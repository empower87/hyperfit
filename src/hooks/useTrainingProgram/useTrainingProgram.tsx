import deepEqual from "fast-deep-equal/es6";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import trainingProgramReducer, {
  INITIAL_STATE,
  MusclePriorityType,
  SplitSessionsNameType,
  State,
  TrainingDayType,
  TrainingProgramParamsType,
} from "./reducer/trainingProgramReducer";

type TrainingProgramType = ReturnType<typeof useTrainingProgram>;

const TrainingProgramContext = createContext<TrainingProgramType>({
  training_week: INITIAL_STATE.training_week,
  training_block: INITIAL_STATE.training_block,
  training_blocks: INITIAL_STATE.training_blocks,
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
  const contextValues = useMemo(() => {
    return values;
  }, [values]);

  return (
    <TrainingProgramContext.Provider value={contextValues}>
      {children}
    </TrainingProgramContext.Provider>
  );
};

const useTrainingProgramContext = () => {
  return useContext(TrainingProgramContext);
};

const STORAGE_KEY = "TRAINING_PROGRAM_STATE";

function isValidState(obj: any): obj is State {
  return (
    "frequency" in obj &&
    "training_program_params" in obj &&
    "muscle_priority_list" in obj &&
    "training_week" in obj &&
    "training_block" in obj &&
    "split_sessions" in obj &&
    "mrv_breakpoint" in obj &&
    "mev_breakpoint" in obj
  );
}

function parseState(stateString: string | null): State | null {
  if (!stateString) {
    return null;
  }

  try {
    const parsedState: unknown = JSON.parse(stateString);

    if (isValidState(parsedState)) {
      return parsedState;
    } else {
      console.error("Invalid state data in localStorage");
      return null;
    }
  } catch (error) {
    console.error("Error parsing state from localStorage:", error);
    return null;
  }
}

function useTrainingProgram() {
  const [state, dispatch] = useReducer(trainingProgramReducer, INITIAL_STATE);
  const prevState = useRef<State>(state);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    console.log(raw, "RAW");
    if (raw) {
      const localState = parseState(raw);
      if (!localState) return;
      console.log(state, localState, "LOCAL_STORAGE_STUFF");
      dispatch({
        type: "INIT_STORED",
        payload: { value: localState },
      });

      prevState.current = localState;
    }
  }, []);

  useEffect(() => {
    const initialStateEqual = deepEqual(INITIAL_STATE, state);
    const stateEqual = deepEqual(prevState.current, state);

    if (!stateEqual && !initialStateEqual) {
      const stringifiedState = JSON.stringify(state);
      window.localStorage.setItem(STORAGE_KEY, stringifiedState);
    }
  }, [state]);

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
    [state.muscle_priority_list]
  );

  const handleUpdateMuscle = useCallback(
    (updated_muscle: MusclePriorityType) => {
      dispatch({
        type: "UPDATE_EXERCISES_BY_MUSCLE",
        payload: { updated_muscle: updated_muscle },
      });
    },
    [state.muscle_priority_list]
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
      _params: TrainingProgramParamsType,
      _training_week: TrainingDayType[]
    ) => {
      dispatch({
        type: "UPDATE_PROGRAM_CONFIG",
        payload: {
          frequency: _frequency,
          split: _split,
          muscle_priority_list: _muscle_priority_list,
          training_program_config: _params,
          training_week: _training_week,
        },
      });
    },
    []
  );

  useEffect(() => {
    console.log(
      state.frequency,
      state.split_sessions,
      state.muscle_priority_list,
      state.training_block,
      state.training_week,
      "ALL DATA"
    );
  }, [
    state.frequency,
    state.split_sessions,
    state.muscle_priority_list,
    state.training_week,
  ]);

  return {
    training_week: state.training_week,
    training_block: state.training_block,
    training_blocks: state.training_blocks,
    split_sessions: state.split_sessions,
    frequency: state.frequency,
    training_program_params: state.training_program_params,
    prioritized_muscle_list: state.muscle_priority_list,
    handleUpdateMuscleList,
    handleUpdateMuscle,
    handleUpdateBreakpoint,
    handleUpdateBreakpoints,
    handleUpdateSplitSessions,
    handleFrequencyChange,
    handleRearrangeTrainingWeek,
    handleChangeFrequencyProgression,
    handleOnProgramConfigChange,
    mrv_breakpoint: state.mrv_breakpoint,
    mev_breakpoint: state.mev_breakpoint,
  };
}

export {
  TrainingProgramProvider,
  useTrainingProgram,
  useTrainingProgramContext
};

