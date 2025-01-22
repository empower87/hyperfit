import { Button } from "~/components/ui/button";
import { useTimer } from "~/hooks/useTimer";
import { ActiveWorkout } from "../../hooks/useActiveWorkout";

type StartWorkoutProps = {
  active_workout: ActiveWorkout | null;
};
export function StartWorkout({ active_workout }: StartWorkoutProps) {
  if (!active_workout) return null;
  const { start, pause, duration, isRunning } = useTimer();
  return (
    <div>
      {isRunning ? (
        <div>{duration}</div>
      ) : (
        <Button onClick={() => start()}>Start</Button>
      )}
    </div>
  );
}
