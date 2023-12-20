import { getVolumeProgressionMatrix } from "~/constants/volumeProgressionMatrices";
import {
  ExerciseDetails,
  ExerciseType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import {
  VolumeKey,
  VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
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

const INITIAL_DETAILS: ExerciseDetails = {
  sets: 2,
  reps: 10,
  weight: 100,
  rir: 3,
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
  meso_progression: [0, 0, 0],
  meso_details: [null, null, null],
  block_progression_matrix: [[], [], []],
};

const getMesoFrequency = (
  one: number | null,
  two: number | null,
  three: number | null
) => {
  let weight = 100;
  let _one = one ? { ...INITIAL_DETAILS, sets: one, weight: weight } : null;
  let _two = two ? { ...INITIAL_DETAILS, sets: two, weight: weight + 5 } : null;
  let _three = three
    ? { ...INITIAL_DETAILS, sets: three, weight: weight + 10 }
    : null;
  return [_one, _two, _three];
};

// TODO: using meso_details key, add a starting sets/reps/weight/rir for each mesocycle based on muscle-data.json
export const getTopExercises = (
  group: string,
  key: VolumeKey,
  mesoProgression: number[]
) => {
  const getGroup = getMuscleData(group);
  const getVolume = getGroup[key];

  if (!getVolume.length) return [];

  const volume_meso_one = getVolume[mesoProgression[0] - 1] ?? 0;
  const volume_meso_two = getVolume[mesoProgression[1] - 1] ?? 0;
  const volume_meso_three =
    getVolume[mesoProgression[2] - 1] ?? getVolume[getVolume.length - 1];

  const exercises = getGroupList(group);

  let exercise_list: ExerciseType[][] = [];
  let exercises_index = 0;

  let rank: VolumeLandmarkType =
    key === "mrv_progression_matrix"
      ? "MRV"
      : key === "mev_progression_matrix"
      ? "MEV"
      : "MV";

  for (let i = 0; i < volume_meso_three.length; i++) {
    console.log(
      volume_meso_one,
      volume_meso_two,
      mesoProgression,
      key,
      group,
      "WHAT IS GOING ON HERE???"
    );
    let split_three = volume_meso_three[i].split("-");

    let split_two = volume_meso_two[i] ? volume_meso_two[i].split("-") : [];
    let split_one = volume_meso_one[i] ? volume_meso_one[i].split("-") : [];

    let meso_details_one = [];
    let meso_details_two = [];

    // NOTE: basically to prevent the fact that if there are less exercises than the amount of
    // exercises required for a mesocycle.
    // TODO: Need to fix so as to add different modality for exercise that's already being used
    // to prevent multiple instances of an exercise through-out.
    if (!exercises[exercises_index]) {
      exercises_index = 0;
    }

    if (exercises[exercises_index]) {
      const exercise_one_set_num =
        split_one.length && split_one[0] ? parseInt(split_one[0]) : null;
      const exercise_two_set_num = split_two[0] ? parseInt(split_two[0]) : null;
      const exercise_three_set_num = split_three[0]
        ? parseInt(split_three[0])
        : null;
      meso_details_one = getMesoFrequency(
        exercise_one_set_num,
        exercise_two_set_num,
        exercise_three_set_num
      );

      let exercise_one = {
        ...INITIAL_EXERCISE,
        id: exercises[exercises_index].id,
        exercise: exercises[exercises_index].name,
        group: group,
        rank: rank,
        meso_progression: mesoProgression,
        meso_details: meso_details_one,
      };

      if (split_three.length === 2) {
        const exercise_two_one_set_num =
          split_one.length && split_one[1] ? parseInt(split_one[1]) : null;
        const exercise_two_two_set_num =
          split_two.length && split_two[1] ? parseInt(split_two[1]) : null;
        const exercise_two_three_set_num =
          split_three.length && split_three[1]
            ? parseInt(split_three[1])
            : null;

        meso_details_two = getMesoFrequency(
          exercise_two_one_set_num,
          exercise_two_two_set_num,
          exercise_two_three_set_num
        );

        let exercise_two = {
          ...INITIAL_EXERCISE,
          id: exercises[exercises_index + 1].id,
          exercise: exercises[exercises_index + 1].name,
          group: group,
          rank: rank,
          meso_progression: mesoProgression,
          meso_details: meso_details_two,
        };

        const getSetsOne = {
          ...exercise_one,
          sets: parseInt(split_three[0]),
        };
        const getSetsTwo = {
          ...exercise_two,
          sets: parseInt(split_three[1]),
        };

        exercise_list.push([getSetsOne, getSetsTwo]);
        exercises_index = exercises_index + 2;
      } else if (split_three.length === 1) {
        const getSetsOne = {
          ...exercise_one,
          sets: parseInt(split_three[0]),
        };
        exercise_list.push([getSetsOne]);
        exercises_index++;
      }
    }
  }

  return exercise_list;
};

export const getTotalExercisesForMuscleGroup = (
  group: string,
  rank: VolumeLandmarkType,
  frequencyProgression: number[],
  exercisesPerSessionSchema: number
) => {
  let total_frequency = frequencyProgression[frequencyProgression.length - 1];

  const exercises = getGroupList(group);

  let exercise_list: ExerciseType[] = [];
  let exercises_index = 0;

  const matrix = getVolumeProgressionMatrix(rank, exercisesPerSessionSchema);

  const final_meso_frequency = matrix[total_frequency - 1] ?? matrix[0];

  for (let i = 0; i < final_meso_frequency.length; i++) {
    const session = final_meso_frequency[i];

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
          group: group,
          rank: rank,
          meso_progression: frequencyProgression,
        };
        exercise_list.push(exercise);
        exercises_index++;
      }
    }
  }
  return exercise_list;
};

export const getTotalExercisesForMuscleGroupTEST = (
  group: string,
  rank: VolumeLandmarkType,
  frequencyProgression: number[],
  exercisesPerSessionSchema: number
) => {
  let total_frequency = frequencyProgression[frequencyProgression.length - 1];

  const exercises = getGroupList(group);

  let exercise_list: ExerciseType[][] = [];
  let exercises_index = 0;

  const matrix = getVolumeProgressionMatrix(rank, exercisesPerSessionSchema);

  const final_meso_frequency = matrix[total_frequency - 1] ?? matrix[0];

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
          group: group,
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
