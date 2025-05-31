import { sortExercisesByCriteria } from "~/components/Modals/SelectExercise/SelectExerciseContext";
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
import { getJSONMuscle, getMuscleData } from "../../../../utils/getMuscleData";
import { MIN_SETS_PER_EXERCISE } from "./exercisePlaceholders";
import { ProgressionMethodType } from "./repsAndWeightProgression";
import { setProgression_addOnePerMicrocycle_TEST } from "./setProgressionOverMicrocycles";

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

const findGreatestSetsIndex = (session_sets: number[]) => {
  let index = 0;

  for (let i = 0; i < session_sets.length; i++) {
    index = session_sets[i] >= session_sets[index] ? i : index;
  }
  return index;
};
const findLeastSetsIndex = (session_sets: number[]) => {
  let index = 0;

  for (let i = 0; i < session_sets.length; i++) {
    index = session_sets[i] < session_sets[index] ? i : index;
  }
  return index;
};

export const getFinalMicrocycleSets_AddOnePerMicrocycle = (
  initialSets: number[],
  microcycles: number
) => {
  const setsOverMicrocycles = [initialSets];
  for (let i = 0; i < microcycles - 1; i++) {
    const sets = [...setsOverMicrocycles[i]];
    const index = findLeastSetsIndex(sets);
    const validAddableSets = sets[index] > 0 ? sets[index] + 1 : 0;
    sets[index] = validAddableSets;
    setsOverMicrocycles.push(sets);
  }
  return setsOverMicrocycles;
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
    }
  }
  return index;
};

export const updateSetProgression = (
  frequencyProgression: number[],
  setProgressionMatrix: number[][][]
) => {
  for (let i = 0; i < frequencyProgression.length; i++) {
    const frequency = frequencyProgression[i];

    const closestIndex = findClosestIndex(frequency, setProgressionMatrix);
    if (setProgressionMatrix[closestIndex].length === frequency) continue;

    const closestProgression = structuredClone(
      setProgressionMatrix[closestIndex]
    );

    const closestFrequency = closestProgression.length;

    // NOTE: updating setProgressionMatrix should only ever occur when subtracting from
    //       frequencyProgression[0] or adding to frequencyProgression[frequencyProgression.length - 1]
    if (closestIndex === 0) {
      const reduced = closestProgression.slice(
        0,
        closestProgression.length - 1
      );
      setProgressionMatrix.unshift(reduced);
    } else {
      // TODO: determining addSessionSets should be done in a separate function based on closestProgression's layout
      const addSessionSets = [2];
      closestProgression.push(addSessionSets);
      const addProgression = disperseAddedSets(
        [closestFrequency],
        closestProgression
      );
      setProgressionMatrix.splice(closestIndex + 1, 0, addProgression);
    }
  }
  return setProgressionMatrix;
};

export const updateExercisesOnSetProgressionChange = (
  muscle: MuscleType,
  volume_landmark: VolumeLandmarkType, // TODO: try passing a function to create new exercise
  setProgressionMatrix: number[][][],
  exercises: ExerciseType[][]
) => {
  const total_exercise_frequency = exercises.length;
  const total_exercises_frequency_in_sets =
    setProgressionMatrix[setProgressionMatrix.length - 1].length;
  const remaining_frequency =
    total_exercises_frequency_in_sets - total_exercise_frequency;
  if (remaining_frequency <= 0) return exercises;
  const selected_index =
    total_exercises_frequency_in_sets - remaining_frequency;
  const selected_sets =
    setProgressionMatrix[setProgressionMatrix.length - 1].slice(selected_index);
  const all_exercises = getGroupList(muscle);

  for (let i = 0; i < selected_sets.length; i++) {
    const session = selected_sets[i];
    const session_exercises: ExerciseType[] = [];

    for (let j = 0; j < session.length; j++) {
      const current_exercise_names = exercises.flat().map((ex) => ex.name);
      const unselected_exercises = all_exercises.filter(
        (ex) => !current_exercise_names.includes(ex.name)
      );

      let max = all_exercises.length;
      let min = unselected_exercises.length;

      let available_exercises = all_exercises;
      if (min > 0) {
        available_exercises = unselected_exercises;
        max = min;
        min = 0;
      }

      const exercise_index = Math.floor(Math.random() * (max - min) + min);
      const exercise_data = available_exercises[exercise_index];
      console.log(
        muscle,
        current_exercise_names,
        unselected_exercises.flat().map((ex) => ex.name),
        max,
        min,
        exercise_index,
        available_exercises.flat().map((ea) => ea.name),
        // selected_exercise,
        "CHECK CH CH CHECK IT OUT"
      );
      const selected_exercise = initNewExercise(exercise_data, volume_landmark);
      session_exercises.push(selected_exercise);
    }

    exercises.push(session_exercises);
    console.log(
      muscle,
      setProgressionMatrix,
      exercises,
      session_exercises,
      selected_sets,
      selected_index,
      remaining_frequency,
      "OH BOY HERE WE GO"
    );
  }
  return exercises;
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
  muscle: "triceps",
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
    region: {
      primary: "long-head",
      secondary: [],
    },
  },
  setProgression: [],
  rep_range: [8, 12],
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

export const setProgressionForExercises = (
  muscleGroup: MusclePriorityType,
  microcycles: number
) => {
  const exercises = structuredClone(muscleGroup.exercises);
  const frequencyProgression = muscleGroup.frequency.progression;

  for (let i = 0; i < exercises.length; i++) {
    for (let j = 0; j < exercises[i].length; j++) {
      const setsProgression: number[][] = [];
      for (let k = 0; k < frequencyProgression.length; k++) {
        const setsOverWeek = getExerciseSetsOverMicrocycles(
          exercises[i][j].id,
          muscleGroup,
          k,
          microcycles
        );
        setsProgression.push(setsOverWeek);
      }
      exercises[i][j].setProgression = setsProgression;
    }
  }
  console.log(exercises, "YO WTFS GOING ON HERE?");
  return exercises;
};

const REPS_ARR = [5, 12, 10, 12, 8, 10, 15, 8, 12];
// const REPS_ARR = [
//   [5, 8],
//   [12, 15],
//   [10, 13],
//   [12, 15],
//   [8, 12],
//   [10, 13],
//   [15, 18],
//   [8, 12],
//   [12, 15],
// ]

const WeightIncrementTuple = {
  barbell: [45, 5],
  dumbbell: [10, 2.5],
  cable: [10, 2.5],
  machine: [20, 5],
  bodyweight: [0, 0],
};
const getWeightData = (requirements: string[]) => {
  return Object.entries(WeightIncrementTuple).filter(([key, value]) => {
    if (requirements.includes(key)) {
      return value;
    }
  })[0][1];
};

const DEFAULT_SET_PROGRESSION_SCHEMA = "ADD_ONE_PER_MICROCYCLE";
// NOTE: 4/11/2025. Need to create a function to progress weight over mesocycles.
// linear progression, dynamic progression, etc.
export const getTotalExercisesFromSetMatrix = (
  prioritized_muscle: MusclePriorityType,
  setProgressionMatrix: number[][][]
) => {
  const muscle = prioritized_muscle.muscle;
  const volume_landmark = prioritized_muscle.volume.landmark;

  const finalProgression =
    setProgressionMatrix[setProgressionMatrix.length - 1];
  const allExercises = getGroupList(muscle);
  const exercise_list: ExerciseType[][] = [];

  let exercises_index = 0;
  let reps_index = 0;
  for (let i = 0; i < finalProgression.length; i++) {
    const session = finalProgression[i];
    const session_exercises: ExerciseType[] = [];

    for (let j = 0; j < session.length; j++) {
      if (session[j] === 0) continue;
      if (!allExercises[exercises_index]) {
        exercises_index = 0;
      }
      const exercise = initNewExercise(
        allExercises[exercises_index],
        volume_landmark
      );

      const weightData = getWeightData(exercise.data.requirements);
      exercise.reps = REPS_ARR[reps_index];
      exercise.weight = weightData[0];
      exercise.weightIncrement = weightData[1];
      session_exercises.push(exercise);
      exercises_index++;
      reps_index++;
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

// 4/8/2025. This is exported and unused, but was intended maybe.
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

      const exercise = initNewExercise(allExercises[exercises_index], rank);

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
  setProgressionMatrix: number[][][],
  sessionIndex: number
) => {
  let sets = 2;

  const matrix = structuredClone(setProgressionMatrix);
  const lastMeso = matrix[matrix.length - 1];
  const isNewSession = lastMeso[sessionIndex] ? true : false;

  if (!isNewSession) {
    const prevMeso = matrix[matrix.length - 1];
    const newRow = addSetProgressionMatrixRow(prevMeso, [sets]);
    matrix.push(newRow);
  } else {
    for (let i = 0; i < matrix.length; i++) {
      const meso = matrix[i];
      if (meso[sessionIndex]) {
        matrix[i][sessionIndex].push(sets);
      }
    }
  }
  return matrix;
};

export const initNewExercise = (
  exerciseData: JSONExercise,
  volume_landmark: VolumeLandmarkType
) => {
  const schemas: SetProgressionType[] = Array.from([], (e, i) =>
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
    setProgressionSchema: schemas,
    data: {
      movement_type: exerciseData.movement_type,
      requirements: exerciseData.requirements,
      region: {
        primary: exerciseData.region,
        secondary: [],
      },
    },
  };
  return new_exercise;
};

export const getExerciseSetsOverMicrocycles = (
  exerciseId: ExerciseType["id"],
  muscleGroup: MusclePriorityType,
  selectedMesocycleIndex: number,
  microcycles: number
) => {
  const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
  const setProgressionLengths = Array.from(
    setProgressionMatrix,
    (e, i) => e.length
  );
  const frequency = muscleGroup.frequency.progression[selectedMesocycleIndex];
  const setProgressionIndex = setProgressionLengths.indexOf(frequency);

  let dayIndex = 0;
  let exerciseIndex = 0;
  let totalExercisesInSession = 0;
  let foundExercise: ExerciseType | null = null;

  for (let i = 0; i < muscleGroup.exercises.length; i++) {
    const sessionExercises = muscleGroup.exercises[i];
    for (let j = 0; j < sessionExercises.length; j++) {
      const exercise = sessionExercises[j];
      if (exercise.id === exerciseId) {
        dayIndex = i;
        exerciseIndex = j;
        totalExercisesInSession = sessionExercises.length;
        foundExercise = exercise;
        continue;
      }
    }
  }
  const sessionSetsByMatrix =
    setProgressionMatrix[setProgressionIndex][dayIndex];
  if (!sessionSetsByMatrix) return [];
  const setsByMatrix = sessionSetsByMatrix[exerciseIndex];

  const initialSets =
    foundExercise &&
    foundExercise.initialSets &&
    foundExercise.initialSets[frequency]
      ? foundExercise.initialSets[frequency]
      : setsByMatrix;

  const sets = setProgression_addOnePerMicrocycle_TEST(
    microcycles,
    totalExercisesInSession,
    exerciseIndex,
    initialSets
  );

  return sets;
};

// prettier-ignore
const EXERCISE_LOCATION = [
  "cable-single",
  "cable-single bench",
  "cable-multi",
  "cable-multi bench",
  "smith-machine", 
  "machine", 
  "power-rack", 
  "power-rack bench", 
  "power-tower", 
  "bench", 
  "incline-bench",
  "floor-tight",
  "floor-open",
] as const
type ExerciseLocationType = (typeof EXERCISE_LOCATION)[number];

// CHEST            IDEAL          |          MATH
// 0.50 0.40 .1
// FREQ     upper | middle | lower | upper | middle | lower
//   7       3        3       1    |  3.5     2.8      0.7  = 3 3 1
//   6       3        2       1    |  3.0     2.4      0.6  = 3 2 1
//   5       3        2       0    |  2.5     2.0      0.5  = 3 2 0
//   4       2        2       0    |  2.0     1.6      0.4  = 2 2 0
//   3       2        1       0    |  1.5     1.2      0.3  = 2 1 0
//   2       1        1       0    |  1.0     0.8      0.2  = 1 1 0
//   1       1        0       0    |  0.5     0.4      0.1  = 1 0 0

// CHEST            IDEAL          |          MATH
// 0.50 0.425 0.075
// FREQ     upper | middle | lower | upper  | middle  | lower
//   7       4        3       1    |  3.50     2.97     0.525  = 3 3 1
//   6       3        2       1    |  3.00     2.55     0.45   = 3 3 0
//   5       3        2       0    |  2.50     2.13     0.38   = 3 2 0
//   4       2        2       0    |  2.00     1.7      0.3    = 2 2 0
//   3       2        1       0    |  1.50     1.28     0.23   = 2 1 0
//   2       1        1       0    |  1.00     0.85     0.15   = 1 1 0
//   1       1        0       0    |  0.50     0.43     0.08   = 1 0 0

// TRICEPS  .65  IDEAL .35  |     MATH
// FREQ     long | lateral  | long | lateral
//   7       4        3     |  4.55   2.45  = 5 2
//   6       3        3     |  3.9    2.1   = 4 2
//   5       3        2     |  3.25   1.75  = 3 2
//   4       2        2     |  2.0    2.0   = 2 2
//   3       2        1     |  1.95   1.05  = 2 1
//   2       1        1     |  1.3    0.7   = 1 1
//   1       1        0     |  0.65   0.35  = 1 0

// TRICEPS  .55  IDEAL .45  |     MATH
// FREQ     long | lateral  | long | lateral
//   7       4        3     |  3.85   3.15  = 4 3
//   6       3        3     |  3.30   2.70  = 3 3
//   5       3        2     |  2.75   2.25  = 3 2
//   4       2        2     |  2.2    1.8   = 2 2
//   3       2        1     |  1.65   1.35  = 2 1
//   2       1        1     |  1.10   0.90  = 1 1
//   1       1        0     |  0.55   0.45  = 1 0

// BICEPS            IDEAL          |          MATH
// 0.40 0.40 0.20
// FREQ     long  | short | brachi |  long   | short | brachi
//   7       4        3       1    |  2.80     2.80     1.40   = 3 3 1
//   6       3        2       1    |  2.40     2.40     1.20   = 3 2 1
//   5       3        2       0    |  2.00     2.00     1.00   = 2 2 1
//   4       2        2       0    |  1.60     1.60     0.80   = 2 2 0
//   3       2        1       0    |  1.20     1.20     0.60   = 1 1 1
//   2       1        1       0    |  0.80     0.80     0.40   = 1 1 0
//   1       1        0       0    |  0.40     0.40     0.20   = 1 0 0

// BICEPS            IDEAL          |          MATH
// 0.45 0.41 0.14
// FREQ     long  | short | brachi |  long   | short | brachi
//   7       3        3       1    |  3.15     2.87     0.98   = 3 3 1
//   6       3        2       1    |  2.70     2.46     0.84   = 3 2 1
//   5       3        2       0    |  2.25     2.05     0.70   = 2 2 1
//   4       2        2       0    |  1.80     1.64     0.56   = 2 2 0
//   3       2        1       0    |  1.35     1.23     0.42   = 1 1 1
//   2       1        1       0    |  0.80     0.80     0.40   = 1 1 0
//   1       1        0       0    |  0.40     0.40     0.20   = 1 0 0
// BICEPS            IDEAL          |          MATH
// 0.45 0.41 0.14
// FREQ     long  | short | brachi |  long   | short | brachi
//   7       3        3       1    |  3.15     2.87     0.98   = 3 3 1
//   6       3        2       1    |  2.70     2.46     0.84   = 3 2 1
//   5       3        2       0    |  2.25     2.05     0.70   = 2 2 1
//   4       2        2       0    |  1.80     1.64     0.56   = 2 2 0
//   3       2        1       0    |  1.35     1.23     0.42   = 1 1 1
//   2       1        1       0    |  0.80     0.80     0.40   = 1 1 0
//   1       1        0       0    |  0.40     0.40     0.20   = 1 0 0
// BICEPS            IDEAL          |          MATH
// 0.50 0.39 0.11
// FREQ     long  | short | brachi |  long   | short | brachi
//   7       3        3       1    |  3.50     2.73     0.77   = 3 3 1
//   6       3        2       1    |  3.00     2.34     0.66   = 3 2 1
//   5       3        2       0    |  2.50     1.95     0.55   = 3 2 0
//   4       2        2       0    |  2.00     1.56     0.44   = 2 2 0
//   3       2        1       0    |  1.50     1.17     0.33   = 2 1 0
//   2       1        1       0    |  1.00     0.80     0.20   = 1 1 0
//   1       1        0       0    |  0.40     0.40     0.10   = 1 0 0

// BICEPS            IDEAL          |          MATH
// 0.49 0.39 0.12
// FREQ     long  | short | brachi |  long   | short | brachi
//   7       3        3       1    |  3.43     2.73     0.84   = 3 3 1
//   6       3        2       1    |  2.94     2.34     0.70   = 3 2 1
//   5       3        2       0    |  2.45     1.95     0.60   = 2 2 1
//   4       2        2       0    |  1.96     1.56     0.48   = 2 2 0
//   3       2        1       0    |  1.47     1.17     0.36   = 2 1 0
//   2       1        1       0    |  0.98     0.78     0.24   = 1 1 0
//   1       1        0       0    |  0.40     0.40     0.10   = 1 0 0

// TRAPS            IDEAL          |          MATH
// 0.75 0.15 0.10
// FREQ     long  | short | brachi |  long   | short | brachi
//   7       5        1       1    |  5.25     1.05     1.00   = 5 1 1
//   6       4        1       1    |  4.50     0.90     0.60   = 5 1 1
//   5       4        1       0    |  3.75     0.75     0.50   = 4 1 1
//   4       3        1       0    |  3.00     0.60     0.40   = 3 1 0
//   3       3        0       0    |  2.25     0.45     0.30   = 2 0 0
//   2       2        0       0    |  1.50     0.30     0.20   = 2 0 0
//   1       1        0       0    |  0.75     0.15     0.10   = 1 0 0

// QUADS            IDEAL          |          MATH
// 0.70 0.20 0.10
// FREQ     rect  | vasti | adduct |  rect   | vasti | adduct
//   7       5        1       1    |  4.90     1.40     0.70   = 5 1 1
//   6       4        1       1    |  4.20     1.20     0.60   = 4 1 1
//   5       4        1       0    |  3.50     1.00     0.50   = 4 1 0
//   4       3        1       0    |  2.80     0.80     0.40   = 3 1 0
//   3       3        0       0    |  2.10     0.60     0.30   = 2 1 0
//   2       2        0       0    |  1.40     0.40     0.20   = 1 0 0
//   1       1        0       0    |  0.70     0.20     0.10   = 1 0 0

// FOREARMS         IDEAL          |          MATH
// 0.40 0.35 0.25
// FREQ     brach | flex  | extens |  brach  | flex  | extens
//   7       3        2       2    |  2.80     2.45     1.75   = 3 2 2
//   6       2        2       2    |  2.40     2.10     1.50   = 2 2 2
//   5       2        2       1    |  2.00     1.75     1.25   = 2 2 1
//   4       2        1       1    |  1.60     1.40     1.00   = 2 1 1
//   3       1        1       1    |  1.20     1.05     0.75   = 1 1 1
//   2       1        1       0    |  0.80     0.70     0.50   = 1 1 1
//   1       1        0       0    |  0.40     0.35     0.25   = 0 0 0

// NOTE. if frequency doesn't match on rounding. If under: add to top. If over: subtract from bottom.
const MUSCLE_GROUP_REGION_WEIGHTS = {
  abs: {
    upper: 0.3,
    lower: 0.3,
    obliques: 0.4,
  },
  back: {
    lats: 0.55,
    upper: 0.45,
  },
  biceps: {
    long: 0.49,
    short: 0.39,
    brachialis: 0.12,
  },
  calves: {
    calves: 1,
  },
  chest: {
    upper: 0.49,
    middle: 0.39,
    lower: 0.12,
  },
  delts_front: {
    front: 1,
  },
  delts_rear: {
    rear: 1,
  },
  delts_side: {
    side: 1,
  },
  forearms: {
    brachioradialis: 0.4,
    flexors: 0.35,
    extensors: 0.25,
  },
  glutes: {
    glutes: 1,
  },
  hamstrings: {
    hamstrings: 1,
  },
  quads: {
    vastus: 0.7,
    rectus: 0.2,
    adductors: 0.1,
  },
  traps: {
    upper: 0.75,
    middle: 0.15,
    lower: 0.1,
  },
  triceps: {
    long: 0.55,
    lateral: 0.45,
  },
} as const;

const findExercisesByTargetRegions = (
  muscle_name: MuscleType,
  frequency: number,
  sorted_json_exercises: JSONExercise[]
) => {
  // Get region weights for the muscle group
  const regionWeights = MUSCLE_GROUP_REGION_WEIGHTS[muscle_name];
  const regionKeys = Object.keys(regionWeights) as Array<
    keyof typeof regionWeights
  >;
  if (!regionWeights || regionKeys.length <= 1)
    return sorted_json_exercises.slice(0, frequency);

  // Calculate how many exercises per region (integer division, distribute remainder)
  const totalWeight = regionKeys.reduce(
    (sum, key) => sum + regionWeights[key],
    0
  );
  let regionCounts: { [region: string]: number } = {};
  let totalAssigned = 0;

  // Initial assignment (floor)
  regionKeys.forEach((region) => {
    const count = Math.floor((regionWeights[region] / totalWeight) * frequency);
    regionCounts[region] = count;
    totalAssigned += count;
  });

  // Distribute remainder
  let remainder = frequency - totalAssigned;
  if (remainder > 0) {
    // Sort regions by largest fractional remainder
    const remainders = regionKeys
      .map((region) => ({
        region,
        frac:
          (regionWeights[region] / totalWeight) * frequency -
          regionCounts[region],
      }))
      .sort((a, b) => b.frac - a.frac);

    for (let i = 0; i < remainder; i++) {
      regionCounts[remainders[i % remainders.length].region]++;
    }
  }

  // Select exercises for each region, in order from the sorted list
  const selected: JSONExercise[] = [];
  const usedIds = new Set<string>();
  for (const region of regionKeys) {
    let count = regionCounts[region];
    if (count <= 0) continue;
    for (const ex of sorted_json_exercises) {
      if (usedIds.has(ex.id)) continue;
      // If region is "", treat as default (include if no region specified)
      if (ex.region === region || (region === "default" && !ex.region)) {
        selected.push(ex);
        usedIds.add(ex.id);
        count--;
        if (count === 0) break;
      }
    }
  }

  // If not enough found, fill from remaining exercises
  if (selected.length < frequency) {
    for (const ex of sorted_json_exercises) {
      if (selected.length >= frequency) break;
      if (!usedIds.has(ex.id)) {
        selected.push(ex);
        usedIds.add(ex.id);
      }
    }
  }

  return selected;
};

// NOTE: 5/13/2025. New exercise builders via new setProgressionMatrix functionality.
//       Currently works well. But requires smarter logic.
//       1. Create a logical algorithm for determining how to err on min_variation vs. max_variation.
//       2. Exercise selection algorithm will be helpful.
//          Different angles, equipment, etc..
const LOADING_DIFFERENTIATION = ["heavy", "medium", "light"];
export const getExercises = (
  muscle_name: MuscleType,
  volume: number,
  exercise_placeholders: number[][],
  min_variation: number,
  max_variation: number
) => {
  const total_exercises = exercise_placeholders.reduce(
    (acc, exercise_day) => acc + exercise_day.length,
    0
  );
  if (total_exercises <= 0) return [];

  const json_exercises = getGroupList(muscle_name);
  const sorted_json_exercises = sortExercisesByCriteria(json_exercises, "rank");

  const frequency = exercise_placeholders.filter(
    (exercise_day) => exercise_day.length
  ).length;
  const exercises = findExercisesByTargetRegions(
    muscle_name,
    frequency,
    sorted_json_exercises
  );

  const ending_index = Math.min(max_variation, total_exercises);
  const unique_exercises: JSONExercise[] = exercises.slice(0, ending_index);
  const repeated_exercises: JSONExercise[] = [];

  let total_possible_repeated_exercises =
    total_exercises - unique_exercises.length;
  let loading_diff_index = 0;
  for (let i = 0; i < unique_exercises.length; i++) {
    if (total_possible_repeated_exercises <= 0) break;
    const repeated_exercise = { ...unique_exercises[i] };
    repeated_exercise.id = `${repeated_exercise.id}_${LOADING_DIFFERENTIATION[loading_diff_index]}`;
    repeated_exercises.push(repeated_exercise);

    total_possible_repeated_exercises--;
    if (loading_diff_index >= LOADING_DIFFERENTIATION.length) {
      loading_diff_index = 0;
    } else {
      loading_diff_index++;
    }
  }

  const final_exercises = [...unique_exercises, ...repeated_exercises];
  console.log(
    muscle_name,
    volume,
    exercise_placeholders,
    max_variation,
    total_exercises,
    json_exercises.length,
    ending_index,
    unique_exercises.length,
    repeated_exercises.length,
    final_exercises,
    sorted_json_exercises,
    exercises,
    "FUNCTION: getExercises => getExercises.ts"
  );
  return final_exercises;
};

const addExercisesToPlaceholders = (
  prioritized_muscle: MusclePriorityType,
  exercisePlaceholders: number[][]
) => {
  const muscle = prioritized_muscle.muscle;
  const volume_landmark = prioritized_muscle.volume.landmark;
  // NOTE: muscle_data, may have to just put this on prioritized_muscle?
  const muscle_data = getJSONMuscle(muscle);
  const exercise_variation_range = muscle_data.exercises.variationPerWeekRange;
  const ex_var_min = exercise_variation_range[0];
  const ex_var_max = exercise_variation_range[1];

  const allExercises = getGroupList(muscle);
  const exercise_list: ExerciseType[][] = [];

  let exercises_index = 0;
  for (let i = 0; i < exercisePlaceholders.length; i++) {
    const session = exercisePlaceholders[i];
    const session_exercises: ExerciseType[] = [];

    for (let j = 0; j < session.length; j++) {
      if (session[j] === 0) continue;
      if (!allExercises[exercises_index]) {
        exercises_index = 0;
      }
      const exercise = initNewExercise(
        allExercises[exercises_index],
        volume_landmark
      );
      session_exercises.push(exercise);
      exercises_index++;
    }
    exercise_list.push(session_exercises);
  }

  return exercise_list;
};

const getMaxSets = (exercises_in_session: number) => {
  switch (exercises_in_session) {
    case 1:
      return [5];
    case 2:
      return [5, 5];
    case 3:
      return [4, 4, 4];
    default:
      return [];
  }
};

// prettier-ignore
export const getInitialWeekFromVolume = (
  max_sets: number,
  microcycles: number,
  frequency: number,
  exercise_placeholders: number[][]
) => {
  const placeholder_total_volume = exercise_placeholders.reduce((acc, curr) => acc + curr.reduce((a, c) => a + c, 0), 0);
  const initial_microcycle_total_volume = max_sets - (microcycles - 1) * frequency;
  const volume_difference = initial_microcycle_total_volume - placeholder_total_volume;
  if (volume_difference <= 0 || placeholder_total_volume <= 0) return exercise_placeholders;

  const sets_to_add_to_each_session = Math.floor(volume_difference / frequency);
  let sets_to_add_to_each_session_remainder = volume_difference % frequency;

  const sets_to_add_over_week = Array.from(Array(frequency), (e, i) => {
    if (sets_to_add_to_each_session_remainder > 0) {
      sets_to_add_to_each_session_remainder--;
      return sets_to_add_to_each_session + 1;
    }
    return sets_to_add_to_each_session;
  });

  const cloned_placeholders = structuredClone(exercise_placeholders);

  let sets_to_add_over_week_index = 0;
  for (let i = 0; i < cloned_placeholders.length; i++) {
    const session = cloned_placeholders[i];
    if (!session.length) continue;

    const sets_to_add = sets_to_add_over_week[sets_to_add_over_week_index];

    let session_index = 0;
    for (let j = 0; j < sets_to_add; j++) {
      session[session_index]++;
      session_index++;
      if (session_index >= session.length) {
        session_index = 0;
      }
    }
    sets_to_add_over_week_index++;
  }

  console.log(
    placeholder_total_volume,
    initial_microcycle_total_volume,
    volume_difference,
    sets_to_add_to_each_session,
    sets_to_add_to_each_session_remainder,
    exercise_placeholders,
    cloned_placeholders,
    sets_to_add_over_week,
    max_sets,
    microcycles,
    frequency,
    "FUNCTION: getInitialWeekFromVolume => getExercises.ts"
  );
  return cloned_placeholders;
};

export const getInitialWeeksFromFinalWeek = (
  frequency_progression: number[],
  final_week: number[][]
) => {
  const initial_weeks: number[][][] = [final_week];
  const totals = frequency_progression.reduce((acc, curr) => acc + curr, 0);
  if (totals <= 0) return [];

  const SETS_TO_SUBTRACT = 1;
  const reversed_frequency_progression = [...frequency_progression].reverse();
  for (let i = 1; i < reversed_frequency_progression.length; i++) {
    let frequency_count = reversed_frequency_progression[i];

    const previous_week = structuredClone(initial_weeks[i - 1]);

    for (let j = 0; j < previous_week.length; j++) {
      let session = [...previous_week[j]];
      if (session.length === 0) continue;
      if (frequency_count > 0) {
        const index = findGreatestSetsIndex(session);
        const new_sets = session[index] - SETS_TO_SUBTRACT;
        session[index] =
          new_sets >= MIN_SETS_PER_EXERCISE ? new_sets : MIN_SETS_PER_EXERCISE;
        frequency_count--;
      } else {
        session = [];
      }
      previous_week[j] = session;
    }

    initial_weeks.push(previous_week);
  }

  const reverse_initial_weeks = initial_weeks.reverse();
  console.log(
    frequency_progression,
    reversed_frequency_progression,
    final_week,
    initial_weeks,
    reverse_initial_weeks,
    "FUNCTION: getInitialWeeksForEachMesocycle => getExercises.ts"
  );
  return reverse_initial_weeks;
};

// SINGLE
// IDEAL: low reps. i.e. 3-5, 5-8
// Requires skill with RiR.
// 100lbs x 8 reps at 3 rir
// 105lbs x 8 reps at 2 rir
// 100lbs x 5 reps at 1 rir > 100lbs x 5 reps at 2rir 100 lbs x 5 reps at 3rir
const progressionHandler_single = (
  one_rep_max: number,
  initial_rir: number,
  target_rir: number,
  reps: number,
  load_increment: number,
) => {
  // 1. Calculate starting load based on 1RM and initial_rir.
  // 2. Weight increases when target_rir is reached.
  //    THIS IS UNDETERMINED LOGIC. Should rir be increased by week, or every other week?
  // 3. Add load by increment. And reset RIR to initial_rir.
}

// DYNAMIC_SINGLE

// DOUBLE
// Requires 3-5 rep range spread. i.e. 5-8, 8-10, 8-12, 12-15, 15-20

// DYNAMIC_DOUBLE

// DOUBLE_SET_WEIGHT
// SETS = add 1 set to an exercise in a session each microcycle until the final week.
// REPS = within a range
// LOAD = When upper rep range is 

// TRIPLE
// IDEAL: Best for isolation exercises.
// progress to the top end of rep range. Then add a set. Progress again to top end of rep range. Add weight and restart.


// 1RM Calculation
// EPLEY FORMULA: 1RM = Weight * (1 + (Reps / 30)). This formula is simple and widely used, but it might overestimate 1RM, especially for a higher number of reps
// 540 x 5  = 630
// 540 x 8  = 684
// 450 x 12 = 630
// BRZYCKI FORMULA: 1RM = Weight / (1.0278 - (0.0278 * Reps)). This formula is another popular option, often considered more accurate than Epley for a wider range of repetitions
// 450 x 12 = 651
// 540 x &  = 670

// LOAD = 1RM / [1 + (Reps / 30)] 
// 651 1RM for 10 reps = 488.25lbs

const exerciseProgressionHandler = (
  exercise: ExerciseType,
  frequency: number,
  microcycles: number,
  progression_method: ProgressionMethodType,
  final_week: number[][]
) => {


};

// freq_prog = 2 > 3 > 4     volume on final week = 30
// 2 [2, 2], [2, 2]           = 20
// 3 [2, 2], [2, 2], [2]      = 25
// 4 [2, 2], [2, 2], [2], [2] = 30

// FREQUENCY = 2
// week 1 = [3, 2], [3, 2]           = 10
// week 2 = [3, 3], [3, 3]           = 12
// week 3 = [4, 3], [4, 3]           = 14
// week 4 = [4, 4], [4, 4]           = 16

// FREQUENCY = 3
// week 1 = [3, 3], [3, 3], [2]      = 14
// week 2 = [4, 3], [4, 3], [3]      = 17
// week 3 = [4, 4], [4, 4], [4]      = 20
// week 4 = [5, 4], [5, 4], [5]      = 23

// FREQUENCY = 4
// week 1 = [4, 3], [4, 3], [2], [2] = 18
// week 2 = [4, 4], [4, 4], [3], [3] = 22
// week 3 = [5, 4], [5, 4], [4], [4] = 26
// week 4 = [5, 5], [5, 5], [5], [5] = 30

// FREQUENCY = 3
// week 1 = [3, 2], [3, 2], [2]      = 14
// week 2 = [3, 3], [3, 3], [3]      = 17
// week 3 = [4, 3], [4, 3], [4]      = 20
// week 4 = [4, 4], [4, 4], [5]      = 23

// FREQUENCY = 4
// week 1 = [2, 2], [2, 2], [2], [2] = 12

// week 1 = [3, 3], [3, 3], [3], [3] = 18
// week 2 = [3, 4], [3, 4], [4], [4] = 22
// week 3 = [4, 4], [4, 4], [4], [4] = 26
// week 4 = [5, 5], [5, 5], [5], [5] = 30
