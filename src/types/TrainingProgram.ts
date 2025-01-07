import { DayType, ExerciseType, SplitType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { Set } from "./Exercise";


type TrainingProgram = {
  id: string;
  user_id: string
  name?: string;
  training_blocks: string[]
}

type TrainingBlock = {
  id: string;
  user_id: string
  name?: string;
  mesocycles: string[]
  prioritized_muscles: string[],

  created_at: Date;
  updated_at: Date;
}

type Mesocycle = {
  id: string;
  name?: string;
  training_block_id: string;
  sessions: Session[]
}

type Session = {
  id: string;
  user_id: string;
  training_program_id: string;
  training_block_id: string;
  mesocycle_id: string;
  split: SplitType;
  scheduled_day: DayType;
  scheduled_time: Date;
  exercises: ExerciseType[];
  created_at: Date;
}

type ProgramExercise = {
  id: string;
  name: string;
  muscle: string;
  session_id: string;
  sets: Set[]
  training_modality: string;
  superset_with?: string;
}

const TrainingProgram = {
  id: "training_program_1",
  user_id: "user_1",
  name: "Arms Focus Year",
  training_blocks: [],
  created_at: new Date(),
  updated_at: new Date(),

}