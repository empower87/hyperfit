import { CheckIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  ExerciseType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { NewTrainingWeek } from "~/hooks/useTrainingProgram/utils/training_block/trainingBlockHelpers";
import { useActiveWorkoutContext } from "../../hooks/useActiveWorkout";
import { StartWorkout } from "./StartWorkout";

type ActiveWorkoutProps = {
  training_day: NewTrainingWeek | TrainingDayType;
};
export default function ActiveWorkout() {
  const { active_workout } = useActiveWorkoutContext();
  const [today, setToday] = useState(new Date());
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
  const hours = today.getHours();
  const time_of_day =
    hours < 12 ? "morning" : hours < 18 ? "afternoon" : "evening";

  const unnamed_workout =
    time_of_day.charAt(0).toUpperCase() + time_of_day.slice(1) + " Workout";

  return (
    <div className="flex h-full flex-col overflow-scroll">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="p-2 pb-0 text-secondary-400">
            {active_workout?.session?.name ?? unnamed_workout}
          </h2>
          <div className="flex space-x-2 p-2 pt-0">
            <p className=" text-muted-foreground">{dayOfWeek}</p>
            <p className=" text-muted-foreground">
              {active_workout?.session?.split}
            </p>
          </div>
        </div>
        <div className="flex p-2">
          <StartWorkout active_workout={active_workout} />
        </div>
      </div>

      <div className="h-5/6 space-y-2 overflow-auto">
        {active_workout?.session?.exercises.map((exercise, index) => {
          return (
            <ExerciseItem
              key={`activeWorkoutExerciseItem_${exercise.id}_${index}`}
              exercise={exercise}
              order={index + 1}
            />
          );
        })}
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
            className={`flex justify-center ${width}`}
          >
            {TITLES[index]}
          </div>
        );
      })}
    </div>
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
    <div className="flex flex-col space-y-1 rounded-lg border border-input">
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
    </div>
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
