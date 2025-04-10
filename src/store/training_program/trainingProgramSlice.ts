import {
  DayType,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { MUSCLE_PRIORITY_LIST } from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/musclePriorityListHandlers";

const INITIAL_TRAINING_WEEK: TrainingWeekType = [
  {
    id: "day-1",
    day: "Sunday",
    sessions: [],
  },
  {
    id: "day-2",
    day: "Monday",
    sessions: [],
  },
  {
    id: "day-3",
    day: "Tuesday",
    sessions: [],
  },
  {
    id: "day-4",
    day: "Wednesday",
    sessions: [],
  },
  {
    id: "day-5",
    day: "Thursday",
    sessions: [],
  },
  {
    id: "day-6",
    day: "Friday",
    sessions: [],
  },
  {
    id: "day-7",
    day: "Saturday",
    sessions: [],
  },
];

type TrainingProgramType = {
  muscles: MusclePriorityType[];
  sessions: {
    [key: string]: number;
  };
  training_week: TrainingWeekType;
};

const TRAINING_PROGRAM: TrainingProgramType = {
  muscles: MUSCLE_PRIORITY_LIST,
  sessions: {},
  training_week: [...INITIAL_TRAINING_WEEK],
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

type SetNumberType = number;
type RepsType = number;
type LbsType = number;
type RirType = number;
type SetType = [SetNumberType, RepsType, LbsType, RirType];

// NOTE: To get this required data, will need...
// 1. Space out split sessions across the week. Give enough rest between sessions for the same muscle.
// 2. Get Exercises from .json file based on muscle's priority and sessions available for that muscle.
// 3. Sort Exercises
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
  split: string;
  day: DayType;
  exercises_by_mesocycle: MesocycleExercisesType[];
  duration_variables?: {
    warmup: number;
    rest_between_sets: number;
    superset_rest: number;
    rep: number;
  };
};

type SessionClientType = SessionType & {
  getTotalSessionDuration: () => number;
};

type TrainingDayType = {
  id: string;
  day: DayType;
  sessions: SessionType[];
};

type TrainingWeekType = TrainingDayType[];

// PROGRAM STRUCTURE:
// ==================

// PROGRAM CONIGURATION:
// =====================
// 1. Prioritize Muscles.
// 2. Choose Frequency.
// 3. Choose Split.
// 4. Prioritize Muscles. Adjust frequency range and get target frequency.
// 5. Split Sessions. Distribute Splits into sessions by frequency and muscles.

// TRAINING PROGRAM:
// =================
// 1. Get Exercises for each muscle based on frequency and priority.
// 2. Define Progression matrix for each exercise.
// 3. Create a training week based on the split and sessions.
// 4. Fill training week with exercises.