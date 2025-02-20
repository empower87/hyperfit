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

export const useRestTimerControls = () => {
  const restPeriods = [...DEFAULT_REST_PERIODS];
  const [totalRestTimeInSeconds, setTotalRestTimeInSeconds] = useState(
    restPeriods[0]
  );
  const [restTimerStatus, setRestTimerStatus] = useState<
    "running" | "stopped" | "paused"
  >("stopped");

  const customRestPeriodOptions = createCustomRestOptions(
    CUSTOM_REST_MIN_IN_SECONDS,
    CUSTOM_REST_MAX_IN_SECONDS,
    CUSTOM_REST_INCREMENT_IN_SECONDS
  );

  const initializeRestDuration = (duration: number) => {
    setTotalRestTimeInSeconds(duration);
  };

  const updateRestTimerStatus = (
    new_status: "stopped" | "paused" | "running"
  ) => {
    setRestTimerStatus(new_status);
  };

  return {
    restTimerStatus,
    updateRestTimerStatus,
    restPeriods,
    customRestPeriodOptions,
    currentRestPeriod: totalRestTimeInSeconds,
    initializeRestDuration,
  };
};

export default function useRestTimer(
  status: "stopped" | "paused" | "running",
  currentRestPeriod: number
) {
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
    let timer: NodeJS.Timeout | null = null;
    // if (activeRestTime !== null && activeRestTime > 0) {

    // if (startRestTimer && activeRestTime !== null && activeRestTime > 0) {
    if (status === "running") {
      timer = setInterval(() => {
        setActiveRestTime((prev) => prev - 1);
      }, 1000);
    } else {
      // setStartRestTimer(false);
      setActiveRestTime(0);
    }
    console.log(
      activeRestTime,
      totalRestTimeInSeconds,
      "WHAT ARE THESE VALUES AND WHEN ARE THEY CALLED?"
    );
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentRestPeriod, status]);

  const startRestTimerHandler = (
    restPeriod: number,
    action: "start" | "end"
  ) => {
    if (action === "end") {
      setActiveRestTime(0);
      setStartRestTimer(false);
    } else {
      setTotalRestTimeInSeconds(restPeriod);
      setActiveRestTime(restPeriod);
      setStartRestTimer(true);
    }
  };

  // const initRestTimer = useCallback(
  //   (value?: null | number) => {
  //     console.log(value, activeRestTime, "INIT REST TIMER");
  //     if (value === null) {
  //       setActiveRestTime(null);
  //       // setStartRestTimer(false);
  //     } else if (typeof value === "number") {
  //       setActiveRestTime(value);
  //     } else {
  //       setActiveRestTime(totalRestTimeInSeconds);
  //       // setStartRestTimer(true);
  //     }
  //   },
  //   [totalRestTimeInSeconds]
  // );

  const presetRestTimerHandler = (value: number) => {
    setTotalRestTimeInSeconds(value);
    // initRestTimer(value);
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
    // initRestTimer,
    presetRestTimerHandler,
  };
}
// export default function useRestTimer() {
//   const restPeriods = [...DEFAULT_REST_PERIODS];
//   const [totalRestTimeInSeconds, setTotalRestTimeInSeconds] = useState(
//     restPeriods[0]
//   );
//   const [startRestTimer, setStartRestTimer] = useState<boolean>(false);
//   // const [activeRestTime, setActiveRestTime] = useState<number | null>(null);
//   const [activeRestTime, setActiveRestTime] = useState<number | null>(null);

//   const customRestPeriodOptions = createCustomRestOptions(
//     CUSTOM_REST_MIN_IN_SECONDS,
//     CUSTOM_REST_MAX_IN_SECONDS,
//     CUSTOM_REST_INCREMENT_IN_SECONDS
//   );

//   useEffect(() => {
//     setTotalRestTimeInSeconds(restPeriods[0]);
//   }, [restPeriods]);

//   useEffect(() => {
//     let timer: NodeJS.Timeout | null = null;
//     // if (activeRestTime !== null && activeRestTime > 0) {

//     // if (startRestTimer && activeRestTime !== null && activeRestTime > 0) {
//     if (activeRestTime !== null && activeRestTime > 0) {
//       timer = setInterval(() => {
//         setActiveRestTime((prev) => (prev !== null ? prev - 1 : null));
//       }, 1000);
//     } else {
//       // setStartRestTimer(false);
//       setActiveRestTime(null);
//     }
//     console.log(
//       activeRestTime,
//       totalRestTimeInSeconds,
//       "WHAT ARE THESE VALUES AND WHEN ARE THEY CALLED?"
//     );
//     return () => {
//       if (timer) {
//         clearInterval(timer);
//       }
//     };
//   }, [activeRestTime, totalRestTimeInSeconds]);

//   const startRestTimerHandler = (
//     restPeriod: number,
//     action: "start" | "end"
//   ) => {
//     if (action === "end") {
//       setActiveRestTime(0);
//       setStartRestTimer(false);
//     } else {
//       setTotalRestTimeInSeconds(restPeriod);
//       setActiveRestTime(restPeriod);
//       setStartRestTimer(true);
//     }
//   };

//   const initRestTimer = useCallback(
//     (value?: null | number) => {
//       console.log(value, activeRestTime, "INIT REST TIMER");
//       if (value === null) {
//         setActiveRestTime(null);
//         // setStartRestTimer(false);
//       } else if (typeof value === "number") {
//         setActiveRestTime(value);
//       } else {
//         setActiveRestTime(totalRestTimeInSeconds);
//         // setStartRestTimer(true);
//       }
//     },
//     [totalRestTimeInSeconds]
//   );

//   const presetRestTimerHandler = (value: number) => {
//     setTotalRestTimeInSeconds(value);
//     initRestTimer(value);
//   };

//   const stopRestTimerHandler = () => {
//     setStartRestTimer(false);
//   };
//   const setRestTimeDurationHandler = (restTimeDuration: number) => {
//     setActiveRestTime(restTimeDuration);
//   };
//   return {
//     customRestPeriodOptions,
//     restPeriods,
//     totalRestTimeInSeconds,
//     activeRestTime,
//     startRestTimerHandler,
//     stopRestTimerHandler,
//     initRestTimer,
//     presetRestTimerHandler,
//   };
// }
