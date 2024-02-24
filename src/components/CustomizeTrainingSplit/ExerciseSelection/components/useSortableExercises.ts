import { useCallback, useEffect, useState } from "react";
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

export default function useSortableExercises(muscle: string, exercise: string) {
  const exercises = getGroupList(muscle);
  const [visibleExercises, setVisibleExercises] = useState<Exercise[]>([]);
  const [filterTags, setFilterTags] = useState<FilterTags>({
    ...INITIAL_FILTER_TAGS,
  });

  const onFilterTagChange = useCallback(
    (key: FilterTagsKey, value: string | null) => {
      const validTag = filterTags[key] === value ? null : value;
      setFilterTags((prev) => ({ ...prev, [key]: validTag }));
    },
    [filterTags]
  );

  useEffect(() => {
    const filteredExercises = filterExercisesByTags(exercises, filterTags);
    setVisibleExercises(filteredExercises);
  }, [filterTags, exercises]);

  useEffect(() => {
    setVisibleExercises(exercises);
  }, [exercises]);

  return {
    exercises: visibleExercises,
    filterTags,
    onFilterTagChange,
  };
}
