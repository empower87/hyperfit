import { ExerciseType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import {
  VolumeKey,
  VolumeLandmarkType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
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
  meso_details: [],
};

// TODO: using meso_details key, add a starting sets/reps/weight/rir for each mesocycle based on muscle-data.json

export const getTopExercises = (
  group: string,
  key: VolumeKey,
  total: number,
  mesoProgression: number[]
) => {
  const getGroup = getMuscleData(group);
  const getVolume = getGroup[key];
  if (!getVolume.length) return [];
  const getVolumeString =
    getVolume[total - 1] ?? getVolume[getVolume.length - 1];

  const exercises = getGroupList(group);

  let exercise_list: ExerciseType[][] = [];
  let exercises_index = 0;

  let split_key = key.split("_")[0];
  let rank: VolumeLandmarkType =
    split_key === "mrv" ? "MRV" : split_key === "mev" ? "MEV" : "MV";

  let meso_start = 1;
  let meso_count = 1;

  for (let i = 0; i < getVolumeString.length; i++) {
    let split = getVolumeString[i].split("-");

    // NOTE: allows for progressing the mesocycles from 1 to 3 by marking them
    if (meso_count <= mesoProgression[0]) {
      meso_start = 1;
    } else if (
      meso_count > mesoProgression[0] &&
      meso_count <= mesoProgression[1]
    ) {
      meso_start = 2;
    } else {
      meso_start = 3;
    }

    if (exercises[exercises_index]) {
      let exercise_one = {
        ...INITIAL_EXERCISE,
        id: exercises[exercises_index].id,
        exercise: exercises[exercises_index].name,
        group: group,
        rank: rank,
      };

      let exercise_two = {
        ...INITIAL_EXERCISE,
        id: exercises[exercises_index + 1].id,
        exercise: exercises[exercises_index + 1].name,
        group: group,
        rank: rank,
      };

      if (split.length === 2) {
        const getSetsOne = {
          ...exercise_one,
          sets: parseInt(split[0]),
          meso_start: meso_start,
        };
        const getSetsTwo = {
          ...exercise_two,
          sets: parseInt(split[1]),
          meso_start: meso_start,
        };
        exercise_list.push([getSetsOne, getSetsTwo]);
        exercises_index = exercises_index + 2;
        meso_count++;
      } else if (split.length === 1) {
        const getSetsOne = {
          ...exercise_one,
          sets: parseInt(split[0]),
          meso_start: meso_start,
        };
        exercise_list.push([getSetsOne]);
        exercises_index++;
        meso_count++;
      }
    }
  }

  return exercise_list;
};
