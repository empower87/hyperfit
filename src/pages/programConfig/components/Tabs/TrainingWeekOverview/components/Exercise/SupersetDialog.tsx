import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useSupersetsContext } from "../../hooks/useSupersets";

type SupersetDialogItemProps = {
  exercise_order: number;
  exercise: ExerciseType;
  isSelected: boolean;
  borderColor: string;
  isSupersetted: boolean;
  onClick: () => void;
};
function SupersetDialogItem({
  exercise_order,
  exercise,
  isSelected,
  borderColor,
  isSupersetted,
  onClick,
}: SupersetDialogItemProps) {
  return (
    <div
      className={`flex cursor-pointer items-center rounded border-2 ${
        isSelected ? borderColor : "border-gray-300"
      } ${isSelected ? "bg-primary-100" : ""} ${
        isSupersetted ? "ring-2 ring-purple-400" : ""
      }`}
      onClick={onClick}
      style={{ marginBottom: 4 }}
    >
      <div className={`p-2 text-xs`}>{exercise_order}</div>
      <div className={`text-sm`}>{exercise.name}</div>
    </div>
  );
}

type SupersetDialogBodyProps = {
  exercises: ExerciseType[];
  selectedIds: string[];
  supersets: Record<string, string[]>;
  onSelect: (id: string) => void;
};
export function SupersetDialogBody({
  exercises,
  selectedIds,
  supersets,
  onSelect,
}: SupersetDialogBodyProps) {
  // Unique border colors for up to 2 selections
  const borderColors = ["border-blue-500", "border-green-500"];
  return (
    <ul className="space-y-1">
      {exercises.map((ex, i) => {
        const isSelected = selectedIds.includes(ex.id);
        const borderColor = isSelected
          ? borderColors[selectedIds.indexOf(ex.id)]
          : "";
        // Check if this exercise is in any superset
        const isSupersetted = Object.values(supersets).some((arr) =>
          arr.includes(ex.id)
        );
        return (
          <SupersetDialogItem
            key={`${ex.id}_SupersetDialogItem`}
            exercise_order={i + 1}
            exercise={ex}
            isSelected={isSelected}
            borderColor={borderColor}
            isSupersetted={isSupersetted}
            onClick={() => onSelect(ex.id)}
          />
        );
      })}
    </ul>
  );
}

type SupersetDialogProps = {
  openSuperset: boolean;
  setOpenSuperset: (open: boolean) => void;
  exercises: ExerciseType[];
};
export function SupersetDialog({
  openSuperset,
  setOpenSuperset,
  exercises,
}: SupersetDialogProps) {
  const { supersets, addSuperset, breakSuperset } = useSupersetsContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Select/deselect logic
  const handleSelect = (id: string) => {
    // If already selected, deselect
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
      return;
    }
    // If already in a superset, overwrite
    const inSuperset = Object.values(supersets).some((arr) => arr.includes(id));
    if (inSuperset) {
      setSelectedIds([id]);
      return;
    }
    // Only allow up to 2 selections
    if (selectedIds.length < 2) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Button logic
  const canSuperset = selectedIds.length === 2;
  const canBreak =
    selectedIds.length === 1 &&
    Object.values(supersets).some((arr) => arr.includes(selectedIds[0]));

  const handleSuperset = () => {
    if (canSuperset) {
      // Overwrite any existing supersets for these exercises
      Object.entries(supersets).forEach(([key, arr]) => {
        if (arr.some((id) => selectedIds.includes(id))) {
          breakSuperset(key);
        }
      });
      addSuperset(selectedIds[0], selectedIds[1], "");
      setSelectedIds([]);
    }
  };

  const handleBreak = () => {
    if (canBreak) {
      // Find and break the superset containing the selected exercise
      Object.entries(supersets).forEach(([key, arr]) => {
        if (arr.includes(selectedIds[0])) {
          breakSuperset(key);
        }
      });
      setSelectedIds([]);
    }
  };

  return (
    <Dialog open={openSuperset} onOpenChange={setOpenSuperset}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Superset</DialogTitle>
          <DialogDescription>
            Select up to 2 exercises to create a superset. Click again to
            deselect. Supersets will overwrite previous ones.
          </DialogDescription>
        </DialogHeader>
        {/* Top-right button */}
        <div className="absolute right-4 top-4">
          {canSuperset ? (
            <Button variant="default" onClick={handleSuperset}>
              Superset Selected
            </Button>
          ) : canBreak ? (
            <Button variant="destructive" onClick={handleBreak}>
              Break Superset
            </Button>
          ) : null}
        </div>
        <SupersetDialogBody
          exercises={exercises}
          selectedIds={selectedIds}
          supersets={supersets}
          onSelect={handleSelect}
        />
        <DialogFooter>
          <Button type="button" onClick={() => setOpenSuperset(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
