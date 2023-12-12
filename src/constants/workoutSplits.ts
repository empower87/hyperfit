import { SplitSessionsNameType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

export type MusclesType =
  | "traps"
  | "delts_front"
  | "delts_side"
  | "delts_rear"
  | "biceps"
  | "triceps"
  | "chest"
  | "back"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "forearms"
  | "abs"
  | "calves";

export const FULL_BODY_MUSCLES = [
  "abs",
  "back",
  "biceps",
  "calves",
  "chest",
  "delts_front",
  "delts_rear",
  "delts_side",
  "forearms",
  "glutes",
  "hamstrings",
  "quads",
  "traps",
  "triceps",
];

export const UPPER_MUSCLES = [
  "traps",
  "delts_front",
  "delts_side",
  "delts_rear",
  "biceps",
  "triceps",
  "chest",
  "back",
  "forearms",
];

export const LOWER_MUSCLES = ["glutes", "quads", "hamstrings", "calves"];

export const PUSH_MUSCLES = [
  "chest",
  "triceps",
  "delts_front",
  "delts_side",
  "traps",
];

export const PULL_MUSCLES = [
  "back",
  "biceps",
  "delts_side",
  "delts_rear",
  "traps",
];

export const ARMS_MUSCLES = ["biceps", "triceps", "forearms"];
export const SHOULDERS_MUSCLES = [
  "delts_side",
  "delts_rear",
  "delts_front",
  "traps",
];
export const BACK_MUSCLES = ["back"];
export const CHEST_MUSCLES = ["chest"];
export const LEGS_MUSCLES = ["glutes", "quads", "hamstrings", "calves"];

export const PUSH_AND_PULL_MUSCLES = ["delts_side", "traps"];

export const ANY_MUSCLES = ["delts_side", "traps", "abs", "forearms"];

export const PERIPHERAL_MUSCLES = ["forearms", "abs", "calves"];

export const getGroupList = (split: string) => {
  switch (split) {
    case "upper":
      return UPPER_MUSCLES;
    case "lower":
      return LOWER_MUSCLES;
    case "push":
      return PUSH_MUSCLES;
    case "pull":
      return PULL_MUSCLES;
    case "full":
      return FULL_BODY_MUSCLES;
    case "legs":
      return LEGS_MUSCLES;
    case "chest":
      return CHEST_MUSCLES;
    case "back":
      return BACK_MUSCLES;
    case "shoulders":
      return SHOULDERS_MUSCLES;
    case "arms":
      return ARMS_MUSCLES;
    default:
      return FULL_BODY_MUSCLES;
  }
};

const getPPLULSplit = (muscle: string) => {
  let allSplits: ("pull" | "push" | "lower" | "legs" | "upper")[] = [];
  if (PULL_MUSCLES.includes(muscle)) {
    allSplits.push("pull", "upper");
  } else if (PUSH_MUSCLES.includes(muscle)) {
    allSplits.push("push", "upper");
  } else {
    allSplits.push("lower", "legs");
  }
  return allSplits;
};

const getOPTSplit = (muscle: string) => {
  let allSplits: ("pull" | "push" | "lower" | "upper" | "full")[] = ["full"];
  if (PULL_MUSCLES.includes(muscle)) {
    allSplits.push("pull", "upper");
  } else if (PUSH_MUSCLES.includes(muscle)) {
    allSplits.push("push", "upper");
  } else {
    allSplits.push("lower");
  }
  return allSplits;
};

export const getMusclesSplit = (
  split: SplitSessionsNameType,
  muscle: string
) => {
  switch (split) {
    case "OPT":
      return getOPTSplit(muscle);
    case "PPL":
      return [getPushPullLegsSplit(muscle)];
    case "PPLUL":
      return getPPLULSplit(muscle);
    case "UL":
      return [getUpperLowerSplit(muscle)];
    case "FB":
      return ["full"];
    case "BRO":
      return [getBroSplit(muscle)];
    case "CUS":
      return [];
    default:
      return [];
  }
};

export const getBroSplit = (muscle: string) => {
  if (SHOULDERS_MUSCLES.includes(muscle)) {
    return "shoulders";
  } else if (ARMS_MUSCLES.includes(muscle)) {
    return "arms";
  } else if (CHEST_MUSCLES.includes(muscle)) {
    return "chest";
  } else if (BACK_MUSCLES.includes(muscle)) {
    return "back";
  } else {
    return "legs";
  }
};

export const getPushPullLegsSplit = (muscle: string) => {
  if (PUSH_MUSCLES.includes(muscle)) {
    return "push";
  } else if (PULL_MUSCLES.includes(muscle)) {
    return "pull";
  } else {
    return "legs";
  }
};

export const getUpperLowerSplit = (muscle: string) => {
  if (UPPER_MUSCLES.includes(muscle)) return "upper";
  else return "lower";
};

export const getOptimizedSplit = (muscle: string) => {
  let all: ("upper" | "lower" | "push" | "pull" | "full")[] = [];

  if (PUSH_AND_PULL_MUSCLES.includes(muscle)) {
    all.push("push", "pull", "upper");
  } else if (PUSH_MUSCLES.includes(muscle)) {
    all.push("push", "upper");
  } else if (PULL_MUSCLES.includes(muscle)) {
    all.push("pull", "upper");
  } else if (LOWER_MUSCLES.includes(muscle)) {
    all.push("lower");
  }

  all.push("full");
  return all;
};
