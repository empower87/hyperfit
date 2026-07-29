import { createContext, ReactNode, useContext, useMemo, useState } from "react";
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

const useRestTimerControls = () => {
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

type RestTimerControlsType = ReturnType<typeof useRestTimerControls>;

const RestTimerControlsContext = createContext<RestTimerControlsType | null>(
  null
);

const RestTimerControlsProvider = ({ children }: { children: ReactNode }) => {
  const values = useRestTimerControls();

  const contextValues = useMemo(() => {
    return values;
  }, [values]);

  return (
    <RestTimerControlsContext.Provider value={contextValues}>
      {children}
    </RestTimerControlsContext.Provider>
  );
};

const useRestTimerControlsContext = () => {
  const context = useContext(RestTimerControlsContext);
  if (!context) {
    throw new Error(
      "RestTimer.* component must be rendered as child of RestTimer component"
    );
  }
  return context;
};

export { RestTimerControlsProvider, useRestTimerControlsContext };
