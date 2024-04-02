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
  SplitSessionsNameType,
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
  const [split, setSplit] = useState<SplitSessionsNameType>(
    split_sessions.split
  );
  const [splitSessions, setSplitSessions] = useState<SplitSessionsType>({
    ...split_sessions,
  });
  const [programParams, setProgramParams] = useState({
    ...training_program_params,
  });
  const [freq, setFreq] = useState<[number, number]>([...frequency]);

  const onFrequencyChange = useCallback((values: [number, number]) => {
    setFreq(values);
  }, []);

  const onSplitChange = useCallback((split: SplitSessionsNameType) => {
    setSplit(split);
  }, []);

  const onSaveConfig = useCallback(() => {
    handleOnProgramConfigChange(freq, split, list, programParams);
  }, [freq, split, list, programParams]);

  return {
    muscle_priority_list: list,
    split_sessions: splitSessions,
    training_program_params: programParams,
    frequency: freq,
    split,
    onSaveConfig,
    onSplitChange,
    onFrequencyChange,
  };
}

type ProgramConfigType = ReturnType<typeof useProgramConfig>;

const ProgramConfigContext = createContext<ProgramConfigType>({
  muscle_priority_list: INITIAL_STATE.muscle_priority_list,
  split_sessions: INITIAL_STATE.split_sessions,
  training_program_params: INITIAL_STATE.training_program_params,
  frequency: INITIAL_STATE.frequency,
  split: "OPT",
  onSaveConfig: () => null,
  onSplitChange: () => null,
  onFrequencyChange: () => null,
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
