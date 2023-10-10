import {
  ABS_EXERCISES,
  BACK_EXERCISES,
  BICEPS_EXERCISES,
  CALVES_EXERCISES,
  CHEST_EXERCISES,
  DELTS_FRONT_EXERCISES,
  DELTS_REAR_EXERCISES,
  DELTS_SIDE_EXERCISES,
  FOREARMS_EXERCISES,
  GLUTES_EXERCISES,
  HAMSTRINGS_EXERCISES,
  QUADS_EXERCISES,
  TRAPS_EXERCISES,
  TRICEPS_EXERCISES,
} from "../constants/exercises/index";

export const getGrouplist = (group: string) => {
  switch (group) {
    case "back":
      return BACK_EXERCISES;
    case "delts_side":
      return DELTS_SIDE_EXERCISES;
    case "delts_front":
      return DELTS_FRONT_EXERCISES;
    case "delts_rear":
      return DELTS_REAR_EXERCISES;
    case "chest":
      return CHEST_EXERCISES;
    case "triceps":
      return TRICEPS_EXERCISES;
    case "biceps":
      return BICEPS_EXERCISES;
    case "forearms":
      return FOREARMS_EXERCISES;
    case "traps":
      return TRAPS_EXERCISES;
    case "quads":
      return QUADS_EXERCISES;
    case "hamstrings":
      return HAMSTRINGS_EXERCISES;
    case "glutes":
      return GLUTES_EXERCISES;
    case "calves":
      return CALVES_EXERCISES;
    case "abs":
      return ABS_EXERCISES;
    default:
      return BACK_EXERCISES;
  }
};
