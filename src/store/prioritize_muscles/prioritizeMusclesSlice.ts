import { createSlice } from "@reduxjs/toolkit";
import { DayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { MUSCLE_PRIORITY_LIST } from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/musclePriorityListHandlers";

const prioritizeMusclesSlice = createSlice({
  name: "prioritize_muscles",
  initialState: MUSCLE_PRIORITY_LIST,
  reducers: {},
});

export const {} = prioritizeMusclesSlice.actions;
export default prioritizeMusclesSlice.reducer;

// FREQUENCY: 5
// SPLIT: "OPT"
// MUSCLE_PRIORITIZED: ["back", "delts_side", "triceps"]

// SESSIONS: [full, lower, upper, upper, full]

// Requirements:
// 1. BUILD PROGRESSION OF SETS/REPS/LBS over mesocycles/microcycles.
// 2.
// EXERCISES: []

// MESOCYCLE 1 : MON  |  WED  |  FRI

// MESOCYCLE 2 : MON  |  WED  |  FRI  |  SAT

// MESOCYCLE 3 :       MON       |  TUE  |  WED  |  FRI  |  SAT
// BACK:  ex. 1:  [2, 3, 3, 4],  | []
//        ex. 2:  [3, 4, 4, 5],  | []

// set: set_num: number; reps: number; lbs: number; rir: number

// TOTAL = 5
// SPLIT = "OPT"

// WEEK  | SUN |  MON  |  TUE  |  WED  |  THU  |  FRI  |  SAT
//-----------------------------------------------------------
//       | off | lower | upper |  full |  off  | lower | upper

const SET_EX = [1, 15, 115, 0];
const SET_EX_3 = {
  microcycle_index: 0,
  sets: 3,
  reps: 15,
  lbs: 115,
  rir: 0,
};
type ExerciseSetsMatrixType = {
  mesocycle_index: number;
  sets: Set[];
};

type ProgramExerciseType = {
  id: string;
  name: string;
  muscle: string;
  weightIncrement: number;
  data: {
    movement_type: string;
    requirements: string[];
    region: {
      primary: string;
      secondary: string[];
    };
  };
};

type Set = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  trainingModality: string;
  supersetWith?: Set["id"];
  reps: number;
  lbs: number;
  rir: number;
  isCompleted: boolean;
};

const SET = {
  exerciseId: "exercise-1",
  exerciseName: "squat",
  trainingModality: "straight",
  mesocycle: 0,
  microcycle: 0,
  training_program_id: "tpi-1",
  sets: 3,
  reps: 8,
  lbs: 100,
  isCompleted: false,
};

type ExerciseType = {
  id: string;
  name: string;
  muscle: string;
  weightIncrement: number;
  data: {
    movement_type: string;
    requirements: string[];
    region: {
      primary: string;
      secondary: string[];
    };
  };
};

const Exercise = {
  id: "exercise-1",
  name: "squat",
  supersetWith: null,
};

type SessionClientType = SessionType & {
  getTotalSessionDuration: () => number;
};

type SetNumberType = number;
type RepsType = number;
type LbsType = number;
type RirType = number;
type SetType = [SetNumberType, RepsType, LbsType, RirType];

type SessionExerciseType = {
  id: ExerciseType["id"];
  sets: SetType[];
  rest_between_sets?: number;
};

type MesocycleExercisesType = {
  mesocycle: number;
  exercises: SessionExerciseType[];
};

type SessionType = {
  id: string;
  name: string;
  day: DayType;
  exercises_by_mesocycle: MesocycleExercisesType[];
  duration_variables?: {
    warmup: number;
    rest_between_sets: number;
    superset_rest: number;
    rep: number;
  };
};

const SESSION: SessionType = {
  id: "session-1",
  name: "lower",
  day: "Monday",
  exercises_by_mesocycle: [],
  duration_variables: {
    warmup: 500,
    rest_between_sets: 120,
    superset_rest: 90,
    rep: 2,
  },
};

const MESOCYCLE = {
  id: "mesocycle-1",
  name: "mesocycle-1",
  sessions: [SESSION],
};

const TRAINING_BLOCK = {
  id: "tblock-1",
  name: "block-1",
  details: "",
  mesocycles: [MESOCYCLE, MESOCYCLE, MESOCYCLE],
};

const TRAINING_PROGRAM = {};

const ACTIVE_SESSION = {
  id: "session-1",
  split: "lower",
  day: "Monday",
  trainingProgramId: "tpi-1",
};
