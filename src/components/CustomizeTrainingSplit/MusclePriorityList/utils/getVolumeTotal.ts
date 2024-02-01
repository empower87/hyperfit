import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import { getMuscleData } from "~/utils/getMuscleData";

export const getEndOfMesocycleVolume = (
  group: string,
  frequency: number,
  volume_landmark: VolumeLandmarkType,
  exercisesPerSessionSchema: number,
  setProgressionMatrix: number[][][][]
) => {
  if (frequency === 0) return 0;
  const muscleData = getMuscleData(group);
  const key =
    volume_landmark === "MRV"
      ? "mrv_progression_matrix"
      : volume_landmark === "MEV"
      ? "mev_progression_matrix"
      : "mv_progression_matrix";
  let volFrequency = setProgressionMatrix[frequency - 1];

  // if (exercisesPerSessionSchema === 2) {
  //   volFrequency = MRV_PROGRESSION_MATRIX_TWO
  // } else {
  //   volFrequency = MRV_PROGRESSION_MATRIX_ONE
  // }
  console.log(volFrequency, "WHY IS THIS UNDFINED??");

  if (!volFrequency.length) return 0;
  const frequencyList = volFrequency[volFrequency.length - 1];

  let count = 0;
  for (let i = 0; i < frequencyList.length; i++) {
    for (let j = 0; j < frequencyList[i].length; j++) {
      count = count + frequencyList[i][j];
    }
  }

  const numberOfMesocycles = 3;
  const addSets = numberOfMesocycles * frequency;

  const totalVolume = addSets + count;

  if (key === "mv_progression_matrix") return count;
  return totalVolume;
};
