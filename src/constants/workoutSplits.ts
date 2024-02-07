import {
  SplitSessionsNameType,
  SplitSessionsType,
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
  // "delts_side",
  // "traps",
] as const;

export const PULL_MUSCLES = [
  "back",
  "biceps",
  "delts_rear",
  "forearms",
  // "delts_side",
  // "traps",
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

export type PeripheralMuscles = (typeof PERIPHERAL_MUSCLES)[number];

export const getAvailableSplitsByMuscle = (muscle: MuscleType): SplitType[] => {
  switch (muscle) {
    case "abs":
      return ["full", "upper", "lower"];
    case "back":
      return ["full", "upper", "pull", "back"];
    case "biceps":
      return ["full", "upper", "pull", "arms"];
    case "calves":
      return ["full", "lower", "legs"];
    case "chest":
      return ["full", "upper", "push", "chest"];
    case "delts_front":
      return ["full", "upper", "push", "shoulders"];
    case "delts_rear":
      return ["full", "upper", "pull", "shoulders"];
    case "delts_side":
      return ["full", "upper", "push", "pull", "shoulders"];
    case "forearms":
      return ["full", "upper", "pull", "arms"];
    case "glutes":
      return ["full", "lower", "legs"];
    case "hamstrings":
      return ["full", "lower", "legs"];
    case "quads":
      return ["full", "lower", "legs"];
    case "traps":
      return ["full", "upper", "push", "pull", "shoulders"];
    case "triceps":
      return ["full", "upper", "push", "arms"];
    default:
      return [];
  }
};

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
  if (includes(PUSH_AND_PULL_MUSCLES, muscle)) {
    allSplits.push("push", "pull", "upper");
  } else if (includes(PULL_MUSCLES, muscle)) {
    allSplits.push("pull", "upper");
  } else if (includes(PUSH_MUSCLES, muscle)) {
    allSplits.push("push", "upper");
  } else {
    allSplits.push("lower");
  }
  return allSplits;
};

export const getMusclesSplit = (
  split: SplitSessionsNameType,
  muscle: MuscleType
): SplitType[] => {
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

export const getMusclesMaxFrequency = (
  split_sessions: SplitSessionsType,
  muscle: MuscleType
): number => {
  switch (split_sessions.split) {
    case "OPT":
      const opt = getOPTSplit(muscle);
      return opt.reduce(
        (acc, split) => acc + split_sessions.sessions[split],
        0
      );
    case "PPL":
      const ppl = getPushPullLegsSplit(muscle);
      return split_sessions.sessions[ppl];
    case "PPLUL":
      const pplul = getPPLULSplit(muscle);
      return pplul.reduce(
        (acc, split) => acc + split_sessions.sessions[split],
        0
      );
    case "UL":
      return split_sessions.sessions[getUpperLowerSplit(muscle)];
    case "FB":
      return split_sessions.sessions["full"];
    case "BRO":
      return split_sessions.sessions[getBroSplit(muscle)];
    case "CUS":
      return 0;
    default:
      return 0;
  }
};

export const getOptimizedSplitForWeights = (muscle: MuscleType) => {
  if (includes(PUSH_AND_PULL_MUSCLES, muscle)) {
    return "both";
  } else if (includes(PUSH_MUSCLES, muscle)) {
    return "push";
  } else if (includes(PULL_MUSCLES, muscle)) {
    return "pull";
  } else if (includes(LOWER_MUSCLES, muscle)) {
    return "lower";
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
  if (includes(PUSH_AND_PULL_MUSCLES, muscle)) {
    return "push";
  } else if (includes(PUSH_MUSCLES, muscle)) {
    return "push";
  } else if (includes(PULL_MUSCLES, muscle)) {
    return "pull";
  } else {
    return "legs";
  }
};

export const getUpperLowerSplit = (muscle: MuscleType) => {
  if (includes(UPPER_MUSCLES, muscle)) return "upper";
  else return "lower";
};

export const getOptimizedSplit = (muscle: MuscleType) => {
  let all: ("upper" | "lower" | "push" | "pull" | "full")[] = [];

  if (includes(PUSH_AND_PULL_MUSCLES, muscle)) {
    all.push("push", "pull", "upper");
  } else if (includes(PUSH_MUSCLES, muscle)) {
    all.push("push", "upper");
  } else if (includes(PULL_MUSCLES, muscle)) {
    all.push("pull", "upper");
  } else if (includes(LOWER_MUSCLES, muscle)) {
    all.push("lower");
  }

  all.push("full");
  return all;
};
