import { Link2Icon, LinkNone2Icon } from "@radix-ui/react-icons";
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
import { useSupersetsContext } from "~/components/programConfig/Tabs/TrainingWeekOverview/hooks/useSupersets";

type SupersetDialogItemProps = {
  exercise_order: number;
  exercise: ExerciseType;
  isSelected: boolean;
  borderColor: string;
  isSupersetted: boolean;
  supersetColor?: string;
  onClick: () => void;
};
function SupersetDialogItem({
  exercise_order,
  exercise,
  isSelected,
  borderColor,
  isSupersetted,
  supersetColor,
  onClick,
}: SupersetDialogItemProps) {
  // If in a superset, use supersetColor for border
  const border =
    isSupersetted && supersetColor
      ? supersetColor
      : isSelected
      ? borderColor
      : "border-gray-500";
  return (
    <div
      className={`mb-2 flex cursor-pointer items-center rounded border-2 ${border} ${
        isSelected ? "bg-primary-400" : ""
      }`}
      onClick={onClick}
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
  // Palette for supersets (cycle through)
  const supersetColors = [
    "border-red-500",
    "border-yellow-500",
    "border-green-500",
    "border-blue-500",
    "border-purple-500",
    "border-pink-500",
    "border-orange-500",
    "border-teal-500",
    "border-cyan-500",
    "border-lime-500",
  ];
  // Unique border colors for up to 2 selections (not yet supersetted)
  const borderColors = ["border-primary-200", "border-primary-200"];

  // Map superset key to color
  const supersetKeyList = Object.keys(supersets);
  const supersetColorMap: Record<string, string> = {};
  supersetKeyList.forEach((key, idx) => {
    supersetColorMap[key] = supersetColors[idx % supersetColors.length];
  });

  return (
    <ul className="">
      {exercises.map((ex, i) => {
        const isSelected = selectedIds.includes(ex.id);
        const borderColor = isSelected
          ? borderColors[selectedIds.indexOf(ex.id)]
          : "";
        // Find superset key for this exercise
        let supersetKey: string | undefined = undefined;
        let isSupersetted = false;
        Object.entries(supersets).forEach(([key, arr]) => {
          if (arr.includes(ex.id)) {
            supersetKey = key;
            isSupersetted = true;
          }
        });
        const supersetColor = supersetKey
          ? supersetColorMap[supersetKey]
          : undefined;
        return (
          <SupersetDialogItem
            key={`${ex.id}_SupersetDialogItem`}
            exercise_order={i + 1}
            exercise={ex}
            isSelected={isSelected}
            borderColor={borderColor}
            isSupersetted={isSupersetted}
            supersetColor={supersetColor}
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
        <div className="flex justify-end">
          {canSuperset ? (
            <Button variant="default" size="iconLg" onClick={handleSuperset}>
              <Link2Icon />
            </Button>
          ) : canBreak ? (
            <Button variant="default" size="iconLg" onClick={handleBreak}>
              <LinkNone2Icon />
            </Button>
          ) : (
            <Button variant="default" size="iconLg" disabled>
              <Link2Icon />
            </Button>
          )}
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
