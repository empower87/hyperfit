import { getBroSplit, MuscleType } from "~/constants/workoutSplits";
import {
  attachTargetFrequency,
  MUSCLE_PRIORITY_LIST,
} from "../utils/prioritized_muscle_list/musclePriorityListHandlers";

import {
  distributeSessionsIntoSplits,
  getFrequencyMaxes,
} from "../utils/split_sessions/distributeSessionsIntoSplits";
import { distributeSplitAcrossWeek } from "../utils/training_block/distributeSplitAcrossTrainingWeek";
import { initializeTrainingBlock } from "../utils/training_block/trainingBlockHelpers";

export type DayType =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

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
export type SplitType = SessionKeys<SplitSessionsSplitsType> & {};

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

export type ExerciseDataType = {
  movement_type: string;
  requirements: string[];
};

export type ExerciseType = {
  id: string;
  name: string;
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
  data: ExerciseDataType;
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
  exercisesPerSessionSchema: number;
};
export type MusclePriorityFrequencyType = {
  range: [number, number];
  target: number;
  progression: number[];
  setProgressionMatrix: number[][][];
};
export type MusclePriorityType = {
  id: string;
  muscle: MuscleType;
  exercises: ExerciseType[][];
  volume: MusclePriorityVolumeType;
  frequency: MusclePriorityFrequencyType;
};

export type SessionSplitType = SplitType | "off";
export type SessionType = {
  id: string;
  split: SessionSplitType;
  exercises: [MuscleType, string][];
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
  training_block: TrainingDayType[][];
  split_sessions: SplitSessionsType;
  mrv_breakpoint: number;
  mev_breakpoint: number;
};
type UpdateProgramConfigAction = {
  type: "UPDATE_PROGRAM_CONFIG";
  payload: { value: State };
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
  training_block: [],
  split_sessions: { ...INITIAL_SPLIT_SESSIONS },
  mrv_breakpoint: INITIAL_MRV_BREAKPOINT,
  mev_breakpoint: INITIAL_MEV_BREAKPOINT,
};

export default function trainingProgramReducer(state: State, action: Action) {
  const frequency = state.frequency;
  const frequency_total = frequency[0] + frequency[1];
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
      // const frequencyPayload = action.payload.frequency;
      // const freqPayloadTotal = frequencyPayload[0] + frequencyPayload[1];
      // const split = action.payload.split;
      // const list = action.payload.muscle_priority_list;

      // const finalizedMuscleList = attachTargetFrequency(
      //   list,
      //   freqPayloadTotal,
      //   breakpoints
      // );

      // const freq_maxes = getFrequencyMaxes(
      //   2,
      //   finalizedMuscleList,
      //   breakpoints,
      //   freqPayloadTotal
      // );

      // const broSplitSorted =
      //   split === "BRO"
      //     ? finalizedMuscleList.reduce((acc: BROSessionKeys[], curr) => {
      //         const split = getBroSplit(curr.muscle);
      //         if (!acc.includes(split)) return [...acc, split];
      //         return acc;
      //       }, [])
      //     : undefined;

      // const sessions = distributeSessionsIntoSplits(
      //   split,
      //   freqPayloadTotal,
      //   freq_maxes,
      //   broSplitSorted
      // );

      // const distributedAcrossWeek = distributeSplitAcrossWeek(
      //   frequencyPayload,
      //   sessions
      // );

      // const built_training_block = initializeTrainingBlock(
      //   sessions,
      //   finalizedMuscleList,
      //   distributedAcrossWeek,
      //   freqPayloadTotal,
      //   mesocycles
      // );
      // return {
      //   ...state,
      //   frequency: frequencyPayload,
      //   muscle_priority_list: finalizedMuscleList,
      //   split_sessions: sessions,
      //   training_week: distributedAcrossWeek,
      //   training_block: built_training_block,
      // };
      return action.payload.value;
    case "UPDATE_FREQUENCY":
      const new_freq = action.payload.frequency;
      const new_freq_total = new_freq[0] + new_freq[1];
      const new_split = action.payload?.split ?? split_sessions.split;

      const getNGroup = getFrequencyMaxes(
        2, // this will be determined via mrv_breakpoint
        muscle_priority_list,
        breakpoints,
        new_freq_total
      );

      const broSplitSorted2 =
        new_split === "BRO"
          ? muscle_priority_list.reduce((acc: BROSessionKeys[], curr) => {
              const split = getBroSplit(curr.muscle);
              if (!acc.includes(split)) return [...acc, split];
              return acc;
            }, [])
          : undefined;

      const update_split_sessions_freq = distributeSessionsIntoSplits(
        new_split,
        new_freq_total,
        getNGroup,
        broSplitSorted2
      );

      const updated_list_freq = attachTargetFrequency(
        muscle_priority_list,
        frequency_total,
        breakpoints,
        mesocycles
      );

      return {
        ...state,
        frequency: new_freq,
        muscle_priority_list: updated_list_freq,
        split_sessions: update_split_sessions_freq,
      };
    case "UPDATE_MUSCLE_PRIORITY_LIST":
      const new_list = action.payload.priority_list;
      const freq_total = frequency[0] + frequency[1];

      const getNGroup2 = getFrequencyMaxes(
        2, // this will be determined via mrv_breakpoint
        muscle_priority_list,
        breakpoints,
        freq_total
      );

      const broSplitSorted3 =
        split_sessions.split === "BRO"
          ? muscle_priority_list.reduce((acc: BROSessionKeys[], curr) => {
              const split = getBroSplit(curr.muscle);
              if (!acc.includes(split)) return [...acc, split];
              return acc;
            }, [])
          : undefined;

      const update_split_sessions = distributeSessionsIntoSplits(
        split_sessions.split,
        freq_total,
        getNGroup2,
        broSplitSorted3
      );

      const updated_list = attachTargetFrequency(
        muscle_priority_list,
        frequency_total,
        breakpoints,
        mesocycles
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

      const freq_total_2 = frequency[0] + frequency[1];
      const getNGroup3 = getFrequencyMaxes(
        2, // this will be determined via mrv_breakpoint
        muscle_priority_list,
        breakpoints,
        freq_total_2
      );

      const broSplitSorted4 =
        split_sessions.split === "BRO"
          ? muscle_priority_list.reduce((acc: BROSessionKeys[], curr) => {
              const split = getBroSplit(curr.muscle);
              if (!acc.includes(split)) return [...acc, split];
              return acc;
            }, [])
          : undefined;

      const update_split_sessions_2 = distributeSessionsIntoSplits(
        split_sessions.split,
        freq_total_2,
        getNGroup3,
        broSplitSorted4
      );

      const updated_list_2 = attachTargetFrequency(
        muscle_priority_list,
        frequency_total,
        breakpoints,
        mesocycles
      );

      return {
        ...state,
        muscle_priority_list: updated_list_2,
        split_sessions: update_split_sessions_2,
      };
    case "UPDATE_SPLIT_SESSIONS":
      const type = action.payload.split;

      const getNGroup4 = getFrequencyMaxes(
        2, // this will be determined via mrv_breakpoint
        muscle_priority_list,
        breakpoints,
        frequency_total
      );

      const broSplitSorted5 =
        type === "BRO"
          ? muscle_priority_list.reduce((acc: BROSessionKeys[], curr) => {
              const split = getBroSplit(curr.muscle);
              if (!acc.includes(split)) return [...acc, split];
              return acc;
            }, [])
          : undefined;

      const splitSessions = distributeSessionsIntoSplits(
        type,
        frequency_total,
        getNGroup4,
        broSplitSorted5
      );

      const updated_list_sessions = attachTargetFrequency(
        muscle_priority_list,
        frequency_total,
        breakpoints,
        mesocycles
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
      const get_training_block = initializeTrainingBlock(
        split_sessions,
        muscle_priority_list,
        new_training_week,
        frequency[0] + frequency[1],
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

      // const getSplit = determineSplitHandler(splits);
      // const split_change = getSplit.includes(split_sessions.split);

      // const new_sessions = redistributeSessionsIntoNewSplit(
      //   getSplit[0],
      //   splits
      // );

      // console.log(
      //   splits,
      //   new_sessions,
      //   "what this look like? lets just have a looksie"
      // );

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

      const update_muscle_list = attachTargetFrequency(
        muscle_priority_list,
        frequency_total,
        breakpoints,
        mesocycles
      );

      const rebuild_training_block = initializeTrainingBlock(
        split_sessions,
        update_muscle_list,
        filteredWeek,
        frequency[0] + frequency[1],
        mesocycles
      );

      return {
        ...state,
        training_week: filteredWeek,
        training_block: rebuild_training_block,
        // split_sessions: new_sessions,
        muscle_priority_list: update_muscle_list,
      };
    case "GET_TRAINING_BLOCK":
      const l = state.muscle_priority_list;
      const s = state.split_sessions;
      const w = [...INITIAL_WEEK];
      const m = state.training_program_params.mesocycles;
      const t = state.frequency[0] + state.frequency[1];

      const training_block = initializeTrainingBlock(s, l, w, t, m);

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
