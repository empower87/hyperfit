import { FULL_BODY_MUSCLES, MuscleType } from "~/constants/workoutSplits";

const SYSTEMIC_FATIGUE_MODIFIER = 2;
const LOWER_MODIFIER = 1.15;

const INITIAL_MRV_BREAKPOINT = 4;
const INITIAL_MEV_BREAKPOINT = 9;

const RANK_TEST = [26, 24, 22, 20, 16, 15, 14, 13, 12, 6, 5, 4, 3, 2];

const RANK_WEIGHTS = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
// export const RANK_WEIGHTS_TEST = [
//   3, 2.8, 2.6, 2.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1, 1, 1, 1, 1,
// ];
// export const RANK_WEIGHTS_TEST = [
//   2, 1.9, 1.8, 1.7, 1.2, 1.2, 1.2, 1.2, 1.05, 1.05, 1.05, 1.05, 1.05, 1,
// ];

// CURRENT ALGO:
// 1. starting at 14 (FULL_BODY_MUSCLES.length) * 2 for MRV then - 4/2
export const getWeightedList = (breakpoints: [number, number]) => {
  const weights: number[] = [];
  let mrv = breakpoints[0];
  let mev = breakpoints[1];

  // FULL_BODY_MUSCLES is an array of every muscleType
  let init_mev_or_mv = 0;
  for (let i = 0; i < FULL_BODY_MUSCLES.length; i++) {
    const initialValue = FULL_BODY_MUSCLES.length - i;
    if (i < mrv) {
      const dilute = Math.round(mrv / 2);
      const mrv_weight = initialValue * 2 - dilute;
      weights.push(mrv_weight);
    } else if (i === mrv) {
      const dilute = mrv;
      const mev_weight = initialValue * 2 - dilute;
      init_mev_or_mv = mev_weight;
      weights.push(init_mev_or_mv);
    } else if (i < mev) {
      init_mev_or_mv--;
      weights.push(init_mev_or_mv);
    } else if (i === mev) {
      const dilute = mrv;
      const mv_weight = initialValue * 2 - dilute || 0;
      init_mev_or_mv = mv_weight;
      weights.push(init_mev_or_mv);
    } else {
      init_mev_or_mv--;
      weights.push(init_mev_or_mv || 0);
    }
  }
  return weights;
};

export const getRankWeightForMuscle = (
  index: number,
  muscle: MuscleType,
  weights: number[]
) => {
  let muscle_rank = 0;
  switch (muscle) {
    case "hamstrings":
    case "glutes":
    case "calves":
    case "quads":
      let lowerMod = Math.round(weights[index] * LOWER_MODIFIER);
      // if (index < 3 && muscle === "quads") {
      //   lowerMod = lowerMod * SYSTEMIC_FATIGUE_MODIFIER;
      // }
      muscle_rank = lowerMod;
      break;
    case "back":
    case "chest":
    case "biceps":
    case "triceps":
    case "traps":
    case "forearms":
    case "delts_rear":
    case "delts_side":
    case "delts_front":
    case "abs":
    default:
      muscle_rank = weights[index];
  }
  return muscle_rank;
};

// MUSCLE  |  OPT_FREQ  |  MUS_VOL  |
// ======================================================================
// LEGS
// ----------------------------------------------------------------------
// quads   |    3.5     |   1.38   |
// hams    |    2.5     |   1.15   |
// glutes  |    3.5     |   1.18   |
// calves  |    4.5     |   1.18   |

// PUSH
// ----------------------------------------------------------------------
// chest   |    3.5     |   1.05   |
// triceps |    3.0     |   1.05   |
// f_delts |    2.5     |   1.02   |
// s_delts |    4.5     |   1.03   |

// PULL
// ----------------------------------------------------------------------
// back    |    3.5     |   1.10   |
// biceps  |    4.5     |   1.02   |
// r_delts |    4.5     |   1.01   |
// traps   |    3.0     |   1.03   |
// --------
