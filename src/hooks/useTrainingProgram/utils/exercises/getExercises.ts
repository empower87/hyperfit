import { MuscleType } from "~/constants/workoutSplits";
import {
  ExerciseType,
  MusclePriorityType,
  SetProgressionType,
  type VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import {
  getInitMatrixFnByVolumeLandmark,
  getMatrixFnByVolumeLandmark,
  getValidFrequencyIndex_mev_mv,
} from "~/hooks/useTrainingProgram/utils/exercises/setProgressionMatrices";
import { getUID } from "~/utils/generateUID";
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

export type JSONExercise = {
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
export type HypertrophyCriteriaKey = keyof JSONExercise["hypertrophy_criteria"];

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

const getWeightedCriteriaTotal = (exercise: JSONExercise) => {
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

export const getGroupList = (group: string): JSONExercise[] => {
  let exercises: JSONExercise[] = [];
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
const findGreatestSetsIndex = (sessionSets: number[]) => {
  let index = 0;
  for (let i = 0; i < sessionSets.length; i++) {
    index = sessionSets[i] > sessionSets[index] ? i : index;
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

// exercises: [[ex-1, ex-2], [ex-3, ex-4], [ex-5, ex-6], [ex-7]]
// -------------------------------------------------------------
//    meso 1: [[   2,    2], [   2,    2], [   0,    0], [   0]]
//    meso 3: [[   2,    3], [   2,    3], [   2,    2], [   0]]
//    meso 3: [[   3,    3], [   3,    3], [   3,    2], [   2]]

export const getMatrixIndexCase = (muscle: MusclePriorityType) => {
  switch (muscle.volume.landmark) {
    case "MEV":
    case "MV":
      const data = getMuscleData(muscle.muscle);
      return data[muscle.volume.landmark];
    default:
      return muscle.volume.exercisesPerSessionSchema;
  }
};

const findClosestIndex = (frequency: number, matrix: number[][][]) => {
  let index = 0;
  for (let i = 0; i < matrix.length; i++) {
    const frequencyInSets = matrix[i].length;
    switch (true) {
      case frequencyInSets === frequency:
        return i;
      case frequencyInSets < frequency:
        index = i;
        break;
      default:
        index = 0;
        console.log(
          frequencyInSets,
          frequency,
          matrix[i],
          "HEY WHAT WE DOING HERE?"
        );
    }
  }
  return index;
};

const reduceFrequencyBySelectedMatrixRow = (matrix: number[][]) => {
  let frequency = matrix.length;
  for (let i = 0; i < matrix.length - 1; i++) {
    const index = findGreatestSetsIndex(matrix[i]);
    if (frequency > 0) {
      matrix[i][index]--;
      frequency--;
    }
  }
  return matrix;
};
export const updateSetProgression = (
  frequencyProgression: number[],
  setProgressionMatrix: number[][][]
) => {
  // loop over progression matrix
  // 1. if matrix[i].length is in frequencyProgression > next
  // 2. find closest frequency in frequencyProgression
  // const cloneMatrix = structuredClone(setProgressionMatrix);

  for (let i = 0; i < frequencyProgression.length; i++) {
    const frequency = frequencyProgression[i];

    const closestIndex = findClosestIndex(frequency, setProgressionMatrix);
    // 1. frequency is in matrix and thus no need to do update matrix
    if (setProgressionMatrix[closestIndex].length === frequency) continue;

    const closestProgression = structuredClone(
      setProgressionMatrix[closestIndex]
    );
    const closestFrequency = closestProgression.length;

    if (closestIndex === 0) {
      const reduced = reduceFrequencyBySelectedMatrixRow(closestProgression);
      setProgressionMatrix.unshift(reduced);
    } else {
      closestProgression.push([2]);
      const addProgression = disperseAddedSets(
        [closestFrequency],
        closestProgression
      );
      setProgressionMatrix.splice(closestIndex + 1, 0, addProgression);
    }

    console.log(frequency, closestIndex, setProgressionMatrix, "WHAT IT DO?");
  }
  return setProgressionMatrix;
};

export const initializeSetProgression = (
  rank: VolumeLandmarkType,
  frequencyProgression: number[],
  case_index: number
) => {
  const setProgression: number[][][] = [];
  const getMatrix = getInitMatrixFnByVolumeLandmark(rank);
  const matrix = getMatrix(case_index);

  if (!matrix.length) {
    return frequencyProgression.map((each) =>
      Array.from(Array(each), () => [])
    );
  }

  let counter: number[] = [];
  for (let i = 0; i < frequencyProgression.length; i++) {
    const meso = frequencyProgression[i];
    let currentSchema = matrix[meso - 1];

    if (rank === "MRV") {
      currentSchema = disperseAddedSets(counter, currentSchema);
    }
    setProgression.push(currentSchema);
    counter.push(meso);
  }

  return setProgression;
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

export const updateInitialSetsForExercisesTEST = (
  exercises: ExerciseType[][],
  targetIndex: number,
  newValue: number,
  setProgressionMatrix: number[][][]
) => {
  let newValuesMatrix: number | null = null;
  for (let i = 0; i < setProgressionMatrix.length; i++) {
    if (setProgressionMatrix[i].length === newValue) {
      newValuesMatrix = i;
    }
  }
  // TODO: Add logic to create another progression matrix
  // Note. On incrementing initialSets determine if should update matrix or not. Probably not just initialSets actually.
  if (newValuesMatrix == null) return exercises;

  const copied_exercises = structuredClone(exercises);

  for (let i = 0; i < copied_exercises.length; i++) {
    const session_exercises = copied_exercises[i];
    for (let j = 0; j < session_exercises.length; j++) {
      const newSets =
        setProgressionMatrix[newValuesMatrix][i] &&
        setProgressionMatrix[newValuesMatrix][i][j]
          ? setProgressionMatrix[newValuesMatrix][i][j]
          : 0;
      copied_exercises[i][j].initialSetsPerMeso[targetIndex] = newSets;
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

export const getTotalExercisesFromSetMatrix = (
  muscleGroup: MuscleType,
  volume_landmark: VolumeLandmarkType,
  setProgressionMatrix: number[][][],
  frequencyProgression: number[]
) => {
  const finalProgression =
    setProgressionMatrix[setProgressionMatrix.length - 1];
  const allExercises = getGroupList(muscleGroup);
  const exercise_list: ExerciseType[][] = [];

  let exercises_index = 0;
  for (let i = 0; i < finalProgression.length; i++) {
    const session = finalProgression[i];
    const session_exercises: ExerciseType[] = [];

    for (let j = 0; j < session.length; j++) {
      if (session[j] === 0) continue;
      if (!allExercises[exercises_index]) {
        exercises_index = 0;
      }

      const sets = getSetsFromProgressionMatrix(
        frequencyProgression,
        setProgressionMatrix,
        i,
        j
      );

      const exercise = initNewExercise(
        allExercises[exercises_index],
        volume_landmark,
        sets
      );
      exercise.sets = finalProgression[i][j];
      session_exercises.push(exercise);
      exercises_index++;
    }
    exercise_list.push(session_exercises);
  }
  return exercise_list;
};

const getSetsFromProgressionMatrix = (
  frequencyProgression: number[],
  matrix: number[][][],
  sessionIndex: number,
  exerciseIndex: number
) => {
  const matrixLengths = matrix.map((each) => each.length);
  const sets: number[] = [];
  for (let k = 0; k < frequencyProgression.length; k++) {
    const frequencyIndex = frequencyProgression[k];
    const index = matrixLengths.indexOf(frequencyIndex);

    const row = matrix[index];
    const session =
      row && row[sessionIndex] && row[sessionIndex][exerciseIndex]
        ? matrix[index][sessionIndex][exerciseIndex]
        : 0;

    sets.push(session);
  }
  return sets;
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

      const sets = getSetsFromProgressionMatrix(
        frequencyProgression,
        matrix,
        i,
        j
      );

      const exercise = initNewExercise(
        allExercises[exercises_index],
        rank,
        sets
      );

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

const addSetProgressionMatrixRow = (
  previousRow: number[][],
  addedSession: number[]
) => {
  let setsToAdd = previousRow.length;
  const newRow: number[][] = [];
  for (let i = 0; i < previousRow.length; i++) {
    const session = previousRow[i];
    const index = findLeastSetsIndex(session);
    session[index]++;
    setsToAdd--;
    newRow.push(session);
  }
  newRow.push(addedSession);
  return newRow;
};

export const addNewExerciseSetsToSetProgressionMatrix = (
  frequencyProgression: number[],
  setProgressionMatrix: number[][][],
  exerciseIndex: number
) => {
  let sets = 2;
  // let initialSetsPerMeso = [];

  const matrix = setProgressionMatrix;
  const lastMeso = matrix[matrix.length - 1];
  const isNewSession = lastMeso[exerciseIndex] ? true : false;

  if (!isNewSession) {
    const prevMeso = structuredClone(matrix[matrix.length - 1]);
    const newRow = addSetProgressionMatrixRow(prevMeso, [sets]);
    matrix.push(newRow);
  }

  const initialSetsPerMeso = getSetsFromProgressionMatrix(
    frequencyProgression,
    matrix,
    exerciseIndex,
    0
  );

  return {
    initialSetsPerMeso: initialSetsPerMeso,
    setProgressionMatrix: matrix,
  };
};

export const initNewExercise = (
  exerciseData: JSONExercise,
  volume_landmark: VolumeLandmarkType,
  initalSetsPerMeso: number[]
) => {
  const schemas: SetProgressionType[] = Array.from(initalSetsPerMeso, (e, i) =>
    volume_landmark === "MRV" ? "ADD_ONE_PER_MICROCYCLE" : "NO_ADD"
  );
  const uid = getUID();
  const new_exercise: ExerciseType = {
    ...INITIAL_EXERCISE,
    id: `${exerciseData.id}_${uid}`,
    name: exerciseData.name,
    muscle: exerciseData.group as MuscleType,
    session: 0,
    rank: volume_landmark,
    sets: 2,
    reps: 10,
    weight: 100,
    rir: 3,
    weightIncrement: 2,
    initialSetsPerMeso: initalSetsPerMeso,
    setProgressionSchema: schemas,
    data: {
      movement_type: exerciseData.movement_type,
      requirements: exerciseData.requirements,
    },
  };
  return new_exercise;
};
