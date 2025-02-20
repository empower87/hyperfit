import { createContext, ReactNode, useContext, useMemo } from "react";
import { useRestTimerControls } from "../hooks/useRestTimer";

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
