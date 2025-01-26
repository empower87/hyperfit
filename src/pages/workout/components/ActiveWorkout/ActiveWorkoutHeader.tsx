import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useActiveWorkoutContext } from "../../hooks/useActiveWorkout";
import RestTimer from "./RestTimer";

type ActiveWorkoutHeaderProps = {
  startTimer: () => void;
  stopTimer: () => void;
  isRunning: boolean;
};

export function ActiveWorkoutHeader({
  startTimer,
  stopTimer,
  isRunning,
}: ActiveWorkoutHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <RestTimer />

      <div className="flex p-2">
        {isRunning ? (
          <Button
            className="text-secondary-400"
            variant="ghost"
            onClick={() => stopTimer()}
          >
            Finish
          </Button>
        ) : (
          <Button className="" variant="outline" onClick={() => startTimer()}>
            Start
          </Button>
        )}
      </div>
    </div>
  );
}

type ActiveWorkoutTitleprops = {
  workout_duration: JSX.Element;
};
export function ActiveWorkoutTitle({
  workout_duration,
}: ActiveWorkoutTitleprops) {
  const { active_workout } = useActiveWorkoutContext();
  const session_name = active_workout?.session?.name;
  const session_split = active_workout?.session?.split;

  const [today] = useState(new Date());
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
  const hours = today.getHours();
  const time_of_day =
    hours < 12 ? "morning" : hours < 18 ? "afternoon" : "evening";

  const unnamed_workout =
    time_of_day.charAt(0).toUpperCase() + time_of_day.slice(1) + " Workout";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <h2 className="p-2 pb-0 text-white">
          {session_name ?? unnamed_workout}
        </h2>

        <div className="flex space-x-2 p-2 pt-0">
          <p className=" text-muted-foreground">{dayOfWeek}</p>
          <p className=" text-muted-foreground">{session_split}</p>
        </div>
      </div>

      <div className="flex p-2">{workout_duration}</div>
    </div>
  );
}
