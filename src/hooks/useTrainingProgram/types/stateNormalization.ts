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

type TrainingProgram = {
  id: string;
  user_id: string;
  name: string;
  training_split: string; // e.g. Push/Pull/Legs
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
  order: number;
  sets: number;
  reps: number;
  rir?: number;
  progression_id?: string;
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
  type: 'linear' | 'double_progression' | 'wave' | 'rpe' | 'custom';
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
}
const CLIENT_STATE = {
  trainingPrograms: {
    "tp-1": {
      user_id: "user-1",

    }
  },
  trainingBlocks:{
    "tb-1": {
      id: "tb-1",
      program_id: "tp-1",
      name: "",
      training_split: "PPL",
      mesocycles: ["meso-1", "meso-2", "meso-3"]
    }
  },
  mesocycles:{
    "meso-1": {
      id: "meso-1",
      block_id: "tb-1",
      name: "",
      week_count: 4,
      order: 1,
      microcycles: ["micro-1", "micro-2", "micro-3", "micro-4"],
    }
  },
  microcycles:{},
  sessions:{},
  sessionItems:{},
  exercises:{},
  progressionSchemes:{},
  currentProgramId: {},
  ui: {
    selectedWeek: 0,
  }
}

const SESSION_ITEM = {
  "session-item-1": {
    id: "session-item-1",
    exercise_id: "exercise-1",
    session_id: "session-1",
    order: 1,
    sets: 3,
    reps: 12,
    lbs: 105,
    rir: 2,
    progression_id: "progression-1"

  }
}