import { SplitType } from "../reducer/trainingProgramReducer";
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

type WorkoutT = {
  id: string;
  training_program_id: TrainingProgramT["id"];
  day: string; // e.g., "Monday"
  day_number: number;
  split: string; // e.g., "Upper Body", "Lower Body"
  exercises: ExerciseT[];
};

type ExerciseT = {
  id: string;
  name: string;
  progression_method: ProgressionMethodType;
};

type MesocyclePlanT = {};

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

// New Attempt: 6/20/25
// Entities:
// 1. User
// 2. TrainingProgram
// 3. Workout
// 4. Exercise
// 5. Sets
type UserA = {
  id: string;
  first_name: string;
  last_name: string;
};

type TrainingProgramA = {
  id: string;
  user_id: UserA["id"];
};

type WorkoutA = {
  id: string;
  training_program_id: TrainingProgramA["id"];
  mesocycle_number: number;
  day_number: number;
  split: SplitType;
};

type WorkoutItemsA = {
  id: string;
  workout_id: WorkoutA["id"];
  exercise_id: ExerciseA["id"];
  rank: number;
};

type ExerciseA = {
  id: string;
  workout_id: WorkoutA["id"];
};

type SetsA = {
  id: string;
  workout_item_id: WorkoutItemsA["id"];
  rep_count: number;
  weight: number;
  duration: number;
};

type ExercisePeriodizationA = {
  id: string;
  exercise_id: ExerciseA["id"];
  mesocycle_number: number;
  sets: number[];
  reps: number[];
  weight: number[];
  rir: number[];
  weight_increment: number;
};

// splits = upper, upper, lower, full, full
// back        = 2,3,4
// side_delts  = 2,3,4
// triceps     = 1,2,3
// hamstrings  = 1,2,3
// quads       = 1,2,3
// delts_rear  = 1,2,2
// forearms    = 1,1,1
// traps       = 1,2,2
// biceps      = 1,2,2
// chest       = 1,2,2
// calves      = 1,2,2
// delts_front = 0,0,0
// abs         = 0,0,0
// glutes      = 0,0,0

// meso 1
// upper = back, sdelts, tris, forearms, biceps,
// upper = back, sdelts, rdelts, traps, chest,
// lower = hams, quads, calves

// meso 2
// upper = back, sdelts, tris, forearms, biceps, traps, chest
// upper = back, sdelts, rdelts, traps, chest, biceps,
// lower = hams, quads, calves
// full  = back, sdelts, tris, hams, quads, rdelts, calves,

// meso 3
// upper 7 = back, sdelts, tris, forearms, biceps, traps, chest
// upper 6 = back, sdelts, rdelts, traps, chest, biceps,
// lower 3 = hams, quads, calves
// full  7 = back, sdelts, tris, hams, quads, rdelts, calves,
// full  5 = back, sdelts, tris, hams, quads,

// meso 1
// upper = back, sdes, tris, rdes, trap, chst
// upper = back, sdes, tris, frms, bics,
// lower = hams, quad, calf,

// meso 2
// upper = back, sdes, tris, rdes, frms, bics,
// upper = back, sdes, tris, rdes, trap, chst,
// lower = hams, quad, calf,
// full  = back, sdes, hams, quad, trap, bics, chst, calf

// meso 3
// upper  = back, sdes, tris, rdes, frms, bics,
// upper  = back, sdes, tris, rdes, trap, bics,
// lower  = hams, quad, calf,
// full   = back, sdes, tris, hams, quad, chst, calf,
// full   = back, sdes, hams, quad, trap, chst,

// NOTE: With this algorithm.
// 1. Start from top of muscle list.
// 2. Start with all splits available on last mesocycle, then fill each preceding meso.
// 3. For each meso:
//    a. If muscle is filled in previous meso then carry it over.
//    b. If muscle has not been filled then find least full session with default on the first available.

// meso 1
// upper = back, sdel, tris, fore, bics,
// upper = back, sdel, rdel, trap, chst,
// lower = hams, quad,

// meso 2
// upper = back, sdel, tris, rdel, fore, bics,
// upper = back, sdel, tris, rdel, trap, bics, chst,
// lower = hams, quad,
// full  = back, sdel, hams, quad, trap, chst,

// meso 3
// upper  = back, sdel, tris, rdel, fore, bics,
// upper  = back, sdel, tris, rdel, trap, bics, chst,
// lower  = hams, quad, calf,
// full   = back, sdel, tris, hams, quad, chst,
// full   = back, sdel, hams, quad, trap, calf

// meso 1
// upper  = back, back, sdel, sdel, tris, fore, bics,
// upper  = back, back, sdel, sdel, rdel, trap, chst,
// lower  = hams, quad, calf,

// meso 3
// upper  = back, back, sdel, sdel, tris, fore, bics, rdel, chst,
// upper  = back, back, sdel, sdel, rdel, trap, chst, bics,
// lower  = hams, quad, calf,
// full   = back, back, sdel, sdel, tris, hams, quad, trap, calf

// meso 3
// upper  = back, back, sdel, sdel, tris, fore, bics, rdel,
// upper  = back, back, sdel, sdel, rdel, trap, chst, bics,
// lower  = hams, quad, calf,
// full   = back, back, sdel, sdel, tris, hams, quad, trap,
// full   = back, sdel, tris, hams, quad, chst, calf
