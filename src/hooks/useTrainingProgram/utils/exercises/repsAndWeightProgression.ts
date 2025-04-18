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

// MRV_INIT
// 7  20  [2, 2]    [2, 2]   [2, 2]   [2]   [2]   [2]   [2]
// 6  18  [2, 2]    [2, 2]   [2, 2]   [2]   [2]   [2]
// 5  16  [2, 2]    [2, 2]   [2, 2]   [2]   [2]
// 4  14  [2, 2]    [2, 2]   [2, 2]   [2]
// 3  12  [2, 2]    [2, 2]   [2, 2]
// 2   8  [2, 2]    [2, 2]

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
