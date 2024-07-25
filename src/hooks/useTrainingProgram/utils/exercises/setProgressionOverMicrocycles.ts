import {
  ExerciseType,
  SetProgressionType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

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

  if (initialSets === 0) {
    return Array.from(Array(microcycles), (e, i) => 0);
  }
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

export const setProgression_addOnePerMicrocycle_TEST = (
  microcycles: number,
  totalExercisesInSession: number,
  exerciseIndex: number,
  initialSets: number
) => {
  if (initialSets === 0) {
    return Array.from(Array(microcycles), (e, i) => 0);
  }
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
