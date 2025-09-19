import { ReactNode } from "react";
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

type SupersetDialogItemProps = {
  exercise_order: number;
  exercise: ExerciseType;
  selected_exercise_id: string;
  isSupersetted: boolean;
};
function SupersetDialogItem({
  exercise_order,
  exercise,
  selected_exercise_id,
  isSupersetted,
}: SupersetDialogItemProps) {
  const exercise_bg =
    selected_exercise_id === exercise.id ? "bg-primary-300" : "";
  return (
    <div
      className={`flex cursor-pointer items-center rounded border border-primary-400 ${exercise_bg}`}
    >
      <div className={`p-2 text-xs`}>{exercise_order}</div>
      <div className={`text-sm`}>{exercise.name}</div>
    </div>
  );
}

type SupersetDialogBodyProps = {
  exercises: ExerciseType[];
  selected_exercise_id: string;
};
export function SupersetDialogBody({
  exercises,
  selected_exercise_id,
}: SupersetDialogBodyProps) {
  return (
    <ul className="space-y-1">
      {exercises.map((ex, i) => {
        return (
          <SupersetDialogItem
            key={`${ex.id}_SupersetDialogItem`}
            exercise_order={i + 1}
            exercise={ex}
            selected_exercise_id={selected_exercise_id}
            isSupersetted={false}
          />
        );
      })}
    </ul>
  );
}

type SupersetDialogProps = {
  openSuperset: boolean;
  setOpenSuperset: (open: boolean) => void;
  children: ReactNode;
};
export function SupersetDialog({
  openSuperset,
  setOpenSuperset,
  children,
}: SupersetDialogProps) {
  return (
    <Dialog open={openSuperset} onOpenChange={setOpenSuperset}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Superset</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {children}

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
