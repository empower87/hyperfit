import React, { useEffect, useState } from "react";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { DraggableExercises } from "../../../hooks/useExerciseSelection";

const EQUIPMENT_TAGS = [
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "bench",
  "bodyweight",
];

type FilterPanelProps = {
  trainingWeek: DraggableExercises[];
  onFilter: (filteredIds: string[]) => void;
};

export const FilterPanel: React.FC<FilterPanelProps> = ({
  trainingWeek,
  onFilter,
}) => {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Flatten all exercises from all days/sessions
  const allExercises: ExerciseType[] = React.useMemo(() => {
    return trainingWeek.flatMap((day) =>
      day.sessions.flatMap((session) => session.exercises)
    );
  }, [trainingWeek]);

  // Filter logic
  const filtered = allExercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesTag =
      activeTags.length === 0 ||
      activeTags.some((tag) => ex.data?.requirements?.includes(tag));
    return matchesSearch && matchesTag;
  });

  useEffect(() => {
    onFilter(filtered.map((ex) => ex.id));
  }, [search, activeTags, trainingWeek]);

  return (
    <div className="flex flex-row items-center gap-4 rounded-md border border-primary-700 bg-background p-2">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-56 rounded border border-input bg-background px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      {/* Equipment Tags */}
      <div className="flex flex-row gap-2">
        {EQUIPMENT_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() =>
              setActiveTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag]
              )
            }
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              activeTags.includes(tag)
                ? "border-pink-500 bg-pink-500 text-white"
                : "border-input bg-background text-secondary-300 hover:bg-pink-100 hover:text-pink-700"
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

// Helper to highlight ExerciseItem (to be used in parent)
export const getExerciseHighlightClass = (isFiltered: boolean) =>
  isFiltered ? "border-2 border-pink-500" : "";
