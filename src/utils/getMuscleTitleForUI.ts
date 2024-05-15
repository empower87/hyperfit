import { MuscleType } from "~/constants/workoutSplits";

export default function getMuscleTitleForUI(muscle: MuscleType) {
  switch (muscle) {
    case "abs":
      return "Abs";
    case "back":
      return "Back";
    case "biceps":
      return "Biceps";
    case "calves":
      return "Calves";
    case "chest":
      return "Chest";
    case "delts_front":
      return "Front Delts";
    case "delts_rear":
      return "Rear Delts";
    case "delts_side":
      return "Side Delts";
    case "forearms":
      return "Forearms";
    case "glutes":
      return "Glutes";
    case "hamstrings":
      return "Hamstrings";
    case "quads":
      return "Quads";
    case "traps":
      return "Traps";
    case "triceps":
      return "Triceps";
    default:
      const _never: never = muscle;
      return _never;
  }
}
