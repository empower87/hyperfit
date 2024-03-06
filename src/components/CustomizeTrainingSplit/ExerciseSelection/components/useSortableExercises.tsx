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
    let push = true;
    let equipment = filterTags.equipment;
    let movement_type = filterTags.movement_type;
    let region = filterTags.region;
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

type ExerciseSearchFiltersType = ReturnType<typeof useExerciseSearchFilters>;

const ExerciseSearchFiltersContext = createContext<ExerciseSearchFiltersType>({
  exercises: [],
  exerciseId: "",
  allExercises: [],
  selectedExerciseId: "",
  filterTags: INITIAL_FILTER_TAGS,
  onFilterTagChange: () => {},
  onSortHandler: () => {},
  onSaveExerciseHandler: () => {},
  onSelectExerciseHandler: () => {},
});

type ExerciseSearchFiltersProviderProps = {
  muscle: MusclePriorityType;
  exerciseId: string;
  onExerciseChange: (updated_muscle: MusclePriorityType) => void;
  children: ReactNode;
};
const ExerciseSearchFiltersProvider = ({
  muscle,
  exerciseId,
  onExerciseChange,
  children,
}: ExerciseSearchFiltersProviderProps) => {
  const values = useExerciseSearchFilters(muscle, exerciseId, onExerciseChange);
  return (
    <ExerciseSearchFiltersContext.Provider value={values}>
      {children}
    </ExerciseSearchFiltersContext.Provider>
  );
};

const useExerciseSearchFiltersContext = () => {
  return useContext(ExerciseSearchFiltersContext);
};

function useExerciseSearchFilters(
  muscle: MusclePriorityType,
  exerciseId: string,
  onExerciseChange: (updated_muscle: MusclePriorityType) => void
) {
  const exercises = getGroupList(muscle.muscle);
  const allExercises = [...muscle.exercises].flat();

  const [visibleExercises, setVisibleExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");
  const [filterTags, setFilterTags] = useState<FilterTags>({
    ...INITIAL_FILTER_TAGS,
  });

  useEffect(() => {
    const filteredExercises = filterExercisesByTags([...exercises], filterTags);
    setVisibleExercises(filteredExercises);
  }, [filterTags]);

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
      console.log(id);
      if (selectedExerciseId === id) {
        setSelectedExerciseId("");
      } else {
        setSelectedExerciseId(id);
      }
    },
    [selectedExerciseId]
  );

  const onSaveExerciseHandler = useCallback(() => {
    const index = allExercises.findIndex((each) => each.id === exerciseId);
    const new_muscle = {
      ...muscle,
      exercises: [...muscle.exercises],
    };
  }, []);

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
export { ExerciseSearchFiltersProvider, useExerciseSearchFiltersContext };
