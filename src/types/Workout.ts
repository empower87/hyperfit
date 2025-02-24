import { MuscleType } from "~/constants/workoutSplits";
import {
  DayType,
  ExerciseType,
  SessionSplitType,
  VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

type ExerciseDataType = {
  movement_type: string;
  requirements: string[];
  region: {
    primary: string;
    secondary: string[];
  };
};
const EXERCISE_TRAINING_MODALITIES = [
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

type SetProgressionType =
  | "ADD_ONE"
  | "ADD_ONE_ODD"
  | "FLAT_ADD"
  | "NO_ADD"
  | "ADD_ONE_PER_MICROCYCLE"
  | "ADD_MANY_PER_MICROCYCLE";
type ExerciseTrainingModality = (typeof EXERCISE_TRAINING_MODALITIES)[number];
type FrequencyProgressionType = number[];
type Frequency = FrequencyProgressionType[number];
type InitialSets = {
  [key: Frequency]: number;
};
type ExerciseMesocycleProgressionType = {
  week: number;
  sets: number;
  reps: number;
  weight: number;
  rir: number;
};

type SetsOverMesocycle = number[];

type Set = {
  set_num: number;
  exercise_id: string;
  reps: number;
  weight: number;
  rir: number;
};

type ProgramExerciseType = {
  id: string;
  exercise_id: string;
  name: string;
  alt_name?: string;
  muscle: MuscleType;
  priority_rank: VolumeLandmarkType;
  progression: {
    training_block_id: string;
    sets: SetsOverMesocycle[];
  };

  session: number;
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
  initialSets?: InitialSets;
};

type ExerciseProgression = {
  id: string;
  exercise_id: string;
};

type Workout = {
  id: string;
  name?: string;
  exercises: ExerciseType[];
  program: {
    training_block_id: string;
    current_progress: {
      cur_session_id: number;
      cur_mesocycle: number;
      cur_microcycle: number;
    };
    changes: {};
  };
  started_at: Date;
  completed_at: Date;
  updated_at: Date;
  rest_periods: number[];
};

type TrainingDay = {
  day: DayType;
  isTrainingDay: boolean;
  sessions: {
    id: string;
    split: SessionSplitType;
    exercises: [MuscleType, string][];
  }[];
};

type TrainingWeek = TrainingDay[];

type TrainingBlock = {
  id: string;
  name?: string;
  created_at: string;
  updated_at: string;
};

type UserTrainingBlock = {
  id: string;
  name?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  prev_tblock_ids: string[];
};
