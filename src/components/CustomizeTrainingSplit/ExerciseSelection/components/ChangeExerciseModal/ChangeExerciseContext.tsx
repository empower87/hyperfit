import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { Exercise, getGroupList } from "~/utils/getExercises";

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
  exercises: Exercise[],
  filterTags: FilterTags
) => {
  const filteredExercises: Exercise[] = [];

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

type KeyKey = keyof Exercise["hypertrophy_criteria"];
const sortExercisesByCriteria = (
  exercises: Exercise[],
  key: KeyKey | "rank",
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

type ChangeExerciseContextType = ReturnType<typeof useChangeExercise>;

const ChangeExerciseContext = createContext<ChangeExerciseContextType>({
  exercises: [],
  exerciseId: "",
  allExercises: [],
  selectedExerciseId: "",
  filterTags: INITIAL_FILTER_TAGS,
  onFilterTagChange: () => null,
  onSortHandler: () => null,
  onSaveExerciseHandler: () => undefined,
  onSelectExerciseHandler: () => null,
});

type ChangeExerciseProviderProps = {
  muscle: MusclePriorityType;
  exerciseId: string;
  children: ReactNode;
};
const ChangeExerciseProvider = ({
  muscle,
  exerciseId,
  children,
}: ChangeExerciseProviderProps) => {
  const values = useChangeExercise(muscle, exerciseId);
  return (
    <ChangeExerciseContext.Provider value={values}>
      {children}
    </ChangeExerciseContext.Provider>
  );
};

const useChangeExerciseContext = () => {
  return useContext(ChangeExerciseContext);
};

function useChangeExercise(muscle: MusclePriorityType, exerciseId: string) {
  const allExercises = [...muscle.exercises].flat();
  const [visibleExercises, setVisibleExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [filterTags, setFilterTags] = useState<FilterTags>({
    ...INITIAL_FILTER_TAGS,
  });

  useEffect(() => {
    const exercises = getGroupList(muscle.muscle);
    const filteredExercises = filterExercisesByTags([...exercises], filterTags);
    setVisibleExercises(filteredExercises);
  }, [filterTags, muscle]);

  const onFilterTagChange = useCallback(
    (key: FilterTagsKey, value: string | null) => {
      const validTag = filterTags[key] === value ? null : value;
      setFilterTags((prev) => ({ ...prev, [key]: validTag }));
    },
    [filterTags]
  );

  const onSortHandler = useCallback(
    (key: string, secondKey?: "lengthened" | "challenging") => {
      const keykey = key as KeyKey;

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
    exerciseId,
    allExercises,
    selectedExerciseId,
    filterTags,
    onFilterTagChange,
    onSortHandler,
    onSaveExerciseHandler,
    onSelectExerciseHandler,
  };
}
export { ChangeExerciseProvider, useChangeExerciseContext };
