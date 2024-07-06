import { MUSCLE_WEIGHTS_MODIFIERS } from "~/constants/weighting/muscles";
import { getPushPullLegsSplit } from "~/constants/workoutSplits";
import {
  BROSessionKeys,
  MusclePriorityType,
  SessionSplitType,
  SplitSessionsNameType,
  SplitSessionsType,
} from "../../reducer/trainingProgramReducer";

type Basket = {
  push: number;
  pull: number;
  lower: number;
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
    totals.lower +
    totals.push +
    totals.pull -
    total_frequency;

  let remove: "upper" | "lower" = "upper";
  if (remainder > 0) {
    const isEven = remainder % 2 === 0;

    if (isEven) {
      remove = "lower";
    }

    for (let i = 0; i < remainder; i++) {
      totals[remove]--;
      remove = remove === "upper" ? "lower" : "upper";
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
    case basket.full < 2 && basket.pull > 0 && basket.lower > 0:
      return {
        ...basket,
        pull: basket.pull--,
        lower: basket.lower--,
        full: basket.full++,
      };
    case basket.full < 2 && basket.push > 0 && basket.lower > 0:
      return {
        ...basket,
        pull: basket.push--,
        lower: basket.lower--,
        full: basket.full++,
      };
    case basket.full < 2 && basket.upper > 0 && basket.lower > 0:
      return {
        ...basket,
        pull: basket.upper--,
        lower: basket.lower--,
        full: basket.full++,
      };
    default:
      return removeRemaining(basket, total_frequency);
  }
};

export const distributeSessionsIntoSplits = (
  split: SplitSessionsNameType,
  total_sessions: number,
  freq_limits: SplitMaxes,
  bro_freq_limits?: BROSessionKeys[]
): SplitSessionsType => {
  switch (split) {
    case "PPL":
      const PPL = {
        split: split,
        sessions: distributeSessionsIntoSplits_ppl(total_sessions, freq_limits),
      };
      return PPL;
    case "PPLUL":
      const PPLUL = {
        split: split,
        sessions: distributeSessionsIntoSplits_pplul(
          total_sessions,
          freq_limits
        ),
      };
      return PPLUL;
    case "OPT":
      const OPT = {
        split: split,
        sessions: distributeSessionsIntoSplits_opt(total_sessions, freq_limits),
      };
      return OPT;
    case "BRO":
      if (bro_freq_limits === undefined) {
        throw new Error("BRO frequency limits are undefined");
      }
      const BRO = {
        split: split,
        sessions: distributeSessionsIntoSplits_bro(
          total_sessions,
          bro_freq_limits
        ),
      };
      return BRO;
    case "UL":
      const UL = {
        split: split,
        sessions: {
          upper: Math.floor(total_sessions / 2),
          lower: Math.ceil(total_sessions / 2),
        },
      };
      return UL;
    case "FB":
      const FB = {
        split: split,
        sessions: {
          full: total_sessions,
        },
      };
      return FB;
    case "CUS":
      const CUS = {
        split: split,
        sessions: {},
      };
      return CUS;
    default:
      const _exhaustiveCheck: never = split;
      return _exhaustiveCheck;
  }
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

export const getFrequencyMaxes = (
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
        // const muscle_max = getMaxFrequencyByMatrix(
        //   freq_string,
        //   i,
        //   breakpoints[0] - 1
        // );
        const muscle_max = muscle_priority_list[i].frequency.target;
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

const distributeSessionsIntoSplits_opt = (
  total_sessions: number,
  freq_limits: SplitMaxes
) => {
  const basket = {
    push: freq_limits.push[1],
    pull: freq_limits.pull[1],
    lower: freq_limits.legs[1],
    upper: 0,
    full: 0,
  };

  while (
    total_sessions !==
    basket.full + basket.lower + basket.upper + basket.push + basket.pull
  ) {
    mutateBasket(basket, total_sessions);
  }

  return basket;
};

const distributeSessionsIntoSplits_ppl = (
  total_frequency: number,
  freq_limits: SplitMaxes
) => {
  const prioritizedSplits = Object.keys(freq_limits).sort(
    (a, b) =>
      freq_limits[a as keyof typeof freq_limits][0] -
      freq_limits[b as keyof typeof freq_limits][0]
  );
  const totals = {
    push: 1,
    pull: 1,
    legs: 1,
  };
  const remainder = total_frequency - (totals.push + totals.pull + totals.legs);
  let counter = 0;
  for (let i = 0; i < remainder; i++) {
    const key = prioritizedSplits[counter] as keyof typeof totals;
    totals[key]++;
    counter = counter === prioritizedSplits.length - 1 ? 0 : counter + 1;
  }
  return totals;
};

const distributeSessionsIntoSplits_pplul = (
  total_frequency: number,
  freq_limits: SplitMaxes
) => {
  const prioritizedSplits = Object.keys(freq_limits).sort(
    (a, b) =>
      freq_limits[a as keyof typeof freq_limits][0] -
      freq_limits[b as keyof typeof freq_limits][0]
  );
  const totals = {
    push: 1,
    pull: 1,
    legs: 1,
    upper: 1,
    lower: 1,
  };
  const remainder =
    totals.push +
    totals.pull +
    totals.legs +
    totals.upper +
    totals.lower -
    total_frequency;
  const remainderAbsVal = Math.abs(remainder);
  const operation = remainder >= 0 ? "subtract" : "add";

  let addTracker: "upper" | "lower" =
    prioritizedSplits[0] === "legs" ? "lower" : "upper";
  for (let i = 0; i < remainderAbsVal; i++) {
    if (operation === "add") {
      totals[addTracker]++;
      addTracker = addTracker === "lower" ? "upper" : "lower";
    } else {
      const lastIndex = prioritizedSplits.length - 1;
      const removalIndex = lastIndex - i;
      const removalKey = prioritizedSplits[removalIndex];
      totals[removalKey as keyof typeof totals]--;
    }
  }
  return totals;
};

const distributeSessionsIntoSplits_bro = (
  total_sessions: number,
  broSplitSorted: BROSessionKeys[]
) => {
  const sessions = {
    back: 1,
    chest: 1,
    legs: 1,
    arms: 1,
    shoulders: 1,
  };
  const remainder =
    total_sessions -
    (sessions.back +
      sessions.chest +
      sessions.legs +
      sessions.arms +
      sessions.shoulders);
  const remainderAbsVal = Math.abs(remainder);
  if (remainder === 0) return sessions;
  const operation = remainder > 0 ? "add" : "subtract";

  let counter = operation === "add" ? 0 : broSplitSorted.length - 1;
  for (let i = 0; i < remainderAbsVal; i++) {
    const key = broSplitSorted[counter] as keyof typeof sessions;
    if (operation === "add") {
      sessions[key]++;
      counter++;
    } else {
      sessions[key]--;
      counter--;
    }
    if (counter > broSplitSorted.length - 1) counter = 0;
    if (counter < 0) counter = broSplitSorted.length - 1;
  }
  return sessions;
};

// NOTE: not sure if this is useful yet
const getPotentialSplits = (
  splitType: SessionSplitType
): SplitSessionsNameType[] => {
  switch (splitType) {
    case "arms":
      return ["BRO", "CUS"];
    case "back":
      return ["BRO", "CUS"];
    case "chest":
      return ["BRO", "CUS"];
    case "legs":
      return ["PPL", "PPLUL", "BRO", "CUS"];
    case "shoulders":
      return ["BRO", "CUS"];
    case "push":
      return ["PPL", "PPLUL", "OPT", "CUS"];
    case "pull":
      return ["PPL", "PPLUL", "OPT", "CUS"];
    case "upper":
      return ["UL", "OPT", "PPLUL", "CUS"];
    case "lower":
      return ["UL", "OPT", "PPLUL", "CUS"];
    case "full":
      return ["FB", "OPT", "CUS"];
    default:
      return [];
  }
};
