import { createContext, ReactNode, useContext, useMemo } from "react";
import useRestTimer from "../hooks/useRestTimer";

type RestTimerType = ReturnType<typeof useRestTimer>;

const RestTimerContext = createContext<RestTimerType | null>(null);

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
  const context = useContext(RestTimerContext);
  if (!context) {
    throw new Error(
      "RestTimer.* component must be rendered as child of RestTimer component"
    );
  }
  return context;
};

export { RestTimerProvider, useRestTimerContext };
