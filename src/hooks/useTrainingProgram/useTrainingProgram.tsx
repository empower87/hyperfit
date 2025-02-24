import deepEqual from "fast-deep-equal/es6";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  parseState,
  saveStateToLocalStorage,
  STORAGE_KEY,
} from "~/utils/localStorageHelpers";
import trainingProgramReducer, {
  INITIAL_STATE,
  MusclePriorityType,
  SplitSessionsNameType,
  State,
  TrainingDayType,
} from "./reducer/trainingProgramReducer";

type TrainingProgramType = ReturnType<typeof useTrainingProgram>;

const TrainingProgramContext = createContext<TrainingProgramType | null>(null);

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
  const context = useContext(TrainingProgramContext);

  if (!context) {
    throw new Error(
      "useTrainingProgramContext must be used within a TrainingProgramProvider"
    );
  }
  return context;
};

function useTrainingProgram() {
  const [state, dispatch] = useReducer(trainingProgramReducer, INITIAL_STATE);
  const prevState = useRef<State>(state);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    console.log(raw, "RAW");
    if (raw) {
      const localState = parseState(raw);
      console.log(state, localState, "LOCAL_STORAGE_STUFF");
      if (!localState) return;
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
      saveStateToLocalStorage(state);
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

  const handleOnProgramConfigChange = useCallback((value: State) => {
    dispatch({
      type: "UPDATE_PROGRAM_CONFIG",
      payload: {
        value: value,
      },
    });
  }, []);

  useEffect(() => {
    console.log(
      state.frequency,
      state.split_sessions,
      state.muscle_priority_list,
      state.training_block,
      "ALL DATA"
    );
  }, [state.frequency, state.split_sessions, state.muscle_priority_list]);

  return {
    training_block: state.training_block,
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
  useTrainingProgramContext,
};
