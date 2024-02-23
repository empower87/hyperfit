import { getVolumeProgressionMatrix } from "~/constants/volumeProgressionMatrices";
import { MuscleType } from "~/constants/workoutSplits";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import {
  ABS_EXERCISES,
  BACK_EXERCISES,
  BICEPS_EXERCISES,
  CALVES_EXERCISES,
  CHEST_EXERCISES,
  DELTS_FRONT_EXERCISES,
  DELTS_REAR_EXERCISES,
  DELTS_SIDE_EXERCISES,
  FOREARMS_EXERCISES,
  GLUTES_EXERCISES,
  HAMSTRINGS_EXERCISES,
  QUADS_EXERCISES,
  TRAPS_EXERCISES,
  TRICEPS_EXERCISES,
} from "../constants/exercises/index";
import { getMuscleData } from "./getMuscleData";

// back
// regions: "lat" | "upper-back" | "upper-trap"

// TIME EFFICIENCY: barbell
export type Exercise = {
  id: string;
  name: string;
  rank: number;
  group: string;
  region: string;
  requirements: string[];
  variations: string[];
  tips?: string;
  movement_type?: string;
  hypertrophy_criteria?: {
    target_function: number;
    stability: number;
    limiting_factor: number;
    stretch: {
      lengthened: boolean;
      challenging: boolean;
      partial_friendly: boolean;
    };
    time_efficiency: number;
    loadability: number;
  };
};
export type ExerciseTest = {
  id: string;
  name: string;
  rank: number;
  group: string;
  region: string;
  requirements: string[];
  variations: string[];
  tips?: string;
  movement_type?: string;
  hypertrophy_criteria: {
    target_function: number;
    stability: number;
    limiting_factor: number;
    stretch: {
      lengthened: boolean;
      challenging: boolean;
      partial_friendly: boolean;
    };
    time_efficiency: number;
    loadability: number;
  };
};
export const getGroupList = (group: string): Exercise[] => {
  switch (group) {
    case "back":
      return BACK_EXERCISES;
    case "delts_side":
      return DELTS_SIDE_EXERCISES;
    case "delts_front":
      return DELTS_FRONT_EXERCISES;
    case "delts_rear":
      return DELTS_REAR_EXERCISES;
    case "chest":
      return CHEST_EXERCISES;
    case "triceps":
      return TRICEPS_EXERCISES;
    case "biceps":
      return BICEPS_EXERCISES;
    case "forearms":
      return FOREARMS_EXERCISES;
    case "traps":
      return TRAPS_EXERCISES;
    case "quads":
      return QUADS_EXERCISES;
    case "hamstrings":
      return HAMSTRINGS_EXERCISES;
    case "glutes":
      return GLUTES_EXERCISES;
    case "calves":
      return CALVES_EXERCISES;
    case "abs":
      return ABS_EXERCISES;
    default:
      return BACK_EXERCISES;
  }
};

const INITIAL_EXERCISE: ExerciseType = {
  exercise: "Triceps Extension (cable, single-arm)",
  id: "001_Triceps Extension (cable, single-arm)",
  muscle: "back",
  rank: "MRV",
  session: 0,
  sets: 2,
  reps: 10,
  weight: 0,
  rir: 3,
  weightIncrement: 5,
  trainingModality: "straight",
  mesocycle_progression: [],
  supersetWith: null,
};

export const getTotalExercisesForMuscleGroup = (
  group: MuscleType,
  rank: VolumeLandmarkType,
  frequencyProgression: number[],
  exercisesPerSessionSchema: number
) => {
  let total_frequency = frequencyProgression[frequencyProgression.length - 1];
  const muscleData = getMuscleData(group);

  const exercises = getGroupList(group);

  let exercise_list: ExerciseType[][] = [];
  let exercises_index = 0;

  // Note: below guard clause checks to see if MEV or MV volume is 0
  //       thus no need for exercises for this muscle group.
  if (muscleData[rank] === 0) return exercise_list;
  const matrix = getVolumeProgressionMatrix(rank, exercisesPerSessionSchema);

  const final_meso_frequency = matrix[total_frequency - 1];

  if (!final_meso_frequency) {
    return exercise_list;
  }

  for (let i = 0; i < final_meso_frequency.length; i++) {
    const session = final_meso_frequency[i];

    let session_exercises: ExerciseType[] = [];
    for (let j = 0; j < session.length; j++) {
      if (session[j] === 0) continue;
      if (!exercises[exercises_index]) {
        exercises_index = 0;
      }

      if (exercises[exercises_index]) {
        let exercise = {
          ...INITIAL_EXERCISE,
          id: exercises[exercises_index].id,
          exercise: exercises[exercises_index].name,
          muscle: group,
          rank: rank,
          meso_progression: frequencyProgression,
        };
        session_exercises.push(exercise);
        exercises_index++;
      }
    }
    exercise_list.push(session_exercises);
  }
  return exercise_list;
};
