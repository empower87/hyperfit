import { ExerciseType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
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

type Exercise = {
  id: string;
  name: string;
  rank: number;
  group: string;
  region: string;
  requirements: string[];
  variations: string[];
  tips?: string;
  movement_type?: string;
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

type VolumeKey =
  | "mrv_progression_matrix"
  | "mev_progression_matrix"
  | "mv_progression_matrix";

const INITIAL_EXERCISE: ExerciseType = {
  exercise: "Triceps Extension (cable, single-arm)",
  id: "001_Triceps Extension (cable, single-arm)",
  group: "back",
  rank: "MRV",
  session: 0,
  sets: 2,
  reps: 10,
  weight: 100,
  rir: 3,
  meso_start: 1,
};

export const getTopExercises = (
  group: string,
  key: VolumeKey,
  total: number
) => {
  const getGroup = getMuscleData(group);
  const getVolume = getGroup[key];
  if (!getVolume.length) return [];
  const getVolumeString =
    getVolume[total - 1] ?? getVolume[getVolume.length - 1];

  console.log(getVolumeString, key, total, "OH BOY HERES AN UNDEFINED?");
  const exercises = getGroupList(group);

  let exercise_list: ExerciseType[][] = [];
  let exercises_index = 0;

  let split_key = key.split("_");
  let rank = split_key[0].toUpperCase();

  for (let i = 0; i < getVolumeString.length; i++) {
    let split = getVolumeString[i].split("-");

    if (exercises[exercises_index]) {
      let exercise_one = {
        ...INITIAL_EXERCISE,
        id: exercises[exercises_index].id,
        exercise: exercises[exercises_index].name,
        group: group,
        rank: rank as "MEV" | "MRV" | "MV",
      };

      let exercise_two = {
        ...INITIAL_EXERCISE,
        id: exercises[exercises_index + 1].id,
        exercise: exercises[exercises_index + 1].name,
        group: group,
        rank: rank as "MEV" | "MRV" | "MV",
      };

      if (split.length === 2) {
        const getSetsOne = { ...exercise_one, sets: parseInt(split[0]) };
        const getSetsTwo = { ...exercise_two, sets: parseInt(split[1]) };
        exercise_list.push([getSetsOne, getSetsTwo]);
        exercises_index = exercises_index + 2;
      } else if (split.length === 1) {
        const getSetsOne = { ...exercise_one, sets: parseInt(split[0]) };
        exercise_list.push([getSetsOne]);
        exercises_index++;
      }
    }
  }

  return exercise_list;
};
