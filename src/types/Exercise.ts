import { MuscleType } from "~/constants/workoutSplits";

type BackMuscleType =
  | "upper_trapezius"
  | "middle_trapezius"
  | "rhomboids"
  | "teres_minor"
  | "teres_major"
  | "infraspinatus"
  | "latissimus_dorsi";
type BackMuscleGroupType = "traps" | "lats" | "rhomboids";

type ChestMuscleType = "upper" | "middle" | "lower";
type TricepsMuscleType = "long_head" | "medial_head" | "lateral_head";
type BicepsMuscleType = "long_head" | "short_head" | "brachialis";

type CoreMuscleType = "erector_spinae" | "thoracolumbar_fascia";

type Muscle =
  | "gluteus_minimus"
  | "gluteus_medius"
  | "gluteus_maximus"
  | "anterior_deltoids"
  | "lateral_deltoids"
  | "posterior_deltoids";

type ExerciseDataType = {
  id: string;
  name: string;
  muscle: {
    target: string;
    group: MuscleType;
    supporting: string[];
  };
};

type TrainingBlockExerciseData = {};

export type Set = {
  set_num: number;
  reps: number;
  weight: number;
  rir: number;
  isCompleted: boolean;
};

type ExerciseNote = {
  id: string;
  exercise_log_id: string;
  note: string;
};

type ExerciseLog = {
  id: string;
  name: string;
  program_exercise_id: string;
  microcycle_id: string;
  started_at: string;
  completed_at: string;
  notes: ExerciseNote[];
  sets: Set[];
};

type Workout = {
  id: string;
  name?: string;
  session_id: string;
  exercises: ExerciseLog[];
  program: {
    training_block_id: string;
    current_progress: {
      cur_session_id: number;
      cur_mesocycle: number;
      cur_microcycle: number;
    };
    changes: {};
  };
  started_at: string;
  completed_at: string;
};
