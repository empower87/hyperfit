import { StopwatchIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useActiveWorkoutContext } from "../../hooks/useActiveWorkout";

type ActiveWorkoutHeaderProps = {
  start: () => void;
};

export function ActiveWorkoutHeader({ start }: ActiveWorkoutHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <Button className="" size="icon">
          <StopwatchIcon fill="white" />
        </Button>
      </div>

      <div className="flex p-2">
        <Button onClick={() => start()}>Start</Button>
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
        <h2 className="p-2 pb-0 text-secondary-400">
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
