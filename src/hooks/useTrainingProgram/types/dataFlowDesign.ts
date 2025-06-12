import { ProgressionMethodType } from "../utils/exercises/repsAndWeightProgression";

type UserT = {
  id: string;
  name: string;
  age: number;
  email: string;
  biometric_data: {
    age: number; // in years
    gender: string;
    height: number; // in in
    weight: number; // in lbs
    body_fat_percentage: number; // in %
    activity_level: string; // e.g., "sedentary", "lightly active", "moderately active", "very active"
  };
  tracking: {
    weight: number;
    body_fat_percentage: number;
    measurements: {
      neck: number;
      chest: number;
      waist: number;
      shoulder: number;
      hips: number;
      arm: number;
      forearm: number;
      thigh: number;
      calf: number;
    };
  };
};

type TrainingProgramT = {
  id: string;
  name: string;
  description: string;
  user_id: UserT["id"];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  macrocycles: number;
  mesocycles: number;
  microcycles: number;
  periodization_map: [];
};

type SetsT = number;
type RepsT = number;
type LlbsT = number; // in lbs
type RirT = number; // Reps in Reserve
type SessionSetT = [SetsT, RepsT, LlbsT, RirT];
type MicrocycleT = SessionSetT[];
type MesocycleT = MicrocycleT[];
type MacrocycleT = MesocycleT[];

type SessionT = {
  id: string;
  training_program_id: TrainingProgramT["id"];
  day: string; // e.g., "Monday"
  split: string; // e.g., "Upper Body", "Lower Body"
  exercises: ExerciseT[];
};

type ExerciseT = {
  id: string;
  name: string;
  progression_method: ProgressionMethodType;
};

const sets = [
  [2, 2, 2, 2], // MESO 1
  [2, 2, 2, 2], // MESO 2
  [2, 2, 2, 2], // MESO 3
];
type ExerciseMapT = {
  id: ExerciseT["id"];
  name: ExerciseT["name"];
  exercise_order_index: number;
  exercise_progression: number[][][];
};

// NOTES: 06/07/2025
// Each exercise will contain the full mesocycle progression for sets, reps, lbs, and rir.
// The EXERCISE_MESO_MAP will contain the mapping of exercises to their particular sessions over mesocycles.
const EXERCISE: ExerciseMapT = {
  id: "exercise_id",
  name: "Bench Press",
  exercise_order_index: 0,
  exercise_progression: [
    [
      [
        2, // Sets
        8, // Reps
        135, // Lbs
        2, // RIR
      ], // Microcycle 1
      [], // Microcycle 2
      [], // Microcycle 3
      [], // Microcycle 4
    ], // Mesocycle 1
    [], // Mesocycle 2
    [], // Mesocycle 3
  ],
};

const EXERCISE_MESO_MAP: ExerciseMapT["id"][][][][] = [
  [
    [], // Monday
    [
      [
        EXERCISE["id"], // Exercise 1
      ], // Session 1
      [], // Session 2
    ], // Tuesday
    [], // Wednesday
    [], // Thursday
    [], // Friday
    [], // Saturday
    [], // Sunday
  ], // Mesocycle 1
  [], // Mesocycle 2
  [], // Mesocycle 3
];
