import {
  MRV_PROGRESSION_MATRIX_ONE,
  MRV_PROGRESSION_MATRIX_TWO_INIT,
  getSetProgressionMatrix_mev_mv,
  getVolumeProgressionMatrix,
} from "~/constants/volumeProgressionMatrices";
import { MuscleType } from "~/constants/workoutSplits";
import {
  ExerciseType,
  SetProgressionType,
  type VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
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
} from "../../../../constants/exercises/index";
import { getMuscleData } from "../../../../utils/getMuscleData";

// back
// regions: "lat" | "upper-back" | "upper-trap"

// TIME EFFICIENCY: barbell

// CRITERION    |          0           |    1        |    2     |        3         |       4          |        5        |
//=====================================================================================================================
// STABILITY:   | bosu ball bent rows  | barbell row | pull-ups | seated cable row | chest-sup db row | iso-lateral row
// LOADABILITY: | pull-up (bodyweight) | dumbbell    | cable    |    barbell       |                  |
// TARGETED:    |                      |             |          |                  |                  |
//=====================================================================================================================
// CHALLENGING: | seated cable row     | cbl pullovr | pulldown |   db pullover    |                  |
// LENGTHENED:  |
// PARTIALS  :  |       false          |   true      |          |                  |                  |
// FATIGUE:     |     standing         |  lat raise  | iso stf  | most back stuff  |   bench press    |  barbell squats

// STABILITY:
// stability 5 = range of motion locked in and body locked in: IE: Smith Machine JM Press
// stability 4 = body locked in: IE JM Press
// stability 3 = body locked in, but movement itself isn't stable: IE: Dumbbell Bench Press
// stability 2 = Free body but movement itself is stable: IE: Standing Overhead Extensions EZ-Bar
// stability 1 = Free body and movement instability: IE: Standing Overhead Extensions Dumbbells
// stability 0 = above on a bosu ball..
// NOTE: DONE AS OF 3/2/2024

export type Exercise = {
  id: string;
  name: string;
  rank: number;
  group: string;
  region: string;
  requirements: string[];
  variations: string[];
  tips?: string;
  limbs_involved?: string;
  movement_type: string;
  hypertrophy_criteria: {
    target_function: number;
    stability: number;
    limiting_factor: number;
    stretch: {
      lengthened: number;
      challenging: number;
      partial_friendly: number;
    };
    time_efficiency: number;
    loadability: number;
    fatigue: number;
  };
};
export type HypertrophyCriteriaKey = keyof Exercise["hypertrophy_criteria"];

const CRITERIA_WEIGHTS = {
  stretch: {
    lengthened: 1.9,
    challenging: 1.9,
    partial_friendly: 1.1,
  },
  target_function: 1.7,
  stability: 1.6,
  limiting_factor: 1.5,
  fatigue: 1.3,
  time_efficiency: 1.2,
  loadability: 1.1,
} as const;

const getWeightedCriteriaTotal = (exercise: Exercise) => {
  const hypertrophy_criteria = exercise.hypertrophy_criteria;
  let total = 0;

  for (const criteria in hypertrophy_criteria) {
    const key = criteria as HypertrophyCriteriaKey;
    if (key === "stretch") {
      total =
        total +
        hypertrophy_criteria["stretch"]["lengthened"] *
          CRITERIA_WEIGHTS["stretch"]["lengthened"];
      total =
        total +
        hypertrophy_criteria["stretch"]["challenging"] *
          CRITERIA_WEIGHTS["stretch"]["challenging"];
      total =
        total +
        hypertrophy_criteria["stretch"]["partial_friendly"] *
          CRITERIA_WEIGHTS["stretch"]["partial_friendly"];
    } else {
      total += hypertrophy_criteria[key] * CRITERIA_WEIGHTS[key];
    }
  }

  return Math.round(total);
};

export const getGroupList = (group: string): Exercise[] => {
  let exercises: Exercise[] = [];
  switch (group) {
    case "back":
      exercises = BACK_EXERCISES;
      break;
    case "delts_side":
      exercises = DELTS_SIDE_EXERCISES;
      break;
    case "delts_front":
      exercises = DELTS_FRONT_EXERCISES;
      break;
    case "delts_rear":
      exercises = DELTS_REAR_EXERCISES;
      break;
    case "chest":
      exercises = CHEST_EXERCISES;
      break;
    case "triceps":
      exercises = TRICEPS_EXERCISES;
      break;
    case "biceps":
      exercises = BICEPS_EXERCISES;
      break;
    case "forearms":
      exercises = FOREARMS_EXERCISES;
      break;
    case "traps":
      exercises = TRAPS_EXERCISES;
      break;
    case "quads":
      exercises = QUADS_EXERCISES;
      break;
    case "hamstrings":
      exercises = HAMSTRINGS_EXERCISES;
      break;
    case "glutes":
      exercises = GLUTES_EXERCISES;
      break;
    case "calves":
      exercises = CALVES_EXERCISES;
      break;
    case "abs":
      exercises = ABS_EXERCISES;
      break;
    default:
      break;
  }

  const rankedExercises = exercises.map((each) => ({
    ...each,
    rank: getWeightedCriteriaTotal(each),
  }));
  return rankedExercises.sort((a, b) => b.rank - a.rank);
};

// get init
const findLeastSetsIndex = (sessionSets: number[]) => {
  let index = 0;
  for (let i = 0; i < sessionSets.length; i++) {
    index = sessionSets[i] < sessionSets[index] ? i : index;
  }
  return index;
};

const disperseAddedSets = (addedSets: number[], schema: number[][]) => {
  const copiedSchema = structuredClone(schema);

  for (let i = 0; i < addedSets.length; i++) {
    let addCounter = addedSets[i];

    for (let j = 0; j < copiedSchema.length; j++) {
      const index = findLeastSetsIndex(copiedSchema[j]);
      if (addCounter > 0) {
        copiedSchema[j][index] = copiedSchema[j][index] + 1;
        addCounter--;
      }
    }
  }
  return copiedSchema;
};

export const initializeSetProgression = (
  progression: number[],
  targetSets: number,
  muscle: MuscleType
) => {
  const mesoProgression: number[][][] = [];

  let counter: number[] = [];
  for (let i = 0; i < progression.length; i++) {
    const meso = progression[i];
    const schemaa = MRV_PROGRESSION_MATRIX_TWO_INIT[meso - 1];
    const currentSchema = disperseAddedSets(counter, schemaa);
    mesoProgression.push(currentSchema);
    counter.push(meso);
  }

  return mesoProgression;
};

export const INITIAL_EXERCISE: ExerciseType = {
  name: "Triceps Extension (cable, single-arm)",
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
  initialSetsPerMeso: [],
  setProgressionSchema: [],
  data: {
    movement_type: "isolation",
    requirements: ["cable"],
  },
};

const getValidFrequencyIndex_mev_mv = (selectedFrequency: number) => {
  switch (true) {
    case selectedFrequency > 1:
      return 1;
    case selectedFrequency === 1:
      return 0;
    default:
      return null;
  }
};

const getExerciseMatrix = (
  rank: VolumeLandmarkType,
  exercisesPerSessionSchema: number
) => {
  if (rank === "MRV") {
    const matrix = getVolumeProgressionMatrix(rank, exercisesPerSessionSchema);
    return matrix;
  } else {
    // const index = getValidFrequencyIndex_mev_mv(selectedFrequency);
    // if (index == null) return [];
    const matrix = getSetProgressionMatrix_mev_mv(exercisesPerSessionSchema);
    return matrix;
  }
};

// frequencyProgression changes..
//
export const updateInitialSetsForExercises = (
  rank: VolumeLandmarkType,
  rankData: number,
  exercisesPerSessionSchema: number,
  exercises: ExerciseType[][],
  freqProgIndex: number, // 1
  freqProg: number[] // 2, 3 4
) => {
  let exercises_matrix: number[][] = [];
  let freq_index = freqProg[freqProgIndex] - 1; // 0 1 2
  let variable = exercisesPerSessionSchema;

  if (rank !== "MRV") {
    const index = getValidFrequencyIndex_mev_mv(freqProg[freq_index]);
    variable = rankData;
    freq_index = index == null ? -1 : index;
  }

  const matrix = getExerciseMatrix(rank, variable);
  exercises_matrix = matrix[freq_index];

  const copied_exercises = structuredClone(exercises);

  for (let i = 0; i < copied_exercises.length; i++) {
    const session_exercises = copied_exercises[i];

    for (let j = 0; j < session_exercises.length; j++) {
      const exercise = session_exercises[j];

      const setsAndSchemas = getSetsAndSchema(
        exercises_matrix,
        freqProgIndex,
        j
      );
      const validSets =
        i > freqProg[freqProgIndex] - 1 ? 0 : setsAndSchemas.sets;
      copied_exercises[i][j].initialSetsPerMeso[freqProgIndex] = validSets;

      console.log(
        exercise,
        setsAndSchemas,
        copied_exercises,
        freqProg,
        freqProgIndex,
        exercises_matrix,
        "WTF????"
      );
    }
  }
  return copied_exercises;
};
// const getExerciseMatrix = (
//   selectedFrequency: number,
//   rank: VolumeLandmarkType,
//   exercisesPerSessionSchema: number
// ) => {
//   if (rank === "MRV") {
//     const index = selectedFrequency - 1;
//     const matrix = getVolumeProgressionMatrix(rank, exercisesPerSessionSchema);
//     return matrix[index];
//   } else {
//     const index = getValidFrequencyIndex_mev_mv(selectedFrequency);
//     if (index == null) return [];
//     const matrix = getSetProgressionMatrix_mev_mv(exercisesPerSessionSchema);
//     return matrix[index];
//   }
// };
export const getSetProgressionOnFrequencyChange = (
  frequencyProgression: number[],
  matrix: number[][][],
  rank: VolumeLandmarkType,
  exercises: ExerciseType[][]
) => {
  const updated_exercises = structuredClone(exercises);
  for (let i = 0; i < updated_exercises.length; i++) {
    const session = updated_exercises[i];

    for (let j = 0; j < session.length; j++) {
      let sets = [];
      let schemas: SetProgressionType[] = [];

      if (rank === "MEV" || rank === "MV") {
        for (let g = 0; g < frequencyProgression.length; g++) {
          sets.push(2); /// TEST TEST OH BOY HARD CODE
          schemas.push("NO_ADD");
        }
      } else {
        const toAdd = initializeSetsPerMeso(frequencyProgression, matrix, j, i);
        sets = toAdd.sets;
        schemas = toAdd.schemas;
      }
      session[j].initialSetsPerMeso = sets;
      session[j].setProgressionSchema = schemas;
    }
    updated_exercises[i] = session;
  }
  return updated_exercises;
};

export const getTotalExercisesForMuscleGroup = (
  group: MuscleType,
  rank: VolumeLandmarkType,
  frequencyProgression: number[],
  exercisesPerSessionSchema: number
) => {
  const total_frequency = frequencyProgression[frequencyProgression.length - 1];
  const muscleData = getMuscleData(group);

  const allExercises = getGroupList(group);

  const exercise_list: ExerciseType[][] = [];
  let exercises_index = 0;

  let matrix: number[][][] = [];
  let exercises_matrix: number[][] = [];
  // const matrix = getVolumeProgressionMatrix(rank, exercisesPerSessionSchema);

  let freq_index = total_frequency - 1;
  let variable = exercisesPerSessionSchema;
  if (rank !== "MRV") {
    const index = getValidFrequencyIndex_mev_mv(total_frequency);
    if (muscleData[rank] === 0 || index == null) return exercise_list;
    variable = muscleData[rank];
    freq_index = index;
  }
  matrix = getExerciseMatrix(rank, variable);
  exercises_matrix = matrix[freq_index];

  if (!exercises_matrix) return exercise_list;

  for (let i = 0; i < exercises_matrix.length; i++) {
    const session = exercises_matrix[i];
    const session_exercises: ExerciseType[] = [];

    for (let j = 0; j < session.length; j++) {
      if (session[j] === 0) continue;
      if (!allExercises[exercises_index]) {
        exercises_index = 0;
      }

      const exercise = {
        ...INITIAL_EXERCISE,
        id: `${allExercises[exercises_index].id}_${exercises_index}`,
        name: allExercises[exercises_index].name,
        muscle: group,
        rank: rank,
        data: {
          movement_type: allExercises[exercises_index].movement_type,
          requirements: allExercises[exercises_index].requirements,
        },
      };

      for (let k = 0; k < frequencyProgression.length; k++) {
        const setsAndSchemas = getSetsAndSchema(exercises_matrix, i, j);
      }
      // Initializes the set progression schema and initial sets per meso
      let sets = [];
      let schemas: SetProgressionType[] = [];

      if (rank === "MEV" || rank === "MV") {
        for (let g = 0; g < frequencyProgression.length; g++) {
          sets.push(session[j]);
          schemas.push("NO_ADD");
        }
      } else {
        const toAdd = initializeSetsPerMeso(frequencyProgression, matrix, i, j);
        sets = toAdd.sets;
        schemas = toAdd.schemas;
      }

      exercise.initialSetsPerMeso = sets;
      exercise.setProgressionSchema = schemas;

      session_exercises.push(exercise);
      exercises_index++;
    }
    exercise_list.push(session_exercises);
  }
  return exercise_list;
};

// DELOAD NOTE
// deload should be implemented on 3 weeks of hard training
// otherwise should be around 4 weeks

// NOTE: May need to experiment with a more algorithmic logic to create these values then hard coding
//       these cases

const initializeSetsPerMeso_mev_mv = (
  target: number,
  frequencyProgression: number[]
) => {
  const total_frequency = frequencyProgression[frequencyProgression.length - 1];

  switch (target) {
    case 2:
      return [[2]];
    case 4:
      if (total_frequency === 2) {
        return [[2], [2]];
      } else {
        return [[2, 2]];
      }
    case 6:
      if (total_frequency === 2) {
        return [[3], [3]];
      } else {
        return [[3, 3]];
      }
    case 8:
      if (total_frequency === 2) {
        return [
          [2, 2],
          [2, 2],
        ];
      } else {
        return [[3, 3]];
      }
    case 10:
      if (total_frequency === 2) {
        return [
          [3, 2],
          [3, 2],
        ];
      } else {
        return [[4, 3]];
      }
    default:
      return [[]];
  }
};

const getProgressionByMeso = (
  targetFrequency: number,
  matrix: number[][][]
) => {
  return matrix[targetFrequency];
};

const getSetsAndSchema = (
  matrix: number[][],
  freqIndex: number,
  exerciseIndex: number
) => {
  if (!matrix[freqIndex] || !matrix[freqIndex][exerciseIndex]) {
    console.log(
      matrix,
      freqIndex,
      exerciseIndex,
      "ERROR: matrix does not contain these coords"
    );
  }

  return {
    sets: matrix[freqIndex][exerciseIndex],
    schema: "ADD_ONE_PER_MICROCYCLE",
  };
};

const initializeSetsPerMeso = (
  frequencyProgression: number[],
  matrix: number[][][],
  sessionIndex: number,
  exerciseIndex: number
) => {
  const setsToAdd = [];
  const schemasToAdd: SetProgressionType[] = [];
  for (let m = 0; m < frequencyProgression.length; m++) {
    const currentMeso = matrix[frequencyProgression[m] - 1];
    const currentSession = currentMeso[sessionIndex];
    const currentSet =
      currentSession && currentSession[exerciseIndex]
        ? currentSession[exerciseIndex]
        : 0;

    setsToAdd.push(currentSet);
    schemasToAdd.push("ADD_ONE_PER_MICROCYCLE");
  }
  return {
    sets: setsToAdd,
    schemas: schemasToAdd,
  };
};

export const initializeNewExerciseSetsPerMeso = (
  frequencyProgression: number[],
  sessionIndex: number
) => {
  const setsToAdd = [];
  const schemasToAdd: SetProgressionType[] = [];

  const matrix = [...MRV_PROGRESSION_MATRIX_ONE];
  for (let i = 0; i < frequencyProgression.length; i++) {
    const currentMeso = frequencyProgression[i];
    const set = matrix[frequencyProgression[i] - 1];
    const currentSet = set[sessionIndex] ? set[sessionIndex][0] : 2;

    if (sessionIndex + 1 <= currentMeso) {
      setsToAdd.push(currentSet);
      schemasToAdd.push("FLAT_ADD");
    } else {
      setsToAdd.push(0);
      schemasToAdd.push("NO_ADD");
    }
  }
  return {
    sets: setsToAdd,
    schemas: schemasToAdd,
  };
};

const getMevMvIncrement = (
  initialSet: number,
  microcycles: number,
  target: number
) => {
  const setsToProgress = target - initialSet;
  const increment = setsToProgress / microcycles - 1;

  return increment;
};