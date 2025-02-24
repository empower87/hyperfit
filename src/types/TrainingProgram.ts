import {
  DayType,
  SplitSessionsNameType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

import { Set } from "./Exercise";

type TrainingProgram = {
  id: string;
  user_id: string;
  name?: string;
  training_blocks: string[];
};

type TrainingBlock = {
  id: string;
  user_id: string;
  training_program_id: string;
  name?: string;
  mesocycles: string[];
  prioritized_muscles: string[];
  training_split: {
    name: SplitSessionsNameType;
    sessions: SplitType[];
  };
};

type Mesocycle = {
  id: string;
  name?: string;
  training_block_id: string;
  sessions: Session1[];
};

type Session1 = {
  id: string;
  user_id: string;
  training_program_id: string;
  training_block_id: string;
  mesocycle_id: string;
  name?: string;
  split: SplitType;
  scheduled_day: DayType;
  scheduled_time: Date;
  exercises: ProgramExercise[];
};

type Session2 = {
  id: string;
  user_id: string;
  mesocycle_id: string;
  name?: string;
  split: SplitType;
  scheduled_day: DayType;
  scheduled_time: Date;
  exercises: ProgramExercise[];
};

type ProgramExercise = {
  id: string;
  name: string;
  muscle: string;
  session_id: string;
  sets: Set[];
  training_modality: string;
  superset_with?: string;
};

const exercise: ProgramExercise = {
  id: "exercise_1",
  name: "Bicep Curl",
  muscle: "bicep",
  session_id: "session_1",
  sets: [
    {
      set_num: 1,
      reps: 12,
      weight: 100,
      rir: 3,
      isCompleted: false,
    },
  ],
  training_modality: "straight",
};

const session: Session1 = {
  id: "session_1",
  user_id: "user_1",
  training_program_id: "training_program_1",
  training_block_id: "training_block_1",
  mesocycle_id: "mesocycle_1",
  name: "Block 1 - Mesocycle 1 - Push 1",
  split: "push",
  scheduled_day: "Monday",
  scheduled_time: new Date(),
  exercises: [exercise],
};

const mesocycle: Mesocycle = {
  id: "mesocycle_1",
  name: "Arms Focus Year Block 1 - Mesocycle 1",
  training_block_id: "training_block_1",
  sessions: [session],
};

const trainingBlock: TrainingBlock = {
  id: "training_block_1",
  user_id: "user_1",
  name: "Arms Focus Year Block 1",
  training_program_id: "training_program_1",
  mesocycles: [mesocycle.id],
  prioritized_muscles: [],
  training_split: {
    name: "PPL",
    sessions: ["push", "pull", "legs", "push", "pull"],
  },
};

const trainingProgram: TrainingProgram = {
  id: "training_program_1",
  user_id: "user_1",
  name: "Arms Focus Year",
  training_blocks: [trainingBlock.id],
};
