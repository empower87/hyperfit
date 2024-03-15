import { ReactNode, createContext, useContext } from "react";
import useSessionDurationVariables, {
  DURATION_TIME_CONSTRAINTS,
} from "./useSessionDurationVariables";

type SessionDurationVariablesType = ReturnType<
  typeof useSessionDurationVariables
>;

const SessionDurationVariablesContext =
  createContext<SessionDurationVariablesType>({
    durationTimeConstants: { ...DURATION_TIME_CONSTRAINTS },
    sessionDurationCalculator: () => 0,
    onTimeChange: () => {},
  });

const SessionDurationVariablesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const values = useSessionDurationVariables();
  return (
    <SessionDurationVariablesContext.Provider value={values}>
      {children}
    </SessionDurationVariablesContext.Provider>
  );
};

const useSessionDurationVariablesContext = () => {
  return useContext(SessionDurationVariablesContext);
};
export { SessionDurationVariablesProvider, useSessionDurationVariablesContext };
