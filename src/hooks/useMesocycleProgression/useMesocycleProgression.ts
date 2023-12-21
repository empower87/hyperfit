import {
  MRV_PROGRESSION_MATRIX_ONE,
  MRV_PROGRESSION_MATRIX_TWO,
} from "~/constants/volumeProgressionMatrices";
import {
  ExerciseType,
  MusclePriorityType,
} from "../useTrainingProgram/reducer/trainingProgramReducer";

function findIndexWithLowestSets(sets: number[]) {
  if (sets.length === 0) {
    // Handle empty array case
    return 0;
  }

  let lowestSets = sets[0];
  let lowestIndex = 0;

  for (let i = 1; i < sets.length; i++) {
    if (sets[i] < lowestSets) {
      lowestSets = sets[i];
      lowestIndex = i;
    }
  }

  return lowestIndex;
}

const setProgressionOverMesocycle = (
  exercises: ExerciseType[],
  index: number,
  microcycles: number,
  frequencyProgression: number[],
  exercisesPerSessionSchema: number
) => {
  let new_exercises = [...exercises];
  let block: number[][][] = [[], [], []];

  const blockMap = new Map(
    [...new_exercises].map((each, index) => [index, [...block]])
  );
  const matrix =
    exercisesPerSessionSchema === 2
      ? MRV_PROGRESSION_MATRIX_TWO
      : MRV_PROGRESSION_MATRIX_ONE;

  for (let i = 0; i < frequencyProgression.length; i++) {
    let matrix_index = frequencyProgression[i] - 1;

    if (matrix_index < 0) {
      continue;
    }
    const coords = matrix[matrix_index][index];
    if (!coords) {
      continue;
    }

    let initial_sets: number[][] = [[...coords]];

    // let microcycleMap = new Map<number, number[]>(new_exercises.map((each, index) => [index, []]))

    for (let j = 0; j < microcycles; j++) {
      let add_sets: number[] = [...initial_sets[j]];
      const index = findIndexWithLowestSets(add_sets);
      add_sets[index] = add_sets[index] + 1;
      initial_sets.push(add_sets);

      for (let k = 0; k < add_sets.length; k++) {
        let values = blockMap.get(k);
        if (values && add_sets[k]) {
          console.log(values, add_sets, k, "WTF IS ACTUALLY GOING ON???");
          values[i].push([add_sets[k], 10, 100, 3]);
          blockMap.set(k, values);
        }
      }
    }

    // block.push(initial_sets);
  }

  for (let m = 0; m < new_exercises.length; m++) {
    const block = blockMap.get(m);
    if (block) {
      new_exercises[m].block_progression_matrix = block;
    }
  }

  console.log(blockMap, new_exercises, "THIS SHOULDN'T BE RIDIC");
  // for (let k = 0; k < new_exercises.length; k++) {
  //   let current_block_matrix: number[][][] = [];

  //   for (let l = 0; l < block.length; l++) {
  //     let mesocycle: number[][] = [];
  //     for (let m = 0; m < block[l].length; m++) {
  //       let details = [block[l][m][k], 10, 100, 3];
  //       mesocycle.push(details);
  //     }
  //     current_block_matrix.push(mesocycle);
  //   }
  //   new_exercises[k].block_progression_matrix = current_block_matrix;
  // }

  return new_exercises;
};

export const createBlockProgressionForExercisesInPriority = (
  muscle_priority_list: MusclePriorityType[],
  microcycles: number
) => {
  let list_w_exercises = [...muscle_priority_list];
  for (let i = 0; i < list_w_exercises.length; i++) {
    let exercises = list_w_exercises[i].exercises;

    let { frequencyProgression, exercisesPerSessionSchema } =
      list_w_exercises[i].volume;

    for (let j = 0; j < exercises.length; j++) {
      let exercise = exercises[j];

      const data = setProgressionOverMesocycle(
        exercise,
        j,
        microcycles,
        frequencyProgression,
        exercisesPerSessionSchema
      );
      exercises[j] = data;
    }

    list_w_exercises[i].exercises = exercises;
  }

  return list_w_exercises;
};

// NOTES: These progression matrices will be generic progression templates.
//        Exercises for a muscle group will be determined and ordered by final mesocycle.
//        i.e: 7 total back sessions:
//        [rows, pulldowns, lat prayers, single-arm pulldowns, pullups, seated rows, pullovers]
//        based on this order will determine its progression.
//        i.e: lat prayers are exercise 1 in session 2 of MRV_PROGRESSION_MATRIX_TWO schema.
//        so to initialize it. Pass in mesocycle index (example 3): 1, [2, 1]

// initial set start for each mesocycle

const MRV_PROGRESSION_MATRIX_THREE = [
  [[2, 2, 1]],
  [
    [2, 2, 1],
    [2, 2, 1],
  ],
  [
    [2, 2, 2],
    [2, 2, 2],
    [2, 2, 1],
  ],
  [
    [3, 2, 2],
    [3, 2, 2],
    [3, 2, 1],
    [2, 2, 1],
  ],
  [[5], [5], [5], [4], [3]],
  [
    [3, 3, 3],
    [3, 3, 3],
    [3, 3, 3],
    [3, 2, 0],
    [2, 2, 0],
    [2, 0, 0],
  ],
];

// ---- week 1 ---- week 2 ---- week 3 ---- week 4
// ---- 2/2/1  ---- 2/2/2  ---- 3/2/2  ---- 3/3/2
// ---- 2/2/1
