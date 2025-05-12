// Double Progression
// NOTES: requires you to stabilize the amount of sets
//        progress from reps across every set till you reach the top of rep range then increase weight.

// SETS: micros: | 1 | 2 | 3 | 4
// --------------------------
//      meso 1:   2   3   3   4
//      meso 2:   3   4   4   5
//      meso 3:   3   4   4   5

// RANGE: 8 - 12

//  meso 1:   [8, 8]      [9, 8, 8]       [9, 9, 8]        [9, 9, 9, 8]
//  meso 2:   [9, 9, 9]   [10, 9, 9, 9]   [10, 9, 9, 9]    [10, 10, 9, 9, 9]
//  meso 3:   [10, 9, 9]  [10, 10, 9, 9]  [10, 10, 10, 9]  [10, 10, 10, 10, 9]

//  meso 1:   [8, 8]        [9, 8, 8]         [9, 9, 8]         [10, 9, 9, 8]
//  meso 2:   [9, 9, 9]     [10, 9, 9, 9]     [10, 9, 9, 9]     [11, 10, 9, 9, 9]
//  meso 3:   [10, 10, 10]  [11, 11, 10, 10]  [11, 11, 11, 10]  [12, 12, 12, 11, 11]

//  meso 1:   [8, 8]        [9, 8, 8]         [9, 9, 8]         [9, 9, 9, 8]
//  meso 2:   [10, 10, 9]   [10, 10, 10, 9]   [10, 10, 10, 10]  [10, 10, 10, 10, 10]
//  meso 3:   [11, 11, 11]  [11, 11, 11, 10]  [11, 11, 11, 11]  [12, 11, 11, 11, 11]

// RANGE: 8 - 11
//  meso 1: 150 [8, 8, 8]  [9, 9, 9]  [10, 10, 10]  [11, 11, 11]
//  meso 2: 155 [8, 8, 8]  [9, 9, 9]  [10, 10, 10]  [11, 11, 11]
//  meso 3: 160 [8, 8, 8]  [9, 9, 9]  [10, 10, 10]  [11, 11, 11]

// SINGLE PROGRESSION ------------------
//   Notes: Single progression involves the progression of only one programming variable, while keeping everything else the same.
//          Good for heavy compounds and low reps (5 reps or less). When last set becomes easy, i.e. from 1 rir to 3 rir then it's time to increase the weight.
//     LBS: Increase weekly at smallest amount.
//    SETS: Don't necessarily need to be fixed.
//    REPS: range gap should be relatively large: i.e. 5-10 reps, 8-12 reps, 10-15 reps, etc.
//     RIR: Is the primary gauge of progression.
//    CONS: Can be hard to gauge your rir which is fundamental to this method.

// DYNAMIC SINGLE PROGRESSION ---------------
//   Notes: Same as SINGLE PROGRESSION but adjust each set based on target RIR. i.e. 1st set can progress in weight faster than subsequent sets.
//    CONS: Have to track each individual set. Can be hard to gauge your rir which is fundamental to this method.

// DOUBLE PROGRESSION -----------------------
//   Notes: Progression of two variables: weight and reps. Progress towards top end of rep range, then when all sets
//          reach that, add weight and start over at the bottom of the rep range.
//          Good for hypertrophy and moderate rep ranges (6-12 reps).
//     LBS: Increase when all sets reach top end of rep range.
//    SETS: Keep fixed.
//    REPS: Small to moderate rep range: i.e. 6-8, 8-10, 8-12, 10-12, 10-15, 12-15, etc.
//     RIR: Can fluctuate between sets. So pay closer attention to initial set's rir.
// IMPLEMENTATION:
// 1. Choose a set matrix. Probably MRV_INIT_ONE.
// 2.

const ex_prog = {
  progression_method: "double",
  rep_range: [8, 12],
  set_prog: "no-add",
  sets: [],
  reps: [],
  weight: [],
  rir: [],
};

// DYNAMIC DOUBLE PROGRESSION ---------------
//   Notes: First initial set determines subsequent sets.
//     LBS: Increase at top end of rep range for each individual set.
//    SETS: Keep fixed.
//    REPS: Small rep range: i.e. 5-6, 6-8, 8-10, 10-12, etc.
//     RIR:  Keep RIR fixed across all sets. Ideally, 1-2 RIR (or 8-9 RPE) for hypertrophy.

// TRIPLE PROGRESSION -----------------------
//   Notes: Progress sets up to top of rep range. Then add a set. Then add weight.
//     LBS: Add weight after reaching top of rep range for all sets and added all sets.
//    SETS: Create a range of sets to progress through. i.e. 2-3, 3-4, 4-5, etc.
//    REPS: Small rep range: i.e. 5-6, 6-8, 8-10, 10-12, etc.
//     RIR:  Keep RIR fixed across all sets. Ideally, 1-2 RIR (or 8-9 RPE) for hypertrophy.
//    CONS: Lyle McDonald claims to have never had to use this method.

// EXERCISES---
// 1. based on frequency_progression[frequency_progression.length - 1]. Get exercises by this.
//    i.e. frequency_progression = 4 > [ex 1, ex 2], [ex 3, ex 4], [ex 5, ex 6], [ex 7, ex 8]
// 2. get setProgressionMatrix depending on progression_method.
// 3.

// type SetsType = number;
type RepsType = number;
type LbsType = number;
type RirType = number;

type SetType = [RepsType, LbsType, RirType];
type SetOverMicrocyclesType = SetType[];
type MesocycleType = SetOverMicrocyclesType[];

//                       M I C R O C Y C L E S
//                1           2           3           4
//        ||=================================================
//  set1  || [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
//  set2  || [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
//  set3  || [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
//  set4  || [        [], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
//  set5  || [        [],         [],         [], [9, 10, 2]],

// prettier-ignore
const EXERCISE_SET_PROGRESSION_OVER_MESOCYCLES: MesocycleType[] = [
  [
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
  ],
  [
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
  ],
  [
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
    [[8, 10, 2], [9, 10, 2], [9, 10, 2], [9, 10, 2]],
  ],
];

const SETS = {
  progression_method: "double",
  set_progression_schema: "NO_ADD",
  rep_range: [8, 12],
  weight_increment: 5,
  superset_id: null,
  training_modality: "straight",
  set_progression: [...EXERCISE_SET_PROGRESSION_OVER_MESOCYCLES],
};

const INITIAL_EXERCISE = {
  id: "001_Triceps Extension (cable, single-arm)",
  name: "Triceps Extension (cable, single-arm)",
  muscle: "triceps",
  data: {
    movement_type: "isolation",
    requirements: ["cable"],
    region: {
      primary: "long-head",
      secondary: [],
    },
  },
  sets: { ...SETS },
};

// TODO: Get exercises algorithmically!
// Determiners: Frequency, volume_landmark (set range), progression_overload_method
//

// BACK -- mrv = 20-26 | mrv-a = 20-26 | mrv-p = 26-34

// 34 / 4 = 8.5
// 34 - 5 =

// 30 / 3 = 10 = 10 10 10
// 29 / 3 = 9.67 = 10 + 10 + 9
// 28 / 3 = 9.33 = 10 + 9 + 9
// 27 / 3 = 9

// 30 / 4 = 7.5  = 8 8 7 7
// 29 / 4 = 7.25 = 8 7 7 7
// 28 / 4 = 7    = 7 7 7 7
// 27 / 4 = 6.75 = 7 7 7 6

// 30 / 5 = 6.0  = 6 6 6 6 6
// 29 / 5 = 5.8  = 6 6 6 6 5
// 28 / 5 = 5.6  = 6 6 6 5 5
// 27 / 5 = 5.4  = 6 6 6 6 6
const MIN_SETS = 2;
const MAX_SETS = 5;
const MAX_SETS_PER_SESSION = 12;

const getTotalSessionsWithOneExercise = (initial_sets: number[][]) => {
  let total = 0;
  for (let i = 0; i < initial_sets.length; i++) {
    if (initial_sets[i].length === 1) {
      total++;
    }
  }
  return total;
};

const getSingleExerciseSessionSets = (
  total_sets: number,
  total_single_exercise_sessions: number
) => {
  const avg_sets_per_session = Math.floor(
    total_sets / total_single_exercise_sessions
  );

  let single_session_sets: number[][] = [];
  for (let i = 0; i < total_single_exercise_sessions; i++) {
    const min_acceptable_sets = avg_sets_per_session >= MIN_SETS;
    if (!min_acceptable_sets) {
      single_session_sets.push([MIN_SETS]);
      continue;
    }
    const max_acceptable_sets = avg_sets_per_session <= MAX_SETS;
    if (!max_acceptable_sets) {
      single_session_sets.push([MAX_SETS]);
      continue;
    }
    single_session_sets.push([avg_sets_per_session]);
  }
  return single_session_sets;
};

const areSetsWithinRange = (sets_range: number[], sets: number[][]) => {
  const total_sets = sets.reduce((acc, curr) => acc + curr[0], 0);
  return total_sets >= sets_range[0] && total_sets <= sets_range[1];
};

const filterOutZeroSets = (sets: number[][]) => {
  return sets.filter((session) => {
    const total_sets = session.reduce((acc, curr) => acc + curr, 0);
    if (total_sets > 0) return session;
  });
};

const addAdditionalSets = (sets: number[], sets_to_add: number) => {
  const total_sets = sets.reduce((acc, curr) => acc + curr, 0);

  const loop_limit = sets.length + 1;
  let sets_counter = sets_to_add;
  for (let i = 0; i < loop_limit; i++) {
    if (!sets[i] && sets_counter > 0) {
      sets.push(sets_counter);
      sets_counter = sets_counter - sets_counter;
    }
    const addable_sets = MAX_SETS - sets[i];
    sets[i] = sets[i] + addable_sets;
    sets_counter = sets_counter - addable_sets;
  }
  return { sets, sets_counter };
};

const adjustSets = (sets_range: number[], sets: number[][]) => {
  const total_sets = sets.reduce((acc, curr) => acc + curr[0], 0);
  let total_difference = sets_range[1] - total_sets;

  let sets_to_add_per_session = Math.floor(total_difference / sets.length);

  const sets_integer = Math.floor(sets_to_add_per_session);
  const sets_decimal = sets_to_add_per_session - sets_integer;
  const decimal_fixer = (sets_decimal * sets.length).toFixed();

  let total_sessions_to_add_one_set = Number(decimal_fixer);

  for (let i = 0; i < sets.length; i++) {
    let session_sets = sets[i];
    const stuff = addAdditionalSets(session_sets, sets_integer);
    session_sets = stuff.sets;
    total_difference = total_difference - stuff.sets_counter;

    const add_only_one = total_sessions_to_add_one_set > 0 ? 1 : 0;
    if (add_only_one) {
      for (let j = 0; j < session_sets.length; j++) {
        if (session_sets[j] < MAX_SETS && add_only_one > 0) {
          session_sets[j] += 1;
          total_sessions_to_add_one_set--;
        }
      }
    }
    sets[i] = session_sets;
  }
  return sets;
};

// NOTES: the max amount of exercises per sessions is determined by the rest period.
// [1] = at least 24 hrs rest between sessions
// [1, 2] = at least 48 hrs rest between sessions
// [1, 2, 3] = at least 72 hrs rest between sessions
const getTotalExercises = (matrix: number[][][]) => {
  return matrix.map((row) => row.reduce((acc, curr) => acc + curr.length, 0));
};
const getMinSetRange = (matrix: number[][][]) => {
  return matrix.map((row) => row.flat().reduce((acc, curr) => acc + curr, 0));
};
const getMaxSetRange = (matrix: number[][][]) => {
  return matrix.map((row) =>
    row.reduce(
      (acc, curr) =>
        acc +
        (curr.length >= 3
          ? 12
          : curr.length === 2
          ? 10
          : curr.length === 1
          ? 5
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
  frequency_matrix: number[][][]
) => {
  const max = variationPerSessionRange[1];
  const max_volume = set_range[1];
  const max_sets = getMaxSetRange(frequency_matrix);

  let index = 0;
  for (let i = 0; i < frequency_matrix.length; i++) {
    const max_ex_per_session = frequency_matrix[i][0].length;
    const curr_max_volume = max_sets[i];

    if (max_ex_per_session > max) break;
    if (curr_max_volume >= max_volume) {
      index = i;
      break;
    }
  }

  const optimal_placeholder = frequency_matrix[index];
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
  set_range: number[]
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
    frequency_matrix
  );
};

// FUNCTIONALITY:
// Purpose: Considering user's ideal frequency for a muscle group.
// 1.  Seven matrices for total frequencies possible in a training week (Not considering, multiple sessions per day).
// 1a. Each of these seven matrices contains layouts of possible total exercises represented by 2s.
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

// prettier-ignore
const FREQUENCY_MATRIX_SEVEN = [                                                 // SETS   INIT MAX
  [[2, 2, 2], [      2], [      2], [   2, 2], [      2], [   2, 2], [      2]], // 1-2-4   22  52
  [[   2, 2], [      2], [   2, 2], [      2], [   2, 2], [      2], [      2]], // 0-3-4   20  50
  [[2, 2, 2], [      2], [      2], [2, 2, 2], [      2], [      2], [      2]], // 2-0-5   22  49
  [[2, 2, 2], [      2], [      2], [   2, 2], [      2], [      2], [      2]], // 1-1-5   20  47
  [[   2, 2], [      2], [   2, 2], [      2], [      2], [      2], [      2]], // 0-2-5   18  45
  [[2, 2, 2], [      2], [      2], [      2], [      2], [      2], [      2]], // 1-0-6   18  42
  [[   2, 2], [      2], [      2], [      2], [      2], [      2], [      2]], // 0-1-6   16  40
  [[      2], [      2], [      2], [      2], [      2], [      2], [      2]], // 0-0-7   14  35
]
const IDEAL_FREQUENCY_MATRIX_SEVEN = FREQUENCY_MATRIX_SEVEN[4];

// prettier-ignore
const FREQUENCY_MATRIX_SIX = [                                                   // SETS   INIT MAX
  [[       ], [2, 2, 2], [      2], [   2, 2], [      2], [   2, 2], [      2]], // 1-2-3   20  47
  [[       ], [   2, 2], [      2], [   2, 2], [      2], [   2, 2], [      2]], // 0-3-3   18  45
  [[       ], [2, 2, 2], [      2], [      2], [2, 2, 2], [      2], [      2]], // 2-0-4   20  44
  [[       ], [2, 2, 2], [      2], [   2, 2], [      2], [      2], [      2]], // 1-1-4   18  42
  [[       ], [   2, 2], [      2], [   2, 2], [      2], [      2], [      2]], // 0-2-4   16  40  8
  [[       ], [   2, 2], [      2], [      2], [      2], [      2], [      2]], // 0-1-5   14  35
  [[       ], [      2], [      2], [      2], [      2], [      2], [      2]], // 0-0-6   12  30
]
const IDEAL_FREQUENCY_MATRIX_SIX = FREQUENCY_MATRIX_SIX[4];

// prettier-ignore
const FREQUENCY_MATRIX_FIVE = [                                                  // SETS   INIT MAX EXERCISES
  [[       ], [   2, 2], [      2], [   2, 2], [       ], [   2, 2], [      2]], // 0-3-2   16  40  8
  [[       ], [2, 2, 2], [      2], [      2], [       ], [2, 2, 2], [      2]], // 2-0-3   18  39  9
  [[       ], [2, 2, 2], [      2], [      2], [       ], [   2, 2], [      2]], // 1-1-3   16  37  8
  [[       ], [2, 2, 2], [      2], [      2], [       ], [      2], [      2]], // 1-0-4   14  32  7
  [[       ], [   2, 2], [      2], [      2], [       ], [      2], [      2]], // 0-1-4   12  30  6
  [[       ], [      2], [      2], [      2], [       ], [      2], [      2]], // 0-0-5   10  25  5
]
const IDEAL_FREQUENCY_MATRIX_FIVE = FREQUENCY_MATRIX_FIVE[0];

// prettier-ignore
const FREQUENCY_MATRIX_FOUR = [                                                  // SETS   INIT MAX EXERCISES
  [[       ], [   2, 2], [       ], [   2, 2], [       ], [   2, 2], [      2]], // 0-3-1   14  35  8
  [[       ], [2, 2, 2], [       ], [      2], [       ], [2, 2, 2], [      2]], // 2-0-2   16  34  8
  [[       ], [2, 2, 2], [       ], [      2], [       ], [   2, 2], [      2]], // 1-1-2   14  32  7
  [[       ], [   2, 2], [       ], [   2, 2], [       ], [      2], [      2]], // 0-2-2   12  30  6
  [[       ], [2, 2, 2], [       ], [      2], [       ], [      2], [      2]], // 1-0-3   12  27  6
  [[       ], [   2, 2], [       ], [      2], [       ], [      2], [      2]], // 0-1-3   10  25  5
  [[       ], [      2], [       ], [      2], [       ], [      2], [      2]], // 0-0-4    8  20  4
]
const IDEAL_FREQUENCY_MATRIX_FOUR = FREQUENCY_MATRIX_FOUR[0];

// prettier-ignore
const FREQUENCY_MATRIX_THREE = [                                                 // SETS   INIT MAX
  [[       ], [   2, 2], [       ], [   2, 2], [       ], [   2, 2], [       ]], // 0-3-0   16  30
  [[       ], [2, 2, 2], [       ], [      2], [       ], [2, 2, 2], [       ]], // 2-0-1   12  29
  [[       ], [2, 2, 2], [       ], [      2], [       ], [   2, 2], [       ]], // 1-1-1   12  27
  [[       ], [   2, 2], [       ], [   2, 2], [       ], [      2], [       ]], // 0-2-1   14  25
  [[       ], [   2, 2], [       ], [      2], [       ], [      2], [       ]], // 0-1-2   14  20
  [[       ], [      2], [       ], [      2], [       ], [      2], [       ]], // 0-1-3   10  15
]
const IDEAL_FREQUENCY_MATRIX_THREE = FREQUENCY_MATRIX_THREE[0];

// prettier-ignore
const FREQUENCY_MATRIX_TWO = [                                                   // SETS   INIT MAX
  [[       ], [2, 2, 2], [       ], [       ], [       ], [2, 2, 2], [       ]], // 2-0-0   12  24
  [[       ], [2, 2, 2], [       ], [       ], [       ], [   2, 2], [       ]], // 1-1-0   10  22
  [[       ], [   2, 2], [       ], [       ], [       ], [   2, 2], [       ]], // 0-2-0    8  20
  [[       ], [2, 2, 2], [       ], [       ], [       ], [      2], [       ]], // 1-0-1    8  17
  [[       ], [   2, 2], [       ], [       ], [       ], [      2], [       ]], // 0-1-1    6  15
  [[       ], [      2], [       ], [       ], [       ], [      2], [       ]], // 0-0-2    4  10
]
const IDEAL_FREQUENCY_MATRIX_TWO = FREQUENCY_MATRIX_TWO[1];

// prettier-ignore
const FREQUENCY_MATRIX_ONE = [                                                   // SETS   INIT MAX
  [[       ], [2, 2, 2], [       ], [       ], [       ], [       ], [       ]], // 1-0-0    6  12
  [[       ], [   2, 2], [       ], [       ], [       ], [       ], [       ]], // 0-1-0    4  10
  [[       ], [      2], [       ], [       ], [       ], [       ], [       ]], // 0-0-1    2   5
]
const IDEAL_FREQUENCY_MATRIX_ONE = FREQUENCY_MATRIX_ONE[0];

const FREQUENCY_MATRIX_COMBINED = [
  FREQUENCY_MATRIX_ONE,
  FREQUENCY_MATRIX_TWO,
  FREQUENCY_MATRIX_THREE,
  FREQUENCY_MATRIX_FOUR,
  FREQUENCY_MATRIX_FIVE,
  FREQUENCY_MATRIX_SIX,
  FREQUENCY_MATRIX_SEVEN,
];

export const accumulateFinalMicrocycleSets = (
  sets_range: number[],
  initial_sets: number[][]
) => {
  const frequency = initial_sets.length;
  const total_one_exercise_sessions =
    getTotalSessionsWithOneExercise(initial_sets);
  const single_set_sessions: number[][] = getSingleExerciseSessionSets(
    sets_range[1],
    total_one_exercise_sessions
  );

  const sets_to_subtract = single_set_sessions.reduce(
    (acc, curr) => acc + curr[0],
    0
  );
  const total_many_exercise_sets = sets_range[1] - sets_to_subtract;
  if (
    total_one_exercise_sessions === frequency ||
    total_many_exercise_sets <= 0
  ) {
    console.log(
      sets_range,
      initial_sets,
      total_one_exercise_sessions,
      single_set_sessions,
      "ok first test - first first"
    );
    // if (sets_range[1] > totals) {
    //   const adjusted_sets = adjustSets(sets_range, single_set_sessions);
    //   console.log(
    //     rank,
    //     muscle_name,
    //     sets_range,
    //     initial_sets,
    //     total_one_exercise_sessions,
    //     single_set_sessions,
    //     adjusted_sets,
    //     totals,
    //     "ok first test - first first"
    //   );
    //   return adjusted_sets;
    // }
    return single_set_sessions;
  }

  const remaining_sessions = frequency - total_one_exercise_sessions;
  const total_sets_per_two_exercise_session =
    total_many_exercise_sets / remaining_sessions;
  const sets_integer = Math.floor(total_sets_per_two_exercise_session);
  const sets_decimal = total_sets_per_two_exercise_session - sets_integer;

  const decimal_fixer = (sets_decimal * remaining_sessions).toFixed();
  let total_sessions_to_add_one_set = Number(decimal_fixer);

  const double_set_sessions: number[][] = [];
  for (let i = 0; i < remaining_sessions; i++) {
    let sets = sets_integer;

    if (total_sessions_to_add_one_set > 0) {
      sets = sets_integer + 1;
      total_sessions_to_add_one_set--;
    }

    const split_sets = sets / 2;
    const sets_one = Math.ceil(split_sets);
    const sets_two = Math.floor(split_sets);
    const session = [sets_one, sets_two];

    double_set_sessions.push(session);
  }

  const total_sets = [...double_set_sessions, ...single_set_sessions];
  const filtered_total_sets = filterOutZeroSets(total_sets);

  const totals = filtered_total_sets.reduce(
    (acc, curr) => acc + curr.reduce((a, c) => a + c, 0),
    0
  );

  console.log(
    sets_range,
    initial_sets,
    double_set_sessions,
    single_set_sessions,
    total_one_exercise_sessions,
    sets_to_subtract,
    total_many_exercise_sets,
    remaining_sessions,
    total_sets_per_two_exercise_session,
    sets_integer,
    sets_decimal,
    decimal_fixer,
    total_sessions_to_add_one_set,
    total_sets,
    filtered_total_sets,
    totals,
    "ok first test"
  );

  return total_sets;
};

//  FIRST MESO - 2x
//       3,2 2,2 = 9
//       3,3 3,2 = 11
//       4,3 3,3 = 13
//       4,4 4,3 = 15

// MIDDLE MESO - 3x
//   3,3 3,2 3,2 = 16
//   4,3 3,3 3,3 = 19
//   4,4 4,3 4,3 = 22
//   5,4 4,4 4,4 = 25

//  FINAL MESO - 4x
// 4,3 4,3 3,4 2 = 23
// 4,4 4,4 4,4 3 = 27
// 4,5 5,4 4,5 4 = 31
// 5,5 5,5 5,4 5 = 34

// 2,2 2,2 2,2 2 = 14
// 3,2 3,2 3,2 3 = 18
// 3,3 3,3 3,3 4 = 22
// 4,3 4,3 4,3 5 = 26

// MRV_INIT
// 7  20  [2, 2]   [2, 2]   [2, 2]   [2]   [2]   [2]   [2]
// 6  18  [2, 2]   [2, 2]   [2, 2]   [2]   [2]   [2]
// 5  16  [2, 2]   [2, 2]   [2, 2]   [2]   [2]
// 4  14  [2, 2]   [2, 2]   [2, 2]   [2]
// 3  12  [2, 2]   [2, 2]   [2, 2]
// 2   8  [2, 2]   [2, 2]

// MRV = 20-26
// 7    [3, 3]    [3, 2]   [3, 2]   [3]   [3]   [2]   [2]
// 6    [3, 3]    [3, 3]   [3, 3]   [3]   [3]   [2]
// 5    [3, 3]    [3, 3]   [3, 3]   [3]   [2]
// 4    [3, 3]    [3, 3]   [4, 3]   [4]
// 3    [5, 5]    [5, 5]   [5, 5]
// 2 [4, 4, 4] [4, 4, 4]

// MRV-P = 34
// 7    [4, 4]    [4, 3]   [4, 3]   [3]   [3]   [3]   [3]
// 6    [4, 4]    [4, 4]   [4, 4]   [4]   [3]   [3]
// 6    [3, 3]    [3, 3]   [3, 3]   [3]   [3]   [2]
// 5    [3, 3]    [3, 3]   [3, 3]   [3]   [2]
// 4    [3, 3]    [3, 3]   [4, 3]   [4]
// 3    [5, 5]    [5, 5]   [5, 5]
// 2 [4, 4, 4] [4, 4, 4]

// DYNAMIC DOUBLE PROGRESSION (MRV = 20)---------------
// 7    [3]    [3] [3] [3] [3] [3] [2]
// 7    [2]    [2] [2] [2] [2] [2] [2]
// 6 [3, 3]    [3] [3] [3] [3] [2]
// 5 [3, 3] [3, 3] [3] [3] [2]
// 4 [3, 3] [3, 3] [4] [4]
// 3 [4, 4] [4, 4] [4]
// 2 [5, 5] [5, 5]

const getExercises = (frequency_progression: number[]) => {};

const initExerciseSetProgression_double = (
  set_range: number[],
  frequency_progression: number[],
  microcycles: number
) => {
  const initialSet = [10, 10, 2];
};
