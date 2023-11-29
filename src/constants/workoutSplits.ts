import { SplitSessionsNameType } from "~/utils/getNextSession";

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

export const COMBINED_SPLITS = [
  { name: "back", list: BACK_MUSCLES },
  { name: "chest", list: CHEST_MUSCLES },
  { name: "arms", list: ARMS_MUSCLES },
  { name: "shoulders", list: SHOULDERS_MUSCLES },
  { name: "legs", list: LEGS_MUSCLES },
  { name: "lower", list: LOWER_MUSCLES },
  { name: "push", list: PUSH_MUSCLES },
  { name: "pull", list: PULL_MUSCLES },
  { name: "upper", list: UPPER_MUSCLES },
  { name: "full", list: FULL_BODY_MUSCLES },
];

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

const split = (split: SplitSessionsNameType, muscle: string) => {
  switch (split) {
    case "OPT":
    case "PPL":
      return getPushPullLegsSplit(muscle);
    case "PPLUL":
    case "UL":
    case "FB":
    case "BRO":
      return getBroSplit(muscle);
    case "CUS":
    default:
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
  let all: (
    | "upper"
    | "lower"
    | "push"
    | "pull"
    | "full"
    | "chest"
    | "back"
    | "shoulders"
    | "arms"
    | "legs"
  )[] = [];

  if (UPPER_MUSCLES) {
    all.push("upper");
  } else {
    all.push("lower");
  }
  const bro = getBroSplit(muscle);
  const ppl = getPushPullLegsSplit(muscle);

  if (bro === ppl) {
    all.push(bro);
  } else {
    all.push(bro);
    all.push(ppl);
  }
  all.push("full");
  return all;
};
