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

export default function useRestTimer(startRestTimerOnSetComplete?: boolean) {
  const restPeriods = [...DEFAULT_REST_PERIODS];
  const [totalRestTimeInSeconds, setTotalRestTimeInSeconds] = useState(
    restPeriods[0]
  );
  const [startRestTimer, setStartRestTimer] = useState<boolean>(false);
  // const [activeRestTime, setActiveRestTime] = useState<number | null>(null);
  const [activeRestTime, setActiveRestTime] = useState<number>(0);

  const customRestPeriodOptions = createCustomRestOptions(
    CUSTOM_REST_MIN_IN_SECONDS,
    CUSTOM_REST_MAX_IN_SECONDS,
    CUSTOM_REST_INCREMENT_IN_SECONDS
  );

  useEffect(() => {
    setTotalRestTimeInSeconds(restPeriods[0]);
  }, [restPeriods]);

  // const startRestTimer = useCallback(() => {
  //   let timer: NodeJS.Timeout | null = null;
  //   if (activeRestTime !== null && activeRestTime > 0) {
  //     console.log(
  //       startRestTimerOnSetComplete,
  //       activeRestTime,
  //       "WHAT IS THESE VALUE CALLED IN A CALLBACK?"
  //     );
  //     timer = setInterval(() => {
  //       setActiveRestTime((prev) => (prev !== null ? prev - 1 : null));
  //     }, 1000);
  //   } else if (activeRestTime === 0) {
  //     setActiveRestTime(null);
  //   }

  //   return () => {
  //     if (timer) {
  //       clearInterval(timer);
  //     }
  //   };
  // }, [activeRestTime]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    // if (activeRestTime !== null && activeRestTime > 0) {

    if (startRestTimer && activeRestTime > 0) {
      timer = setInterval(() => {
        setActiveRestTime((prev) => prev - 1);
      }, 1000);
    } else if (activeRestTime === 0) {
      setStartRestTimer(false);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [activeRestTime, startRestTimer, totalRestTimeInSeconds]);

  const startRestTimerHandler = (restPeriod: number) => {
    setTotalRestTimeInSeconds(restPeriod);
    setActiveRestTime(restPeriod);
    setStartRestTimer(true);
  };
  const stopRestTimerHandler = () => {
    setStartRestTimer(false);
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
    stopRestTimerHandler,
  };
}
