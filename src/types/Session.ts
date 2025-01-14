import {
  ExerciseType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

export type Session = {
  id: string;
  user_id: string;
  training_program_id: string;
  training_block_id: string;
  mesocycle_id: string;
  training_split: SplitType;
  exercises: ExerciseType[];
};
