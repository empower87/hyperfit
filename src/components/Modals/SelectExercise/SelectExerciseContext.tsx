import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import {
  JSONExercise,
  getGroupList,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";

type EquipmentType = "barbell" | "dumbbell" | "machine" | "cable";
type MovementType = "compound" | "isolation";

const INITIAL_FILTER_TAGS = {
  equipment: null,
  movement_type: null,
  region: null,
};
export type FilterTags = {
  equipment: EquipmentType | null;
  movement_type: MovementType | null;
  region: string | null;
};
export type FilterTagsKey = keyof typeof INITIAL_FILTER_TAGS;

const filterExercisesByTags = (
  exercises: JSONExercise[],
  filterTags: FilterTags
) => {
  const filteredExercises: JSONExercise[] = [];

  for (let i = 0; i < exercises.length; i++) {
    const push = true;
    const equipment = filterTags.equipment;
    const movement_type = filterTags.movement_type;
    const region = filterTags.region;
    if (equipment) {
      const hasEquipment = exercises[i].requirements.includes(equipment);
      if (!hasEquipment) continue;
    }
    if (movement_type) {
      const hasMovementType = exercises[i].movement_type === movement_type;
      if (!hasMovementType) continue;
    }
    if (region) {
      const hasRegion = exercises[i].region === region;
      if (!hasRegion) continue;
    }
    if (push) {
      filteredExercises.push(exercises[i]);
    }
  }
  return filteredExercises;
};

type HypertrophyCriteriaKey = keyof JSONExercise["hypertrophy_criteria"];
export const sortExercisesByCriteria = (
  exercises: JSONExercise[],
  key: HypertrophyCriteriaKey | "rank",
  secondKey?: "lengthened" | "challenging"
) => {
  const sorted = exercises.sort((a, b) => {
    if (secondKey) {
      if (
        a.hypertrophy_criteria["stretch"][secondKey] <
        b.hypertrophy_criteria["stretch"][secondKey]
      )
        return 1;
      else if (
        a.hypertrophy_criteria["stretch"][secondKey] >
        b.hypertrophy_criteria["stretch"][secondKey]
      )
        return -1;
    } else if (key === "rank") {
      if (a[key] < b[key]) return 1;
      else if (a[key] > b[key]) return -1;
    } else {
      if (a.hypertrophy_criteria[key] < b.hypertrophy_criteria[key]) return 1;
      else if (a.hypertrophy_criteria[key] > b.hypertrophy_criteria[key])
        return -1;
    }
    return 0;
  });
  return sorted;
};

type SelectExerciseContextType = ReturnType<typeof useSelectExercise>;

const SelectExerciseContext = createContext<SelectExerciseContextType | null>(
  null
);

type SelectExerciseProviderProps = {
  exerciseId: string;
  children: ReactNode;
  muscle?: MusclePriorityType;
};
const SelectExerciseProvider = ({
  exerciseId,
  children,
  muscle,
}: SelectExerciseProviderProps) => {
  const values = useSelectExercise(exerciseId, muscle);
  return (
    <SelectExerciseContext.Provider value={values}>
      {children}
    </SelectExerciseContext.Provider>
  );
};

const useSelectExerciseContext = () => {
  const context = useContext(SelectExerciseContext);
  if (!context) {
    throw new Error(
      "SelectExercise.* component must be rendered as child of SelectExercise component"
    );
  }
  return context;
};

const getAlphabetizedExercises = (
  exercises: JSONExercise[]
): GroupedExercisesByFilter => {
  const groupedExercises: GroupedExercisesByFilter = {};

  exercises.forEach((exercise) => {
    const firstLetter = exercise.name.charAt(0).toUpperCase();
    if (!groupedExercises[firstLetter]) {
      groupedExercises[firstLetter] = [];
    }
    groupedExercises[firstLetter].push(exercise);
  });

  // Sort each group alphabetically by exercise name
  Object.keys(groupedExercises).forEach((key) => {
    groupedExercises[key].sort((a, b) => a.name.localeCompare(b.name));
  });

  return groupedExercises;
};

const getMuscleExercises = (muscle: string, exercises: JSONExercise[][]) => {
  const index_of_muscle = MUSCLES.indexOf(muscle);
  return exercises[index_of_muscle];
};

const MUSCLES = [
  "abs",
  "back",
  "biceps",
  "calves",
  "chest",
  "delts_front",
  "delts_rear",
  "delts_side",
  "forearms",
  "glutes",
  "hamstrings",
  "quads",
  "triceps",
  "traps",
];

type GroupedExercisesByFilter = {
  [key: string]: JSONExercise[];
};

function useSelectExercise(exerciseId: string, muscle?: MusclePriorityType) {
  const all_api_exercises = useMemo(
    () => MUSCLES.map((muscle) => getGroupList(muscle)),
    []
  );
  const all_api_exercises_flattened = useMemo(
    () => all_api_exercises.flat(),
    [all_api_exercises]
  );
  const alphabetizedExercises = useMemo(
    () => getAlphabetizedExercises(all_api_exercises_flattened),
    [all_api_exercises_flattened]
  );

  const selected_muscles_exercises = muscle ? [...muscle.exercises].flat() : [];

  const [visibleExercises, setVisibleExercises] = useState<JSONExercise[]>([]);
  const [groupedExercises, setGroupedExercises] =
    useState<GroupedExercisesByFilter>({});
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [filterTags, setFilterTags] = useState<FilterTags>({
    ...INITIAL_FILTER_TAGS,
  });

  useEffect(() => {
    if (muscle) {
      const exercises = getMuscleExercises(muscle.muscle, all_api_exercises);
      const filteredExercises = filterExercisesByTags(exercises, filterTags);
      const groupedExercise: GroupedExercisesByFilter = {
        [muscle.muscle]: filteredExercises,
      };
      setGroupedExercises(groupedExercise);
    } else {
      setGroupedExercises(alphabetizedExercises);
    }
  }, [filterTags, muscle, all_api_exercises, alphabetizedExercises]);

  const binarySearchExercises = useCallback(
    (muscle: string) => {
      let left = 0;
      let right = all_api_exercises_flattened.length - 1;
      let startIndex = -1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (all_api_exercises_flattened[mid].group === muscle) {
          startIndex = mid;
          right = mid - 1; // Continue searching in the left half
        } else if (all_api_exercises_flattened[mid].group < muscle) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      if (startIndex === -1) return [];

      const result = [];
      for (
        let i = startIndex;
        i < all_api_exercises_flattened.length &&
        all_api_exercises_flattened[i].group === muscle;
        i++
      ) {
        result.push(all_api_exercises_flattened[i]);
      }

      return result;
    },
    [all_api_exercises_flattened]
  );

  const onFilterTagChange = useCallback(
    (key: FilterTagsKey, value: string | null) => {
      const validTag = filterTags[key] === value ? null : value;
      setFilterTags((prev) => ({ ...prev, [key]: validTag }));
    },
    [filterTags]
  );

  const onSortHandler = useCallback(
    (key: string, secondKey?: "lengthened" | "challenging") => {
      const keykey = key as HypertrophyCriteriaKey;

      const sorted = sortExercisesByCriteria(
        [...visibleExercises],
        keykey,
        secondKey
      );
      setVisibleExercises(sorted);
    },
    [visibleExercises]
  );

  const onSelectExerciseHandler = useCallback(
    (id: string) => {
      if (selectedExerciseId === id) {
        setSelectedExerciseId("");
      } else {
        setSelectedExerciseId(id);
      }
    },
    [selectedExerciseId]
  );

  const onSaveExerciseHandler = useCallback(() => {
    const new_exercise = visibleExercises.find(
      (each) => each.id === selectedExerciseId
    );
    if (!new_exercise) return;
    setSelectedExerciseId("");
    return new_exercise;
  }, [visibleExercises, selectedExerciseId]);

  // const onSaveExerciseHandler = useCallback(() => {
  //   const new_exercises = [...muscle.exercises];
  //   const new_exercise = visibleExercises.find(
  //     (each) => each.id === selectedExerciseId
  //   );
  //   if (!new_exercise) return;

  //   for (let i = 0; i < new_exercises.length; i++) {
  //     for (let j = 0; j < new_exercises[i].length; j++) {
  //       if (new_exercises[i][j].id === exerciseId) {
  //         new_exercises[i][j] = {
  //           ...new_exercises[i][j],
  //           id: selectedExerciseId,
  //           exercise: new_exercise.name,
  //         };
  //       }
  //     }
  //   }
  //   const new_muscle = {
  //     ...muscle,
  //     exercises: new_exercises,
  //   };
  //   handleUpdateMuscle(new_muscle);
  // }, [visibleExercises, exerciseId, muscle.exercises, selectedExerciseId]);

  return {
    exercises: visibleExercises,
    alphabetizedExercises,
    groupedExercises,
    exerciseId,
    allExercises: selected_muscles_exercises,
    selectedExerciseId,
    filterTags,
    onFilterTagChange,
    onSortHandler,
    onSaveExerciseHandler,
    onSelectExerciseHandler,
  };
}
export { SelectExerciseProvider, useSelectExerciseContext };
