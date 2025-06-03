// SINGLE
// IDEAL: low reps. i.e. 3-5, 5-8
// Requires skill with RiR.
// 100lbs x 8 reps at 3 rir
// 105lbs x 8 reps at 2 rir
// 100lbs x 5 reps at 1 rir > 100lbs x 5 reps at 2rir 100 lbs x 5 reps at 3rir
// ALGO MAP ----------------------------
//  sets = 3; reps = 5; lbs = 100; initial_rir = 1; target_rir = 3; load_increment = 5
// WEEK   1   2   3   4   5   6   7   8
// SETS   3   3   3   3   3   3   3   3
// REPS   5   5   5   5   5   5   5   5
//  LBS  100 100 100 105 105 105 110 110
//  RIR   1   2   3   1   2   3   1   2
const progressionHandler_single = (
  one_rep_max: number,
  initial_rir: number,
  target_rir: number,
  reps: number,
  load_increment: number
) => {
  // 1. Calculate starting load based on 1RM and initial_rir.
  // 2. Weight increases when target_rir is reached.
  //    THIS IS UNDETERMINED LOGIC. Should rir be increased by week, or every other week?
  // 3. Add load by increment. And reset RIR to initial_rir.
};

// DYNAMIC_SINGLE

// DOUBLE
// Requires 3-5 rep range spread. i.e. 5-8, 8-10, 8-12, 12-15, 15-20
// freqeuncy = 2, 3, 4
// 1. get final week placeholders.
// 2. get full macrocycle placeholders. [[2, 2], [2, 2, 2], [2, 2, 2, 2]]
// ALGO MAP ----------------------------
//  sets = 3; reps = 3,5; lbs = 100; target_rir = 2; load_increment = 5
// WEEK   1   2   3   4   5   6   7   8
// SETS   3   3   3   3   3   3   3   3
// REPS   5   6   7   8   5   6   7   8
//  LBS  100 100 100 100 105 105 105 105
//  RIR   2   2   2   2   2   2   2   2
const progressionHandler_double = (
  one_rep_max: number,
  target_rir: number,
  rep_range: number[],
  load_increment: number
) => {
  // 1. Calculate starting load based on 1RM and initial_rir.
  //    initial_weight:
  //      rep_total  = rep_range[0] + target_rir
  //      percentage_of_1rm = PERCENTAGE_OF_1RM_REPS[rep_total]
  //      load = one_rep_max * percentage_of_1rm
  // 2. Weight increases when last set hits the top end of the rep range.
  //
};

// DYNAMIC_DOUBLE

// DOUBLE_SET_WEIGHT
// SETS = add 1 set to an exercise in a session each microcycle until the final week.
// REPS = within a range. ideally larger range. i.e. 5-10, 10-15, 15-20, 10-20
// LOAD = When upper rep range is
// ALGO MAP ----------------------------
//  sets = 2,4; reps = 5,10; lbs = 100; target_rir = 2; load_increment = 5
// WEEK   1   2   3   4   5   6   7   8
// SETS   2   3   3   4   3   4   4   5
// REPS   9   8   6   5   5   6   7   8
//  LBS  100 105 110 115 105 110 115 120
//  RIR   3   2   1   0   3   2   1   0
const progressionHandler_doubleSetWeight = (
  one_rep_max: number,
  initial_rir: number,
  target_rir: number,
  rep_range: number[],
  load_increment: number
) => {
  // 1. Calculate starting load based on 1RM and initial_rir.
  //    initial_weight:
  //      rep_total  = rep_range[0] + initial_rir
  //      percentage_of_1rm = PERCENTAGE_OF_1RM_REPS[rep_total]
  //      load = one_rep_max * percentage_of_1rm
  // 2. Sets increase by 0 or 1 each week until target sets[1] is reached.
  // 3. Reps decrease by 1 each week until the target_rir is reached.
  // 4. Weight increases by load_increment each week until the target_rir is reached.
};

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
