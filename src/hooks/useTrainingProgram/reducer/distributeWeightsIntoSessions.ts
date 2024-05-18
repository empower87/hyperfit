const freqLimitsHandler = (push: number[], pull: number[], legs: number[]) => {
  const pushAvg = Math.round(push[0] + push[1] / 2);
  const pullAvg = Math.round(pull[0] + pull[1] / 2);
  const legsAvg = Math.round(legs[0] + legs[1] / 2);

  const upperMin = Math.round(push[0] + pull[0] / 2);
  const upperMax = Math.round(push[1] + pull[1] / 2);
  return {
    push: {
      min: push[0],
      max: push[1],
      avg: pushAvg,
    },
    pull: {
      min: pull[0],
      max: pull[1],
      avg: pullAvg,
    },
    legs: {
      min: legs[0],
      max: legs[1],
      avg: legsAvg,
    },
    upper: {
      min: upperMin,
      max: upperMax,
      avg: Math.round(upperMin + upperMax / 2),
    },
  };
};

export const distributeWeightsIntoSessions = (
  total_sessions: number,
  limits: {
    push: number[];
    pull: number[];
    legs: number[];
  }
) => {
  const weight = {
    push: 29.02,
    pull: 32.14,
    legs: 25.14,
  };
  const weight_order = Object.keys(weight).sort(
    (a, b) =>
      weight[b as keyof typeof weight] - weight[a as keyof typeof weight]
  );

  const count = {
    push: 2,
    pull: 2,
    legs: 1,
    upper: 0,
    full: 0,
  };

  const current = {
    push: 0,
    pull: 0,
    legs: 0,
    upper: 0,
    full: 0,
  };

  const freq_limits = freqLimitsHandler(limits.push, limits.pull, limits.legs);

  const min_sessions_totaled =
    freq_limits.push.min + freq_limits.pull.min + freq_limits.legs.min;
  const remainder = min_sessions_totaled - total_sessions;
  // min_sessions_totaled = 8.5

  let overSessions = remainder;

  const canCombinePushAndPull = (
    pullMin: number,
    pushMin: number,
    subVal: number
  ) => {
    const canSubBoth = pullMin >= subVal && pushMin >= subVal;

    if (canSubBoth) return subVal;
    return null;
  };

  let pushMinCount = freq_limits.push.min;
  let pullMinCount = freq_limits.pull.min;
  let upperTracker = 0;
  let subtractor = 1;

  // combine enough push and pulls to get within total_frequency
  while (overSessions > 0 || subtractor <= 0) {
    const val = canCombinePushAndPull(pullMinCount, pushMinCount, subtractor);
    if (!val) {
      subtractor -= 0.5;
    } else {
      upperTracker += subtractor;
      pushMinCount -= subtractor;
      pullMinCount -= subtractor;
      overSessions -= subtractor;
    }
  }

  let remaining_push_pulls =
    pushMinCount !== pullMinCount && (pushMinCount > 0 || pullMinCount > 0);
  while (remaining_push_pulls) {
    const val = canCombinePushAndPull(pullMinCount, pushMinCount, subtractor);
    if (!val) {
      break;
    } else {
      upperTracker += subtractor;
      pushMinCount -= subtractor;
      pullMinCount -= subtractor;
    }
  }

  const maxes = {
    push: 1, // curr: 3, desired: 5
    pull: 2, // curr: 4, desired: 4
    upper: 2,
    legs: 1, // curr: 1, desired: 2
    full: 0,
  };
  // if push and pulls remain then combine them
  const maxes_after_push_pull = {
    push: 0, // curr: 3, desired: 5
    pull: 1, // curr: 4, desired: 4
    upper: 3,
    legs: 1, // curr: 1, desired: 2
    full: 0,
  };

  // if push || pull remain turn into a full
  const maxes_after_push_pull_into_full = {
    push: 0, // curr: 4, desired: 4
    pull: 0, // curr: 4, desired: 5
    upper: 3,
    legs: 1, // curr: 2, desired: 2
    full: 1,
  };
  // if total_sessions < total add to highest priority
  const maxes_after_push_pull_into_full_after_session_check = {
    push: 0, // curr: 4, desired: 4
    pull: 1, // curr: 5, desired: 5
    upper: 3,
    legs: 1, // curr: 2, desired: 2
    full: 1,
  };

  console.log(
    "push:",
    pushMinCount,
    "pull:",
    pullMinCount,
    "upper:",
    upperTracker,
    "legs:",
    freq_limits.legs.min,
    subtractor,
    overSessions,
    "OK WHAT THESE?"
  );
};

export const getMaxFrequencyByMatrix = (
  range: string,
  rank: number,
  mrv_breakpoint: number
) => {
  switch (range) {
    case "3,6":
      return THREE_SIX[mrv_breakpoint][rank];
    case "3,4":
      return THREE_FOUR[mrv_breakpoint][rank];
    case "2,4":
      return TWO_FOUR[mrv_breakpoint][rank];
    case "2,5":
      return TWO_FIVE[mrv_breakpoint][rank];
    default:
      return THREE_SIX[3][0];
  }
};

// export const getMaxFrequencyByMatrix = (
//   range: string,
//   rank: number,
//   mrv_breakpoint: number
// ) => {
//   switch (range) {
//     case "3,6":
//       return [THREE_SIX_MIN[mrv_breakpoint][rank], THREE_SIX[mrv_breakpoint][rank]]
//     case "3,4":
//       return [THREE_FOUR_MIN[mrv_breakpoint][rank], THREE_FOUR[mrv_breakpoint][rank]]
//     case "2,4":
//       return [TWO_FOUR_MIN[mrv_breakpoint][rank], TWO_FOUR[mrv_breakpoint][rank]]
//     case "2,5":
//       return [TWO_FIVE_MIN[mrv_breakpoint][rank], TWO_FIVE[mrv_breakpoint][rank]]
//     default:
//       return [THREE_SIX_MIN[3][0], THREE_SIX[3][0]]
//   }
// };
const THREE_SIX = [
  [6],
  [6, 6],
  [6, 6, 5],
  [6, 5, 5, 4],
  [5, 5, 4, 3, 3],
  [5, 4, 3, 3, 3, 3],
  [4, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const THREE_SIX_MIN = [
  [5],
  [5, 5],
  [5, 5, 4],
  [4, 4, 3, 3],
  [4, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const THREE_FOUR = [
  [4],
  [4, 4],
  [4, 4, 4],
  [4, 4, 4, 3],
  [4, 4, 3, 3, 3],
  [4, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const THREE_FOUR_MIN = [
  [4],
  [4, 4],
  [4, 4, 4],
  [3, 3, 3, 3],
  [3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const TWO_FOUR = [
  [4],
  [4, 4],
  [4, 4, 4],
  [4, 4, 3, 3],
  [4, 4, 3, 3, 2],
  [4, 3, 3, 2, 2, 2],
  [3, 3, 2, 2, 2, 2, 2],
  [3, 2, 2, 2, 2, 2, 2, 2],
];
const TWO_FOUR_MIN = [
  [4],
  [4, 4],
  [4, 4, 3],
  [3, 3, 3, 2],
  [3, 3, 2, 2, 2],
  [3, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
const TWO_FIVE = [
  [5],
  [5, 5],
  [5, 5, 5],
  [5, 5, 4, 4],
  [5, 4, 4, 3, 3],
  [4, 4, 3, 3, 2, 2],
  [4, 3, 3, 2, 2, 2, 2],
  [3, 3, 2, 2, 2, 2, 2, 2],
];
const TWO_FIVE_MIN = [
  [5],
  [5, 5],
  [5, 5, 4],
  [4, 3, 3, 2],
  [3, 3, 2, 2, 2],
  [3, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
