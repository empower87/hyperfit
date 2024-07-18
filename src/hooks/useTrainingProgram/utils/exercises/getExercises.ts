import {
  MRV_PROGRESSION_MATRIX_ONE,
  MRV_PROGRESSION_MATRIX_TWO_INIT,
  getMatrixFnByVolumeLandmark,
  getValidFrequencyIndex_mev_mv,
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

export const updateInitialSetsForExercises = (
  rank: VolumeLandmarkType,
  rankData: number,
  exercisesPerSessionSchema: number,
  exercises: ExerciseType[][],
  targetIndex: number,
  freqProg: number[]
) => {
  let exerciseIndex = freqProg[targetIndex] - 1;

  // const exercises_matrix = getValidatedMatrix(
  //   rank,
  //   rankData,
  //   exercisesPerSessionSchema,
  //   exerciseIndex
  // );
  const getMatrix = getMatrixFnByVolumeLandmark(rank);
  let matrix_index = exercisesPerSessionSchema;

  if (rank !== "MRV") {
    if (rankData === 0) return [];
    matrix_index = rankData;
  }
  const matrix = getMatrix(matrix_index);
  const validIndex = matrixIndexValidator(exerciseIndex, matrix);
  const exercises_matrix = matrix[validIndex];
  const copied_exercises = structuredClone(exercises);

  for (let i = 0; i < copied_exercises.length; i++) {
    const session_exercises = copied_exercises[i];

    for (let j = 0; j < session_exercises.length; j++) {
      const setsAndSchemas = getSetsAndSchema(exercises_matrix, i, j);
      const validSets = i > exerciseIndex ? 0 : setsAndSchemas.sets;
      copied_exercises[i][j].initialSetsPerMeso[targetIndex] = validSets;
    }
  }

  return copied_exercises;
};
const matrixIndexValidator = (index: number, matrix: number[][][]) => {
  const selectedMatrix = matrix[index];
  if (!selectedMatrix) {
    index--;
    return matrixIndexValidator(index, matrix);
  }
  return index;
};

const getValidatedMatrix = (
  rank: VolumeLandmarkType,
  volume: number | number[],
  exercisesPerSessionSchema: number,
  exercise_index: number
) => {
  let variable = exercisesPerSessionSchema;
  const getMatrix = getMatrixFnByVolumeLandmark(rank);
  if (rank !== "MRV") {
    const index = getValidFrequencyIndex_mev_mv(exercise_index);
    if (volume === 0) return [];
    variable = !Array.isArray(volume) ? volume : 0;
    exercise_index = index;
  }
  const matrix = getMatrix(variable);
  return matrix[exercise_index];
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

  let freq_index = total_frequency - 1;

  const getMatrix = getMatrixFnByVolumeLandmark(rank);
  let matrix_index = exercisesPerSessionSchema;

  if (rank !== "MRV") {
    if (muscleData[rank] === 0) return exercise_list;
    matrix_index = muscleData[rank];
  }
  const matrix = getMatrix(matrix_index);
  const validIndex = matrixIndexValidator(freq_index, matrix);
  const exercises_matrix = matrix[validIndex];

  if (!exercises_matrix.length) return exercise_list;

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

      const sets: number[] = [];
      const schemas: SetProgressionType[] = [];
      for (let k = 0; k < frequencyProgression.length; k++) {
        const validIndex = matrixIndexValidator(
          frequencyProgression[k] - 1,
          matrix
        );
        const setsAndSchemas = getSetsAndSchema(matrix[validIndex], i, j);
        const validSets =
          i > frequencyProgression[k] - 1 ? 0 : setsAndSchemas.sets;
        sets.push(validSets);
        schemas.push(setsAndSchemas.schema);
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

const getSetsAndSchema = (
  matrix: number[][],
  freqIndex: number,
  exerciseIndex: number,
  initialSchema?: SetProgressionType
) => {
  let sets = 0;
  if (matrix[freqIndex] && matrix[freqIndex][exerciseIndex]) {
    sets = matrix[freqIndex][exerciseIndex];
  }
  const schema = initialSchema ? initialSchema : "ADD_ONE_PER_MICROCYCLE";
  return {
    sets: sets,
    schema: schema,
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
