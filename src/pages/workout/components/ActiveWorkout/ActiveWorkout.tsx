import { CheckIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useTimer } from "~/hooks/useTimer";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useActiveWorkoutContext } from "../../hooks/useActiveWorkout";
import { ActiveWorkoutHeader, ActiveWorkoutTitle } from "./ActiveWorkoutHeader";

type ActiveWorkoutProps = {
  children: ReactNode;
};

ActiveWorkout.Exercises = ExerciseList;
export default function ActiveWorkout({ children }: ActiveWorkoutProps) {
  const { start, pause, duration, isRunning } = useTimer();
  return (
    <div className="flex h-full flex-col overflow-scroll">
      <ActiveWorkoutHeader
        startTimer={start}
        stopTimer={pause}
        isRunning={isRunning}
      />

      <div className="h-5/6 space-y-2 overflow-auto">
        <ActiveWorkoutTitle workout_duration={<p>{duration}</p>} />
        {children}
      </div>
    </div>
  );
}

const WIDTHS = ["w-10", "w-24", "w-24", "w-24", "w-10"];
const TITLES = ["SET", "PREVIOUS", "LBS", "REPS", ""];

function ExerciseHeaders() {
  return (
    <div className="flex p-2 pt-0 text-sm">
      {WIDTHS.map((width, index) => {
        return (
          <div
            key={`exerciseHeader_${width}_${index}`}
            className={`flex justify-center ${width} text-muted-foreground`}
          >
            {TITLES[index]}
          </div>
        );
      })}
    </div>
  );
}

function ExerciseList() {
  const { active_workout } = useActiveWorkoutContext();
  return (
    <ul>
      {active_workout?.session?.exercises.map((exercise, index) => {
        return (
          <ExerciseItem
            key={`activeWorkoutExerciseItem_${exercise.id}_${index}`}
            exercise={exercise}
            order={index + 1}
          />
        );
      })}
    </ul>
  );
}
type ExerciseItemProps = {
  exercise: ExerciseType;
  order: number;
};
function ExerciseItem({ exercise, order }: ExerciseItemProps) {
  const { onExerciseClick } = useActiveWorkoutContext();
  const sets_array = Array.from(Array(exercise.sets), (_, i) => i + 1);

  return (
    <li className="flex flex-col space-y-1 rounded-lg border border-input text-muted-foreground">
      <div className="flex items-center justify-between">
        <div
          className="flex cursor-pointer text-secondary-400"
          onClick={() => onExerciseClick(exercise.id)}
        >
          <div className="p-2">{order}</div>
          <div className="p-2">{exercise.name}</div>
        </div>

        <Button variant="ghost" size="sm">
          <DotsVerticalIcon fill="white" />
        </Button>
      </div>

      <ExerciseHeaders />
      <div className="flex flex-col p-2 pt-0">
        {sets_array.map((set, index) => {
          return (
            <SetItem
              key={`exerciseSet_${exercise.id}_${set}_${index}`}
              set={set}
              previous={[0, 0]}
              lbs={0}
              reps={0}
            />
          );
        })}
        <Button variant="ghost" className="text-secondary-400">
          Add Set
        </Button>
      </div>
    </li>
  );
}

type SetItemProps = {
  set: number;
  previous: [number, number];
  lbs: number;
  reps: number;
};

function SetItem({ set, previous, lbs, reps }: SetItemProps) {
  const [isSetCompleted, setIsSetCompleted] = useState(false);

  return (
    <div
      className={`flex items-center rounded-md py-1 text-sm ${
        isSetCompleted ? "bg-card" : ""
      }`}
    >
      <div className={`${WIDTHS[0]} flex justify-center`}>{set}</div>
      <div className={`${WIDTHS[1]} flex justify-center`}>
        {previous[0]}lbs x {previous[1]}
      </div>
      <div className={`${WIDTHS[2]} flex justify-center p-1`}>
        <Input value={lbs} />
      </div>
      <div className={`${WIDTHS[3]} flex justify-center p-1`}>
        <Input value={reps} />
      </div>
      <div className={`${WIDTHS[0]} flex justify-center`}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSetCompleted(!isSetCompleted)}
        >
          <CheckIcon fill="white" />
        </Button>
      </div>
    </div>
  );
}
