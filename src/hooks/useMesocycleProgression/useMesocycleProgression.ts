import { getMuscleData } from "~/utils/getMuscleData";
import {
  MusclePriorityType,
  TrainingDayType,
} from "../useTrainingProgram/reducer/trainingProgramReducer";

const INITIAL_STATE_MESOCYCLE = {
  total_microcycles: 4,
  total_mesocycles: 3,
  resensitization: true,
  mesocycles: [],
};

const hmmm = (
  frequencyProgression: number[],
  exercisesPerSessionSchema: number,
  total_microcycles: number,
  total_mesocycles: number,
  muscle_priority_list: MusclePriorityType[],
  training_week: TrainingDayType[]
) => {
  let mesocyles = [];
};

const initExerciseProgression = (
  muscle: string,
  total_frequency: number,
  exerciseSession: number,
  total_microcycles: number,
  total_mesocycles: number,
  deload: boolean
) => {
  const muscleData = getMuscleData(muscle);
  let progressionKey = total_frequency - 1;

  const lastMesocycle = muscleData.MRV[progressionKey];
};

// NOTES: These progression matrices will be generic progression templates.
//        Exercises for a muscle group will be determined and ordered by final mesocycle.
//        i.e: 7 total back sessions:
//        [rows, pulldowns, lat prayers, single-arm pulldowns, pullups, seated rows, pullovers]
//        based on this order will determine its progression.
//        i.e: lat prayers are exercise 1 in session 2 of MRV_PROGRESSION_MATRIX_TWO schema.
//        so to initialize it. Pass in mesocycle index (example 3): 1, [2, 1]

// initial set start for each mesocycle
const MRV_PROGRESSION_MATRIX_ONE = [
  [[2]],
  [[3], [3]],
  [[3], [3], [3]],
  [[4], [4], [4], [3]],
  [[5], [5], [5], [4], [3]],
  [[5], [5], [5], [4], [3], [2]],
];

const MRV_PROGRESSION_MATRIX_TWO = [
  [[2, 2]],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [2, 3],
    [2, 3],
    [2, 2],
  ],
  [
    [3, 3],
    [3, 3],
    [2, 3],
    [2, 0],
  ],
  [
    [3, 3],
    [3, 3],
    [3, 3],
    [3, 0],
    [2, 0],
  ],
  [
    [3, 3],
    [3, 3],
    [3, 3],
    [3, 0],
    [2, 0],
    [1, 0],
  ],
];
