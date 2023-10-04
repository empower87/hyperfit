import { useCallback, useEffect, useReducer } from "react";
import weeklySessionSplitReducer, {
  INITIAL_STATE,
  MusclePriorityType,
} from "./reducer/weeklySessionSplitReducer";

export default function useWeeklySessionSplit() {
  const [{ total_sessions, list, split, training_block }, dispatch] =
    useReducer(weeklySessionSplitReducer, INITIAL_STATE);

  useEffect(() => {
    dispatch({ type: "GET_TRAINING_BLOCK" });
  }, [split]);

  useEffect(() => {
    console.log(
      split,
      list,
      total_sessions,
      training_block,
      "TEST: OMG IF THIS WORKS"
    );
  }, [total_sessions, list, split, training_block]);

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
    training_block,
    total_sessions,
    prioritized_muscle_list: list,
    handleUpdateMuscleList,
    handleFrequencyChange,
  };
}
