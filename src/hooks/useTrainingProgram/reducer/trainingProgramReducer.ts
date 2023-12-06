import { getSplitFromWeights } from "./getSplitFromPriorityWeighting";
import { distributeSplitAcrossWeek } from "./splitSessionsHandler";
import { VolumeLandmarkType, addMesoProgression } from "./trainingProgramUtils";

export type DayType =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type SplitType = "upper" | "lower" | "push" | "pull" | "full" | "off";

export type PPLSessionsType = {
  split: "PPL";
  sessions: {
    push: number;
    legs: number;
    pull: number;
  };
};
export type PPLULSessionsType = {
  split: "PPLUL";
  sessions: {
    push: number;
    legs: number;
    pull: number;
    lower: number;
    upper: number;
  };
};
export type BROSessionsType = {
  split: "BRO";
  sessions: {
    legs: number;
    back: number;
    chest: number;
    arms: number;
    shoulders: number;
  };
};
export type ULSessionsType = {
  split: "UL";
  sessions: {
    upper: number;
    lower: number;
  };
};
export type FBSessionsType = {
  split: "FB";
  sessions: {
    full: number;
  };
};
export type OPTSessionsType = {
  split: "OPT";
  sessions: {
    upper: number;
    lower: number;
    push: number;
    pull: number;
    full: number;
  };
};
export type CUSSessionsType = {
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
export type SplitSessionsType =
  | PPLSessionsType
  | PPLULSessionsType
  | BROSessionsType
  | ULSessionsType
  | FBSessionsType
  | OPTSessionsType
  | CUSSessionsType;
export type SplitSessionsNameType =
  | "OPT"
  | "CUS"
  | "PPL"
  | "PPLUL"
  | "UL"
  | "FB"
  | "BRO";

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

export type MusclePriorityType = {
  id: string;
  rank: number;
  muscle: string;
  volume_landmark: VolumeLandmarkType;
  mesoProgression: number[];
  exercises: ExerciseType[][];
};

export type SessionType = {
  id: string;
  split: string;
  exercises: ExerciseType[][];
};

export type TrainingDayType = {
  day: DayType;
  isTrainingDay: boolean;
  sessions: SessionType[];
};

export type State = {
  frequency: [number, number];
  muscle_priority_list: MusclePriorityType[];
  training_week: TrainingDayType[];
  split_sessions: SplitSessionsType;
  mrv_breakpoint: number;
  mev_breakpoint: number;
};

type UpdateFrequencyAction = {
  type: "UPDATE_FREQUENCY";
  payload: { frequency: [number, number] };
};
type UpdateMusclePriorityListAction = {
  type: "UPDATE_MUSCLE_PRIORITY_LIST";
  payload: { priority_list: MusclePriorityType[] };
};
type UpdateSplitSessionsAction = {
  type: "UPDATE_SPLIT_SESSIONS";
  payload: { split: SplitSessionsNameType };
};
type UpdateTrainingWeekAction = {
  type: "UPDATE_TRAINING_WEEK";
};
type UpdateBreakpointAction = {
  type: "UPDATE_VOLUME_BREAKPOINT";
  payload: { indicator: "mev_breakpoint" | "mrv_breakpoint"; value: number };
};
type Action =
  | UpdateFrequencyAction
  | UpdateMusclePriorityListAction
  | UpdateSplitSessionsAction
  | UpdateTrainingWeekAction
  | UpdateBreakpointAction;

const INITIAL_MRV_BREAKPOINT = 4;
const INITIAL_MEV_BREAKPOINT = 9;

export const INITIAL_WEEK: TrainingDayType[] = [
  {
    day: "Sunday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Monday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Tuesday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Wednesday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Thursday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Friday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Saturday",
    isTrainingDay: true,
    sessions: [],
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
  split: "PPL",
  sessions: {
    push: 1,
    pull: 1,
    legs: 1,
  },
};

// ---------------
export const INITIAL_STATE: State = {
  frequency: [3, 0],
  muscle_priority_list: [...MUSCLE_PRIORITY_LIST],
  training_week: [...INITIAL_WEEK],
  split_sessions: { ...INITIAL_SPLIT_SESSIONS },
  mrv_breakpoint: INITIAL_MRV_BREAKPOINT,
  mev_breakpoint: INITIAL_MEV_BREAKPOINT,
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
    case "UPDATE_FREQUENCY":
      const new_freq = action.payload.frequency;
      const current_priority = state.muscle_priority_list;
      const current_split = state.split_sessions.split;

      const split_sessions = getSplitFromWeights(
        new_freq,
        current_priority,
        current_split
      );
      const priority_list = addMesoProgression(
        current_priority,
        split_sessions,
        state.mrv_breakpoint,
        state.mev_breakpoint
      );

      return {
        ...state,
        total_sessions: new_freq,
        muscle_priority_list: priority_list,
        split_sessions: split_sessions,
      };
    case "UPDATE_MUSCLE_PRIORITY_LIST":
      const new_list = action.payload.priority_list;
      const current_split_sessions = state.split_sessions;

      const update_priority_list = addMesoProgression(
        new_list,
        current_split_sessions,
        state.mrv_breakpoint,
        state.mev_breakpoint
      );
      const update_split_sessions = getSplitFromWeights(
        state.frequency,
        update_priority_list,
        current_split_sessions.split
      );
      return {
        ...state,
        muscle_priority_list: update_priority_list,
        split_sessions: update_split_sessions,
      };
    case "UPDATE_SPLIT_SESSIONS":
      const type = action.payload.split;
      const total_sessions = state.frequency;
      const priority = state.muscle_priority_list;
      const splitSessions = getSplitFromWeights(total_sessions, priority, type);
      const updatePriorityList = addMesoProgression(
        priority,
        splitSessions,
        state.mrv_breakpoint,
        state.mev_breakpoint
      );

      return {
        ...state,
        split_sessions: splitSessions,
        muscle_priority_list: updatePriorityList,
      };
    case "UPDATE_TRAINING_WEEK":
      // updates on a change in split_sessions
      const new_training_week = distributeSplitAcrossWeek(
        [...INITIAL_WEEK],
        state.frequency,
        state.split_sessions
      );
      // update exercises function here
      return {
        ...state,
        training_week: [],
      };
    case "UPDATE_VOLUME_BREAKPOINT":
      let mrv_breakpoint = state.mrv_breakpoint;
      let mev_breakpoint = state.mev_breakpoint;

      if (action.payload.indicator === "mrv_breakpoint") {
        mrv_breakpoint = action.payload.value;
      } else {
        mev_breakpoint = action.payload.value;
      }

      const update_priority_breakpoint = addMesoProgression(
        state.muscle_priority_list,
        state.split_sessions,
        mrv_breakpoint,
        mev_breakpoint
      );

      return {
        ...state,
        muscle_priority_list: update_priority_breakpoint,
        mrv_breakpoint: mrv_breakpoint,
        mev_breakpoint: mev_breakpoint,
      };
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
