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
  TrainingProgramParamsType,
} from "./reducer/trainingProgramReducer";

type TrainingProgramType = ReturnType<typeof useTrainingProgram>;

const TrainingProgramContext = createContext<TrainingProgramType>({
  training_week: INITIAL_STATE.training_week,
  training_block: INITIAL_STATE.training_block,
  split_sessions: INITIAL_STATE.split_sessions,
  frequency: INITIAL_STATE.frequency,
  training_program_params: INITIAL_STATE.training_program_params,
  prioritized_muscle_list: INITIAL_STATE.muscle_priority_list,
  handleUpdateMuscleList: () => null,
  handleUpdateMuscle: () => null,
  handleUpdateBreakpoint: () => null,
  handleUpdateBreakpoints: () => null,
  handleUpdateSplitSessions: () => null,
  handleFrequencyChange: () => null,
  handleRearrangeTrainingWeek: () => null,
  handleChangeFrequencyProgression: () => null,
  handleOnProgramConfigChange: () => null,
  mrv_breakpoint: INITIAL_STATE.mrv_breakpoint,
  mev_breakpoint: INITIAL_STATE.mev_breakpoint,
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

  const handleFrequencyChange = useCallback(
    (value: [number, number], split?: SplitSessionsNameType) => {
      dispatch({
        type: "UPDATE_FREQUENCY",
        payload: { frequency: value, split: split },
      });
    },
    []
  );

  const handleUpdateMuscleList = useCallback(
    (items: MusclePriorityType[]) => {
      dispatch({
        type: "UPDATE_MUSCLE_PRIORITY_LIST",
        payload: { priority_list: items },
      });
    },
    [muscle_priority_list]
  );

  const handleUpdateMuscle = useCallback(
    (updated_muscle: MusclePriorityType) => {
      dispatch({
        type: "UPDATE_EXERCISES_BY_MUSCLE",
        payload: { updated_muscle: updated_muscle },
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

  const handleUpdateBreakpoints = useCallback((value: [number, number]) => {
    dispatch({
      type: "UPDATE_VOLUME_BREAKPOINTS",
      payload: { value: value },
    });
  }, []);

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

  const handleOnProgramConfigChange = useCallback(
    (
      _frequency: [number, number],
      _split: SplitSessionsNameType,
      _muscle_priority_list: MusclePriorityType[],
      _params: TrainingProgramParamsType
    ) => {
      dispatch({
        type: "UPDATE_PROGRAM_CONFIG",
        payload: {
          frequency: _frequency,
          split: _split,
          muscle_priority_list: _muscle_priority_list,
          training_program_config: _params,
        },
      });
    },
    []
  );

  useEffect(() => {
    dispatch({ type: "UPDATE_SPLIT_SESSIONS", payload: { split: "OPT" } });
    // dispatch({ type: "UPDATE_TRAINING_WEEK" });
  }, []);

  useEffect(() => {
    // dispatch({ type: "UPDATE_TRAINING_WEEK" });
    console.log(
      frequency,
      split_sessions,
      muscle_priority_list,
      training_block,
      training_week,
      "ALL DATA"
    );
  }, [frequency, split_sessions, muscle_priority_list, training_week]);

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
    handleUpdateMuscle,
    handleUpdateBreakpoint,
    handleUpdateBreakpoints,
    handleUpdateSplitSessions,
    handleFrequencyChange,
    handleRearrangeTrainingWeek,
    handleChangeFrequencyProgression,
    handleOnProgramConfigChange,
    mrv_breakpoint,
    mev_breakpoint,
  };
}

export {
  TrainingProgramProvider,
  useTrainingProgram,
  useTrainingProgramContext,
};
