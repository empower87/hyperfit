import ABS_EXERCISES from "./abs.json";
import BACK_EXERCISES from "./back.json";
import BICEPS_EXERCISES from "./biceps.json";
import CALVES_EXERCISES from "./calves.json";
import CHEST_EXERCISES from "./chest.json";
import DELTS_FRONT_EXERCISES from "./delts-front.json";
import DELTS_REAR_EXERCISES from "./delts-rear.json";
import DELTS_SIDE_EXERCISES from "./delts-side.json";
import FOREARMS_EXERCISES from "./forearms.json";
import GLUTES_EXERCISES from "./glutes.json";
import HAMSTRINGS_EXERCISES from "./hamstrings.json";
import QUADS_EXERCISES from "./quads.json";
import TRAPS_EXERCISES from "./traps.json";
import TRICEPS_EXERCISES from "./triceps.json";

export {
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
};

// NOTES:
type EquipmentKeyType =
  | "barbell"
  | "dumbbell"
  | "kettle-bell"
  | "machine pin-loaded"
  | "machine plate-loaded"
  | "bodyweight";
type WeightLoadIncrementType = 1 | 1.5 | 2.5 | 5 | 10 | 15 | 20;
type InitialWeightNumberType = 0 | 2.5 | 5 | 10 | 12.5 | 15 | 20;

type DumbbellWeightType =
  | 5
  | 7.5
  | 10
  | 12.5
  | 15
  | 17.5
  | 20
  | 22.5
  | 25
  | 27.5
  | 30
  | 32.5
  | 35
  | 37.5
  | 40
  | 42.5
  | 45
  | 47.5
  | 50
  | 55
  | 60
  | 65
  | 70
  | 75
  | 80
  | 85
  | 90
  | 95
  | 100
  | 105
  | 110
  | 115
  | 120;

type CableWeightType =
  | 5
  | 10
  | 15
  | 20
  | 25
  | 30
  | 35
  | 42.5
  | 50
  | 57.5
  | 65
  | 72.5
  | 80
  | 87.5
  | 95;

type BarbellWeightType =
  | 45
  | 65
  | 95
  | 115
  | 135
  | 155
  | 185
  | 205
  | 225
  | 245
  | 275
  | 315;

type ExerciseEquipmentDetailsType = {
  type: EquipmentKeyType;
  weight_load_increment: number;
  initial_weight: number;
};
