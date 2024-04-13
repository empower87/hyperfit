import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

export type SetProgressionType =
  | "ADD_ONE"
  | "ADD_ONE_ODD"
  | "FLAT_ADD"
  | "NO_ADD"
  | "ADD_ONE_PER_MICROCYCLE"
  | "ADD_MANY_PER_MICROCYCLE";

const EXERCISE = {
  id: "",
  initialSets: [2, 2, 3],
  setProgressionAlgo: ["ADD_ONE", "ADD_ONE", "ADD_ONE"],
};
export const EXERCISE_TRAINING_MODALITIES = [
  "straight",
  "down",
  "eccentric",
  "giant",
  "myoreps",
  "myorep match",
  "drop",
  "superset",
  "pre-exhaust superset",
  "lengthened partials",
] as const;

export type ExerciseTrainingModality =
  (typeof EXERCISE_TRAINING_MODALITIES)[number];

export type ExerciseMesocycleProgressionType = {
  week: number;
  sets: number;
  reps: number;
  weight: number;
  rir: number;
};

const setProgression_addOne = (
  mesocycleIndex: number,
  exercise: ExerciseType,
  microcycles: number
) => {
  const initialSets = exercise.initialSetsPerMeso[mesocycleIndex];

  const setsPerMicrocycle: number[] = [];
  let addCount = 0;
  for (let i = 0; i < microcycles; i++) {
    setsPerMicrocycle.push(initialSets + addCount);
    addCount++;
  }
  return setsPerMicrocycle;
};

const setProgression_addOneOdd = (
  mesocycleIndex: number,
  exercise: ExerciseType,
  microcycles: number
) => {
  const initialSets = exercise.initialSetsPerMeso[mesocycleIndex];

  const setsPerMicrocycle: number[] = [];
  let addCount = 0;
  for (let i = 0; i < microcycles; i++) {
    setsPerMicrocycle.push(initialSets + addCount);
    if (i % 2 !== 0) {
      addCount++;
    }
  }
  return setsPerMicrocycle;
};

const setProgression_flatAdd = (
  mesocycleIndex: number,
  exercise: ExerciseType,
  microcycles: number
) => {
  const initialSets = exercise.initialSetsPerMeso[mesocycleIndex];

  const setsPerMicrocycle: number[] = [];
  let addCount = 0;
  for (let i = 0; i < microcycles; i++) {
    if (i === 1) {
      addCount++;
    }
    setsPerMicrocycle.push(initialSets + addCount);
  }
  return setsPerMicrocycle;
};

const setProgression_noAdd = (
  mesocycleIndex: number,
  exercise: ExerciseType,
  microcycles: number
) => {
  const initialSets = exercise.initialSetsPerMeso[mesocycleIndex];
  const setsPerMicrocycle: number[] = [];

  for (let i = 0; i < microcycles; i++) {
    setsPerMicrocycle.push(initialSets);
  }
  return setsPerMicrocycle;
};

const setProgression_addOnePerMicrocycle = (
  mesocycleIndex: number,
  exercise: ExerciseType,
  microcycles: number,
  totalExercisesInSession: number,
  exerciseIndex: number
) => {
  const initialSets = exercise.initialSetsPerMeso[mesocycleIndex];
  const setsPerMicrocycle: number[] = [initialSets];

  let setCount = initialSets;
  let addCount = 0;

  for (let i = 0; i < microcycles - 1; i++) {
    if (addCount === exerciseIndex) {
      setCount++;
    }
    if (addCount === totalExercisesInSession - 1) {
      addCount = 0;
    } else {
      addCount++;
    }

    setsPerMicrocycle.push(setCount);
  }
  return setsPerMicrocycle;
};

type GetSetProgressionForExerciseType =
  | {
      type: "ADD_ONE";
      mesocycleIndex: number;
      exercise: ExerciseType;
      microcycles: number;
      exerciseIndex: never;
      totalExercisesInSession: never;
    }
  | {
      type: "ADD_ONE_ODD";
      mesocycleIndex: number;
      exercise: ExerciseType;
      microcycles: number;
      exerciseIndex: never;
      totalExercisesInSession: never;
    }
  | {
      type: "FLAT_ADD";
      mesocycleIndex: number;
      exercise: ExerciseType;
      microcycles: number;
      exerciseIndex: never;
      totalExercisesInSession: never;
    }
  | {
      type: "NO_ADD";
      mesocycleIndex: number;
      exercise: ExerciseType;
      microcycles: number;
      exerciseIndex: never;
      totalExercisesInSession: never;
    }
  | {
      type: "ADD_ONE_PER_MICROCYCLE";
      mesocycleIndex: number;
      exercise: ExerciseType;
      microcycles: number;
      exerciseIndex: number;
      totalExercisesInSession: number;
    }
  | {
      type: "ADD_MANY_PER_MICROCYCLE";
      mesocycleIndex: number;
      exercise: ExerciseType;
      microcycles: number;
      exerciseIndex: number;
      totalExercisesInSession: number;
    };

export const getSetProgressionForExercise = (
  type: SetProgressionType,
  mesocycleIndex: number,
  exercise: ExerciseType,
  microcycles: number,
  totalExercisesInSession: number,
  exerciseIndex: number
) => {
  switch (type) {
    case "ADD_ONE":
      return setProgression_addOne(mesocycleIndex, exercise, microcycles);
    case "ADD_ONE_ODD":
      return setProgression_addOneOdd(mesocycleIndex, exercise, microcycles);
    case "FLAT_ADD":
      return setProgression_flatAdd(mesocycleIndex, exercise, microcycles);
    case "NO_ADD":
      return setProgression_noAdd(mesocycleIndex, exercise, microcycles);
    case "ADD_ONE_PER_MICROCYCLE":
      return setProgression_addOnePerMicrocycle(
        mesocycleIndex,
        exercise,
        microcycles,
        totalExercisesInSession,
        exerciseIndex
      );
    default:
      return [];
  }
};

// exercises   = week 1 --- week 2 --- week 3 --- week 4 --- week 5 --- week 6 --- week 7 --- week 8 ---
//  0 one      =   2          3          3          4          4          5          5          6
//  1 two      =   2          2          3          3          4          4          5          5

// exercises   = week 1 --- week 2 --- week 3 --- week 4 --- week 5 --- week 6 --- week 7 --- week 8 ---
//  0 one      =   2          3          3          3          4          4          4          5
//  1 two      =   2          2          3          3          3          4          4          4
//  2 three    =   2          2          2          3          3          3          4          4

// exercises   = week 1 --- week 2 --- week 3 --- week 4 --- week 5 --- week 6 --- week 7 --- week 8 ---
//  0 one      =   2          3          3          3          3          4          4          4
//  1 two      =   2          2          3          3          3          3          4          4
//  2 three    =   2          2          2          3          3          3          3          4
//  3 four     =   2          2          2          2          3          3          3          3

// exercises   = week 1 --- week 2 --- week 3 --- week 4 --- week 5 --- week 6 --- week 7 --- week 8 ---
//  0 one      =   2          3          3          3          3          3          4          4
//  1 two      =   2          2          3          3          3          3          3          4
//  2 three    =   2          2          2          3          3          3          3          3
//  3 four     =   2          2          2          2          3          3          3          3
//  4 five     =   2          2          2          2          2          3          3          3

//  277.36 loan
// 1825.00 rent
//  110.57 phone
