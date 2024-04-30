import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";

export const getRankColor = (volume_indicator: VolumeLandmarkType) => {
  switch (volume_indicator) {
    case "MRV":
      return {
        bg: "bg-red-500",
        text: "text-red-500",
      };
    case "MEV":
      return {
        bg: "bg-amber-500",
        text: "text-amber-500",
      };
    default:
      return {
        bg: "bg-lime-500",
        text: "text-lime-500",
      };
  }
};
