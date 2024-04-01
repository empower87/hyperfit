const SESSION = "2-6 exercises";
const DAY = "0-2 sessions";
const MICROCYCLE = "1 week";
const MESOCYCLE = "3-12 weeks";
const BLOCK = "1-4 mesocycles";
const MACROCYCLE = "1-4 blocks";

export type TrainingProgramParamsType = {
  sessions_per_day: number;
  days: number;
  microcycles: number;
  mesocycles: number;
  training_blocks: number;
  macrocycles: number;
};

export const INITIAL_TRAINING_PROGRAM_PARAMS: TrainingProgramParamsType = {
  sessions_per_day: 1,
  days: 3,
  microcycles: 4,
  mesocycles: 3,
  training_blocks: 4,
  macrocycles: 4,
};

type Action = {
  type: string;
};

export function trainingProgramSettingsReducer(
  state: TrainingProgramParamsType,
  action: Action
) {
  switch (action.type) {
    case "SET_TRAINING_PROGRAM_PARAMS":
      return {
        ...state,
      };
    case "SET_SESSIONS_PER_DAY":
      return {
        ...state,
      };
    case "SET_DAYS":
      return {
        ...state,
      };
    default:
      return state;
  }
}
