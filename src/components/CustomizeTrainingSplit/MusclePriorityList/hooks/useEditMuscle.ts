import { useCallback, useEffect, useState } from "react";
import { MuscleType } from "~/constants/workoutSplits";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import { getSetProgressionMatrixForMuscle } from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";
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

// TODO: may need a useReducer for this as the state is so intrinsically tied.
export default function useEditMuscle(
  _muscle: MusclePriorityType,
  microcycles: number
) {
  const { volume, muscle } = _muscle;
  const [volumeLandmark, setVolumeLandmark] = useState<VolumeLandmarkType>(
    volume.landmark
  );
  const [frequencyProgression, setFrequencyProgression] = useState<number[]>([
    ...volume.frequencyProgression,
  ]);
  const [setProgressionMatrix, setSetProgressionMatrix] = useState<
    number[][][][]
  >([...volume.setProgressionMatrix]);
  const [volumePerMicrocycle, setVolumePerMicrocycle] = useState<number[]>([]);

  useEffect(() => {
    const newSetMatrix = getSetProgressionMatrixForMuscle(
      frequencyProgression,
      volume.exercisesPerSessionSchema,
      microcycles
    );
    setSetProgressionMatrix(newSetMatrix);
  }, [microcycles, volume.exercisesPerSessionSchema, frequencyProgression]);

  useEffect(() => {
    const totalVolume = getTotalVolumeHandler(
      frequencyProgression,
      setProgressionMatrix,
      muscle,
      volume.landmark,
      microcycles
    );
    setVolumePerMicrocycle(totalVolume);
  }, [frequencyProgression, setProgressionMatrix, muscle, volume, microcycles]);

  const updateFrequencyProgression = useCallback(
    (index: number, value: number) => {
      const newFreqProgression = [...frequencyProgression];
      newFreqProgression[index] = value;
      setFrequencyProgression(newFreqProgression);
    },
    []
  );

  const getFrequencyProgressionRanges = (index: number): [number, number] => {
    const maxValue =
      volume.frequencyProgression[volume.frequencyProgression.length - 1];
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
    setProgressionMatrix,
    volumePerMicrocycle,
    updateFrequencyProgression,
    getFrequencyProgressionRanges,
  };
}
