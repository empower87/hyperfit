import { useCallback, useState } from "react";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

const SET = {
  set_num: 1,
  lbs: 105,
  reps: 12,
  rir: 3,
  prev_lbs: 105,
  prev_reps: 12,
};
type SetType = typeof SET;

export default function useSets(exercise: ExerciseType) {
  const sets_array: SetType[] = Array.from(Array(exercise.sets), (_, i) => ({
    ...SET,
    set_num: i + 1,
  }));

  const [sets, setSets] = useState([...sets_array]);

  const onCompleteSet = useCallback(
    (completed_set: SetType) => {
      const updatedSets = sets.map((set) => {
        if (set.set_num === completed_set.set_num) {
          return { ...set, ...completed_set };
        }
        return set;
      });
      setSets(updatedSets);
      console.log("completed set", completed_set, sets);
    },
    [sets]
  );

  return {
    sets,
    onCompleteSet,
  };
}
