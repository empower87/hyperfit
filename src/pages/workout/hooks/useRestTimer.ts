import { useEffect, useState } from "react";
import { convertSecondsNumberToTimeString } from "~/utils/timeFormatters/convertSecondsNumberToTimeString";

const REST_TIME_PRESETS = ["0:30", "1:00", "2:00", "3:00"];
const DEFAULT_REST_PERIODS = [30, 60, 120, 180];
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

export default function useRestTimer() {
  const [restPeriods, setRestPeriods] = useState(DEFAULT_REST_PERIODS);
  const [totalRestTimeInSeconds, setTotalRestTimeInSeconds] = useState(
    restPeriods[0]
  );
  const [activeRestTime, setActiveRestTime] = useState<number | null>(null);

  const customRestPeriodOptions = createCustomRestOptions(
    CUSTOM_REST_MIN_IN_SECONDS,
    CUSTOM_REST_MAX_IN_SECONDS,
    CUSTOM_REST_INCREMENT_IN_SECONDS
  );

  useEffect(() => {
    setTotalRestTimeInSeconds(restPeriods[0]);
  }, [restPeriods]);

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

  const startRestTimerHandler = () => {
    setActiveRestTime(totalRestTimeInSeconds);
  };

  const setRestTimeDurationHandler = (restTimeDuration: number) => {
    setActiveRestTime(restTimeDuration);
  };
  return {
    customRestPeriodOptions,
    restPeriods,
    totalRestTimeInSeconds,
    activeRestTime,
    startRestTimerHandler,
  };
}
