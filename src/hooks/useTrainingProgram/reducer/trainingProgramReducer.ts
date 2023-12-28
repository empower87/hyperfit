import { buildMesocycles } from "~/hooks/useMesocycleProgression/useMesocycleProgression";
import {
  MUSCLE_PRIORITY_LIST,
  onReorderUpdateMusclePriorityList,
  onSplitChangeUpdateMusclePriorityList,
} from "../utils/musclePriorityListHandlers";
import { getSplitFromWeights } from "./getSplitFromPriorityWeighting";
import { distributeSplitAcrossWeek } from "./splitSessionsHandler";
import {
  VolumeLandmarkType,
  addMesoProgression,
  distributeExercisesAmongSplit,
} from "./trainingProgramUtils";

export type DayType =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type SplitType =
  | "push"
  | "legs"
  | "pull"
  | "lower"
  | "upper"
  | "full"
  | "back"
  | "chest"
  | "arms"
  | "shoulders";

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

export type SplitSessionsNameType = SplitSessionsType["split"];

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
  rank: VolumeLandmarkType;
  sets: number;
  reps: number;
  weight: number;
  rir: number;
  meso_progression: number[];
  meso_details: (ExerciseDetails | null)[];
  block_progression_matrix: number[][][];
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
export type MusclePriorityType = {
  id: string;
  rank: number;
  muscle: string;
  volume_landmark: VolumeLandmarkType;
  mesoProgression: number[];
  exercises: ExerciseType[][];
  volume: MusclePriorityVolumeType;
};

export type SessionType = {
  id: string;
  split: SplitType;
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
type GetTrainingBlockAction = {
  type: "GET_TRAINING_BLOCK";
};

type Action =
  | UpdateFrequencyAction
  | UpdateMusclePriorityListAction
  | UpdateSplitSessionsAction
  | UpdateTrainingWeekAction
  | UpdateBreakpointAction
  | GetTrainingBlockAction;

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

export default function weeklySessionSplitReducer(
  state: State,
  action: Action
) {
  const frequency = state.frequency;
  const muscle_priority_list = state.muscle_priority_list;
  const split_sessions = state.split_sessions;
  const mesocycles = state.training_program_params.mesocycles;
  const microcycles = state.training_program_params.microcycles;

  switch (action.type) {
    case "UPDATE_FREQUENCY":
      const new_freq = action.payload.frequency;
      // const current_priority = state.muscle_priority_list;
      // const current_split = state.split_sessions.split;

      // const split_sessions = getSplitFromWeights(
      //   new_freq,
      //   current_priority,
      //   current_split
      // );

      // const lista = addRankWeightsToMusclePriority(current_priority);

      // const priority_list = addMesoProgression(
      //   current_priority,
      //   split_sessions,
      //   state.mrv_breakpoint,
      //   state.mev_breakpoint
      // );

      // const testies = addMesocycleSetProgressionToMusclePriority(
      //   priority_list,
      //   state.training_program_params.microcycles
      // );
      // return {
      //   ...state,
      //   frequency: new_freq,
      //   muscle_priority_list: priority_list,
      //   split_sessions: split_sessions,
      // };

      const reordered_list_freq =
        onReorderUpdateMusclePriorityList(muscle_priority_list);

      const update_split_sessions_freq = getSplitFromWeights(
        new_freq,
        reordered_list_freq,
        split_sessions.split
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
      // const current_split_sessions = state.split_sessions;
      // const update_split_sessions = getSplitFromWeights(
      //   state.frequency,
      //   new_list,
      //   current_split_sessions.split
      // );

      // const update_priority_list = addMesoProgression(
      //   new_list,
      //   update_split_sessions,
      //   state.mrv_breakpoint,
      //   state.mev_breakpoint
      // );

      // return {
      //   ...state,
      //   muscle_priority_list: update_priority_list,
      //   split_sessions: update_split_sessions,
      // };

      // TEST: testing new logic format - 12/27/23
      // const mesocycles = state.training_program_params.mesocycles
      // const microcycles = state.training_program_params.microcycles
      const reordered_list = onReorderUpdateMusclePriorityList(new_list);

      const update_split_sessions = getSplitFromWeights(
        state.frequency,
        new_list,
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
    // case "TEST":
    //   const li = state.muscle_priority_list;
    //   const sp = state.split_sessions;
    //   const list = addRankWeightsToMusclePriority(li);

    //   const test = attachMesocycleFrequencyProgression(
    //     list,
    //     sp,
    //     state.training_program_params.mesocycles
    //   );
    //   const testtest = getExercisesForPrioritizedMuscles(test);
    //   const testtesttest = createBlockProgressionForExercisesInPriority(
    //     testtest,
    //     state.training_program_params.microcycles,
    //     state.training_program_params.mesocycles
    //   );

    //   const testtesttesttest = buildMesocycles(
    //     testtesttest,
    //     sp,
    //     state.training_week,
    //     state.training_program_params.mesocycles
    //   );
    //   console.log(
    //     list,
    //     test,
    //     testtest,
    //     testtesttest,
    //     "CHECK THIS OUT IS IT ACCURATE??"
    //   );
    //   return state;
    case "UPDATE_SPLIT_SESSIONS":
      const type = action.payload.split;
      // const total_sessions = state.frequency;
      // const priority = state.muscle_priority_list;

      // const splitSessions = getSplitFromWeights(total_sessions, priority, type);
      // const updatePriorityList = addMesoProgression(
      //   priority,
      //   splitSessions,
      //   state.mrv_breakpoint,
      //   state.mev_breakpoint
      // );

      // return {
      //   ...state,
      //   split_sessions: splitSessions,
      //   muscle_priority_list: updatePriorityList,
      // };

      // TEST: testing new logic format - 12/27/23
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
        [...INITIAL_WEEK],
        state.frequency,
        state.split_sessions
      );
      const updated_training_week = distributeExercisesAmongSplit(
        state.muscle_priority_list,
        state.split_sessions,
        new_training_week
      );

      return {
        ...state,
        training_week: updated_training_week,
      };
    case "GET_TRAINING_BLOCK":
      const l = state.muscle_priority_list;
      const s = state.split_sessions;
      const w = state.training_week;
      const m = state.training_program_params.mesocycles;

      const training_block = buildMesocycles(l, s, w, m);
      console.log(training_block, "HERE WE GO???????");
      return {
        ...state,
        training_block: training_block,
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
