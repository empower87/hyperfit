import { useCallback, useEffect, useState } from "react";
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
  key: KeyKey,
  secondKey?: "lengthened" | "challenging"
) => {
  const sorted = exercises.sort((a, b) => {
    if (!a.hypertrophy_criteria || !b.hypertrophy_criteria) return 0;
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
    } else {
      if (a.hypertrophy_criteria[key] < b.hypertrophy_criteria[key]) return 1;
      else if (a.hypertrophy_criteria[key] > b.hypertrophy_criteria[key])
        return -1;
    }
    return 0;
  });
  return sorted;
};

const CRITERIA_WEIGHTS = {
  stretch: {
    lengthened: 1.9,
    challenging: 1.9,
    partial_friendly: 1.1,
  },
  target_function: 1.7,
  stability: 1.6,
  limiting_factor: 1.5,
  fatigue: 1.3,
  time_efficiency: 1.2,
  loadability: 1.1,
} as const;

const getWeightedCriteriaTotal = (exercise: Exercise) => {
  const hypertrophy_criteria = exercise.hypertrophy_criteria;
  if (!hypertrophy_criteria) return 0;
  let total = 0;

  Object.entries(hypertrophy_criteria).forEach(([key, value]) => {
    if (typeof value === "number") {
      total =
        total +
        hypertrophy_criteria[key as KeyKey] * CRITERIA_WEIGHTS[key as KeyKey];
    } else {
      total =
        total +
        hypertrophy_criteria["stretch"]["lengthened"] *
          CRITERIA_WEIGHTS["stretch"]["lengthened"];
      total =
        total +
        hypertrophy_criteria["stretch"]["challenging"] *
          CRITERIA_WEIGHTS["stretch"]["challenging"];
      total =
        total +
        hypertrophy_criteria["stretch"]["partial_friendly"] *
          CRITERIA_WEIGHTS["stretch"]["partial_friendly"];
    }
  });
  return Math.round(total);
};

export default function useSortableExercises(
  muscle: MusclePriorityType,
  exercise: string
) {
  const exercises = getGroupList(muscle.muscle);
  const allExercises = [...muscle.exercises].flat();

  const [visibleExercises, setVisibleExercises] = useState<Exercise[]>([]);
  const [filterTags, setFilterTags] = useState<FilterTags>({
    ...INITIAL_FILTER_TAGS,
  });
  const [sortKey, setSortKey] = useState<KeyKey | null>(null);
  const [weightedExercises, setWeightedExercises] = useState<
    { id: string; total: number }[]
  >([]);

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
      if (keykey === sortKey) {
        setSortKey(null);
      } else {
        setSortKey(keykey);
      }
      const sorted = sortExercisesByCriteria(
        visibleExercises,
        keykey,
        secondKey
      );
      setVisibleExercises(sorted);
    },
    [visibleExercises]
  );

  useEffect(() => {
    const filteredExercises = filterExercisesByTags(exercises, filterTags);
    setVisibleExercises(filteredExercises);
  }, [filterTags, exercises]);

  useEffect(() => {
    setVisibleExercises(exercises);
    let weightedExercises: { id: string; total: number }[] = [];
    for (let i = 0; i < exercises.length; i++) {
      const weighted = getWeightedCriteriaTotal(exercises[i]);
      weightedExercises.push({ id: exercises[i].id, total: weighted });
    }
    setWeightedExercises(weightedExercises);
  }, [exercises]);

  return {
    exercises: visibleExercises,
    allExercises,
    weightedExercises,
    filterTags,
    onFilterTagChange,
    onSortHandler,
  };
}
