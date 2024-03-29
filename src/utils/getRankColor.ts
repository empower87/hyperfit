import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";

export const getRankColor = (volume_indicator: VolumeLandmarkType) => {
  switch (volume_indicator) {
    case "MRV":
      return {
        bg: "bg-red-500",
      };
    case "MEV":
      return {
        bg: "bg-orange-500",
      };
    default:
      return {
        bg: "bg-green-500",
      };
  }
};
