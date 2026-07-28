// Splits
type Split = "PPL" | "PPLUL" | "UL" | "FB" | "BRO" | "ULFB" | "CUS";
type MuscleGroup =
  | "chest"
  | "back"
  | "triceps"
  | "biceps"
  | "front_delts"
  | "rear_delts"
  | "side_delts"
  | "traps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "forearms"
  | "core";
type PushMuscles = "chest" | "triceps" | "front_delts";
type PullMuscles = "back" | "biceps" | "rear_delts" | "traps";
type LegsMuscles = "quads" | "hamstrings" | "glutes" | "calves";
type UpperMuscles =
  | "chest"
  | "back"
  | "triceps"
  | "biceps"
  | "front_delts"
  | "rear_delts"
  | "traps"
  | "side_delts";
type LowerMuscles = "quads" | "hamstrings" | "glutes" | "calves";
type MiscellaneousMuscles = "forearms" | "core";

type ChestMuscles = "chest";
type BackMuscles = "back" | "traps";
type ArmMuscles = "biceps" | "triceps";
type ShoulderMuscles = "front_delts" | "rear_delts" | "side_delts";

type PPLSplitMuscles = PushMuscles & PullMuscles & LegsMuscles;
type PPLULSplitMuscles = UpperMuscles & LowerMuscles & PPLSplitMuscles;
type BroSplitMuscles =
  | ChestMuscles
  | BackMuscles
  | ArmMuscles
  | ShoulderMuscles
  | LegsMuscles;

// Volume
type VolumeLandmark = "MRV-P" | "MRV" | "MEV" | "MV";

// MUSCLE GROUP

type PriorityMuscle = {
  id: string;
  name: MuscleGroup;
  volume: {
    landmark: VolumeLandmark;
    target: number;
  };
  frequency: {};
};

// Exercises
type Exercise = {
  
};

// Training Week
type Day = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
type Session = {
  id: string;
  split: Split;
  exercises: Exercise[];
};

type TrainingDay = {
  day: Day;
  sessions: Session;
};
