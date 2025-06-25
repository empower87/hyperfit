// TrainingPrograms
// TrainingBlocks
// Mesocycles
// Microcycles
// Sessions
// Exercises
//
type UserA = {
  id: string;
  name: string;
  email: string;
};

type MuscleGroupName =
  | "chest"
  | "back"
  | "quads"
  | "hamstrings"
  | "delts_front"
  | "delts_rear"
  | "delts_side"
  | "biceps"
  | "triceps"
  | "forearms"
  | "abs"
  | "glutes"
  | "calves"
  | "traps";

type SetVolumeLandmark = "MV" | "MEV" | "MAV" | "MAV-P" | "MRV" | "MRV-P";

type Muscle = {
  name: MuscleGroupName;
  set_volume_landmark: SetVolumeLandmark;
  frequency_range: [number, number]; // e.g. [2, 4] for 2-4 times per week
  frequency_target: number; // e.g. 3 for 3 times per week
  frequency_mesocycle_progression: number[]; // e.g. Mesocycle 1 = 2x frequency, Mesocycle 2 = 3x frequency, Mesocycle 3 = 4x frequency
  set_mesocycle_progression: number[][][];
};

type TrainingSplit =
  | "Push/Pull/Legs"
  | "Upper/Lower"
  | "Push/Pull/Legs Upper/Lower"
  | "Bro"
  | "Full Body"
  | "Custom";

type TrainingProgram = {
  id: string;
  user_id: string;
  name: string;
  training_split: TrainingSplit;
  muscle_priority_list: Muscle[];
  sessions_per_week: number;
  created_at: Date;
  updated_at: Date;
};

type TrainingBlock = {
  id: string;
  program_id: string;
  name: string;
  start_date?: Date;
  end_date?: Date;
  mesocycles: string[]; // or denormalize if ordering is key
};

type Mesocycle = {
  id: string;
  block_id: string;
  name: string;
  week_count: number;
  order: number;
  microcycles: string[];
};

type Microcycle = {
  id: string;
  mesocycle_id: string;
  week_number: number;
  session_ids: string[];
};

type Session = {
  id: string;
  microcycle_id: string;
  day_of_week: number; // 0 = Sunday, etc.
  name?: string;
};

type SessionItem = {
  id: string;
  session_id: string;
  exercise_id: string;
  progression_method: ProgressionMethodType; // e.g. "single", "dynamic_single", "double", etc.
  order: number;
  initial_sets?: number;
  initial_reps?: number;
  initial_lbs?: number;
  initial_rir?: number;
};

type Exercise = {
  id: string;
  name: string;
  is_unilateral: boolean;
  is_compound: boolean;
  muscle_groups: string[]; // e.g. ['chest', 'triceps']
};

type ProgressionScheme = {
  id: string;
  name: string;
  description: string;
  type: "linear" | "double_progression" | "wave" | "rpe" | "custom";
  config: any; // depends on type
};

type ExerciseLog = {
  id: string;
  user_id: string;
  session_item_id: string;
  date: Date;
  set_logs: {
    reps: number;
    weight: number;
    rir?: number;
  }[];
};

type ClientState = {
  trainingPrograms: Record<string, TrainingProgram>;
  trainingBlocks: Record<string, TrainingBlock>;
  mesocycles: Record<string, Mesocycle>;
  microcycles: Record<string, Microcycle>;
  sessions: Record<string, Session>;
  sessionItems: Record<string, SessionItem>;
  exercises: Record<string, Exercise>;
  progressionSchemes: Record<string, ProgressionScheme>;
  currentProgramId?: string;
  ui: {
    selectedWeek: number;
    selectedSessionId?: string;
  };
};

const CLIENT_STATE = {
  trainingPrograms: {
    "tp-1": {
      user_id: "user-1",
    },
  },
  trainingBlocks: {
    "tb-1": {
      id: "tb-1",
      program_id: "tp-1",
      name: "",
      training_split: "PPL",
      mesocycles: ["meso-1", "meso-2", "meso-3"],
    },
  },
  mesocycles: {
    "meso-1": {
      id: "meso-1",
      block_id: "tb-1",
      name: "",
      week_count: 4,
      order: 1,
      microcycles: ["micro-1", "micro-2", "micro-3", "micro-4"],
    },
  },
  microcycles: {},
  sessions: {},
  sessionItems: {},
  exercises: {},
  progressionSchemes: {},
  currentProgramId: {},
  ui: {
    selectedWeek: 0,
  },
};

const SESSION_ITEM = {
  "session-item-1": {
    id: "session-item-1",
    exercise_id: "exercise-1",
    session_id: "session-1",
    progression_method: "single",
    order: 1,
    initial_sets: 3,
    initial_reps: 12,
    initial_lbs: 105,
    initial_rir: 2,
  },
};

type ProgressionMethodType = 
  | "single"
  | "dynamic_single"
  | "double"
  | "dynamic_double"
  | "double_setsWeight"
  | "triple"
  | "wave"
  | "custom";