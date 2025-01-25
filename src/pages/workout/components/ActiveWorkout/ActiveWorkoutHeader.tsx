import { StopwatchIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useActiveWorkoutContext } from "../../hooks/useActiveWorkout";

type ActiveWorkoutHeaderProps = {
  startTimer: () => void;
  stopTimer: () => void;
  isRunning: boolean;
};

const REST_TIME_PRESETS = [30, 60, 90, 120, 180];
export function ActiveWorkoutHeader({
  startTimer,
  stopTimer,
  isRunning,
}: ActiveWorkoutHeaderProps) {
  const [restTime, setRestTime] = useState(REST_TIME_PRESETS[0]);
  const [activeRestTime, setActiveRestTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (activeRestTime !== null && activeRestTime > 0) {
      timer = setInterval(() => {
        setActiveRestTime((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (activeRestTime === 0) {
      setActiveRestTime(null);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [activeRestTime]);

  const handleStartRest = () => {
    setActiveRestTime(restTime);
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        {activeRestTime !== null ? (
          <Button
            className={`bg-linear-to-l from-bg-secondary-400 via-${
              ((restTime - activeRestTime) / restTime) * 100
            }% to-bg-card`}
            variant="defaultCard"
            // style={{
            //   background: `linear-gradient(to left, var(--card) ${
            //     ((restTime - activeRestTime) / restTime) * 100
            //   }%, #1f2937 0%)`,
            // }}
            // style={{
            //   background: `linear-gradient(to left, var(--card) ${
            //     ((restTime - activeRestTime) / restTime) * 100
            //   }%, #1f2937 0%)`,
            // }}
          >
            <StopwatchIcon fill="white" />
            <div className="flex items-center justify-center text-white">
              {activeRestTime}s
            </div>
          </Button>
        ) : (
          <Button
            className=""
            size="iconLg"
            variant="defaultCard"
            onClick={handleStartRest}
          >
            <StopwatchIcon fill="white" />
          </Button>
        )}
      </div>

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
