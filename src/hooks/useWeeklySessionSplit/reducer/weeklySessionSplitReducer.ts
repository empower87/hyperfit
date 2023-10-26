import { updateReducerStateHandler } from "./weeklySessionSplitUtils";

export type DayType =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type SplitType = "upper" | "lower" | "push" | "pull" | "full" | "off";
export type VolumeLandmark = "MRV" | "MEV" | "MV";

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

export type SessionDayType = {
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
  volume_landmark: VolumeLandmark;
  mesoProgression: number[];
  exercises: ExerciseType[][];
};

type State = {
  total_sessions: [number, number];
  list: MusclePriorityType[];
  split: SessionDayType[];
  mrv_breakpoint: number;
  mev_breakpoint: number;
};

type Action = {
  type: "UPDATE_SESSIONS" | "UPDATE_LIST";
  payload?: {
    new_sessions?: [number, number];
    new_list?: MusclePriorityType[];
  };
};

const INITIAL_MRV_BREAKPOINT = 4;
const INITIAL_MEV_BREAKPOINT = 9;

const INITIAL_SPLIT: SessionDayType[] = [
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

export const INITIAL_STATE: State = {
  total_sessions: [3, 0],
  list: [...MUSCLE_PRIORITY_LIST],
  split: [...INITIAL_SPLIT],
  mrv_breakpoint: INITIAL_MRV_BREAKPOINT,
  mev_breakpoint: INITIAL_MEV_BREAKPOINT,
};

// TODO: Should add state for total mesocycles 1-4

// Notes: updating an exercise should update it within muscle list > split > training_block

// Notes: SessionDaySplit should get built in TrainingBlock

export default function weeklySessionSplitReducer(
  state: State,
  action: Action
) {
  switch (action.type) {
    case "UPDATE_SESSIONS":
      if (!action.payload || !action.payload.new_sessions) return state;
      let new_sessions = action.payload.new_sessions;

      const updated_sessions = updateReducerStateHandler(
        new_sessions,
        state.list,
        state.split,
        state.mrv_breakpoint,
        state.mev_breakpoint
      );

      return {
        ...state,
        total_sessions: new_sessions,
        list: updated_sessions.list,
        split: updated_sessions.split,
      };
    case "UPDATE_LIST":
      if (!action.payload || !action.payload.new_list) return state;
      let new_list = action.payload.new_list;

      const updated_list = updateReducerStateHandler(
        state.total_sessions,
        new_list,
        state.split,
        state.mrv_breakpoint,
        state.mev_breakpoint
      );

      return {
        ...state,
        list: updated_list.list,
        split: updated_list.split,
      };
    default:
      return state;
  }
}
