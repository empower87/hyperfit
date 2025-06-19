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

import {
  ExerciseType,
  VolumeLandmarkType,
} from "../../reducer/trainingProgramReducer";
import { initNewExercise, JSONExercise } from "./getExercises";
import { ProgressionMethodType } from "./repsAndWeightProgression";

//  RIR   1   2   3   1   2   3   1   2
const progressionHandler_single = (
  initial_lbs: number,
  rir_range: number[],
  rep_range: number[],
  set_range: number[] = [2, 4],
  load_increment: number
) => {
  // 1. Calculate starting load based on 1RM and initial_rir.
  // 2. Weight increases when target_rir is reached.
  //    THIS IS UNDETERMINED LOGIC. Should rir be increased by week, or every other week?
  // 3. Add load by increment. And reset RIR to initial_rir.
  return [] as number[][];
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
  initial_lbs: number,
  rir_range: number[],
  rep_range: number[],
  set_range: number[] = [2, 4],
  load_increment: number
) => {
  // 1. Calculate starting load based on 1RM and initial_rir.
  //    initial_weight:
  //      rep_total  = rep_range[0] + target_rir
  //      percentage_of_1rm = PERCENTAGE_OF_1RM_REPS[rep_total]
  //      load = one_rep_max * percentage_of_1rm
  // 2. Weight increases when last set hits the top end of the rep range.
  //
  const microcycles = 4;
  const SETS = set_range[0];
  const REPS = rep_range[0];
  const LBS = initial_lbs;
  const RIR = rir_range[0];
  let initial_microcycle: number[] = [SETS, REPS, LBS, RIR];
  let microcycle_progression: number[][] = [initial_microcycle];
  for (let i = 1; i <= microcycles; i++) {
    let previous_microcycle = microcycle_progression[i - 1];
    let prev_sets = previous_microcycle[0];
    let prev_reps = previous_microcycle[1];
    let prev_lbs = previous_microcycle[2];
    let prev_rir = previous_microcycle[3];

    const new_reps = prev_reps + 1;
    if (new_reps > rep_range[1]) {
      prev_reps = rep_range[0];
      prev_lbs += load_increment;
    } else {
      prev_reps += 1;
    }

    let new_microcycle: number[] = [prev_sets, prev_reps, prev_lbs, prev_rir];
    microcycle_progression.push(new_microcycle);
  }
  return microcycle_progression;
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
  initial_lbs: number,
  rir_range: number[],
  rep_range: number[],
  set_range: number[] = [2, 4],
  load_increment: number
) => {
  const microcycles = 4;
  // 1. Calculate starting load based on 1RM and initial_rir.
  //    initial_weight:
  //      rep_total  = rep_range[0] + initial_rir
  //      percentage_of_1rm = PERCENTAGE_OF_1RM_REPS[rep_total]
  //      load = one_rep_max * percentage_of_1rm
  // 2. Sets increase by 0 or 1 each week until target sets[1] is reached.
  // 3. Reps decrease by 1 each week until the target_rir is reached.
  // 4. Weight increases by load_increment each week until the target_rir is reached.
  const SETS = set_range[0];
  const REPS = rep_range[1];
  const LBS = initial_lbs;
  const RIR = rir_range[0];
  let initial_microcycle: number[] = [SETS, REPS, LBS, RIR];
  let microcycle_progression: number[][] = [initial_microcycle];
  for (let i = 1; i <= microcycles; i++) {
    let previous_microcycle = microcycle_progression[i - 1];
    let prev_sets = previous_microcycle[0];
    let prev_reps = previous_microcycle[1];
    let prev_lbs = previous_microcycle[2];
    let prev_rir = previous_microcycle[3];

    const new_sets = prev_sets < set_range[1] ? prev_sets + 1 : prev_sets;
    const new_reps = prev_reps > rep_range[0] ? prev_reps - 1 : prev_reps;
    const new_lbs = prev_lbs + load_increment;
    const new_rir = prev_rir > rir_range[1] ? prev_rir - 1 : prev_rir;
    let new_microcycle: number[] = [new_sets, new_reps, new_lbs, new_rir];

    microcycle_progression.push(new_microcycle);
  }
  return microcycle_progression;
};

// TRIPLE
// IDEAL: Best for isolation exercises.
// progress to the top end of rep range. Then add a set. Progress again to top end of rep range. Add weight and restart.
// LOAD = When upper rep range is
// ALGO MAP ----------------------------
//  sets = 2,3; reps = 8,10; lbs = 100; target_rir = 2; load_increment = 5
// WEEK   1   2   3   4   5   6   7   8
// SETS   2   2   2   3   3   3   2   2
// REPS   8   9  10   8   9  10   8   9
//  LBS  100 100 100 100 100 100 105 105
//  RIR   2   2   2   2   2   2   2   2
const progressionHandler_triple = (
  set_range: number[] = [2, 4],
  rep_range: number[],
  rir_range: number[],
  curr_sets: number,
  curr_reps: number,
  curr_lbs: number,
  curr_rir: number,
  load_increment: number,
  microcycles: number
) => {
  // 1. Calculate starting load based on 1RM and initial_rir.
  //    initial_weight:
  //      rep_total  = rep_range[0] + initial_rir
  //      percentage_of_1rm = PERCENTAGE_OF_1RM_REPS[rep_total]
  //      load = one_rep_max * percentage_of_1rm
  // 2. Sets increase by 0 or 1 each week until target sets[1] is reached.
  // 3. Reps decrease by 1 each week until the target_rir is reached.
  // 4. Weight increases by load_increment each week until the target_rir is reached.
  const SETS = curr_sets
  const REPS = curr_reps
  const LBS = curr_lbs;
  const RIR = curr_rir
  let initial_microcycle: number[] = [SETS, REPS, LBS, RIR];
  let microcycle_progression: number[][] = [initial_microcycle];

  // 1. Add reps until rep_range[1] is reached.
  // 2. Add a set if possible. Reset reps to rep_range[0].
  //    If set is at set_range[1], then increase weight and reset reps/sets.
  for (let i = 1; i <= microcycles; i++) {
    let previous_microcycle = microcycle_progression[i - 1];
    let prev_sets = previous_microcycle[0];
    let prev_reps = previous_microcycle[1];
    let prev_lbs = previous_microcycle[2];
    let prev_rir = previous_microcycle[3];

    const new_reps = prev_reps + 1;
    const new_sets = prev_sets + 1;
    if (new_reps === rep_range[1]) {
      if (new_sets >= set_range[1]) {
        prev_lbs += load_increment;
        prev_reps = rep_range[0];
        prev_sets = set_range[0];
      } else {
        prev_reps = rep_range[0];
        prev_sets = new_sets;
      }
    } else {
      prev_reps = new_reps;
    }

    let new_microcycle: number[] = [prev_sets, prev_reps, prev_lbs, prev_rir];

    microcycle_progression.push(new_microcycle);
  }
  return microcycle_progression;
};

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

const buildSetProgression = (session_sets: number[], microcycles: number) => {
  // Clone the initial sets so we don't mutate the input
  let currentSets = [...session_sets];
  const progression: number[][] = [];

  for (let i = 0; i < microcycles; i++) {
    // Find the index(es) of the minimum set value(s)
    const minSets = Math.min(...currentSets);
    const minIndexes = currentSets
      .map((val, idx) => (val === minSets ? idx : -1))
      .filter((idx) => idx !== -1);

    // Pick the first exercise with the minimum sets (could randomize or round-robin if you want)
    const chosenIdx = minIndexes[0];

    // Create a binary array for this microcycle
    const binary = currentSets.map((_, idx) => (idx === chosenIdx ? 1 : 0));
    progression.push(binary);

    // Add a set to the chosen exercise
    currentSets[chosenIdx]++;
  }

  return progression;
};

const buildExercises = (
  progression_method: ProgressionMethodType = "DOUBLE_SETS_WEIGHT",
  exercises: JSONExercise[],
  set_progression: number[][][],
  volume_landmark: VolumeLandmarkType,
  microcycles: number = 4
) => {
  const total_mesocycles = set_progression.length;
  const final_mesocycle = set_progression[set_progression.length - 1];

  let exercise_index = 0;
  const total_exercises: ExerciseType[][] = [];
  for (let i = 0; i < final_mesocycle.length; i++) {
    const session_exercises_sets = final_mesocycle[i];
    if (!session_exercises_sets) {
      total_exercises.push([]);
      continue;
    }

    const session_exercises: ExerciseType[] = [];

    let rir_range: number[] = []
    let rep_range: number[] = []
    let lbs: number = 0
    for (let j = 0; j < session_exercises_sets.length; j++) {
      const lol_prog_wow: number[][][] = [];
      // SET_PROGRESSION
      // ex.
      // [
      //    [ [ 2, 2 ], [], [], [], [], [], [] ],
      //    [ [ 2, 2 ], [], [ 2 ], [], [], [], [] ],
      //    [ [ 3, 2 ], [], [ 3 ], [], [ 3 ], [], [] ]
      // ]
      const curr_mesocycle = j;
      const session_index = i;
      const tar_session_sets = set_progression[curr_mesocycle][session_index];
      const add_sets = buildSetProgression(tar_session_sets, microcycles);
      const curr_exercise_set_prog = add_sets[j]

      for (let j = 0; j < total_mesocycles; j++) {
        // SETS_OVER_MICROCYCLES
        // ex. tar_session_sets = [2, 3]
        // [
        //  [2, 3, 3, 4],
        //  [3, 3, 4, 4]
        // ]
        const sets_over_microcycles = tar_session_sets.map((set, index) => {
          let curr_set = set;
          return curr_exercise_set_prog.map((item, i) => {
            if (item === 0) return curr_set;
            curr_set++;
            return curr_set;
          });
        });

        const new_exercise = initNewExercise(
          exercises[exercise_index],
          volume_landmark
        );

        const progression = buildExerciseProgression(
          progression_method,
          new_exercise,
          new_exercise.weight,
          rir_range,
          rep_range,
          curr_exercise_set_prog
        )
      }

      // probably don't need to loop over entire set_progression
      for (let k = 0; k < set_progression.length; k++) {
        const curr_mesocycle_sets = set_progression[k];
        const curr_session_sets = curr_mesocycle_sets[j];

        if (curr_session_sets.length) {
          const add_sets = buildSetProgression(curr_session_sets, microcycles);
          // SETS_OVER_MICROCYCLES
          // ex. curr_session_sets = [2, 3]
          // [
          //  [2, 3, 3, 4],
          //  [3, 3, 4, 4]
          // ]
          const sets_over_microcycles = curr_session_sets.map((set, index) => {
            let curr_set = set;
            return add_sets[index].map((bool, i) => {
              if (bool === 0) return curr_set;
              curr_set++;
              return curr_set;
            });
          });
        }
      }

      const new_exercise = initNewExercise(
        exercises[exercise_index],
        volume_landmark
      );
      exercise_index++;
    }
  }
};


const buildExerciseProgression = (
  progression_method: ProgressionMethodType,
  exercise: ExerciseType,
  weight: number,
  rir_range: number[],
  rep_range: number[],
  set_range: number[] = [2, 4]
) => {
  const mesocycles = 3
  const microcycles = 4
  switch (progression_method) {
    case "SINGLE":
      return progressionHandler_single(
        weight,
        rir_range,
        rep_range,
        set_range,
        exercise.weightIncrement
      );
    case "DYNAMIC_SINGLE":
      return progressionHandler_single(
        weight,
        rir_range,
        rep_range,
        set_range,
        exercise.weightIncrement
      );
    case "DOUBLE":
      return progressionHandler_double(
        weight,
        rir_range,
        rep_range,
        set_range,
        exercise.weightIncrement
      );
    case "DYNAMIC_DOUBLE":
      return progressionHandler_double(
        weight,
        rir_range,
        rep_range,
        set_range,
        exercise.weightIncrement
      );
    case "DOUBLE_SETS_WEIGHT":
      let curr_sets_dsw = set_range[0]
      let curr_reps_dsw = rep_range[0]
      let curr_lbs_dsw = weight
      let curr_rir_dsw = rir_range[0]

      const full_progression_dsw: number[][][] = []
      for (let i = 0; i < mesocycles; i ++) {
        const prog = progressionHandler_triple(
          set_range,
          rep_range,
          rir_range,
          curr_sets_dsw,
          curr_reps_dsw,
          curr_lbs_dsw,
          curr_rir_dsw,
          exercise.weightIncrement,
          microcycles
        );
        full_progression_dsw.push(prog)

        const last_index = prog.length - 1
        const last_prog = prog[last_index]
        const last_set_total = last_prog[0]
        const last_rep_total = last_prog[1]
        const last_lbs_total = last_prog[2]
        curr_sets_dsw = last_set_total
        curr_reps_dsw = last_rep_total
        curr_lbs_dsw = last_lbs_total
      }

      return full_progression_dsw


      // return progressionHandler_doubleSetWeight(
      //   weight,
      //   rir_range,
      //   rep_range,
      //   set_range,
      //   exercise.weightIncrement
      // );
    case "TRIPLE":      
      let curr_sets = set_range[0]
      let curr_reps = rep_range[0]
      let curr_lbs = weight
      let curr_rir = rir_range[0]

      const full_progression: number[][][] = []
      for (let i = 0; i < mesocycles; i ++) {
        const prog = progressionHandler_triple(
          set_range,
          rep_range,
          rir_range,
          curr_sets,
          curr_reps,
          curr_lbs,
          curr_rir,
          exercise.weightIncrement,
          microcycles
        );
        full_progression.push(prog)

        const last_index = prog.length - 1
        const last_prog = prog[last_index]
        const last_set_total = last_prog[0]
        const last_rep_total = last_prog[1]
        const last_lbs_total = last_prog[2]
        curr_sets = last_set_total
        curr_reps = last_rep_total
        curr_lbs = last_lbs_total
      }

      return full_progression

    default:
      throw new Error(`Unknown progression method: ${progression_method}`);
  }
};
