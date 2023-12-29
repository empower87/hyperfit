import {
  SplitSessionsNameType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { includes } from "~/utils/readOnlyArrayIncludes";

export type MuscleType =
  | "abs"
  | "back"
  | "biceps"
  | "calves"
  | "chest"
  | "delts_front"
  | "delts_rear"
  | "delts_side"
  | "forearms"
  | "glutes"
  | "hamstrings"
  | "quads"
  | "traps"
  | "triceps";

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
] as const;

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
] as const;

export const LOWER_MUSCLES = [
  "glutes",
  "quads",
  "hamstrings",
  "calves",
] as const;

export const PUSH_MUSCLES = [
  "chest",
  "triceps",
  "delts_front",
  "delts_side",
  "traps",
] as const;

export const PULL_MUSCLES = [
  "back",
  "biceps",
  "delts_side",
  "delts_rear",
  "traps",
  "forearms",
] as const;

export const ARMS_MUSCLES = ["biceps", "triceps", "forearms"] as const;
export const SHOULDERS_MUSCLES = [
  "delts_side",
  "delts_rear",
  "delts_front",
  "traps",
] as const;
export const BACK_MUSCLES = ["back"] as const;
export const CHEST_MUSCLES = ["chest"] as const;
export const LEGS_MUSCLES = [
  "glutes",
  "quads",
  "hamstrings",
  "calves",
] as const;

export const PUSH_AND_PULL_MUSCLES = ["delts_side", "traps"] as const;

export const ANY_MUSCLES = ["delts_side", "traps", "abs", "forearms"] as const;

export const PERIPHERAL_MUSCLES = ["forearms", "abs", "calves"] as const;

export const getGroupList = (split: SplitType) => {
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

const getPPLULSplit = (muscle: MuscleType) => {
  let allSplits: ("pull" | "push" | "lower" | "legs" | "upper")[] = [];
  if (includes(PULL_MUSCLES, muscle)) {
    allSplits.push("pull", "upper");
  } else if (includes(LOWER_MUSCLES, muscle) || muscle === "abs") {
    allSplits.push("lower", "legs");
  } else {
    allSplits.push("pull", "upper");
  }
  return allSplits;
};

const getOPTSplit = (muscle: MuscleType) => {
  let allSplits: ("pull" | "push" | "lower" | "upper" | "full")[] = ["full"];
  if (includes(PULL_MUSCLES, muscle)) {
    allSplits.push("pull", "upper");
  } else if (includes(LOWER_MUSCLES, muscle) || muscle === "abs") {
    allSplits.push("lower");
  } else {
    allSplits.push("pull", "upper");
  }
  return allSplits;
};

export const getMusclesSplit = (
  split: SplitSessionsNameType,
  muscle: MuscleType
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

export const getBroSplit = (muscle: MuscleType) => {
  if (includes(SHOULDERS_MUSCLES, muscle)) {
    return "shoulders";
  } else if (includes(ARMS_MUSCLES, muscle)) {
    return "arms";
  } else if (includes(CHEST_MUSCLES, muscle)) {
    return "chest";
  } else if (includes(BACK_MUSCLES, muscle)) {
    return "back";
  } else {
    return "legs";
  }
};

export const getPushPullLegsSplit = (muscle: MuscleType) => {
  if (includes(PUSH_MUSCLES, muscle)) {
    return "push";
  } else if (includes(LOWER_MUSCLES, muscle)) {
    return "legs";
  } else {
    return "pull";
  }
};

export const getUpperLowerSplit = (muscle: MuscleType) => {
  if (includes(UPPER_MUSCLES, muscle)) return "upper";
  else return "lower";
};

export const getOptimizedSplit = (muscle: MuscleType) => {
  let all: ("upper" | "lower" | "push" | "pull" | "full")[] = [];

  switch (muscle) {
    case "delts_side":
      all.push("push", "pull", "upper");
      break;
    case "traps":
      all.push("push", "pull", "upper");
      break;
    case "chest":
      all.push("push", "upper");
      break;
    case "delts_front":
      all.push("push", "upper");
      break;
    case "triceps":
      all.push("push", "upper");
      break;
    case "back":
      all.push("pull", "upper");
      break;
    case "biceps":
      all.push("pull", "upper");
      break;
    case "delts_rear":
      all.push("pull", "upper");
      break;
    default:
      all.push("lower");
      break;
  }

  // if (includes(LOWER_MUSCLES, muscle)) {
  //   all.push("lower");
  // } else if (includes(PUSH_AND_PULL_MUSCLES, muscle)) {
  //   all.push("push", "pull", "upper");
  // }

  // else if (includes(PULL_MUSCLES, muscle)) {
  //   all.push("pull", "upper");
  // } else if (includes(PUSH_MUSCLES, muscle)) {
  //   all.push("lower");
  // }

  all.push("full");
  return all;
};
