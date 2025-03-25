import {
  INITIAL_WEEK,
  MusclePriorityType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { MUSCLE_PRIORITY_LIST } from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/musclePriorityListHandlers";

type TrainingProgramType = {
  muscles: MusclePriorityType[];
  sessions: {
    [key: string]: number;
  };
  training_block: TrainingDayType[][];
};

const TRAINING_PROGRAM: TrainingProgramType = {
  muscles: MUSCLE_PRIORITY_LIST,
  sessions: {},
  training_block: [INITIAL_WEEK],
};
