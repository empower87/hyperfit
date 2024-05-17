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
  console.log(pushMinCount, pullMinCount, upperTracker, "OK WHAT THESE?");
};
