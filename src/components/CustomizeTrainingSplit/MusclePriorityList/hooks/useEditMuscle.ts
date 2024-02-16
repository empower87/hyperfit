import { useCallback, useReducer, useState } from "react";
import { MuscleType } from "~/constants/workoutSplits";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import {
  getFrequencyByVolumeLandmark,
  getSetProgressionMatrixForMuscle,
} from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";
import { getEndOfMesocycleVolume } from "../utils/getVolumeTotal";

const getTotalVolumeHandler = (
  _frequencyProgression: number[],
  _matrix: number[][][][],
  _muscle: MuscleType,
  _landmark: VolumeLandmarkType,
  _microcycles: number
) => {
  let newVolume: number[] = [];
  for (let i = 0; i < _frequencyProgression.length; i++) {
    const newTotalVolume = getEndOfMesocycleVolume(
      _muscle,
      i + 1,
      _landmark,
      _matrix
    );
    newVolume.push(newTotalVolume);
  }
  return newVolume;
};

type EditFrequencyProgression = {
  type: "EDIT_FREQUENCY_PROGRESSION";
  payload: { index: number; value: number; microcycles: number };
};
type AddSubtractVolume = {
  type: "ADD_SUBTRACT_VOLUME";
  payload: { index: number; value: number; microcycles: number };
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
type ActionType =
  | EditFrequencyProgression
  | ChangeVolumeLandmark
  | AddSubtractVolume;

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
    case "ADD_SUBTRACT_VOLUME":
      return {
        ...state,
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
  const { frequencyProgression, landmark, setProgressionMatrix } = volume;
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

    let minMaxTuple: [number, number] = [0, maxValue];
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
  };
}

// export default function useEditMuscle(
//   _muscle: MusclePriorityType,
//   microcycles: number
// ) {

//   const { volume, muscle } = _muscle;
//   const [volumeLandmark, setVolumeLandmark] = useState<VolumeLandmarkType>(
//     volume.landmark
//   );
//   const [frequencyProgression, setFrequencyProgression] = useState<number[]>([
//     ...volume.frequencyProgression,
//   ]);
//   const [setProgressionMatrix, setSetProgressionMatrix] = useState<
//     number[][][][]
//   >([...volume.setProgressionMatrix]);
//   const [volumePerMicrocycle, setVolumePerMicrocycle] = useState<number[]>([]);

//   useEffect(() => {
//     const newSetMatrix = getSetProgressionMatrixForMuscle(
//       frequencyProgression,
//       volume.exercisesPerSessionSchema,
//       microcycles
//     );
//     setSetProgressionMatrix(newSetMatrix);
//   }, [microcycles, volume.exercisesPerSessionSchema, frequencyProgression]);

//   useEffect(() => {
//     const totalVolume = getTotalVolumeHandler(
//       frequencyProgression,
//       setProgressionMatrix,
//       muscle,
//       volume.landmark,
//       microcycles
//     );
//     setVolumePerMicrocycle(totalVolume);
//   }, [frequencyProgression, setProgressionMatrix, muscle, volume, microcycles]);

//   const updateFrequencyProgression = useCallback(
//     (index: number, value: number) => {
//       const newFreqProgression = [...frequencyProgression];
//       newFreqProgression[index] = value;
//       setFrequencyProgression(newFreqProgression);
//     },
//     []
//   );

//   const getFrequencyProgressionRanges = (index: number): [number, number] => {
//     const maxValue =
//       volume.frequencyProgression[volume.frequencyProgression.length - 1];
//     const prevValue = frequencyProgression[index - 1];
//     const nextValue = frequencyProgression[index + 1];

//     let minMaxTuple: [number, number] = [0, maxValue];
//     if (prevValue !== undefined) {
//       minMaxTuple[0] = prevValue;
//     }
//     if (nextValue !== undefined) {
//       minMaxTuple[1] = nextValue;
//     }
//     return minMaxTuple;
//   };

//   return {
//     frequencyProgression,
//     setProgressionMatrix,
//     volumePerMicrocycle,
//     updateFrequencyProgression,
//     getFrequencyProgressionRanges,
//   };
// }
