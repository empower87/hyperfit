import { useEffect, useRef, useState } from "react";

type RestTimerProps = {
  status: "stopped" | "paused" | "running";
  initialValue: number;
};
export default function useRestTimer({
  status,
  initialValue = 60,
}: RestTimerProps) {
  const [activeRestTime, setActiveRestTime] = useState<number>(initialValue);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        setActiveRestTime((prev) => prev - 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initialValue, status]);

  return {
    activeRestTime,
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
