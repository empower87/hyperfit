import { StopwatchIcon } from "@radix-ui/react-icons";
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
import { convertSecondsNumberToTimeString } from "~/utils/timeFormatters/convertSecondsNumberToTimeString";
import {
  default as useResetTimer,
  default as useRestTimer,
} from "../../hooks/useRestTimer";

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
            <Button className="" size="iconLg" variant="defaultCard">
              <StopwatchIcon fill="white" />
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[960px]">
          <DialogHeader>
            <DialogTitle>Rest Timer</DialogTitle>
            <DialogDescription>Choose a duration below.</DialogDescription>
          </DialogHeader>

          <SelectRestTime />
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

const DEFAULT_REST_PERIODS = ["0:30", "1:00", "2:00", "3:00"];
const CUSTOM_REST_MIN_IN_SECONDS = 15;
const CUSTOM_REST_MAX_IN_SECONDS = 600;
const CUSTOM_REST_INCREMENT_IN_SECONDS = 15;
const CUSTOM_REST_INIT_IN_SECONDS = 300;

const createCustomRestOptions = (
  min: number,
  max: number,
  increment: number
) => {
  const options = [];
  let current = min;
  while (current <= max) {
    const formattedTime = convertSecondsNumberToTimeString(current);
    options.push(formattedTime);
    current = current + increment;
  }
  return options;
};

export function SelectRestTime() {
  const { activeRestTime, totalRestTimeInSeconds, startRestTimerHandler } =
    useRestTimer();
  const customRestOptions = createCustomRestOptions(
    CUSTOM_REST_MIN_IN_SECONDS,
    CUSTOM_REST_MAX_IN_SECONDS,
    CUSTOM_REST_INCREMENT_IN_SECONDS
  );
  return (
    <div>
      <div className="flex flex-col space-y-3">
        <h2>Preset Timers</h2>
        {DEFAULT_REST_PERIODS.map((restPeriod) => {
          return (
            <Button onClick={() => startRestTimerHandler()}>
              {restPeriod}
            </Button>
          );
        })}
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
              {customRestOptions.map((time, index) => (
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
