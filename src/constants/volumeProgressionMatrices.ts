import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";

export const MRV_PROGRESSION_MATRIX_ONE = [
  [[2]],
  [[3], [3]],
  [[3], [3], [3]],
  [[4], [4], [4], [3]],
  [[5], [5], [5], [4], [3]],
  [[5], [5], [5], [4], [3], [2]],
];

export const MRV_PROGRESSION_MATRIX_TWO = [
  [[2, 2]],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [2, 3],
    [2, 3],
    [2, 2],
  ],
  [
    [3, 3],
    [3, 3],
    [2, 3],
    [2, 0],
  ],
  [
    [3, 3],
    [3, 3],
    [3, 3],
    [3, 0],
    [2, 0],
  ],
  [
    [3, 3],
    [3, 3],
    [3, 3],
    [3, 0],
    [2, 0],
    [1, 0],
  ],
];

export const getVolumeProgressionMatrix = (
  landmark: VolumeLandmarkType,
  exercisesPerSession: number
) => {
  switch (landmark) {
    case "MRV":
      if (exercisesPerSession === 2) {
        return MRV_PROGRESSION_MATRIX_TWO;
      } else {
        return MRV_PROGRESSION_MATRIX_ONE;
      }
    case "MEV":
      if (exercisesPerSession === 2) {
        return MRV_PROGRESSION_MATRIX_TWO;
      } else {
        return MRV_PROGRESSION_MATRIX_ONE;
      }
    case "MV":
    default:
      return MRV_PROGRESSION_MATRIX_TWO;
  }
};
