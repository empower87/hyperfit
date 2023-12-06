import { useCallback, useEffect, useReducer } from "react";
import weeklySessionSplitReducer, {
  INITIAL_STATE,
  MusclePriorityType,
  SplitSessionsNameType,
} from "./reducer/trainingProgramReducer";

export default function useWeeklySessionSplit() {
  const [
    {
      frequency,
      split_sessions,
      muscle_priority_list,
      training_week,
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

  const handleUpdateMuscleList = useCallback((items: MusclePriorityType[]) => {
    dispatch({
      type: "UPDATE_MUSCLE_PRIORITY_LIST",
      payload: { priority_list: items },
    });
  }, []);

  const handleUpdateBreakpoint = useCallback(
    (type: "mev_breakpoint" | "mrv_breakpoint", value: number) => {
      dispatch({
        type: "UPDATE_VOLUME_BREAKPOINT",
        payload: { indicator: type, value: value },
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

  useEffect(() => {
    dispatch({ type: "UPDATE_SPLIT_SESSIONS", payload: { split: "OPT" } });
  }, []);

  useEffect(() => {
    dispatch({ type: "UPDATE_TRAINING_WEEK" });

    console.log(
      frequency,
      split_sessions,
      muscle_priority_list,
      mrv_breakpoint,
      mev_breakpoint,
      training_week,
      "TEST: ALL STATE DATA"
    );
  }, [frequency, split_sessions, muscle_priority_list]);

  return {
    training_week,
    split_sessions,
    frequency,
    prioritized_muscle_list: muscle_priority_list,
    handleUpdateMuscleList,
    handleUpdateBreakpoint,
    handleUpdateSplitSessions,
    handleFrequencyChange,
    mrv_breakpoint,
    mev_breakpoint,
  };
}
