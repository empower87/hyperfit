import { MUSCLE_WEIGHTS_MODIFIERS } from "~/constants/weighting/muscles";
import { getPushPullLegsSplit } from "~/constants/workoutSplits";
import { getMaxFrequencyByMatrix } from "./distributeWeightsIntoSessions";
import { MusclePriorityType } from "./trainingProgramReducer";

type Basket = {
  push: number;
  pull: number;
  legs: number;
  upper: number;
  full: number;
};

type SplitMaxes = {
  push: [number, number];
  pull: [number, number];
  legs: [number, number];
};

const removeRemaining = (totals: Basket, total_frequency: number) => {
  const remainder =
    totals.full +
    totals.upper +
    totals.legs +
    totals.push +
    totals.pull -
    total_frequency;

  let remove: "upper" | "legs" = "upper";
  if (remainder > 0) {
    const isEven = remainder % 2 === 0;

    if (isEven) {
      remove = "legs";
    }

    for (let i = 0; i < remainder; i++) {
      totals[remove]--;
      remove = remove === "upper" ? "legs" : "upper";
    }
  }
  return totals;
};

const mutateBasket = (basket: Basket, total_frequency: number) => {
  switch (true) {
    case basket.push > 0 && basket.pull > 0:
      return {
        ...basket,
        push: basket.push--,
        pull: basket.pull--,
        upper: basket.upper++,
      };
    case basket.full < 2 && basket.pull > 0 && basket.legs > 0:
      return {
        ...basket,
        pull: basket.pull--,
        legs: basket.legs--,
        full: basket.full++,
      };
    case basket.full < 2 && basket.push > 0 && basket.legs > 0:
      return {
        ...basket,
        pull: basket.push--,
        legs: basket.legs--,
        full: basket.full++,
      };
    case basket.full < 2 && basket.upper > 0 && basket.legs > 0:
      return {
        ...basket,
        pull: basket.upper--,
        legs: basket.legs--,
        full: basket.full++,
      };
    default:
      return removeRemaining(basket, total_frequency);
  }
};

export const distributeSessionsIntoSplits = (
  total_sessions: number,
  freq_limits: SplitMaxes,
  prioritizedSplits: ("push" | "pull" | "legs")[]
) => {
  const basket = {
    push: freq_limits.push[1],
    pull: freq_limits.pull[1],
    legs: freq_limits.legs[1],
    upper: 0,
    full: 0,
  };

  while (
    total_sessions !==
    basket.full + basket.legs + basket.upper + basket.push + basket.pull
  ) {
    console.log(
      basket,
      basket.full + basket.legs + basket.upper + basket.push + basket.pull,
      total_sessions,
      prioritizedSplits,
      "beginning of while loop"
    );

    mutateBasket(basket, total_sessions);

    console.log(
      basket,
      basket.full + basket.legs + basket.upper + basket.push + basket.pull,
      total_sessions,
      prioritizedSplits,
      "end of while loop"
    );
  }

  return basket;
};

const getFrequencyLimit = (
  isTopPriority: boolean,
  total_sessions: number,
  min: number,
  max: number
) => {
  const total = isTopPriority ? total_sessions : total_sessions - 1;
  const capped = Math.max(min, Math.min(max, total));
  return capped;
};

export const getNGroupOccurrences = (
  many: number,
  muscle_priority_list: MusclePriorityType[],
  breakpoints: [number, number],
  total_sessions: number
) => {
  // index 1: rank, index 2: total, index 2: many of times added to total for split
  const tracker = {
    push: [0, 0, 0],
    pull: [0, 0, 0],
    legs: [0, 0, 0],
  };

  let rank = 0;
  for (let i = 0; i < muscle_priority_list.length; i++) {
    const muscle = muscle_priority_list[i].muscle;
    const split = getPushPullLegsSplit(muscle);

    if (tracker[split][0] === 0) {
      rank++;
      tracker[split][0] = rank;
    }

    if (tracker[split][2] < many) {
      const freq_string =
        MUSCLE_WEIGHTS_MODIFIERS[muscle].frequencyRange.toString();

      let muscle_max_adj = 2;

      if (i < breakpoints[0]) {
        const muscle_max = getMaxFrequencyByMatrix(
          freq_string,
          i,
          breakpoints[0] - 1
        );
        muscle_max_adj = getFrequencyLimit(
          tracker[split][0] === 1,
          total_sessions,
          MUSCLE_WEIGHTS_MODIFIERS[muscle].frequencyRange[0],
          muscle_max
        );
      } else if (i >= breakpoints[1]) {
        muscle_max_adj = 1;
      }

      if (tracker[split][0] === 1) {
        tracker[split][1] = Math.max(tracker[split][1], muscle_max_adj);
      } else {
        tracker[split][1] += muscle_max_adj;
      }
      tracker[split][2]++;
    }

    if (tracker.push[2] + tracker.pull[2] + tracker.legs[2] === many * 3) break;
  }

  const freq_maxes: SplitMaxes = {
    push: [
      tracker.push[0],
      tracker.push[0] === 1
        ? tracker.push[1]
        : Math.round(tracker.push[1] / many),
    ],
    pull: [
      tracker.pull[0],
      tracker.pull[0] === 1
        ? tracker.pull[1]
        : Math.round(tracker.pull[1] / many),
    ],
    legs: [
      tracker.legs[0],
      tracker.legs[0] === 1
        ? tracker.legs[1]
        : Math.round(tracker.legs[1] / many),
    ],
  };
  return freq_maxes;
};
