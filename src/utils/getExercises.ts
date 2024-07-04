import {
  MRV_PROGRESSION_MATRIX_ONE,
  MRV_PROGRESSION_MATRIX_TWO_INIT,
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
} from "../constants/exercises/index";
import { getMuscleData } from "./getMuscleData";

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
      exercises = BACK_EXERCISES;
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
      console.log(addCounter, copiedSchema, "WTF IS GONIG ?");
    }
  }
  console.log(addedSets, schema, copiedSchema, "LETS LOOK");
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
  initialSetsPerMeso: [],
  setProgressionSchema: [],
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

  let exercises_matrix: number[][] = [];
  const matrix = getVolumeProgressionMatrix(rank, exercisesPerSessionSchema);

  if (rank === "MEV" || rank === "MV") {
    if (muscleData[rank] === 0) return exercise_list;
    exercises_matrix = initializeSetsPerMeso_mev_mv(
      muscleData[rank],
      frequencyProgression
    );
  } else {
    exercises_matrix = matrix[total_frequency - 1];
  }

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
        exercise: allExercises[exercises_index].name,
        muscle: group,
        rank: rank,
      };

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

const handleIncrement = (increment: number) => {
  const roundedIncrement = Math.round(increment);
};
