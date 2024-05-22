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

type MaxSessionsPerSplit = {
  push: {
    min: number;
    max: number;
    avg: number;
  };
  pull: {
    min: number;
    max: number;
    avg: number;
  };
  legs: {
    min: number;
    max: number;
    avg: number;
  };
  upper: {
    min: number;
    max: number;
    avg: number;
  };
};

function distributeTotalSessionsIntoSplits(
  totalSessions: number,
  maxFullSessions: number,
  minMaxPerSplit: MaxSessionsPerSplit,
  prioritizedSplits: ("push" | "pull" | "legs")[]
): { push: number; pull: number; legs: number; upper: number; full: number } {
  const distributedSessions = {
    push: 0,
    pull: 0,
    legs: 0,
    upper: 0,
    full: 0,
  };

  // Sort the prioritized splits based on the minimum required sessions
  const sortedPrioritizedSplits = prioritizedSplits.sort(
    (a, b) => minMaxPerSplit[a].min - minMaxPerSplit[b].min
  );

  // Assign the minimum required sessions for each prioritized split
  for (const split of sortedPrioritizedSplits) {
    distributedSessions[split] = minMaxPerSplit[split].min;
    totalSessions -= minMaxPerSplit[split].min;
  }

  // Assign any remaining sessions to the prioritized splits, up to their maximum allowed sessions
  while (totalSessions > 0) {
    for (const split of sortedPrioritizedSplits) {
      if (
        distributedSessions[split] < minMaxPerSplit[split].max &&
        totalSessions > 0
      ) {
        distributedSessions[split]++;
        totalSessions--;
      }
    }
  }

  // Assign any remaining sessions to full sessions, up to the maximum allowed
  distributedSessions.full = Math.min(totalSessions, maxFullSessions);

  // Assign any remaining sessions to upper sessions
  distributedSessions.upper = totalSessions - distributedSessions.full;

  // Update push and pull sessions based on upper and full sessions
  distributedSessions.push +=
    distributedSessions.upper + distributedSessions.full;
  distributedSessions.pull +=
    distributedSessions.upper + distributedSessions.full;
  distributedSessions.legs += distributedSessions.full;

  return distributedSessions;
}

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

  const freq_limits = freqLimitsHandler(limits.push, limits.pull, limits.legs);

  const min_sessions_totaled =
    freq_limits.push.min + freq_limits.pull.min + freq_limits.legs.min;
  const remainder = min_sessions_totaled - total_sessions;
  // min_sessions_totaled = 8.5

  let overSessions = remainder;

  const freq_limits_2 = {
    upper: Math.max(freq_limits.push.max, freq_limits.pull.max),
    full: 2,
    push: freq_limits.push.max,
    pull: freq_limits.pull.max,
    legs: freq_limits.legs.max,
  };

  const canCombinePushAndPull = (
    pullMin: number,
    pushMin: number,
    subVal: number
  ): [string, number] | null => {
    const canSubBoth = pullMin >= subVal && pushMin >= subVal;
    const canSubPull = pullMin >= subVal;
    const canSubPush = pushMin >= subVal;
    if (canSubBoth) return ["both", subVal];
    else if (canSubPull) return ["pull", pullMin];
    else if (canSubPush) return ["push", pushMin];
    else return null;
  };

  // current
  let push = freq_limits.push.min;
  let pull = freq_limits.pull.min;
  let legs = 0;
  let upper = 0;
  let full = 2;

  let full_limit = 2;
  let subtractor = 1;

  const current = {
    push: push + upper + full,
    pull: pull + upper + full,
    legs: legs + full,
  };

  const desired = {
    push: freq_limits.push.max,
    pull: freq_limits.pull.max,
    legs: freq_limits.legs.max,
  };

  // combine enough push and pulls to get within total_frequency
  while (overSessions > 0 || subtractor <= 0) {
    const val = canCombinePushAndPull(pull, push, subtractor);
    if (!val) {
      subtractor -= 0.5;
    } else if (val[0] === "both") {
      upper += subtractor;
      push -= subtractor;
      pull -= subtractor;
      overSessions -= subtractor;
    } else if (val[0] === "pull") {
      upper += subtractor;
      pull -= subtractor;
      overSessions -= subtractor;
    } else if (val[0] === "push") {
      upper += subtractor;
      push -= subtractor;
      overSessions -= subtractor;
    } else {
      break;
    }
  }

  subtractor = 1;
  let remaining_push_pulls = push !== pull && (push > 0 || pull > 0);
  while (remaining_push_pulls) {
    const val = canCombinePushAndPull(pull, push, subtractor);
    if (!val) {
      break;
    } else if (val[0] === "both") {
      upper += subtractor;
      pull -= subtractor;
      push -= subtractor;
    } else if (val[0] === "push") {
      upper += subtractor;
      push -= subtractor;
    } else if (val[0] === "pull") {
      upper += subtractor;
      pull -= subtractor;
    } else {
      break;
    }
  }
  const curr = {
    upper: upper,
    push: push,
    pull: pull,
    legs: legs,
    full: full,
  };

  // const result = distributeTotalSessionsIntoSplits(
  //   total_sessions,
  //   2,
  //   freq_limits,
  //   ["pull", "push", "legs"]
  // );

  // 1. DISTRIBUTE ALL UPPERS TO MAX and FULLS TO MAX OF LOWER
  // 2. subtract fulls to reach min of lower/upper || fulls at 2
  // 3. subtract

  const rough_total = upper + legs + full;
  if (rough_total > total_sessions) {
    // subtract all remaining uppers into legs
    const remainder = rough_total - total_sessions;
    legs = legs + remainder;
  } else if (rough_total < total_sessions) {
    // add all remaining uppers into legs
    const remainder = total_sessions - upper;
    legs = legs + remainder;
  } else {
    console.log(push, pull, legs, upper, full, "YO YO WE ON TO SOMETHING?");
  }

  let breaker = false;
  while (!breaker) {
    let desired = [
      freq_limits.push.max,
      freq_limits.pull.max,
      freq_limits.legs.max,
    ];
    let currents = [current.push, current.pull, current.legs];
    let results = [
      desired[0] - currents[0],
      desired[1] - currents[1],
      desired[2] - currents[2],
    ];

    let fullTracker = 0;
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result > 0) {
        fullTracker += 1;
      }
    }

    let canAddFull = fullTracker === results.length && full_limit > 0;

    breaker = true;
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
    push: 0, // curr: 5, desired: 5
    pull: 0, // curr: 5, desired: 5
    upper: 4,
    legs: 1, // curr: 2, desired: 2
    full: 1,
  };

  // remainder of 1
  // [4, 5]  [4, 5] [2, 2]
  // add an upper

  // if push || pull remain turn into a full
  const maxes_after_push_pull_into_full = {
    push: 0, // curr: 4, desired: 5, min: 3
    pull: 0, // curr: 4, desired: 5, min: 4
    upper: 3,
    legs: 1, // curr: 2, desired: 2, min: 1
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

  const min_max = [
    [3, 2],
    [4, 3],
    [2, 5],
  ];

  // push / legs = full
  // pull / legs = full
  // push / pull = upper

  // 1. combine min of push/pull into upper and min of lower
  // 2. for each split subtract current from max and get a value to determine next step.
  // 3.

  console.log(
    "push:",
    push,
    "pull:",
    pull,
    "upper:",
    upper,
    "legs:",
    legs,
    "full:",
    full,
    subtractor,
    overSessions,
    // remaining_push_pulls,
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
