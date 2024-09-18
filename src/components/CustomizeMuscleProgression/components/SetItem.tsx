import { HTMLAttributes, ReactNode } from "react";
import { SubtractIcon } from "~/assets/icons/_icons";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { useMuscleEditorContext } from "../context/MuscleEditorContext";
import Counter from "./Counter";

type ExerciseSetsProps = {
  index: number;
  sets: number;
  exerciseId: ExerciseType["id"];
};
export default function ExerciseSets({
  index,
  sets,
  exerciseId,
}: ExerciseSetsProps) {
  const { onSelectedExerciseSetIncrement, onSelectedExerciseSetDecrement } =
    useMuscleEditorContext();
  if (index === 0) {
    return (
        <Counter>
          <Counter.Button
            onClick={() => onSelectedExerciseSetDecrement(exerciseId)}
          >
            <SubtractIcon fill="white" />
          </Counter.Button>
          <Counter.Value value={sets} />
          <Counter.Button
            onClick={() => onSelectedExerciseSetIncrement(exerciseId)}
          >
            <SubtractIcon fill="white" />
          </Counter.Button>
        </Counter>
    );
  }
  return (
    <div
      className={`flex w-3 justify-center border-r-2 p-0.5 border-primary-600`}
    >
      {sets}
    </div>
  );
}

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        `flex w-[11px] border border-primary-400 bg-primary-600 h-[11px] items-center justify-center p-[2px] text-xxs text-white hover:bg-primary-500`,
        className
      )}
    >
      {children}
    </button>
  );
}

WeekOneSets.Button = Button;
function WeekOneSets({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex w-11 items-center justify-center border-x-2 px-1 border-primary-600`}
    >
      {children}
    </div>
  );
}
