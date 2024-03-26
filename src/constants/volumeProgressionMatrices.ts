import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";

export const MRV_PROGRESSION_MATRIX_ONE = [
  [[2]],
  [[3], [3]],
  [[3], [3], [3]],
  [[4], [4], [4], [3]],
  [[5], [5], [5], [4], [3]],
  [[5], [5], [5], [4], [3], [2]],
];

// NOTE: 3/25/2024 - changed this to no longer have placeholder 0s in tuple, this may effect entire app down the line.
// keep an eye on how this effects rest of app.
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
  [[3, 3], [3, 3], [2, 3], [2]],
  [[3, 3], [3, 3], [3, 3], [3], [2]],
  [[3, 3], [3, 3], [3, 3], [3], [2], [1]],
];

const getMatrixByKeySchema = (keySchema: [VolumeLandmarkType, number]) => {
  switch (keySchema[0]) {
    case "MRV":
      if (keySchema[1] === 1) {
        return MRV_PROGRESSION_MATRIX_ONE;
      } else if (keySchema[1] === 2) {
        return MRV_PROGRESSION_MATRIX_TWO;
      } else {
        throw new Error("Invalid key schema");
      }
    case "MEV":
      if (keySchema[1] === 1) {
        return MEV_PROGRESSION_MATRIX_ONE;
      } else if (keySchema[1] === 2) {
        return MEV_PROGRESSION_MATRIX_TWO;
      } else throw new Error("Invalid key schema");
    case "MV":
      if (keySchema[1] === 1) {
        return MV_PROGRESSION_MATRIX_SIX;
      } else if (keySchema[1] === 2) {
        return MV_PROGRESSION_MATRIX_FOUR;
      } else throw new Error("Invalid key schema");
    default:
      throw new Error("Invalid key schema");
  }
};
export const getMatrixWithAdjustedInitialSets = (
  keySchema: [VolumeLandmarkType, number],
  frequencyIndex: number,
  adjust: "add" | "subtract"
) => {
  const matrix = getMatrixByKeySchema(keySchema);
  const mutableMatrix = structuredClone(matrix);
  const selectedFrequency = mutableMatrix[frequencyIndex];
  const lastSessionIndex = selectedFrequency.length - 1;
  const firstSessionIndex = 0;

  if (adjust === "add") {
    mutableMatrix[frequencyIndex][lastSessionIndex][0] =
      mutableMatrix[frequencyIndex][lastSessionIndex][0] + 1;
  } else {
    mutableMatrix[frequencyIndex][firstSessionIndex][0] =
      mutableMatrix[frequencyIndex][firstSessionIndex][0] - 1;
  }
  return mutableMatrix;
};

const MRV_PROGRESSION_MATRIX_THREE = [
  [[2, 2, 1]],
  [
    [2, 2, 1],
    [2, 2, 1],
  ],
  [
    [2, 2, 2],
    [2, 2, 2],
    [2, 2, 1],
  ],
  [
    [3, 2, 2],
    [3, 2, 2],
    [3, 2, 1],
    [2, 2, 1],
  ],
  [[5], [5], [5], [4], [3]],
  [
    [3, 3, 3],
    [3, 3, 3],
    [3, 3, 3],
    [3, 2, 0],
    [2, 2, 0],
    [2, 0, 0],
  ],
];

export const MEV_PROGRESSION_MATRIX_ONE = [[[4]], [[2], [2]], [[2], [2], [1]]];

export const MEV_PROGRESSION_MATRIX_TWO = [
  [[2, 2]],
  [
    [2, 2],
    [2, 0],
  ],
  [[2, 2], [2, 0], [1]],
];

// NOTE: MV probably shouldn't require progression since the volume is already so low
export const MV_PROGRESSION_MATRIX_SIX = [
  [[3, 3]],
  [
    [3, 0],
    [3, 0],
  ],
];

export const MV_PROGRESSION_MATRIX_FOUR = [
  [[2, 2]],
  [
    [2, 0],
    [2, 0],
  ],
];

export const MV_PROGRESSION_MATRIX_THREE = [[[3]]];

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

export const setProgressionHandler = (
  schema: number[][],
  microcycles: number,
  mrv_range: [number, number]
) => {
  // continually add sets
};

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
      if (exercisesPerSession === 2) {
        return MRV_PROGRESSION_MATRIX_TWO;
      } else {
        return MRV_PROGRESSION_MATRIX_ONE;
      }
    default:
      return MRV_PROGRESSION_MATRIX_TWO;
  }
};
