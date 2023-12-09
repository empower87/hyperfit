import {
  INITIAL_WEEK_TEST,
  distributeSplitAcrossWeek,
} from "~/z-unused/oldMainLogicHook9122023/getNextSession";
import { getSplitFromWeights } from "./getSplitFromPriorityWeighting";
import {
  VolumeLandmarkType,
  getSplitSessions,
  updateReducerStateHandler,
  updateTrainingWeek,
} from "./weeklySessionSplitUtils";

export type DayType =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type SplitType = "upper" | "lower" | "push" | "pull" | "full" | "off";

export type ExerciseDetails = {
  sets: number;
  reps: number;
  weight: number;
  rir: number;
};

export type ExerciseType = {
  id: string;
  exercise: string;
  group: string;
  session: number;
  rank: "MRV" | "MEV" | "MV";
  sets: number;
  reps: number;
  weight: number;
  rir: number;
  meso_progression: number[];
  meso_details: (ExerciseDetails | null)[];
};
// TODO: this state needs to be dynamic. Adjust tuples for sessions/sets into an object into an array called sessions.

export type TrainingDayType = {
  day: DayType;
  sessionNum: number;
  sets: [ExerciseType[][], ExerciseType[][]];
  totalSets: [number, number];
  maxSets: [number, number];
  sessions: [SplitType, SplitType];
};

export type MusclePriorityType = {
  id: string;
  rank: number;
  muscle: string;
  volume_landmark: VolumeLandmarkType;
  mesoProgression: number[];
  exercises: ExerciseType[][];
};

export type SplitSessionsNameType =
  | "OPT"
  | "CUS"
  | "PPL"
  | "PPLUL"
  | "UL"
  | "FB"
  | "BRO";

type Sessions = {
  upper: number;
  lower: number;
  push: number;
  pull: number;
  legs: number;
  full: number;
  chest: number;
  back: number;
  arms: number;
  shoulders: number;
  off: number;
};

export type SplitSessionsType = {
  name: SplitSessionsNameType;
  sessions: Sessions;
};

type SessionType = {
  id: string;
  split: string;
  exercises: [];
};
type TrainingDay = {
  day: DayType;
  isTrainingDay: boolean;
  sessions: SessionType[];
};
export type State = {
  total_sessions: [number, number];
  list: MusclePriorityType[];
  training_week: TrainingDayType[];
  split_sessions: SplitSessionsType;
  mrv_breakpoint: number;
  mev_breakpoint: number;
  test: TrainingDay[];
};

type Action = {
  type:
    | "UPDATE_TOTAL_SESSIONS"
    | "UPDATE_LIST"
    | "UPDATE_MRV_BREAKPOINT"
    | "UPDATE_MEV_BREAKPOINT"
    | "UPDATE_SPLIT_SESSIONS"
    | "UPDATE_TRAINING_WEEK"
    | "TEST";
  payload?: {
    new_sessions?: [number, number];
    new_list?: MusclePriorityType[];
    mrv_breakpoint?: number;
    mev_breakpoint?: number;
    split_type?: SplitSessionsNameType;
  };
};

const INITIAL_MRV_BREAKPOINT = 4;
const INITIAL_MEV_BREAKPOINT = 9;

const INITIAL_WEEK: TrainingDayType[] = [
  {
    day: "Sunday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Monday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Tuesday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Wednesday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Thursday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Friday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Saturday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
];

export const VOLUME_BG_COLORS = {
  MRV: "bg-red-500",
  MEV: "bg-orange-500",
  MV: "bg-green-500",
};

const MUSCLE_PRIORITY_LIST: MusclePriorityType[] = [
  {
    id: "back-002",
    rank: 1,
    muscle: "back",
    volume_landmark: "MRV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "delts_side-008",
    rank: 2,
    muscle: "delts_side",
    volume_landmark: "MRV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "triceps-014",
    rank: 3,
    muscle: "triceps",
    volume_landmark: "MRV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "hamstrings-011",
    rank: 4,
    muscle: "hamstrings",
    volume_landmark: "MRV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "quads-012",
    rank: 5,
    muscle: "quads",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "delts_rear-007",
    rank: 6,
    muscle: "delts_rear",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "forearms-009",
    rank: 7,
    muscle: "forearms",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "traps-013",
    rank: 8,
    muscle: "traps",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "biceps-003",
    rank: 9,
    muscle: "biceps",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },

  {
    id: "chest-005",
    rank: 10,
    muscle: "chest",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "calves-004",
    rank: 11,
    muscle: "calves",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },

  {
    id: "delts_front-006",
    rank: 12,
    muscle: "delts_front",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "abs-001",
    rank: 13,
    muscle: "abs",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "glutes-010",
    rank: 14,
    muscle: "glutes",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
];

const INITIAL_SPLIT_SESSIONS: SplitSessionsType = {
  name: "PPL",
  sessions: {
    upper: 0,
    lower: 0,
    push: 1,
    pull: 1,
    legs: 1,
    full: 0,
    off: 0,
    arms: 0,
    chest: 0,
    back: 0,
    shoulders: 0,
  },
};

type PPLSessionsType = {
  split: "PPL";
  sessions: {
    push: number;
    legs: number;
    pull: number;
  };
};
type PPLULSessionsType = {
  split: "PPLUL";
  sessions: {
    push: number;
    legs: number;
    pull: number;
    lower: number;
    upper: number;
  };
};

type BROSessionsType = {
  split: "BRO";
  sessions: {
    legs: number;
    back: number;
    chest: number;
    arms: number;
    shoulders: number;
  };
};

type ULSessionsType = {
  split: "UL";
  sessions: {
    upper: number;
    lower: number;
  };
};

type FBSessionsType = {
  split: "FB";
  sessions: {
    full: number;
  };
};

type OPTSessionsType = {
  split: "OPT";
  sessions: {
    upper: number;
    lower: number;
    push: number;
    pull: number;
    full: number;
  };
};

type CUSSessionsType = {
  split: "CUS";
  sessions: {
    upper?: number;
    lower?: number;
    push?: number;
    legs?: number;
    pull?: number;
    full?: number;
    back?: number;
    chest?: number;
    arms?: number;
    shoulders?: number;
  };
};

export type SplitSessions =
  | PPLSessionsType
  | PPLULSessionsType
  | BROSessionsType
  | ULSessionsType
  | FBSessionsType
  | OPTSessionsType
  | CUSSessionsType;

// ---------------
export const INITIAL_STATE: State = {
  total_sessions: [3, 0],
  list: [...MUSCLE_PRIORITY_LIST],
  training_week: [...INITIAL_WEEK],
  split_sessions: { ...INITIAL_SPLIT_SESSIONS },
  mrv_breakpoint: INITIAL_MRV_BREAKPOINT,
  mev_breakpoint: INITIAL_MEV_BREAKPOINT,
  test: [...INITIAL_WEEK_TEST],
};

// total_sessions --> list
// total_sessions && list --> split_sessions
// mrv && mev_breakpoint --> list

// TODO: Should add state for total mesocycles 1-4

// Notes: updating an exercise should update it within muscle list > split > training_block

// Notes: SessionDaySplit should get built in TrainingBlock

export default function weeklySessionSplitReducer(
  state: State,
  action: Action
) {
  switch (action.type) {
    case "UPDATE_TOTAL_SESSIONS":
      if (!action.payload || !action.payload.new_sessions) return state;
      let new_sessions = action.payload.new_sessions;

      const updated_sessions = updateReducerStateHandler(
        new_sessions,
        state.list,
        state.training_week,
        state.mrv_breakpoint,
        state.mev_breakpoint,
        state.split_sessions
      );

      return {
        ...state,
        total_sessions: new_sessions,
        list: updated_sessions.list,
        training_week: updated_sessions.split,
      };
    case "UPDATE_LIST":
      if (!action.payload || !action.payload.new_list) return state;
      let new_list = action.payload.new_list;

      const updated_list = updateReducerStateHandler(
        state.total_sessions,
        new_list,
        state.training_week,
        state.mrv_breakpoint,
        state.mev_breakpoint,
        state.split_sessions
      );

      return {
        ...state,
        list: updated_list.list,
        training_week: updated_list.split,
      };
    case "UPDATE_SPLIT_SESSIONS":
      if (!action.payload || !action.payload.split_type) return state;
      const type = action.payload.split_type;
      const splitSessions = getSplitSessions(
        type,
        state.total_sessions,
        state.list
      );

      const updated_list_split = updateReducerStateHandler(
        state.total_sessions,
        state.list,
        state.training_week,
        state.mrv_breakpoint,
        state.mev_breakpoint,
        splitSessions
      );

      const week_split = distributeSplitAcrossWeek(
        [...INITIAL_WEEK_TEST],
        state.total_sessions,
        splitSessions
      );
      return {
        ...state,
        split_sessions: splitSessions,
        list: updated_list_split.list,
        training_week: updated_list_split.split,
        test: week_split,
      };
    case "UPDATE_MRV_BREAKPOINT":
      if (!action.payload || !action.payload.mrv_breakpoint) return state;
      let new_mrv_breakpoint = action.payload.mrv_breakpoint;

      const updated_list_mrv = updateReducerStateHandler(
        state.total_sessions,
        state.list,
        state.training_week,
        new_mrv_breakpoint,
        state.mev_breakpoint,
        state.split_sessions
      );
      return {
        ...state,
        list: updated_list_mrv.list,
        training_week: updated_list_mrv.split,
        mrv_breakpoint: new_mrv_breakpoint,
      };
    case "UPDATE_MEV_BREAKPOINT":
      if (!action.payload || !action.payload.mev_breakpoint) return state;
      let new_mev_breakpoint = action.payload.mev_breakpoint;

      const updated_list_mev = updateReducerStateHandler(
        state.total_sessions,
        state.list,
        state.training_week,
        new_mev_breakpoint,
        state.mev_breakpoint,
        state.split_sessions
      );
      return {
        ...state,
        list: updated_list_mev.list,
        training_week: updated_list_mev.split,
        mev_breakpoint: new_mev_breakpoint,
      };

    case "UPDATE_TRAINING_WEEK":
      const updated_training_week = updateTrainingWeek(
        state.total_sessions,
        state.training_week,
        state.split_sessions,
        state.list,
        [state.mrv_breakpoint, state.mev_breakpoint]
      );
      return { ...state, training_week: updated_training_week };

    case "TEST":
      const test = getSplitFromWeights(
        state.total_sessions,
        state.list,
        state.split_sessions.name
      );
      console.log(test, "TEST TEST TEST YO");
      return state;
    default:
      return state;
  }
}

// state
// -----
// total_sessions
// split:
// { name: "ppl",
//   upper: 0,
//   lower: 0,
//   push: 1,
//   pull: 1,
//   legs: 1,
//   full: 0,
//   arms: 0,
//   chest: 0,
//   back: 0,
//   legs: 0,
//   shoulders: 0
// }
// muscle_priority_List
// training_week
