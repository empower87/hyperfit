import { MuscleType, getBroSplit } from "~/constants/workoutSplits";
import { buildTrainingBlockHandler } from "../utils/buildTrainingBlockHandlers";
import {
  MUSCLE_PRIORITY_LIST,
  onReorderUpdateMusclePriorityList,
  onSplitChangeUpdateMusclePriorityList,
} from "../utils/musclePriorityListHandlers";
import { getSplitFromWeights } from "./getSplitFromPriorityWeighting";

import { distributeSplitAcrossWeek } from "../utils/distributeSplitAcrossTrainingWeek";
import {
  distributeSessionsIntoSplits,
  getFrequencyMaxes,
} from "./distributeSessionsIntoSplits";
import {
  determineSplitHandler,
  redistributeSessionsIntoNewSplit,
} from "./splitSessionHandler";

export type DayType =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

// export type PPLSessionsType = {
//   split: "PPL";
//   sessions: {
//     push: number;
//     legs: number;
//     pull: number;
//   };
// };
// export type PPLULSessionsType = {
//   split: "PPLUL";
//   sessions: {
//     push: number;
//     legs: number;
//     pull: number;
//     lower: number;
//     upper: number;
//   };
// };
// export type BROSessionsType = {
//   split: "BRO";
//   sessions: {
//     legs: number;
//     back: number;
//     chest: number;
//     arms: number;
//     shoulders: number;
//   };
// };
// export type ULSessionsType = {
//   split: "UL";
//   sessions: {
//     upper: number;
//     lower: number;
//   };
// };
// export type FBSessionsType = {
//   split: "FB";
//   sessions: {
//     full: number;
//   };
// };
// export type OPTSessionsType = {
//   split: "OPT";
//   sessions: {
//     upper: number;
//     lower: number;
//     push: number;
//     pull: number;
//     full: number;
//   };
// };
// export type CUSSessionsType = {
//   split: "CUS";
//   sessions: {
//     upper?: number;
//     lower?: number;
//     push?: number;
//     legs?: number;
//     pull?: number;
//     full?: number;
//     back?: number;
//     chest?: number;
//     arms?: number;
//     shoulders?: number;
//   };
// };
type Sessions = {
  upper?: never;
  lower?: never;
  full?: never;
  push?: never;
  pull?: never;
  legs?: never;
  chest?: never;
  back?: never;
  arms?: never;
  shoulders?: never;
};

export type FBSessionsType = {
  upper?: never;
  lower?: never;
  full: number;
  push?: never;
  pull?: never;
  legs?: never;
  chest?: never;
  back?: never;
  arms?: never;
  shoulders?: never;
};

export type BROSessionsType = {
  upper?: never;
  lower?: never;
  full?: never;
  push?: never;
  pull?: never;
  legs: number;
  chest: number;
  back: number;
  arms: number;
  shoulders: number;
};
export type PPLSessionsType = {
  upper?: never;
  lower?: never;
  full?: never;
  push: number;
  pull: number;
  legs: number;
  chest?: never;
  back?: never;
  arms?: never;
  shoulders?: never;
};
export type PPLULSessionsType = {
  upper: number;
  lower: number;
  full?: never;
  push: number;
  pull: number;
  legs: number;
  chest?: never;
  back?: never;
  arms?: never;
  shoulders?: never;
};
export type ULSessionsType = {
  upper: number;
  lower: number;
  full?: never;
  push?: never;
  pull?: never;
  legs?: never;
  chest?: never;
  back?: never;
  arms?: never;
  shoulders?: never;
};
export type OPTSessionsType = {
  upper: number;
  lower: number;
  full: number;
  push: number;
  pull: number;
  legs?: never;
  chest?: never;
  back?: never;
  arms?: never;
  shoulders?: never;
};
export type CUSSessionsType = {
  upper?: number;
  lower?: number;
  full?: number;
  push?: number;
  pull?: number;
  legs?: number;
  chest?: number;
  back?: number;
  arms?: number;
  shoulders?: number;
};
export type SplitSessionsNameType =
  | "BRO"
  | "OPT"
  | "PPL"
  | "PPLUL"
  | "UL"
  | "FB"
  | "CUS";
export type SplitSessionsType = SplitSessionsGenericType<SplitSessionsNameType>;

export type ReturnValidSessionKeys<T extends SplitSessionsType["sessions"]> = {
  [key in keyof T]-?: T[key] extends number ? key : never;
}[keyof T] & {};

export type OPTSessionKeys = ReturnValidSessionKeys<OPTSessionsType>;
export type BROSessionKeys = ReturnValidSessionKeys<BROSessionsType>;
export type PPLSessionKeys = ReturnValidSessionKeys<PPLSessionsType>;
export type PPLULSessionKeys = ReturnValidSessionKeys<PPLULSessionsType>;
export type ULSessionKeys = ReturnValidSessionKeys<ULSessionsType>;
export type FBSessionKeys = ReturnValidSessionKeys<FBSessionsType>;
export type CUSSessionKeys = ReturnValidSessionKeys<CUSSessionsType>;

export type SplitSessionsGenericType<T extends SplitSessionsNameType> =
  T extends "BRO"
    ? {
        split: "BRO";
        sessions: BROSessionsType;
      }
    : T extends "OPT"
    ? {
        split: "OPT";
        sessions: OPTSessionsType;
      }
    : T extends "PPL"
    ? {
        split: "PPL";
        sessions: PPLSessionsType;
      }
    : T extends "PPLUL"
    ? {
        split: "PPLUL";
        sessions: PPLULSessionsType;
      }
    : T extends "UL"
    ? {
        split: "UL";
        sessions: ULSessionsType;
      }
    : T extends "FB"
    ? {
        split: "FB";
        sessions: FBSessionsType;
      }
    : T extends "CUS"
    ? {
        split: "CUS";
        sessions: CUSSessionsType;
      }
    : never;

// export type SplitSessionsType =
//   | PPLSessionsType
//   | PPLULSessionsType
//   | BROSessionsType
//   | ULSessionsType
//   | FBSessionsType
//   | OPTSessionsType
//   | CUSSessionsType;

export type SplitSessionsSplitsType =
  SplitSessionsGenericType<SplitSessionsNameType>["sessions"];

export type SessionKeys<T> = T extends T ? keyof T : never;
export type SplitType = SessionKeys<SplitSessionsSplitsType>;

export type ExerciseDetails = {
  sets: number;
  reps: number;
  weight: number;
  rir: number;
};

export type ExerciseMesocycleProgressionType = {
  week: number;
  sets: number;
  reps: number;
  weight: number;
  rir: number;
};
export type VolumeLandmarkType = "MRV" | "MEV" | "MV";
export const EXERCISE_TRAINING_MODALITIES = [
  "straight",
  "down",
  "eccentric",
  "giant",
  "myoreps",
  "myorep match",
  "drop",
  "superset",
  "pre-exhaust superset",
  "lengthened partials",
] as const;

export type SetProgressionType =
  | "ADD_ONE"
  | "ADD_ONE_ODD"
  | "FLAT_ADD"
  | "NO_ADD"
  | "ADD_ONE_PER_MICROCYCLE"
  | "ADD_MANY_PER_MICROCYCLE";
export type ExerciseTrainingModality =
  (typeof EXERCISE_TRAINING_MODALITIES)[number];

export type ExerciseType = {
  id: string;
  exercise: string;
  muscle: MuscleType;
  session: number;
  rank: VolumeLandmarkType;
  sets: number;
  reps: number;
  weight: number;
  rir: number;
  weightIncrement: number;
  trainingModality: ExerciseTrainingModality;
  mesocycle_progression: ExerciseMesocycleProgressionType[];
  supersetWith: ExerciseType["id"] | null;
  initialSetsPerMeso: number[];
  setProgressionSchema: SetProgressionType[];
};

export type TrainingProgramParamsType = {
  sessions: number;
  days: number;
  microcycles: number;
  mesocycles: number;
  blocks: number;
  macrocycles: number;
};

export type MusclePriorityVolumeType = {
  landmark: VolumeLandmarkType;
  frequencyProgression: number[];
  exercisesPerSessionSchema: number;
  setProgressionMatrix: number[][][][];
};
export type MusclePriorityFrequencyType = {
  range: [number, number];
  target: number;
  progression: number[];
};
export type MusclePriorityType = {
  id: string;
  rank: number;
  muscle: MuscleType;
  exercises: ExerciseType[][];
  volume: MusclePriorityVolumeType;
  frequency: MusclePriorityFrequencyType;
};

export type SessionSplitType = SplitType | "off";
export type SessionType = {
  id: string;
  split: SessionSplitType;
  exercises: ExerciseType[][];
};

export type TrainingDayType = {
  day: DayType;
  isTrainingDay: boolean;
  sessions: SessionType[];
};

export type State = {
  frequency: [number, number];
  training_program_params: TrainingProgramParamsType;
  muscle_priority_list: MusclePriorityType[];
  training_week: TrainingDayType[];
  training_block: TrainingDayType[][];
  split_sessions: SplitSessionsType;
  mrv_breakpoint: number;
  mev_breakpoint: number;
};
type UpdateProgramConfigAction = {
  type: "UPDATE_PROGRAM_CONFIG";
  payload: {
    frequency: [number, number];
    split: SplitSessionsNameType;
    muscle_priority_list: MusclePriorityType[];
    training_program_config: TrainingProgramParamsType;
    training_week: TrainingDayType[];
  };
};
type UpdateFrequencyAction = {
  type: "UPDATE_FREQUENCY";
  payload: { frequency: [number, number]; split?: SplitSessionsNameType };
};
type UpdateMusclePriorityListAction = {
  type: "UPDATE_MUSCLE_PRIORITY_LIST";
  payload: { priority_list: MusclePriorityType[] };
};
type UpdateExercisesByMuscleAction = {
  type: "UPDATE_EXERCISES_BY_MUSCLE";
  payload: { updated_muscle: MusclePriorityType };
};
type UpdateSplitSessionsAction = {
  type: "UPDATE_SPLIT_SESSIONS";
  payload: { split: SplitSessionsNameType };
};
type UpdateTrainingWeekAction = {
  type: "UPDATE_TRAINING_WEEK";
};
type RearrangeTrainingWeekAction = {
  type: "REARRANGE_TRAINING_WEEK";
  payload: { rearranged_week: TrainingDayType[] };
};
type UpdateBreakpointAction = {
  type: "UPDATE_VOLUME_BREAKPOINT";
  payload: { indicator: "mev_breakpoint" | "mrv_breakpoint"; value: number };
};
type UpdateBreakpointsAction = {
  type: "UPDATE_VOLUME_BREAKPOINTS";
  payload: { value: [number, number] };
};
type GetTrainingBlockAction = {
  type: "GET_TRAINING_BLOCK";
};
type AdjustFrequencyProgression = {
  type: "ADJUST_FREQUENCY_PROGRESSION";
  payload: {
    update_frequency_tuple: [MusclePriorityType["id"], "add" | "subtract"];
  };
};
type InitStoredAction = {
  type: "INIT_STORED";
  payload: { value: State };
};
type Action =
  | UpdateProgramConfigAction
  | UpdateFrequencyAction
  | UpdateMusclePriorityListAction
  | UpdateSplitSessionsAction
  | UpdateTrainingWeekAction
  | UpdateBreakpointAction
  | GetTrainingBlockAction
  | RearrangeTrainingWeekAction
  | AdjustFrequencyProgression
  | UpdateBreakpointsAction
  | UpdateExercisesByMuscleAction
  | InitStoredAction;

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

const SESSION = "2-6 exercises";
const DAY = "0-2 sessions";
const MICROCYCLE = "1 week";
const MESOCYCLE = "3-12 weeks";
const BLOCK = "1-4 mesocycles";
const MACROCYCLE = "1-4 blocks";

const INITIAL_TRAINING_PROGRAM_PARAMS: TrainingProgramParamsType = {
  sessions: 1,
  days: 3,
  microcycles: 4,
  mesocycles: 3,
  blocks: 4,
  macrocycles: 4,
};

const INITIAL_SPLIT_SESSIONS: SplitSessionsType = {
  split: "PPL",
  sessions: {
    push: 1,
    pull: 1,
    legs: 1,
  },
};

export const INITIAL_STATE: State = {
  frequency: [3, 0],
  training_program_params: { ...INITIAL_TRAINING_PROGRAM_PARAMS },
  muscle_priority_list: [...MUSCLE_PRIORITY_LIST],
  training_week: [...INITIAL_WEEK],
  training_block: [],
  split_sessions: { ...INITIAL_SPLIT_SESSIONS },
  mrv_breakpoint: INITIAL_MRV_BREAKPOINT,
  mev_breakpoint: INITIAL_MEV_BREAKPOINT,
};

export default function trainingProgramReducer(state: State, action: Action) {
  const frequency = state.frequency;
  const muscle_priority_list = state.muscle_priority_list;
  const split_sessions = state.split_sessions;
  const mesocycles = state.training_program_params.mesocycles;
  const microcycles = state.training_program_params.microcycles;
  const breakpoints: [number, number] = [
    state.mrv_breakpoint,
    state.mev_breakpoint,
  ];

  switch (action.type) {
    case "UPDATE_PROGRAM_CONFIG":
      const frequencyPayload = action.payload.frequency;
      const freqPayloadTotal = frequencyPayload[0] + frequencyPayload[1];
      const split = action.payload.split;
      const list = action.payload.muscle_priority_list;
      const params = action.payload.training_program_config;
      const trainingWeek = action.payload.training_week;

      const freq_maxes = getFrequencyMaxes(
        2,
        list,
        breakpoints,
        freqPayloadTotal
      );
      const broSplitSorted =
        split === "BRO"
          ? muscle_priority_list.reduce((acc: BROSessionKeys[], curr) => {
              const split = getBroSplit(curr.muscle);
              if (!acc.includes(split)) return [...acc, split];
              return acc;
            }, [])
          : undefined;

      const sessions = distributeSessionsIntoSplits(
        split,
        freqPayloadTotal,
        freq_maxes,
        broSplitSorted
      );

      // const sesh = getRankWeightsBySplit(
      //   list,
      //   split_sessions.split,
      //   breakpoints
      // );

      // const reorderedList = onReorderUpdateMusclePriorityList(
      //   list,
      //   breakpoints
      // );

      // const weightedSplit = getSplitFromWeights(
      //   frequencyPayload,
      //   reorderedList,
      //   split
      // );

      const finalizedMuscleList = onSplitChangeUpdateMusclePriorityList(
        list,
        sessions,
        params.mesocycles,
        params.microcycles
      );

      const distributedAcrossWeek = distributeSplitAcrossWeek(
        frequencyPayload,
        sessions
      );

      const distributedAcrossMesocycles = buildTrainingBlockHandler(
        finalizedMuscleList,
        sessions,
        distributedAcrossWeek,
        mesocycles
      );
      return {
        ...state,
        frequency: frequencyPayload,
        muscle_priority_list: finalizedMuscleList,
        split_sessions: sessions,
        training_week: distributedAcrossWeek,
        training_block: distributedAcrossMesocycles,
      };
    case "UPDATE_FREQUENCY":
      const new_freq = action.payload.frequency;
      const new_split = action.payload?.split ?? split_sessions.split;

      const reordered_list_freq =
        onReorderUpdateMusclePriorityList(muscle_priority_list);

      const update_split_sessions_freq = getSplitFromWeights(
        new_freq,
        reordered_list_freq,
        new_split
      );

      const updated_list_freq = onSplitChangeUpdateMusclePriorityList(
        reordered_list_freq,
        update_split_sessions_freq,
        mesocycles,
        microcycles
      );

      return {
        ...state,
        frequency: new_freq,
        muscle_priority_list: updated_list_freq,
        split_sessions: update_split_sessions_freq,
      };
    case "UPDATE_MUSCLE_PRIORITY_LIST":
      const new_list = action.payload.priority_list;

      const reordered_list = onReorderUpdateMusclePriorityList(
        new_list,
        breakpoints
      );
      const update_split_sessions = getSplitFromWeights(
        state.frequency,
        reordered_list,
        split_sessions.split
      );
      const updated_list = onSplitChangeUpdateMusclePriorityList(
        reordered_list,
        update_split_sessions,
        mesocycles,
        microcycles
      );

      return {
        ...state,
        muscle_priority_list: updated_list,
        split_sessions: update_split_sessions,
      };
    case "UPDATE_EXERCISES_BY_MUSCLE":
      const new_muscle = action.payload.updated_muscle;
      const new_muscle_list = structuredClone(muscle_priority_list);
      const index = new_muscle_list.findIndex(
        (each) => each.id === new_muscle.id
      );
      new_muscle_list[index] = new_muscle;

      return {
        ...state,
        muscle_priority_list: new_muscle_list,
      };
    case "ADJUST_FREQUENCY_PROGRESSION":
      const tuple = action.payload.update_frequency_tuple;
      const reordered_list_2 = onReorderUpdateMusclePriorityList(
        muscle_priority_list,
        breakpoints
      );
      const update_split_sessions_2 = getSplitFromWeights(
        state.frequency,
        reordered_list_2,
        split_sessions.split
      );
      const updated_list_2 = onSplitChangeUpdateMusclePriorityList(
        reordered_list_2,
        update_split_sessions_2,
        mesocycles,
        microcycles,
        tuple
      );

      return {
        ...state,
        muscle_priority_list: updated_list_2,
        split_sessions: update_split_sessions_2,
      };
    case "UPDATE_SPLIT_SESSIONS":
      const type = action.payload.split;

      const splitSessions = getSplitFromWeights(
        frequency,
        muscle_priority_list,
        type
      );

      const updated_list_sessions = onSplitChangeUpdateMusclePriorityList(
        muscle_priority_list,
        splitSessions,
        mesocycles,
        microcycles
      );

      return {
        ...state,
        split_sessions: splitSessions,
        muscle_priority_list: updated_list_sessions,
      };
    case "UPDATE_TRAINING_WEEK":
      const new_training_week = distributeSplitAcrossWeek(
        frequency,
        split_sessions
      );

      const get_training_block = buildTrainingBlockHandler(
        muscle_priority_list,
        split_sessions,
        new_training_week,
        mesocycles
      );

      return {
        ...state,
        training_week: new_training_week,
        training_block: get_training_block,
      };
    case "REARRANGE_TRAINING_WEEK":
      const rearranged_week = action.payload.rearranged_week;

      const splits = rearranged_week
        .map((each) => {
          const sessions = each.sessions.map((ea) => ea.split);
          const noOffSessions = sessions.filter(
            (each) => each !== ("off" as SplitType)
          );
          return noOffSessions;
        })
        .flat();

      const getSplit = determineSplitHandler(splits);
      const split_change = getSplit.includes(split_sessions.split);

      const new_sessions = redistributeSessionsIntoNewSplit(
        getSplit[0],
        splits
      );

      console.log(
        splits,
        new_sessions,
        "what this look like? lets just have a looksie"
      );

      const filteredWeek = rearranged_week.map((each) => {
        const sessions = each.sessions.filter(
          (ea) => ea.split !== ("off" as SplitType)
        );
        return {
          ...each,
          isTrainingDay: sessions.length ? true : false,
          sessions: sessions,
        };
      });

      const update_muscle_list = onSplitChangeUpdateMusclePriorityList(
        muscle_priority_list,
        new_sessions,
        mesocycles,
        microcycles
      );

      const rebuild_training_block = buildTrainingBlockHandler(
        update_muscle_list,
        new_sessions,
        filteredWeek,
        mesocycles
      );

      return {
        ...state,
        training_week: filteredWeek,
        training_block: rebuild_training_block,
        split_sessions: new_sessions,
        muscle_priority_list: update_muscle_list,
      };
    case "GET_TRAINING_BLOCK":
      const l = state.muscle_priority_list;
      const s = state.split_sessions;
      const w = state.training_week;
      const m = state.training_program_params.mesocycles;

      const training_block = buildTrainingBlockHandler(l, s, w, m);

      return {
        ...state,
        training_block: training_block,
      };
    case "UPDATE_VOLUME_BREAKPOINTS":
      const vol_breakpoints = action.payload.value;
      // let mev_breakpoint = state.mev_breakpoint;

      // const update_priority_breakpoints = addMesoProgression(
      //   state.muscle_priority_list,
      //   state.split_sessions,
      //   vol_breakpoints[0],
      //   vol_breakpoints[1]
      // );

      return {
        ...state,
        // muscle_priority_list: update_priority_breakpoints,
        mrv_breakpoint: vol_breakpoints[0],
        mev_breakpoint: vol_breakpoints[1],
      };
    case "UPDATE_VOLUME_BREAKPOINT":
      let mrv_breakpoint = state.mrv_breakpoint;
      let mev_breakpoint = state.mev_breakpoint;

      if (action.payload.indicator === "mrv_breakpoint") {
        mrv_breakpoint = action.payload.value;
      } else {
        mev_breakpoint = action.payload.value;
      }

      // const update_priority_breakpoint = addMesoProgression(
      //   state.muscle_priority_list,
      //   state.split_sessions,
      //   mrv_breakpoint,
      //   mev_breakpoint
      // );

      return {
        ...state,
        // muscle_priority_list: update_priority_breakpoint,
        mrv_breakpoint: mrv_breakpoint,
        mev_breakpoint: mev_breakpoint,
      };
    case "INIT_STORED":
      return action.payload.value;
    default:
      return state;
  }
}
