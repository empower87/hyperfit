import { StopwatchIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useRestTimerControlsContext } from "../../hooks../../contexts/restTimerControlsContext";
import useRestTimer from "../../hooks/useRestTimer";

export default function RestTimer() {
  const {
    currentRestPeriod,
    restTimerStatus,
    initializeRestDuration,
    updateRestTimerStatus,
    restPeriods,
  } = useRestTimerControlsContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRestPeriodClick = (restPeriod: number) => {
    setIsDialogOpen(false);
    initializeRestDuration(restPeriod);
  };

  const handleSkipButtonClick = () => {
    setIsDialogOpen(false);
    updateRestTimerStatus("stopped");
  };

  return (
    <div className="flex flex-col">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <RestTimerButton
            restPeriodStatus={restTimerStatus}
            restPeriodValue={currentRestPeriod}
          />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[960px]">
          <DialogHeader>
            <DialogTitle>Rest Timer</DialogTitle>
            <DialogDescription>Choose a duration below.</DialogDescription>
          </DialogHeader>

          <SelectRestTime>
            {restPeriods.map((restPeriod, index) => {
              return (
                <Button onClick={() => handleRestPeriodClick(restPeriod)}>
                  {restPeriod}
                </Button>
              );
            })}
          </SelectRestTime>

          <DialogFooter>
            <Button type="submit" onClick={() => handleSkipButtonClick()}>
              Skip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type RestTimerButtonProps = {
  restPeriodStatus: "running" | "stopped" | "paused";
  restPeriodValue: number;
};
function RestTimerButton({
  restPeriodStatus,
  restPeriodValue,
}: RestTimerButtonProps) {
  const { activeRestTime } = useRestTimer({
    status: restPeriodStatus,
    initialValue: restPeriodValue,
  });

  const restTimerButtonBackgroundPercentage = activeRestTime
    ? ((restPeriodValue - activeRestTime) / restPeriodValue) * 100
    : 0;
  if (!activeRestTime) {
    return (
      <Button className="" size="iconLg" variant="defaultCard">
        <StopwatchIcon fill="white" />
      </Button>
    );
  }
  return (
    <Button
      variant="defaultCard"
      style={{
        background: `linear-gradient(to left, #1f2937 ${restTimerButtonBackgroundPercentage}%, #f87171 0%)`,
      }}
    >
      <StopwatchIcon fill="white" />
      <div className="flex items-center justify-center text-white">
        {activeRestTime}s
      </div>
    </Button>
  );
}

type SelectRestTimeProps = {
  children: React.ReactNode;
};
export function SelectRestTime({ children }: SelectRestTimeProps) {
  const { customRestPeriodOptions } = useRestTimerControlsContext();

  return (
    <div>
      <div className="flex flex-col space-y-3">
        <h2>Preset Timers</h2>
        {children}
      </div>

      <div>
        <h2 className="p-2">Custom Timer</h2>
        <div className="flex justify-center space-x-2">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-sm"
          >
            <CarouselContent className="ml-2">
              {customRestPeriodOptions.map((time, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:basis-1/2 lg:basis-1/5"
                >
                  <div className="">
                    <Button>{time}</Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
