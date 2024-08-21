import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

// NOTE: 3/25/2024 - changed this to no longer have placeholder 0s in tuple, this may effect entire app down the line.
// keep an eye on how this effects rest of app.
// prettier-ignore
export const MRV_PROGRESSION_MATRIX_ONE = [
  [[2]],
  [[3], [3]],
  [[3], [3], [2]],
  [[4], [4], [3], [2]],
  [[5], [4], [4], [3], [2]],
  [[5], [5], [5], [4], [3], [2]],
];
// prettier-ignore
export const MRV_PROGRESSION_MATRIX_TWO = [
  [[2, 2]],
  [[2, 2], [2, 2]],
  [[2, 3], [2, 3], [2, 2]],
  [[3, 3], [3, 3], [2, 3], [2]],
  [[3, 3], [3, 3], [3, 3], [3], [2]],
  [[3, 3], [3, 3], [3, 3], [3], [2], [1]],
];
// prettier-ignore
export const MRV_PROGRESSION_MATRIX_ONE_INIT = [
  [[2]],
  [[3], [3]],
  [[3], [3], [2]],
  [[3], [3], [3], [2]],
  [[3], [3], [3], [3], [2]],
  [[3], [3], [3], [3], [3], [2]],
  [[3], [3], [3], [3], [3], [2], [1]],
];
// prettier-ignore
export const MRV_PROGRESSION_MATRIX_TWO_INIT = [
  [[2, 2]],
  [[2, 2], [2, 2]],
  [[2, 2], [2, 2], [2, 2]],
  [[2, 2], [2, 2], [2, 2], [2]],
  [[2, 2], [2, 2], [2, 2], [2], [1]],
  [[2, 2], [2, 2], [2, 2], [2], [2], [1]],
  [[2, 2], [2, 2], [2, 2], [2], [2], [2], [1]],
];
// prettier-ignore
const MEV_MV_PROGRESSION_MATRIX_TWO = [
  [[2]], 
  [[2]], 
  [[2]]
];
// prettier-ignore
const MEV_MV_PROGRESSION_MATRIX_FOUR = [
  [[2, 2]], 
  [[2], [2]], 
  [[2], [2]]
];
// prettier-ignore
const MEV_MV_PROGRESSION_MATRIX_SIX = [
  [[3, 3]], 
  [[3], [3]], 
  [[2], [2], [2]]
];
// prettier-ignore
const MEV_MV_PROGRESSION_MATRIX_EIGHT = [
  [[3, 3]],
  [[2, 2], [2, 2]],
  [[2, 2], [2], [2]],
];
// prettier-ignore
const MEV_MV_PROGRESSION_MATRIX_TEN = [
  [[4, 3]],
  [[3, 2], [3, 2]],
  [[2, 2], [2, 2], [2]],
];

const getSetProgressionMatrix_mrv = (exercisesPerSession: number) => {
  switch (exercisesPerSession) {
    case 1:
      return MRV_PROGRESSION_MATRIX_ONE;
    case 2:
      return MRV_PROGRESSION_MATRIX_TWO;
    default:
      return [];
  }
};
const getInitSetProgressionMatrix_mrv = (exercisesPerSession: number) => {
  switch (exercisesPerSession) {
    case 1:
      return MRV_PROGRESSION_MATRIX_ONE_INIT;
    case 2:
      return MRV_PROGRESSION_MATRIX_TWO_INIT;
    default:
      return [];
  }
};

const getSetProgressionMatrix_mev_mv = (volume: number) => {
  switch (volume) {
    case 2:
      return MEV_MV_PROGRESSION_MATRIX_TWO;
    case 4:
      return MEV_MV_PROGRESSION_MATRIX_FOUR;
    case 6:
      return MEV_MV_PROGRESSION_MATRIX_SIX;
    case 8:
      return MEV_MV_PROGRESSION_MATRIX_EIGHT;
    case 10:
      return MEV_MV_PROGRESSION_MATRIX_TEN;
    default:
      return [];
  }
};

export const getMaxFrequencyTarget_mev_mv = (
  volume: number,
  target: number
) => {
  const targetIndex = target - 1;
  const matrix = getSetProgressionMatrix_mev_mv(volume);
  const lastMatrixRow = matrix[matrix.length - 1];

  if (lastMatrixRow && lastMatrixRow[targetIndex]) {
    return target;
  }
  return target - 1;
};
export const getValidFrequencyIndex_mev_mv = (selectedFrequency: number) => {
  if (selectedFrequency > 2) return -1;
  return selectedFrequency;
};

export const getMatrixFnByVolumeLandmark = (rank: VolumeLandmarkType) => {
  if (rank === "MRV") {
    return getSetProgressionMatrix_mrv;
  } else {
    return getSetProgressionMatrix_mev_mv;
  }
};

export const getInitMatrixFnByVolumeLandmark = (rank: VolumeLandmarkType) => {
  if (rank === "MRV") {
    return getInitSetProgressionMatrix_mrv;
  } else {
    return getSetProgressionMatrix_mev_mv;
  }
};

// [2, 2, 2], [2, 2]
// [3, 2, 2], [3, 2], [2, 2]
// [3, 3, 2], [3, 3], [3, 2], [2]

// 3 3 4 4
// 3 3 3 4
// 2 3 3 3

// 4,3 4,3 3,3 3, 2 = 25
// 4,4 4,4 4,3 3, 3 = 29
// 5,4 5,4 4,4 4, 3 = 33
// 4,4 4,4 4,3 4, 4 = 27

// 2,2  2,2 =  8
// 2,3  2,3 = 10
// 3,3  3,3 = 12
// 4,3  4,3 = 14

// 2,2  2,2  2,2 = 12
// 3,3  3,3  3,2 = 15
// 4,3  4,3  3,3 = 18
// 4,4  4,4  4,3 = 21

// 3,2  3,2  3,2  2 = 17
// 3,3  3,3  3,3  2 = 20
// 4,3  4,3  3,3  3 = 23
// 4,4  4,4  4,3  3 = 26

// microcycles = week 1 --- week 2 --- week 3 --- week 4 --- week 5 --- week 6 --- week 7 --- week 8 ---
//   one-one   =   2          2          3          3          4          4          5          5
//   one-two   =   2          3          3          4          4          5          5          6
// --------------------------------------------------------- -------------------------------------------
//   two-one   =   2          2          3          3          4          4          5          5
//   two-two   =   2          3          3          4          4          5          5          6
//   ---------------------------------------------------------------------------------------------------
//   three     =   3          4          4          5          5          6          6          7
//   three     =   4          5          5          6          6          7          7          8

// ADDING PER WEEK BASED ON INDEX
// 0, 1
// 1, 0
// 1, 0
const one = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
const two = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
const threeone = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
const threetwo = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
const threethree = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];
