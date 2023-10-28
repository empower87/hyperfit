import { useCallback, useReducer } from "react";
import weeklySessionSplitReducer, {
  INITIAL_STATE,
  MusclePriorityType,
} from "./reducer/weeklySessionSplitReducer";

export default function useWeeklySessionSplit() {
  const [
    { total_sessions, list, split, mrv_breakpoint, mev_breakpoint },
    dispatch,
  ] = useReducer(weeklySessionSplitReducer, INITIAL_STATE);

  const handleFrequencyChange = (first: number, second: number) => {
    dispatch({
      type: "UPDATE_SESSIONS",
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

  return {
    split,
    total_sessions,
    prioritized_muscle_list: list,
    handleUpdateMuscleList,
    handleUpdateBreakpoint,
    handleFrequencyChange,
    mrv_breakpoint,
    mev_breakpoint,
  };
}
