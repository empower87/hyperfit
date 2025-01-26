import { useEffect, useState } from "react";

const REST_TIME_PRESETS = [30, 60, 90, 120, 180];
export default function useResetTimer() {
  const [totalRestTimeInSeconds, setTotalRestTimeInSeconds] = useState(
    REST_TIME_PRESETS[0]
  );
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

  const startRestTimerHandler = () => {
    setActiveRestTime(totalRestTimeInSeconds);
  };

  const setRestTimeDurationHandler = (restTimeDuration: number) => {
    setActiveRestTime(restTimeDuration);
  };
  return {
    totalRestTimeInSeconds,
    activeRestTime,
    startRestTimerHandler,
  };
}
