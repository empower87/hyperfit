import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  INITIAL_STATE,
  MusclePriorityType,
  SplitSessionsType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";

function useProgramConfig() {
  const {
    prioritized_muscle_list,
    split_sessions,
    training_program_params,
    frequency,
    handleOnProgramConfigChange,
  } = useTrainingProgramContext();
  const [list, setList] = useState<MusclePriorityType[]>([
    ...prioritized_muscle_list,
  ]);
  const [splitSessions, setSplitSessions] = useState<SplitSessionsType>({
    ...split_sessions,
  });
  const [programParams, setProgramParams] = useState({
    ...training_program_params,
  });
  const [freq, setFreq] = useState<[number, number]>([...frequency]);

  const onSaveConfig = useCallback(() => {
    handleOnProgramConfigChange(freq, splitSessions.split, list, programParams);
  }, [freq, splitSessions, list, programParams]);

  return {
    muscle_priority_list: list,
    split_sessions: splitSessions,
    training_program_params: programParams,
    frequency: freq,
    onSaveConfig,
  };
}

type ProgramConfigType = ReturnType<typeof useProgramConfig>;

const ProgramConfigContext = createContext<ProgramConfigType>({
  muscle_priority_list: INITIAL_STATE.muscle_priority_list,
  split_sessions: INITIAL_STATE.split_sessions,
  training_program_params: INITIAL_STATE.training_program_params,
  frequency: INITIAL_STATE.frequency,
  onSaveConfig: () => {},
});

const ProgramConfigProvider = ({ children }: { children: ReactNode }) => {
  const values = useProgramConfig();
  return (
    <ProgramConfigContext.Provider value={values}>
      {children}
    </ProgramConfigContext.Provider>
  );
};

const useProgramConfigContext = () => {
  return useContext(ProgramConfigContext);
};

export { ProgramConfigProvider, useProgramConfigContext };
