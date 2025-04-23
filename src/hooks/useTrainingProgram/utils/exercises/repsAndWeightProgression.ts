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

const SET = [1, 8, 105, 2];

const MICROCYCLE = [8, 105, 2];

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

const totalSessionsWithOneExercise = (initial_sets: number[][]) => {
  let total = 0;
  for (let i = 0; i < initial_sets.length; i++) {
    if (initial_sets[i].length === 1) {
      total++;
    }
  }
  return total;
};

export const accumulateFinalMicrocycleSets = (
  rank: number,
  muscle_name: string,
  sets_range: number[],
  initial_sets: number[][]
) => {
  const frequency = initial_sets.length;
  const total_one_exercise_sessions =
    totalSessionsWithOneExercise(initial_sets);
  const single_set_sessions: number[][] = Array.from(
    Array(total_one_exercise_sessions),
    (e, i) => [MAX_SETS]
  );

  if (total_one_exercise_sessions === frequency) {
    console.log(
      rank,
      muscle_name,
      sets_range,
      initial_sets,
      total_one_exercise_sessions,
      single_set_sessions,
      "ok first test - first first"
    );
    return single_set_sessions;
  }

  const sets_to_subtract = total_one_exercise_sessions * MAX_SETS;
  const total_many_exercise_sets = sets_range[1] - sets_to_subtract;

  const remaining_sessions = frequency - total_one_exercise_sessions;
  const total_sets_per_two_exercise_session =
    total_many_exercise_sets / remaining_sessions;
  const sets_integer = Math.floor(total_sets_per_two_exercise_session);
  const sets_decimal = total_sets_per_two_exercise_session - sets_integer;

  const decimal_fixer = (sets_decimal * remaining_sessions).toFixed();
  let total_sessions_to_add_one_set = Number(decimal_fixer);

  let array: number[][] = [];
  for (let i = 0; i < remaining_sessions; i++) {
    let sets: number[] = [];

    let sets_ = sets_integer;
    if (total_sessions_to_add_one_set > 0) {
      sets_ = sets_integer + 1;
      total_sessions_to_add_one_set--;
    }

    let split_sets = sets_ / 2;
    const sets_one = Math.floor(split_sets);
    const sets_two = Math.ceil(split_sets);
    sets = [sets_two, sets_one];

    array.push(sets);
  }

  console.log(
    rank,
    muscle_name,
    sets_range,
    initial_sets,
    array,
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
    "ok first test"
  );

  // NOTE: 4/22/2025. SEEMS TO WORK!
  return [...array, ...single_set_sessions];
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
