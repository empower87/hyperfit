import { ReactNode, createContext, useContext } from "react";
import useSessionDurationVariables from "./useSessionDurationVariables";

type SessionDurationVariablesType = ReturnType<
  typeof useSessionDurationVariables
>;

const SessionDurationVariablesContext =
  createContext<SessionDurationVariablesType | null>(null);

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
  const context = useContext(SessionDurationVariablesContext);
  if (!context) {
    throw new Error(
      "useSessionDurationVariablesContext must be used within a SessionDurationVariablesProvider"
    );
  }
  return context;
};
export { SessionDurationVariablesProvider, useSessionDurationVariablesContext };
