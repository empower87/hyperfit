import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import { getMuscleData } from "~/utils/getMuscleData";

export const getEndOfMesocycleVolume = (
  group: string,
  mesocycle: number,
  volume_landmark: VolumeLandmarkType,
  setProgressionMatrix: number[][][][]
) => {
  const muscleData = getMuscleData(group);
  const key =
    volume_landmark === "MRV"
      ? "mrv_progression_matrix"
      : volume_landmark === "MEV"
      ? "mev_progression_matrix"
      : "mv_progression_matrix";
  const volFrequency = setProgressionMatrix[mesocycle - 1];

  // if (exercisesPerSessionSchema === 2) {
  //   volFrequency = MRV_PROGRESSION_MATRIX_TWO
  // } else {
  //   volFrequency = MRV_PROGRESSION_MATRIX_ONE
  // }

  const frequencyList = volFrequency[volFrequency.length - 1];

  let count = 0;
  for (let i = 0; i < frequencyList.length; i++) {
    for (let j = 0; j < frequencyList[i].length; j++) {
      count = count + frequencyList[i][j];
    }
  }

  if (key === "mv_progression_matrix") return count;
  else if (key === "mev_progression_matrix") return muscleData.MEV;
  return count;
};
