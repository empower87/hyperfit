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
export const PUSH_AND_PULL_MUSCLES = ["delts_side", "traps"];
export const PULL_MUSCLES = [
  "back",
  "biceps",
  "delts_side",
  "delts_rear",
  "traps",
];

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
    default:
      return FULL_BODY_MUSCLES;
  }
};
