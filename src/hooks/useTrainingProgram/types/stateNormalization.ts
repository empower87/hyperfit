// TrainingPrograms
// TrainingBlocks
// Mesocycles
// Microcycles
// Sessions
// Exercises

import { exitCode } from "process";
import { ExerciseType, MusclePriorityType, SplitSessionsType } from "../reducer/trainingProgramReducer";

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
  training_block_ids: string[]
  created_at: Date;
  updated_at: Date;
};

type TrainingBlock = {
  id: string;
  program_id: string;
  name: string;
  training_split: TrainingSplit;
  muscle_priority_list: Muscle[];
  sessions_per_week: number;
  mesocycles: string[]; // or denormalize if ordering is key
  start_date?: Date;
  end_date?: Date;
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
  superset_id?: string; // for supersets, if applicable
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
  | "double_sets-weight"
  | "triple"
  | "wave"
  | "custom";


 
// SESSIONS WIP - 6/25/25
// upper = 2, lower = 1, full = 2
// 1. Back -       2,3,4
// 2. Side Delts - 2,3,4 
// 3. Triceps -    1,2,3
// 4. Hamstrings - 1,2,3
// 5. Quads -      1,2,3 
// 6. Rear Delts - 1,2,2
// 7. Foreams -    1,1,1
// 8. Traps -      1,2,2
// 9. Biceps -     1,2,2
// 10. Chest -     1,2,2
// 11. Calves -    1,2,2
// 12. Fnt Delts - 0,0,0
// 13. Abs -       0,0,0
// 14. Glutes -    0,0,0

// upper 1  = back_1
//            back_1
//            sdelts_1
//            sdelts_1
//            triceps_1


// upper 2 =  back_2
//            back_2
//            sdelts_2
//            sdelts_2
//            triceps_2

// lower 1 =  hamstrings_1
//            hamstrings_1
//            quads_1
//            quads_1

// full 1  =  back_3
//            back_3
//            sdelts_3
//            sdelts_3
//            triceps_3


// full 2  =  back_4
//            sdelts_4
//            hamstrings_2
//            quads_2

export const allowable_muscles_per_split = {
  upper: ["back", "traps", "chest", "delts_front", "delts_rear", "delts_side", "biceps", "triceps", "forearms"],
  lower: ["quads", "hamstrings", "glutes", "calves"],
  push: ["chest", "delts_front", "delts_side", "triceps"],
  pull: ["back", "delts_rear", "biceps", "forearms"],
  legs: ["quads", "hamstrings", "glutes", "calves"],
  full: [
    "chest",
    "back",
    "quads",
    "hamstrings",
    "delts_front",
    "delts_rear",
    "delts_side",
    "biceps",
    "triceps",
    "forearms",
    "abs",
    "glutes",
    "calves",
    "traps"
  ],
  back: ["back", "traps"],
  chest: ["chest"],
  shoulders: ["delts_front", "delts_rear", "delts_side", "traps"],
  arms: ["biceps", "triceps", "forearms"],
}

// const muscle_priority_example_1 = [
//   {
//     name: "back",
//     set_volume_landmark: "MRV",
//     frequency_range: [2, 4],
//     frequency_target: 4,
//     frequency_mesocycle_progression: [2, 3, 4],
//     exercises: [
//       [{
//         id: "exercise_1",
//         name: "Pull Up",
//         is_unilateral: false,
//         is_compound: true,
//         muscle_groups: ["back"],
//       },
//       {
//         id: "exercise_2",
//         name: "Bent Over Row",
//         is_unilateral: false,
//         is_compound: true,
//         muscle_groups: ["back"],
//       }], // exercises for session 1
//       [EXERCISE_3, EXERCISE_4], // exercises for session 2
//       [EXERCISE_5, EXERCISE_6], // exercises for session 3
//       [EXERCISE_7] // exercises for session 4
//     ]  
//   },
//   { ...BICEPS },
//   { ...TRICEPS },
//   { ...QUADS },
//   ...etc
// ]



interface MusclePriority {
  name: string;
  set_volume_landmark: string;
  frequency_range: [number, number];
  frequency_target: number;
  frequency_mesocycle_progression: number[];
  exercises: Exercise[][]; // ordered by importance, grouped per intended session
}

interface AssignedExercise {
  sessionIndex: number;
  exerciseGroup: ExerciseType[];
  muscle: string;
}

export function returnSessionSplits(
  split_sessions: SplitSessionsType
): string[] {
  const split_keys: string[] = []
  for (const key in split_sessions.sessions) {
      const num_value = split_sessions.sessions[key as keyof typeof split_sessions.sessions];
      const repeat = `${key}-`.repeat(num_value ?? 1)
      const keyWithoutDash = repeat.split("-")
      split_keys.push(...keyWithoutDash);
  }
  return split_keys.filter((split) => split !== "");
}

// Helpers
function getValidSessionIndicesForMuscle(
  splitList: string[],
  allowable: Record<string, string[]>,
  muscleName: string
): number[] {
  return splitList
    .map((split, i) => (allowable[split]?.includes(muscleName) ? i : null))
    .filter((i): i is number => i !== null);
}

function chooseOptimalSessions(
  valid: number[],
  target: number,
  prefer: Set<number>
): number[] {
  const preferred = valid.filter((i) => prefer.has(i));
  const remaining = valid.filter((i) => !prefer.has(i));

  const chosen = [...preferred.slice(0, target), ...remaining.slice(0, target - preferred.length)];
  return chosen.sort((a, b) => a - b);
}

// Core function
export function assignExercises(
  musclePriorityList: MusclePriorityType[],
  splitList: string[],
  allowableMuscles: Record<string, string[]>,
  totalMesocycles: number
) {
  const finalPlan: Record<number, Record<number, AssignedExercise[]>> = {}; // meso -> session -> exercises

  for (const muscle of musclePriorityList) {
    const sessionIndices = getValidSessionIndicesForMuscle(splitList, allowableMuscles, muscle.muscle);
    let assignedSessions = new Set<number>();

    for (let meso = 0; meso < totalMesocycles; meso++) {
      const freq = muscle.frequency.progression[meso] ?? muscle.frequency.target;
      const chosenSessions = chooseOptimalSessions(sessionIndices, freq, assignedSessions);

      assignedSessions = new Set([...assignedSessions, ...chosenSessions]);

      if (!finalPlan[meso]) finalPlan[meso] = {};

      for (let i = 0; i < freq; i++) {
        const sessionIdx = chosenSessions[i];
        const exerciseGroup = muscle.exercises[i] ?? [];

        if (!finalPlan[meso][sessionIdx]) finalPlan[meso][sessionIdx] = [];
        finalPlan[meso][sessionIdx].push({ sessionIndex: sessionIdx, exerciseGroup, muscle: muscle.muscle });
      }
    }
  }

  return finalPlan; // [mesocycle][session] => AssignedExercise[]
}
