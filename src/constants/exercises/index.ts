import { JSONExercise } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
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
  TRICEPS_EXERCISES
};

// NOTES:

type ExerciseMachineType =
  | "iso-lateral row"
  | "iso-lateral high-row"
  | "iso-lateral low-row"
  | "iso-lateral front lat pulldown"
  | "iso-lateral chest press"
  | "iso-lateral incline press"
  | "iso-lateral decline press"
  | "iso-lateral shoulder press"
  | "iso-lateral lateral raise";

type EquipmentKeyType =
  | "barbell"
  | "dumbbell"
  | "kettlebell"
  | "machine_pin-loaded"
  | "machine_plate-loaded"
  | "machine_cable"
  | "smith_machine"
  | "machine_free-loaded"
  | "bodyweight"
  | "band"
  | "bench"
  | "mat"
  | "bosu_ball";
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

// NOTES: for extended information on exercise equipment details, refer to the following:
// Iso-lateral machines are machines that allow for independent movement of each limb, such as the iso-lateral chest press or iso-lateral row.
// Pin-loaded machines are machines that use a pin to select the weight and don't typically allow for iso-lateral movement.
// Plate-loaded machines are machines that use plates to add weight and can be either iso-lateral or not.

type EquipmentType = {
  name: string;
  load_type: "pin-loaded" | "plate-loaded";
  movement_type: "iso-lateral" | "bilateral";
};

type CableMachineType = {
  min_load_increment: 1.5;
  max_load_increment: 7;
  performable_exercises: "multiple";
};

type MachineType = {
  load_type: "pin-loaded" | "plate-loaded";
};

type ExerciseSpaceLocationType = 
  | "bench"
  | "smith_machine"
  | "cable_machine"
  | "isolation_machine"
  | "mat"
  | "power_rack"

const EXERCISE_SPACE_GROUPING = {
  bench: ["dumbbell", "bodyweight", "barbell"],
  smith_machine: ["barbell", "dumbbell", "bodyweight"],
  cable_machine: ["dumbbell", "bodyweight"],
  isolation_machine: ["dumbbell", "bodyweight"],
  mat: ["bodyweight", "dumbbell", "barbell"]
}

// Group exercises by equipment
const groupByEquipment = (exercises: JSONExercise[]) => {
  const equipmentMap: Record<string, JSONExercise[]> = {};
  exercises.forEach(ex => {
    (ex.requirements.length ? ex.requirements : ["none"]).forEach(eq => {
      if (!equipmentMap[eq]) equipmentMap[eq] = [];
      equipmentMap[eq].push(ex);
    });
  });
  return equipmentMap;
};