import { useCallback, useEffect, useReducer } from "react";
import weeklySessionSplitReducer, {
  INITIAL_STATE,
  MusclePriorityType,
  SplitSessionsNameType,
} from "./reducer/weeklySessionSplitReducer";

export default function useWeeklySessionSplit() {
  const [
    {
      total_sessions,
      split_sessions,
      list,
      training_week,
      mrv_breakpoint,
      mev_breakpoint,
    },
    dispatch,
  ] = useReducer(weeklySessionSplitReducer, INITIAL_STATE);

  const handleFrequencyChange = (first: number, second: number) => {
    dispatch({
      type: "UPDATE_TOTAL_SESSIONS",
      payload: { new_sessions: [first, second] },
    });
  };

  const handleUpdateMuscleList = useCallback((items: MusclePriorityType[]) => {
    dispatch({ type: "UPDATE_LIST", payload: { new_list: items } });
  }, []);

  const handleUpdateBreakpoint = useCallback(
    (type: "mev_breakpoint" | "mrv_breakpoint", value: number) => {
      if (type === "mev_breakpoint") {
        dispatch({ type: "UPDATE_MEV_BREAKPOINT", payload: { [type]: value } });
      } else {
        dispatch({ type: "UPDATE_MRV_BREAKPOINT", payload: { [type]: value } });
      }
    },
    []
  );

  const handleUpdateSplitSessions = useCallback(
    (type: SplitSessionsNameType) => {
      dispatch({
        type: "UPDATE_SPLIT_SESSIONS",
        payload: { split_type: type },
      });
    },
    []
  );

  useEffect(() => {
    dispatch({ type: "UPDATE_SPLIT_SESSIONS", payload: { split_type: "OPT" } });
  }, []);

  return {
    training_week,
    split_sessions,
    total_sessions,
    prioritized_muscle_list: list,
    handleUpdateMuscleList,
    handleUpdateBreakpoint,
    handleUpdateSplitSessions,
    handleFrequencyChange,
    mrv_breakpoint,
    mev_breakpoint,
  };
}
