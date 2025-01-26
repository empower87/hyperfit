import { StopwatchIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import useResetTimer from "../../hooks/useRestTimer";

export default function RestTimer() {
  const { activeRestTime, totalRestTimeInSeconds, startRestTimerHandler } =
    useResetTimer();
  return (
    <div className="flex flex-col">
      {activeRestTime !== null ? (
        <Button
          variant="defaultCard"
          style={{
            background: `linear-gradient(to left, #1f2937 ${
              ((totalRestTimeInSeconds - activeRestTime) /
                totalRestTimeInSeconds) *
              100
            }%, #f87171 0%)`,
          }}
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
          onClick={startRestTimerHandler}
        >
          <StopwatchIcon fill="white" />
        </Button>
      )}
    </div>
  );
}
