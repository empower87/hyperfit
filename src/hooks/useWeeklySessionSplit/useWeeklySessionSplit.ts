import { useCallback, useEffect, useReducer } from "react";
import weeklySessionSplitReducer, {
  INITIAL_STATE,
  MusclePriorityType,
} from "./reducer/weeklySessionSplitReducer";

export default function useWeeklySessionSplit() {
  const [{ total_sessions, list, split }, dispatch] = useReducer(
    weeklySessionSplitReducer,
    INITIAL_STATE
  );

  useEffect(() => {
    console.log(split, list, total_sessions, "TEST: OMG IF THIS WORKS");
  }, [total_sessions, list, split]);

  const handleFrequencyChange = (first: number, second: number) => {
    dispatch({
      type: "UPDATE_SESSIONS",
      payload: { new_sessions: [first, second] },
    });
  };

  const handleUpdateMuscleList = useCallback((items: MusclePriorityType[]) => {
    dispatch({ type: "UPDATE_LIST", payload: { new_list: items } });
  }, []);

  return {
    split,
    total_sessions,
    prioritized_muscle_list: list,
    handleUpdateMuscleList,
    handleFrequencyChange,
  };
}
