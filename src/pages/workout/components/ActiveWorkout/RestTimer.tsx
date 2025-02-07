import { StopwatchIcon } from "@radix-ui/react-icons";
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
import useResetTimer from "../../hooks/useRestTimer";

export default function RestTimerButton() {
  const { activeRestTime, totalRestTimeInSeconds, startRestTimerHandler } =
    useResetTimer();
  return (
    <div className="flex flex-col">
      <Dialog>
        <DialogTrigger asChild>
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
        </DialogTrigger>

        <DialogContent className="sm:max-w-[960px]">
          <DialogHeader>
            <DialogTitle>Rest Timer</DialogTitle>
            <DialogDescription>Choose a duration below.</DialogDescription>
          </DialogHeader>

          {/* <SelectRestTime /> */}
          <DialogFooter>
            <Button type="submit" onClick={() => {}}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SelectRestTime() {
  return (
    <div>
      <Dialog></Dialog>
    </div>
  );
}
