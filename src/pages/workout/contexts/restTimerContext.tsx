import { createContext, ReactNode, useContext, useMemo } from "react";
import useRestTimer from "../hooks/useRestTimer";

type RestTimerType = ReturnType<typeof useRestTimer>;

const RestTimerContext = createContext<RestTimerType>({
  customRestPeriodOptions: [],
  restPeriods: [],
  totalRestTimeInSeconds: 0,
  activeRestTime: 0,
  startRestTimerHandler: () => null,
  stopRestTimerHandler: () => null,
  initRestTimer: () => null,
  presetRestTimerHandler: () => null,
});

const RestTimerProvider = ({ children }: { children: ReactNode }) => {
  const values = useRestTimer();
  const contextValues = useMemo(() => {
    return values;
  }, [values]);

  return (
    <RestTimerContext.Provider value={contextValues}>
      {children}
    </RestTimerContext.Provider>
  );
};

const useRestTimerContext = () => {
  return useContext(RestTimerContext);
};

export { RestTimerProvider, useRestTimerContext };
