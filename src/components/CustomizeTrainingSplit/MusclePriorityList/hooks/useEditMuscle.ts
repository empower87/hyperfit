import { useCallback, useReducer, useState } from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import {
  getFrequencyByVolumeLandmark,
  getSetProgressionMatrixForMuscle,
} from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";

type EditFrequencyProgression = {
  type: "EDIT_FREQUENCY_PROGRESSION";
  payload: { index: number; value: number; microcycles: number };
};
type AdjustVolumeSets = {
  type: "ADJUST_VOLUME_SETS";
  payload: {
    keySchema: [VolumeLandmarkType, number];
    frequencyIndex: number;
    adjust: "add" | "subtract";
    microcycles: number;
  };
};
type ChangeVolumeLandmark = {
  type: "CHANGE_VOLUME_LANDMARK";
  payload: {
    new_landmark: VolumeLandmarkType;
    sessions: number;
    microcycles: number;
    mesocycles: number;
  };
};
type Reset = {
  type: "RESET";
  payload: { reset_props: MusclePriorityType };
};
type ActionType =
  | EditFrequencyProgression
  | ChangeVolumeLandmark
  | AdjustVolumeSets
  | Reset;

const editMuscleReducer = (state: MusclePriorityType, action: ActionType) => {
  switch (action.type) {
    case "EDIT_FREQUENCY_PROGRESSION":
      const { index, value, microcycles } = action.payload;
      const newFreqProgression = [...state.volume.frequencyProgression];
      newFreqProgression[index] = value;

      const newSetMatrix = getSetProgressionMatrixForMuscle(
        newFreqProgression,
        state.volume.exercisesPerSessionSchema,
        microcycles
      );

      return {
        ...state,
        volume: {
          ...state.volume,
          frequencyProgression: newFreqProgression,
          setProgressionMatrix: newSetMatrix,
        },
      };
    case "CHANGE_VOLUME_LANDMARK":
      const {
        new_landmark,
        sessions,
        mesocycles,
        microcycles: microcycles2,
      } = action.payload;
      const newFrequency = getFrequencyByVolumeLandmark(
        sessions,
        state.muscle,
        new_landmark,
        mesocycles
      );
      const newSetMatrix2 = getSetProgressionMatrixForMuscle(
        newFrequency,
        state.volume.exercisesPerSessionSchema,
        microcycles2
      );
      return {
        ...state,
        volume: {
          ...state.volume,
          landmark: new_landmark,
          frequencyProgression: newFrequency,
          setProgressionMatrix: newSetMatrix2,
        },
      };
    case "ADJUST_VOLUME_SETS":
      const {
        keySchema,
        frequencyIndex,
        adjust,
        microcycles: microcycles3,
      } = action.payload;

      const adjustedSetProgression = getSetProgressionMatrixForMuscle(
        state.volume.frequencyProgression,
        state.volume.exercisesPerSessionSchema,
        microcycles3,
        { keySchema, frequencyIndex, adjust }
      );
      console.log(
        state.volume.setProgressionMatrix,
        adjustedSetProgression,
        "OK THIS SHOULD BE DIFFERENT?"
      );
      return {
        ...state,
        volume: {
          ...state.volume,
          setProgressionMatrix: adjustedSetProgression,
        },
      };
    case "RESET":
      const { reset_props } = action.payload;

      return {
        ...state,
        volume: {
          frequencyProgression: reset_props.volume.frequencyProgression,
          landmark: reset_props.volume.landmark,
          exercisesPerSessionSchema:
            reset_props.volume.exercisesPerSessionSchema,
          setProgressionMatrix: reset_props.volume.setProgressionMatrix,
        },
      };
    default:
      return state;
  }
};

// TODO: may need a useReducer for this as the state is so intrinsically tied.
export default function useEditMuscle(
  _muscle: MusclePriorityType,
  microcycles: number
) {
  const muscle = { ..._muscle };
  const [{ volume }, dispatch] = useReducer(editMuscleReducer, muscle);
  const {
    frequencyProgression,
    landmark,
    setProgressionMatrix,
    exercisesPerSessionSchema,
  } = volume;
  const [volumePerMicrocycle, setVolumePerMicrocycle] = useState<number[]>([]);

  const updateFrequencyProgression = useCallback(
    (index: number, value: number) => {
      dispatch({
        type: "EDIT_FREQUENCY_PROGRESSION",
        payload: { index, value, microcycles },
      });
    },
    []
  );

  const adjustVolumeSets = useCallback(
    (frequencyIndex: number, adjust: "add" | "subtract") => {
      dispatch({
        type: "ADJUST_VOLUME_SETS",
        payload: {
          keySchema: [landmark, exercisesPerSessionSchema],
          frequencyIndex: frequencyIndex,
          adjust: adjust,
          microcycles: microcycles,
        },
      });
    },
    [microcycles, landmark, exercisesPerSessionSchema]
  );

  const changeVolumeLandmark = useCallback(
    (new_landmark: VolumeLandmarkType) => {
      const mesocycles = frequencyProgression.length;
      const sessions = 2;

      dispatch({
        type: "CHANGE_VOLUME_LANDMARK",
        payload: { new_landmark, sessions, microcycles, mesocycles },
      });
    },
    [microcycles, frequencyProgression]
  );

  const onResetHandler = useCallback(() => {
    dispatch({ type: "RESET", payload: { reset_props: muscle } });
  }, [muscle]);

  const getFrequencyProgressionRanges = (
    index: number,
    frequencyProgression: number[]
  ): [number, number] => {
    const maxValue =
      _muscle.volume.frequencyProgression[
        _muscle.volume.frequencyProgression.length - 1
      ];
    const prevValue = frequencyProgression[index - 1];
    const nextValue = frequencyProgression[index + 1];

    const minMaxTuple: [number, number] = [0, maxValue];
    if (prevValue !== undefined) {
      minMaxTuple[0] = prevValue;
    }
    if (nextValue !== undefined) {
      minMaxTuple[1] = nextValue;
    }
    return minMaxTuple;
  };

  return {
    frequencyProgression,
    landmark,
    setProgressionMatrix,
    volumePerMicrocycle,
    updateFrequencyProgression,
    getFrequencyProgressionRanges,
    changeVolumeLandmark,
    adjustVolumeSets,
    onResetHandler,
  };
}

// 1 - upper
// 1. triceps    - JM Press (barbell) - heavy
// 2. triceps    - Overhead Extensions (Cable)
// 3. back       - Lat Prayers
// 4. back       - T-Bar Rows
// 5. side delts - Lateral Raise (Cable)
// 6. rear delts - Rear Delt Cable Crossover (single)
// 7. biceps     - Preacher Curl
// 8. chest      - Incline Bench Press (dumbbell)

// 2 - lower
// 1. quads      - Squats
// 2. hams       - Romanian Deadlifts
// 3. quads      - Leg Extensions
// 4. calves     - ??
// 5. traps      - Shrug (Barbell)
// 6. forearms   - Reverse Curl
// 7. rear delts - Face Pull

// 3 - upper
// 1. back       - Dumbbell Rows
// 2. back       - Cable Pullovers
// 3. triceps    - Seated Pushdowns
// 4. triceps    - Overhead Triceps Extensions (Single)
// 5. side delts - BTB Lateral Raise (Cable)
// 6. traps      - Shrug (Dumbbell, Single)
// 7. chest      - Close-Grip Bench Press
// 8. biceps     - Hammer Curl

// 4 - upper
// 1. triceps    - JM Press (barbell) - light
// 2. back       - Lat Prayers
// 3. triceps    - Overhead Extensions (Cable)
// 4. back       - T-Bar Rows
// 5. side delts - Seated Overhead Press (Dumbbell)
// 6. biceps     - Incline Curl (Dumbbell)
// 7. traps      - Shrug (Machine)
// 8. forearms   - Wrist Curls (Dumbbell)

// 5 - full
// 1. quads      - Deadlifts
// 2. triceps    - Overhead Triceps Extensions (Single)
// 3. back       - Seated Cable Row (Single, Lat-Focused)
// 4. side delts - BTB Lateral Raise (Cable)
// 5. rear delts - Rear Delt Cable Crossover (single)
// 6. quads      - Leg Press
// 7. calves     - Calf Raises on Leg Press
// 8. hams       - Leg Curls
