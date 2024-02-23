import { useEffect, useState } from "react";
import { Exercise, getGroupList } from "~/utils/getExercises";

type EquipmentType = "barbell" | "dumbbell" | "machine" | "cable";
type MovementType = "compound" | "isolation";

const INITIAL_FILTER_TAGS = {
  equipment: null,
  movement_type: null,
  region: null,
};
type FilterTags = {
  equipment: EquipmentType | null;
  movement_type: MovementType | null;
  region: string | null;
};
export default function useSortableExercises(muscle: string, exercise: string) {
  const exercises = getGroupList(muscle);

  const [visibleExercises, setVisibleExercises] = useState<Exercise[]>([]);
  const [filterTags, setFilterTags] = useState<FilterTags>({
    ...INITIAL_FILTER_TAGS,
  });

  useEffect(() => {
    setVisibleExercises(exercises);
  }, [exercises]);

  return {
    exercises: visibleExercises,
  };
}
