import { HTMLAttributes, ReactNode } from "react";
import { SubtractIcon } from "~/assets/icons/_icons";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BORDER_COLOR_M4,
  BORDER_COLOR_M6,
} from "~/constants/themes";
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
      <>
        {/* <WeekOneSets>
        <WeekOneSets.Button
          onClick={() => onSelectedExerciseSetDecrement(exerciseId)}
        >
          <SubtractIcon fill="white" />
        </WeekOneSets.Button>
        <div
          className={`flex w-3 items-center justify-center px-1 text-xxs text-white`}
        >
          {sets}
        </div>
        <WeekOneSets.Button
          onClick={() => onSelectedExerciseSetIncrement(exerciseId)}
        >
          <AddIcon fill="white" />
        </WeekOneSets.Button>
      </WeekOneSets> */}

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
      </>
    );
  }
  return (
    <div
      className={`flex w-3 justify-center border-r-2 p-0.5 ${BORDER_COLOR_M6}`}
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
        `flex w-[11px] border ${BORDER_COLOR_M4} ${BG_COLOR_M6} h-[11px] items-center justify-center p-[2px] text-xxs text-white hover:${BG_COLOR_M5}`,
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
      className={`flex w-11 items-center justify-center border-x-2 px-1 ${BORDER_COLOR_M6}`}
    >
      {children}
    </div>
  );
}
