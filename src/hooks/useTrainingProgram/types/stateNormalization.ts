// TrainingPrograms
// TrainingBlocks
// Mesocycles
// Microcycles
// Sessions
// Exercises

import { MUSCLES_IN_EACH_SPLIT } from "../utils/training_block/createTrainingBlock";

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
  training_block_ids: string[];
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

// WHAT I WANT IT TO LOOK LIKE
// SPLIT_LIST = [lower, upper, upper, full, full]
// [SUN, MON, TUE, WED, THU, FRI, SAT]
//  off, upp, low, off, upp, ful, ful
//  off, low, upp, off, upp, ful, ful
//  off, upp, low, off, ful, upp, ful

// SPLIT_LIST = [lower, upper, upper, full, full]
// OFF_DAYS = 2
// OFF_DAY_BREAKPOINT = 3
// [SUN, MON, TUE, WED, THU, FRI, SAT]
//   LO,
// LOGIC:
// 1. Put first split on day 1 to kick it off.
// 2. Look at previous split and sort

// SPLITS WITH PREFERRED REST PERIODS
// Upper = 2 days rest
// Lower = 2 days rest
// Full  = 1 days rest

// Push = 2 days rest
// Pull = 2 days rest
// Legs = 2 days rest

// Arms = 2 days rest
// Back = 2 days rest
// Chest = 2 days rest
// Shoulders = 2 days rest
// Legs = 2 days rest

export const REST_PERIOD_BY_SPLIT_IN_DAYS = {
  upper: 2,
  lower: 2,
  full: 1,
  push: 2,
  pull: 2,
  legs: 2,
  arms: 1,
  back: 2,
  chest: 2,
  shoulders: 1,
};

// example 1
const splitList_1 = ["lower", "upper", "upper", "full", "full"];
const splitWeek_1 = ["off", "upper", "lower", "off", "upper", "full", "full"];

// example 2
const splitList_2 = ["lower", "lower", "upper", "full", "full"];
const splitWeek_2 = ["off", "lower", "upper", "lower", "off", "full", "full"];

// example 3
const splitList_3 = ["push", "pull", "legs", "push", "pull"];
const splitWeek_3 = ["off", "push", "legs", "pull", "off", "push", "pull"];

// example 4
const splitList_4 = ["upper", "lower", "upper", "push", "lower", "full"];
const splitWeek_4 = ["off", "upper", "lower", "push", "full", "lower", "upper"];

type RestPeriodMap = Record<string, number>;

export function distributeSplitsAcrossWeek(
  splitList: string[],
  REST_PERIOD_BY_SPLIT_IN_DAYS: RestPeriodMap
): string[] {
  const week = Array(7).fill("off");
  const used = Array(7).fill(false);

  // Helper: Check if two splits share muscles
  function splitsOverlap(splitA: string, splitB: string): boolean {
    if (!MUSCLES_IN_EACH_SPLIT[splitA] || !MUSCLES_IN_EACH_SPLIT[splitB])
      return false;
    return MUSCLES_IN_EACH_SPLIT[splitA].some((muscle) =>
      MUSCLES_IN_EACH_SPLIT[splitB].includes(muscle)
    );
  }

  // Always place first "off" at index 0 (Sunday)
  week[0] = "off";
  used[0] = true;

  // Track last placed index for each split
  const lastPlaced: Record<string, number> = {};

  // Track which splits have been placed
  const splitsPlaced: boolean[] = Array(splitList.length).fill(false);

  for (let i = 0; i < splitList.length; i++) {
    const split = splitList[i];
    let placed = false;

    // Try to place split at earliest valid index
    for (let day = 1; day < 7; day++) {
      if (used[day]) continue;

      // Check rest period for same split
      if (
        lastPlaced[split] !== undefined &&
        day - lastPlaced[split] < REST_PERIOD_BY_SPLIT_IN_DAYS[split]
      ) {
        continue;
      }

      // Check for muscle overlap with previous day's split
      if (
        day > 0 &&
        week[day - 1] !== "off" &&
        splitsOverlap(split, week[day - 1])
      ) {
        continue;
      }

      // Avoid consecutive "off" days
      if (week[day - 1] === "off" && week[day] === "off") {
        continue;
      }

      // Place split
      week[day] = split;
      used[day] = true;
      lastPlaced[split] = day;
      splitsPlaced[i] = true;
      placed = true;
      break;
    }

    // If not placed, relax only the overlap constraint, but still respect rest period
    if (!placed) {
      for (let day = 1; day < 7; day++) {
        if (used[day]) continue;
        if (
          lastPlaced[split] !== undefined &&
          day - lastPlaced[split] < REST_PERIOD_BY_SPLIT_IN_DAYS[split]
        ) {
          continue;
        }
        week[day] = split;
        used[day] = true;
        lastPlaced[split] = day;
        splitsPlaced[i] = true;
        placed = true;
        break;
      }
    }

    // If still not placed, put in any available slot (should be rare)
    if (!placed) {
      for (let day = 1; day < 7; day++) {
        if (!used[day]) {
          week[day] = split;
          used[day] = true;
          lastPlaced[split] = day;
          splitsPlaced[i] = true;
          break;
        }
      }
    }
  }

  // if (week[0] === "off" && week[6] === "off") {
  //   // Try to move the off day at index 6 to the earliest available non-off slot (indices 1-5)
  //   for (let i = 1; i < 6; i++) {
  //     if (week[i] !== "off" && week[i - 1] !== "off") {
  //       week[6] = week[i];
  //       week[i] = "off";
  //       break;
  //     }
  //   }
  // }
  // No need to fill with more splits; just leave remaining as "off"
  return week;
}
