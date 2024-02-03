import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import weeklySessionSplitReducer, {
  INITIAL_STATE,
  MusclePriorityType,
  SplitSessionsNameType,
  TrainingDayType,
} from "./reducer/trainingProgramReducer";

type TrainingProgramType = ReturnType<typeof useTrainingProgram>;

const TrainingProgramContext = createContext<TrainingProgramType>({
  training_week: INITIAL_STATE.training_week,
  training_block: INITIAL_STATE.training_block,
  split_sessions: INITIAL_STATE.split_sessions,
  frequency: INITIAL_STATE.frequency,
  training_program_params: INITIAL_STATE.training_program_params,
  prioritized_muscle_list: [],
  handleUpdateMuscleList: () => {},
  handleUpdateBreakpoint: () => {},
  handleUpdateSplitSessions: () => {},
  handleFrequencyChange: () => {},
  handleRearrangeTrainingWeek: () => {},
  handleChangeFrequencyProgression: () => {},
  mrv_breakpoint: 4,
  mev_breakpoint: 9,
});

const TrainingProgramProvider = ({ children }: { children: ReactNode }) => {
  const values = useTrainingProgram();
  return (
    <TrainingProgramContext.Provider value={values}>
      {children}
    </TrainingProgramContext.Provider>
  );
};

const useTrainingProgramContext = () => {
  return useContext(TrainingProgramContext);
};

function useTrainingProgram() {
  const [
    {
      frequency,
      split_sessions,
      muscle_priority_list,
      training_program_params,
      training_week,
      training_block,
      mrv_breakpoint,
      mev_breakpoint,
    },
    dispatch,
  ] = useReducer(weeklySessionSplitReducer, INITIAL_STATE);

  const handleFrequencyChange = (first: number, second: number) => {
    dispatch({
      type: "UPDATE_FREQUENCY",
      payload: { frequency: [first, second] },
    });
  };

  const handleUpdateMuscleList = useCallback(
    (items: MusclePriorityType[]) => {
      dispatch({
        type: "UPDATE_MUSCLE_PRIORITY_LIST",
        payload: { priority_list: items },
      });
    },
    [muscle_priority_list]
  );

  const handleUpdateBreakpoint = useCallback(
    (type: "mev_breakpoint" | "mrv_breakpoint", value: number) => {
      dispatch({
        type: "UPDATE_VOLUME_BREAKPOINT",
        payload: { indicator: type, value: value },
      });
    },
    []
  );

  const handleChangeFrequencyProgression = useCallback(
    (id: MusclePriorityType["id"], type: "add" | "subtract") => {
      dispatch({
        type: "ADJUST_FREQUENCY_PROGRESSION",
        payload: {
          update_frequency_tuple: [id, type],
        },
      });
    },
    []
  );

  const handleChangeVolumeBenchmark = useCallback((value: number) => {}, []);

  const handleUpdateSplitSessions = (type: SplitSessionsNameType) => {
    dispatch({
      type: "UPDATE_SPLIT_SESSIONS",
      payload: { split: type },
    });
  };

  const handleRearrangeTrainingWeek = (week: TrainingDayType[]) => {
    dispatch({
      type: "REARRANGE_TRAINING_WEEK",
      payload: { rearranged_week: week },
    });
  };

  useEffect(() => {
    dispatch({ type: "UPDATE_SPLIT_SESSIONS", payload: { split: "OPT" } });
    // dispatch({ type: "UPDATE_TRAINING_WEEK" });
  }, []);

  useEffect(() => {
    dispatch({ type: "UPDATE_TRAINING_WEEK" });
    console.log(
      frequency,
      split_sessions,
      muscle_priority_list,
      training_block,
      training_week,
      "ALL DATA"
    );
  }, [frequency, split_sessions, muscle_priority_list]);

  // useEffect(() => {
  //   dispatch({ type: "GET_TRAINING_BLOCK" });
  //   console.log(muscle_priority_list, training_block, "TEST: TRAINING BLOCK");
  // }, [training_week, muscle_priority_list, frequency, split_sessions]);

  return {
    training_week,
    training_block,
    split_sessions,
    frequency,
    training_program_params,
    prioritized_muscle_list: muscle_priority_list,
    handleUpdateMuscleList,
    handleUpdateBreakpoint,
    handleUpdateSplitSessions,
    handleFrequencyChange,
    handleRearrangeTrainingWeek,
    handleChangeFrequencyProgression,
    mrv_breakpoint,
    mev_breakpoint,
  };
}

export {
  TrainingProgramProvider,
  useTrainingProgram,
  useTrainingProgramContext,
};
