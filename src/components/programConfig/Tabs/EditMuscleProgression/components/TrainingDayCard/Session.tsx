import { useCallback, useState } from "react";
import SelectExercise from "~/components/Modals/SelectExercise/SelectExerciseModal";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { JSONExercise } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";
import Exercise from "./Exercise";

type SessionProps = {
  index: number;
  exercises: ExerciseType[];
  children: React.ReactNode;
};
export function Session({ index, exercises, children }: SessionProps) {
  const { onRemoveTrainingDay, onAddExercise, muscleGroup } =
    useMuscleEditorContext();

  const [selectedExercise, setSelectedExercise] = useState<JSONExercise | null>(
    null
  );

  const selectExerciseHandler = (exerciseData: JSONExercise) => {
    setSelectedExercise(exerciseData);
  };

  const addNewExerciseHandler = useCallback(() => {
    if (selectedExercise) {
      onAddExercise(selectedExercise, index);
    }
  }, [selectedExercise, index]);

  return (
    <div className="pt-3">
      {children}
      <ul className="space-y-2">
        {exercises.map((exercise, exerciseIndex) => {
          return <Exercise index={exerciseIndex} exercise={exercise} />;
        })}
      </ul>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="mt-2 w-full">
            Add Exercise
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[960px]">
          <DialogHeader>
            <DialogTitle>Add Exercise</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <SelectExercise
            muscle={muscleGroup}
            exerciseId={""}
            onSelect={(exercise) => selectExerciseHandler(exercise)}
          />

          <DialogFooter>
            <Button type="submit" onClick={addNewExerciseHandler}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type SessionHeaderProps = {
  children: React.ReactNode;
};
export function SessionHeader({ children }: SessionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between pb-3 pt-0 text-sm text-card-foreground">
      {children}
    </div>
  );
}

export function SessionTitle({ children }: SessionHeaderProps) {
  return (
    <h4 className="font-semibold leading-none tracking-tight">{children}</h4>
  );
}

export function SessionDelete({ children }: SessionHeaderProps) {
  return <div className="">{children}</div>;
}
