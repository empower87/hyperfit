import {
  ExerciseType,
  MusclePriorityType,
} from "../useTrainingProgram/reducer/trainingProgramReducer";

export const createBlockProgressionForExercises = (
  muscle_priority_list: MusclePriorityType[],
  microcycles: number
) => {
  let list_w_exercises = [...muscle_priority_list];
  for (let i = 0; i < list_w_exercises.length; i++) {
    let exercises = list_w_exercises[i].allExercises;

    let { frequencyProgression, exercisesPerSessionSchema } =
      list_w_exercises[i].volume;

    let first = -1;
    let second = 0;
    let indices: [number, number] = [0, 0];
    for (let j = 0; j < exercises.length; j++) {
      let exercise = exercises[j];
      if (exercisesPerSessionSchema === 2) {
        second = 0;
        let mod = j % 2;
        if (mod === 0) {
          first = first + 1;
        } else {
          second = 1;
        }
        indices = [first, second];
      } else {
        indices = [j, 0];
      }

      const data = progressSetsAcrossMesocycle(
        exercise,
        indices,
        microcycles,
        frequencyProgression,
        exercisesPerSessionSchema
      );

      exercises[j].block_progression_matrix = data;
    }
  }
  console.log(list_w_exercises, "excessive data gonna be hard to read");
  return list_w_exercises;
};

const progressSetsAcrossMesocycle = (
  exercise: ExerciseType,
  exercise_indices: [number, number],
  microcycles: number,
  frequencyProgression: number[],
  exercisesPerSessionSchema: number
) => {
  const matrix =
    exercisesPerSessionSchema === 2
      ? MRV_PROGRESSION_MATRIX_TWO
      : MRV_PROGRESSION_MATRIX_ONE;

  let block_details: number[][][] = [];

  // map over each mesocycle in frequency progression
  for (let i = 0; i < frequencyProgression.length; i++) {
    const matrix_mesocycle = matrix[frequencyProgression[i] - 1] ?? matrix[0];
    const one = exercise_indices[0];
    const two = exercise_indices[1];

    let initial_sets = 0;
    let mesocycle_details: number[][] = [];

    if (!matrix_mesocycle[one]) {
      block_details.push(mesocycle_details);
      continue;
    }
    if (exercisesPerSessionSchema === 2) {
      initial_sets = matrix_mesocycle[one][two];
    } else {
      initial_sets = matrix_mesocycle[one][0];
    }

    // TODO: this will have to be handled with an algorithm to optimize and counter edge cases
    let initial_reps = exercise.reps;
    let initial_weight = exercise.weight;
    let initial_rir = exercise.rir;

    let weight_increment = 5;

    for (let j = 0; j < microcycles; j++) {
      initial_weight = initial_weight + weight_increment;
      initial_rir = initial_rir - 1;

      let microcycle = [
        initial_sets + j,
        initial_reps,
        initial_weight,
        initial_rir,
      ];
      
      mesocycle_details.push(microcycle);
    }

    block_details.push(mesocycle_details);
  }

  return block_details;
};

// NOTE: Looks like the best way of handling this is to put into array of arrays since their interdependent

function findIndexWithLowestSets(sets: number[]): number {
  if (sets.length === 0) {
    // Handle empty array case
    return -1;
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


// function findIndexWithLowestSets(exercises: ExerciseType[]): number {
//   if (exercises.length === 0) {
//     // Handle empty array case
//     return -1;
//   }

//   let lowestSets = exercises[0].sets;
//   let lowestIndex = 0;

//   for (let i = 1; i < exercises.length; i++) {
//     if (exercises[i].sets < lowestSets) {
//       lowestSets = exercises[i].sets;
//       lowestIndex = i;
//     }
//   }

//   return lowestIndex;
// }



const setProgressionOverMesocycle = (
  exercises: ExerciseType[],
  index: number,
  microcycles: number,
  initialSets: number,
  frequencyProgression: number[],
  exercisesPerSessionSchema: number
) => {

  let new_exercises = [...exercises]
  let block: number[][][] = []

  const matrix = exercisesPerSessionSchema === 2 ? MRV_PROGRESSION_MATRIX_TWO : MRV_PROGRESSION_MATRIX_ONE

  for (let i = 0; i < frequencyProgression.length; i++) {
    let matrix_index = frequencyProgression[i] - 1 ?? 0
    let initial_sets = [matrix[matrix_index][index]]
    
    if (!initial_sets.length) continue

    for (let j = 0; j < microcycles; j++) {
      const index = findIndexWithLowestSets(initial_sets[j])

      let add_sets = initial_sets[j]
      add_sets[index] = add_sets[index] + 1
      initial_sets.push(add_sets)
    }
    
    block.push(initial_sets)
  }


  for (let k = 0; k < new_exercises.length; k++) {
    let current = new_exercises[k]
    let current_block_matrix: number[][][] = []

    for (let l = 0; l < block.length; l++) {
      let mesocycle: number[][] = []
      for (let m = 0; m < block[l].length; m++) {
        let details = [block[l][m][k], 10, 100, 3]
        mesocycle.push(details)

      }
      current_block_matrix.push(mesocycle)
    }
    new_exercises[k].block_progression_matrix = current_block_matrix

  }
  console.log(new_exercises, "oh boy this is gonna be crazy")
  return new_exercises
};

// NOTES: These progression matrices will be generic progression templates.
//        Exercises for a muscle group will be determined and ordered by final mesocycle.
//        i.e: 7 total back sessions:
//        [rows, pulldowns, lat prayers, single-arm pulldowns, pullups, seated rows, pullovers]
//        based on this order will determine its progression.
//        i.e: lat prayers are exercise 1 in session 2 of MRV_PROGRESSION_MATRIX_TWO schema.
//        so to initialize it. Pass in mesocycle index (example 3): 1, [2, 1]

// initial set start for each mesocycle
const MRV_PROGRESSION_MATRIX_ONE = [
  [[2]],
  [[3], [3]],
  [[3], [3], [3]],
  [[4], [4], [4], [3]],
  [[5], [5], [5], [4], [3]],
  [[5], [5], [5], [4], [3], [2]],
];

const MRV_PROGRESSION_MATRIX_TWO = [
  [[2, 2]],
  [
    [2, 2],
    [2, 2],
  ],
  [
    [2, 3],
    [2, 3],
    [2, 2],
  ],
  [
    [3, 3],
    [3, 3],
    [2, 3],
    [2, 0],
  ],
  [
    [3, 3],
    [3, 3],
    [3, 3],
    [3, 0],
    [2, 0],
  ],
  [
    [3, 3],
    [3, 3],
    [3, 3],
    [3, 0],
    [2, 0],
    [1, 0],
  ],
];

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
