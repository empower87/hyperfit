// FUNCTIONALITY:
// Purpose: Considering user's ideal frequency for a muscle group.
// 1.  Seven matrices for total frequencies possible in a training week (Not considering, multiple sessions per day).
// 1a. Each of these seven matrices contains layouts of possible total exercises represented by 2s.
//     [1] = at least 24 hrs rest between sessions
//     [1, 2] = at least 48 hrs rest between sessions
//     [1, 2, 3] = at least 72 hrs rest between sessions
// 2.(SORTING PRIORITY):
//   A) Descending by lowest total exercises in a session for whole week.
//   B) If matrices have equal lowest total exercises in a session, sort by the lowest total exercises in a week.
//   C) If both above are equal, sort by 2nd lowest total exercises in a session.

// prettier-ignore
const FREQUENCY_MATRIX_SEVEN_SORTED = [                                          // SETS  MEPS INIT MAX EX
  [[      2], [      2], [      2], [      2], [      2], [      2], [      2]], // 0-0-7   1   14  35  7
  [[   2, 2], [      2], [      2], [      2], [      2], [      2], [      2]], // 0-1-6   2   16  40  8
  [[   2, 2], [      2], [   2, 2], [      2], [      2], [      2], [      2]], // 0-2-5   2   18  45  9
  [[   2, 2], [      2], [   2, 2], [      2], [   2, 2], [      2], [      2]], // 0-3-4   2   20  50  10
  [[2, 2, 2], [      2], [      2], [      2], [      2], [      2], [      2]], // 1-0-6   3   18  42  9
  [[2, 2, 2], [      2], [      2], [   2, 2], [      2], [      2], [      2]], // 1-1-5   3   20  47  10
  [[2, 2, 2], [      2], [      2], [   2, 2], [      2], [   2, 2], [      2]], // 1-2-4   3   22  52  11
  [[2, 2, 2], [      2], [      2], [2, 2, 2], [      2], [      2], [      2]], // 2-0-5   3   22  49  11
]
// prettier-ignore
const FREQUENCY_MATRIX_SIX_SORTED = [                                            // SETS  MEPS INIT MAX EX
  [[      2], [      2], [      2], [      2], [      2], [      2], [       ]], // 0-0-6   1   12  30  6
  [[   2, 2], [      2], [      2], [      2], [      2], [      2], [       ]], // 0-1-5   2   14  35  7
  [[   2, 2], [      2], [   2, 2], [      2], [      2], [      2], [       ]], // 0-2-4   2   16  40  8
  [[   2, 2], [      2], [   2, 2], [      2], [   2, 2], [      2], [       ]], // 0-3-3   2   18  45  9
  [[2, 2, 2], [      2], [   2, 2], [      2], [      2], [      2], [       ]], // 1-1-4   3   18  42  9
  [[2, 2, 2], [      2], [      2], [2, 2, 2], [      2], [      2], [       ]], // 2-0-4   3   20  44  10
  [[2, 2, 2], [      2], [   2, 2], [      2], [   2, 2], [      2], [       ]], // 1-2-3   3   20  47  10
]
// prettier-ignore
const FREQUENCY_MATRIX_FIVE_SORTED = [                                           // SETS  MEPS INIT MAX EX
  [[      2], [      2], [      2], [       ], [      2], [      2], [       ]], // 0-0-5   1   10  25  5
  [[   2, 2], [      2], [      2], [       ], [      2], [      2], [       ]], // 0-1-4   2   12  30  6
  [[   2, 2], [      2], [   2, 2], [       ], [      2], [      2], [       ]], // 0-2-3   2   14  35  7
  [[   2, 2], [      2], [   2, 2], [       ], [   2, 2], [      2], [       ]], // 0-3-2   2   16  40  8
  [[2, 2, 2], [      2], [      2], [       ], [      2], [      2], [       ]], // 1-0-4   3   14  32  7
  [[2, 2, 2], [      2], [      2], [       ], [   2, 2], [      2], [       ]], // 1-1-3   3   16  37  8
  [[2, 2, 2], [      2], [      2], [       ], [2, 2, 2], [      2], [       ]], // 2-0-3   3   18  39  9
]
// prettier-ignore
const FREQUENCY_MATRIX_FOUR_SORTED = [                                           // SETS  MEPS INIT MAX EX
  [[      2], [       ], [      2], [       ], [      2], [      2], [       ]], // 0-0-4   1    8  20  4
  [[   2, 2], [       ], [      2], [       ], [      2], [      2], [       ]], // 0-1-3   2   10  25  5
  [[   2, 2], [       ], [   2, 2], [       ], [      2], [      2], [       ]], // 0-2-2   2   12  30  6
  [[   2, 2], [       ], [   2, 2], [       ], [   2, 2], [      2], [       ]], // 0-3-1   2   14  35  7
  [[2, 2, 2], [       ], [      2], [       ], [      2], [      2], [       ]], // 1-0-3   3   12  27  6
  [[2, 2, 2], [       ], [      2], [       ], [   2, 2], [      2], [       ]], // 1-1-2   3   14  32  7
  [[2, 2, 2], [       ], [      2], [       ], [2, 2, 2], [      2], [       ]], // 2-0-2   3   16  34  8
]
// prettier-ignore
const FREQUENCY_MATRIX_THREE_SORTED = [                                          // SETS  MEPS INIT MAX EX
  [[      2], [       ], [      2], [       ], [      2], [       ], [       ]], // 0-0-3   2   10  15  3
  [[   2, 2], [       ], [      2], [       ], [      2], [       ], [       ]], // 0-1-2   2   14  20  4
  [[   2, 2], [       ], [   2, 2], [       ], [      2], [       ], [       ]], // 0-2-1   2   14  25  5
  [[   2, 2], [       ], [   2, 2], [       ], [   2, 2], [       ], [       ]], // 0-3-0   2   16  30  6
  [[2, 2, 2], [       ], [      2], [       ], [      2], [       ], [       ]], // 1-0-2   3   10  22  5
  [[2, 2, 2], [       ], [      2], [       ], [   2, 2], [       ], [       ]], // 1-1-1   3   12  27  6
  [[2, 2, 2], [       ], [      2], [       ], [2, 2, 2], [       ], [       ]], // 2-0-1   3   14  29  7
]
// prettier-ignore
const FREQUENCY_MATRIX_TWO_SORTED = [                                            // SETS  MEPS INIT MAX EX
  [[      2], [       ], [       ], [       ], [      2], [       ], [       ]], // 0-0-2   1   4   10  2
  [[   2, 2], [       ], [       ], [       ], [      2], [       ], [       ]], // 0-1-1   2   6   15  3
  [[   2, 2], [       ], [       ], [       ], [   2, 2], [       ], [       ]], // 0-2-0   2   8   20  4
  [[2, 2, 2], [       ], [       ], [       ], [      2], [       ], [       ]], // 1-0-1   3   8   17  4
  [[2, 2, 2], [       ], [       ], [       ], [   2, 2], [       ], [       ]], // 1-1-0   3   10  22  5
  [[2, 2, 2], [       ], [       ], [       ], [2, 2, 2], [       ], [       ]], // 2-0-0   3   12  24  6
]
// prettier-ignore
const FREQUENCY_MATRIX_ONE_SORTED = [                                            // SETS  MEPS INIT MAX EX
  [[      2], [       ], [       ], [       ], [       ], [       ], [       ]], // 0-0-1   1   2   5   1
  [[   2, 2], [       ], [       ], [       ], [       ], [       ], [       ]], // 0-1-0   2   4   10  2
  [[2, 2, 2], [       ], [       ], [       ], [       ], [       ], [       ]], // 1-0-0   3   6   12  3
]

const getTotalExercises = (matrix: number[][][]) => {
  return matrix.map((row) => row.reduce((acc, curr) => acc + curr.length, 0));
};

const getMinSetRange = (matrix: number[][][]) => {
  return matrix.map((row) => row.flat().reduce((acc, curr) => acc + curr, 0));
};
export const MAX_SETS_AT_THREE_EXERCISES = 12;
export const MAX_SETS_AT_TWO_EXERCISES = 10;
export const MAX_SETS_AT_ONE_EXERCISE = 5;
export const MAX_SETS_AT_ONE_EXERCISE_AND_ONE_VARIATION_PER_SESSION_RANGE = 6;

const getMaxSetRange = (matrix: number[][][]) => {
  return matrix.map((row) =>
    row.reduce(
      (acc, curr) =>
        acc +
        (curr.length >= 3
          ? MAX_SETS_AT_THREE_EXERCISES
          : curr.length === 2
          ? MAX_SETS_AT_TWO_EXERCISES
          : curr.length === 1
          ? MAX_SETS_AT_ONE_EXERCISE
          : 0),
      0
    )
  );
};

// NOTE: This function intends to find the optimal placeholder by preferring the least amount of exercises
//       per session, then the least amount of exercises per week. By filtering through this pre-sorted
//       matrix, we then find the first row with total set volume that exceeds the max set_range.
//       This ideally should return the "optimal" placeholder.
const findOptimalPlaceholderExerciseLayout = (
  variationPerSessionRange: number[],
  set_range: number[],
  frequency_matrix: number[][][],
  muscle?: string
) => {
  const total_frequency = frequency_matrix[0]?.reduce(
    (acc, curr) => acc + curr.length,
    0
  );
  const max_ex_per_session = variationPerSessionRange[1];
  const max_volume_in_sets = set_range[1];
  const max_sets = getMaxSetRange(frequency_matrix);

  let index = 0;
  for (let i = 0; i < frequency_matrix.length; i++) {
    const curr_max_ex_per_session = frequency_matrix[i][0].length;
    const curr_max_volume_in_sets = max_sets[i];

    if (curr_max_ex_per_session > max_ex_per_session) break;
    // NOTE: This check ensures that the least amount of variationsPerSession is first to be returned if possible.
    if (curr_max_volume_in_sets >= max_volume_in_sets) {
      index = i;
      break;
    }
    // NOTE: for cases in which max_volume_in_sets never gets met.
    if (
      frequency_matrix[index + 1] &&
      frequency_matrix[i + 1][0].length <= max_ex_per_session
    ) {
      index++;
    }
  }

  const optimal_placeholder = frequency_matrix[index];
  console.log(
    muscle,
    total_frequency,
    frequency_matrix,
    max_ex_per_session,
    max_volume_in_sets,
    max_sets,
    index,
    optimal_placeholder,
    "findOptimalPlaceholderExerciseLayout"
  );
  return optimal_placeholder;
};

// TODO: 4/30/25 -------------------------
//      1. muscle-data.json. Finish recording external anatomy of each muscle. Potentially break that down further into bodybuilding terms.
//      2. Potentially make use of how many exercises are involved in each frequency set range. With that information and the breakdown of muscles anatomy
//         determine which amount of exercises will be needed to fully develop that muscle group.
//      3. 5/1/25.. Potentially go throw and hardcode a desired amount of exercises per group.
//      4. 5/2/25.. Have to sort based on closest to range of desired sets. Then filter through to see if it fits within variationPerSessionRange.

// NOTE: By pulling from these matrices, every time a final microcycle set array is pushed out,
//       it will be guaranteed to fulfill the set range requirements.

export const getPlaceholderExerciseLayout = (
  ex_per_session_range: number[],
  frequency: number,
  set_range: number[],
  muscle?: string
) => {
  let frequency_matrix: number[][][] = [];

  switch (frequency) {
    case 7:
      frequency_matrix = FREQUENCY_MATRIX_SEVEN_SORTED;
      break;
    case 6:
      frequency_matrix = FREQUENCY_MATRIX_SIX_SORTED;
      break;
    case 5:
      frequency_matrix = FREQUENCY_MATRIX_FIVE_SORTED;
      break;
    case 4:
      frequency_matrix = FREQUENCY_MATRIX_FOUR_SORTED;
      break;
    case 3:
      frequency_matrix = FREQUENCY_MATRIX_THREE_SORTED;
      break;
    case 2:
      frequency_matrix = FREQUENCY_MATRIX_TWO_SORTED;
      break;
    case 1:
      frequency_matrix = FREQUENCY_MATRIX_ONE_SORTED;
      break;
    default:
      break;
  }

  if (frequency_matrix.length === 0) return [];
  return findOptimalPlaceholderExerciseLayout(
    ex_per_session_range,
    set_range,
    frequency_matrix,
    muscle
  );
};
