import {
  type SplitType,
  type VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

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

export const getSplitColor = (split: SplitType | "off") => {
  switch (split) {
    case "upper":
      return {
        bg: "bg-indigo-700",
        text: "text-indigo-700",
      };
    case "lower":
      return {
        bg: "bg-fuchsia-700",
        text: "text-fuchsia-700",
      };
    case "full":
      return {
        bg: "bg-violet-700",
        text: "text-violet-700",
      };
    case "push":
      return {
        bg: "bg-teal-700",
        text: "text-teal-700",
      };
    case "pull":
      return {
        bg: "bg-teal-600",
        text: "text-teal-600",
      };
    case "legs":
      return {
        bg: "bg-fuchsia-500",
        text: "text-fuchsia-500",
      };
    case "arms":
      return {
        bg: "bg-cyan-700",
        text: "text-cyan-700",
      };
    case "back":
      return {
        bg: "bg-teal-700",
        text: "text-teal-700",
      };
    case "chest":
      return {
        bg: "bg-emerald-600",
        text: "text-emerald-600",
      };
    case "shoulders":
      return {
        bg: "bg-sky-600",
        text: "text-sky-600",
      };
    default:
      return {
        bg: "bg-slate-400",
        text: "text-slate-400",
      };
  }
};
// teal
// emerald
// cyan
// sky
// indigo
// purple
// fuschia
// pink
