import {
  getBroSplit,
  getOPTSplit,
  getOptimizedSplitForWeights,
  getPPLULSplit,
  getPushPullLegsSplit,
  getUpperLowerSplit,
} from "~/constants/workoutSplits";
import { getKeyWithHighestValue } from "~/utils/getKeyWithHighestValue";

import {
  MUSCLE_WEIGHTS_MODIFIERS,
  RANK_WEIGHTS,
} from "~/constants/weighting/muscles";
import { isKey } from "~/utils/typeHelpers/isKey";
import { getRankWeightForMuscle as original } from "../utils/musclePriorityListHandlers";
import { getWeightedList } from "../utils/prioritizationWeightingHandlers";
import { initSplitSessions } from "./splitSessionHandler";
import {
  MusclePriorityType,
  SplitSessionsNameType,
  SplitSessionsType,
} from "./trainingProgramReducer";

const getWeightRanking_BRO = (
  muscle_priority_list: MusclePriorityType[],
  sessions: SplitSessionsType
) => {
  type BROKeys = keyof typeof sessions.sessions;
  const sessions_float = { ...sessions };

  for (let i = 0; i < muscle_priority_list.length; i++) {
    const bro_muscle = muscle_priority_list[i].muscle;
    const bro_rank = muscle_priority_list[i].rank;
    switch (sessions_float.split) {
      case "BRO":
        const bro_split = getBroSplit(bro_muscle);
        sessions_float.sessions[bro_split] =
          sessions_float.sessions[bro_split] + bro_rank;
        break;
      case "UL":
    }
  }
};

export const handleDistribution = (
  muscle_priority_list: MusclePriorityType[],
  sessions: {
    session: string;
    modifiers: number[];
  }[]
) => {
  // FIND UPPER MRVS
  // FIND LOWER MRVS if none check MEVS and return 2 if none in MEVS return 1
  let pushTracker = 0;
  let pushCount = [];
  let pullTracker = 0;
  let pullCount = [];
  let legsTracker = 0;
  let legsCount = [];
  for (let i = 0; i < muscle_priority_list.length; i++) {
    const muscle = muscle_priority_list[i].muscle;
    const split = getPushPullLegsSplit(muscle);
    if (muscle_priority_list[i].volume.landmark === "MRV") {
      switch (split) {
        case "push":
          if (pushTracker < 2) {
            const muscleWeight =
              MUSCLE_WEIGHTS_MODIFIERS[muscle].optimalFrequency;
            pushCount.push(muscleWeight);
            pushTracker++;
          }
          break;
        case "pull":
          if (pullTracker < 2) {
            const muscleWeight =
              MUSCLE_WEIGHTS_MODIFIERS[muscle].optimalFrequency;
            pullCount.push(muscleWeight);
            pullTracker++;
          }
          break;
        case "legs":
          if (legsTracker < 2) {
            const muscleWeight =
              MUSCLE_WEIGHTS_MODIFIERS[muscle].optimalFrequency;
            legsCount.push(muscleWeight);
            legsTracker++;
          }
          break;
        default:
          break;
      }
    } else if (muscle_priority_list[i].volume.landmark === "MEV") {
      switch (split) {
        case "push":
          if (pushTracker < 2) {
            const muscleWeight =
              MUSCLE_WEIGHTS_MODIFIERS[muscle].optimalFrequency;
            pushCount.push(muscleWeight - 1);
            pushTracker++;
          }
          break;
        case "pull":
          if (pullTracker < 2) {
            const muscleWeight =
              MUSCLE_WEIGHTS_MODIFIERS[muscle].optimalFrequency;
            pullCount.push(muscleWeight - 1);
            pullTracker++;
          }
          break;
        case "legs":
          if (legsTracker < 2) {
            const muscleWeight =
              MUSCLE_WEIGHTS_MODIFIERS[muscle].optimalFrequency;
            legsCount.push(muscleWeight - 1);
            legsTracker++;
          }
          break;
        default:
          break;
      }
    }
  }
  return {
    push: pushCount,
    pull: pullCount,
    legs: legsCount,
  };
};

const roundHalf = (num: number) => {
  return Math.round(num * 2) / 2;
};

export const maths = (
  split_sessions: SplitSessionsType,
  total_sessions: number
) => {
  const sessions_mapped = structuredClone(split_sessions.sessions);
  const sessions_float = { ...sessions_mapped };
  const sessions_ratio = { ...sessions_mapped };
  const sessions_remainders = { ...sessions_mapped };

  const total = Object.values(sessions_float).reduce(
    (acc, val) => acc + val,
    0
  );

  const sessionsTest: {
    session: string;
    modifiers: number[];
  }[] = [];

  for (const [key, val] of Object.entries(sessions_mapped)) {
    const decimal = val / total;
    const ratio = total_sessions * decimal;
    const integer = Math.floor(ratio);
    const remainder = ratio - integer;

    const validKey = isKey(sessions_mapped, key);
    if (validKey) {
      sessions_float[key] = integer;
      sessions_ratio[key] = ratio;
      sessions_remainders[key] = roundHalf(remainder);

      const rounded = Math.round(ratio * 100) / 100;
      const roundedVal = Math.round(val * 100) / 100;
      sessionsTest.push({
        session: key,
        modifiers: [integer, roundedVal, rounded, roundHalf(remainder)],
      });
    }
  }
  const sortedSessionsTest = sessionsTest.sort(
    (a, b) => b.modifiers[3] - a.modifiers[3]
  );
  const evenOutRounders = sessionsTest.map((each) => {});
  let lower: [string, number] = ["lower", 0];
  let full: [string, number] = ["full", 0];
  let push: [string, number] = ["push", 0];
  let pull: [string, number] = ["pull", 0];
  let upper: [string, number] = ["upper", 0];

  for (let i = 0; i < sessionsTest.length; i++) {
    const getRemainder = sessionsTest[i].modifiers[3];
    if (getRemainder > 0) {
      switch (sessionsTest[i].session) {
        case "lower":
          if (lower[1] >= 0) {
            lower[1] = lower[1] + getRemainder;
            full[1] = full[1] - 1;
          } else {
            full[1] = full[1] + getRemainder;
            lower[1] = lower[1] - 1;
          }
          break;
        case "full":
          if (full[1] >= 0) {
            full[1] = full[1] + getRemainder;
            lower[1] = lower[1] - 1;
          } else {
            lower[1] = lower[1] + getRemainder;
            full[1] = full[1] - 1;
          }
          break;
        case "pull":
        case "push":
          upper[1] = upper[1] + getRemainder;
          break;
        case "upper":
          upper[1] = upper[1] + getRemainder;
          break;
        default:
          break;
      }
    }
  }

  for (let j = 0; j < sessionsTest.length; j++) {
    const jv = sessionsTest[j];
    switch (jv.session) {
      case "upper":
        if (upper[1] <= 0) continue;
        sessionsTest[j].modifiers[0] = sessionsTest[j].modifiers[0] + upper[1];
        break;
      case "lower":
        if (lower[1] <= 0) continue;
        sessionsTest[j].modifiers[0] = sessionsTest[j].modifiers[0] + lower[1];
        break;
      case "full":
        if (full[1] <= 0) continue;
        sessionsTest[j].modifiers[0] = sessionsTest[j].modifiers[0] + full[1];
        break;
      default:
        break;
    }
  }
  console.log(lower, full, push, pull, upper, sortedSessionsTest, "LOL TES");
  return sessionsTest;
};

export const getRankWeightsBySplit = (
  muscle_priority_list: MusclePriorityType[],
  split: SplitSessionsType["split"],
  breakpoints: [number, number]
) => {
  // const sessions = structuredClone(split_sessions);
  // const sessions_mapped = Object.fromEntries(
  //   Object.entries(split_sessions.sessions).map(([key, val]) => [key, 0])
  // );
  // const sessions = { ...split_sessions };
  const sessions = initSplitSessions(split);
  // const sessions = { split: split_sessions.split, sessions: sessions_mapped };
  const weights = getWeightedList(breakpoints);

  for (let i = 0; i < muscle_priority_list.length; i++) {
    const muscle = muscle_priority_list[i].muscle;
    // const rank = parseFloat(`1.${MUSCLE_WEIGHTS[muscle]}`);

    const muscleWeight = MUSCLE_WEIGHTS_MODIFIERS[muscle].optimalFrequency;
    const muscleVolume = MUSCLE_WEIGHTS_MODIFIERS[muscle].muscleVolume;

    // const muscleVolume = parseFloat(
    //   `1.${MUSCLE_WEIGHTS_MODIFIERS[muscle].muscleVolume}`
    // );
    const rank = muscleWeight * muscleVolume;
    // const weight1 = getRankWeightForMuscle(i, muscle, weights) * rank;
    const weight1 = RANK_WEIGHTS[i];
    // const floatedWeight = parseFloat(`1.${Math.round(weight1)}`);
    const weight = rank * weight1;

    console.log(
      `${muscle} : `,
      muscleWeight,
      muscleVolume,
      rank,
      weight1,
      weight,
      sessions,
      "YO WHAT IS GOING ON HERE?"
    );

    switch (sessions.split) {
      case "BRO":
        const bro_splits = getBroSplit(muscle);
        sessions.sessions[bro_splits] = sessions.sessions[bro_splits] + weight;
        break;
      case "PPL":
        const ppl_splits = getPushPullLegsSplit(muscle);
        sessions.sessions[ppl_splits] = sessions.sessions[ppl_splits] + weight;

        break;
      case "PPLUL":
        const pplul_splits = getPPLULSplit(muscle);
        for (let j = 0; j < pplul_splits.length; j++) {
          const split_weight = Math.round(weight / 2);

          if (pplul_splits[j].includes("push")) {
            sessions.sessions["push"] =
              sessions.sessions["push"] + split_weight;
            sessions.sessions["upper"] =
              sessions.sessions["upper"] + split_weight;
          } else if (pplul_splits[j].includes("pull")) {
            sessions.sessions["pull"] =
              sessions.sessions["pull"] + split_weight;
            sessions.sessions["upper"] =
              sessions.sessions["upper"] + split_weight;
          } else {
            sessions.sessions["legs"] =
              sessions.sessions["legs"] + split_weight;
            sessions.sessions["lower"] =
              sessions.sessions["lower"] + split_weight;
          }
        }

        break;
      case "UL":
        const ul_splits = getUpperLowerSplit(muscle);
        sessions.sessions[ul_splits] = sessions.sessions[ul_splits] + weight;
        break;
      case "OPT":
        const opt_splits = getOPTSplit(muscle);
        switch (muscle) {
          case "calves":
          case "glutes":
          case "hamstrings":
          case "quads":
            sessions.sessions["lower"] = sessions.sessions["lower"] + weight;
            break;
          case "back":
          case "biceps":
          case "delts_rear":
          case "traps":
            sessions.sessions["pull"] = sessions.sessions["pull"] + weight;
            break;
          case "chest":
          case "triceps":
          case "delts_side":
          case "delts_front":
            sessions.sessions["push"] = sessions.sessions["push"] + weight;
            break;
          case "abs":
            sessions.sessions["lower"] = sessions.sessions["lower"] + weight;
          case "forearms":
            const split = Math.round(weight / 2);
            sessions.sessions["push"] = sessions.sessions["push"] + split;
            sessions.sessions["pull"] = sessions.sessions["pull"] + split;
            break;
          default:
            break;
        }
        console.log(sessions, opt_splits, "OPT");
        break;
      default:
        break;
    }
  }
  return sessions;
};

export function getSplitFromWeights(
  frequency: [number, number],
  muscle_priority_list: MusclePriorityType[],
  split_name: SplitSessionsNameType
): SplitSessionsType {
  let push = 0;
  let pull = 0;
  let lower = 0;

  for (let i = 0; i < muscle_priority_list.length; i++) {
    // const rank = muscle_priority_list[i].rank;
    const muscle = muscle_priority_list[i].muscle;
    const rank = original(i, muscle);
    const split = getOptimizedSplitForWeights(muscle);
    switch (split) {
      case "both":
        const splitRank = Math.round(rank / 2);
        push = push + splitRank;
        pull = pull + splitRank;
        break;
      case "pull":
        pull = pull + rank;
        break;
      case "push":
        push = push + rank;
        break;
      case "lower":
        lower = lower + rank;
        break;
      default:
        break;
    }
  }

  const total_sessions = frequency[0] + frequency[1];

  let session_maxes_per_week = [0, 0, 0];

  switch (total_sessions) {
    // KEY
    // [0, 1, 2]
    // [push, pull, lower]
    case 3:
      session_maxes_per_week = [2, 2, 2];
      break;
    case 4:
      session_maxes_per_week = [3, 3, 3];
      break;
    case 5:
      session_maxes_per_week = [4, 4, 3];
      break;
    case 6:
      session_maxes_per_week = [4, 4, 3];
      break;
    case 7:
      session_maxes_per_week = [5, 5, 4];
      break;
    case 8:
      session_maxes_per_week = [5, 5, 4];
      break;
    case 9:
      session_maxes_per_week = [5, 5, 5];
      break;
    case 10:
      session_maxes_per_week = [6, 6, 5];
      break;
    case 11:
      session_maxes_per_week = [6, 6, 5];
      break;
    case 12:
      session_maxes_per_week = [6, 6, 5];
      break;
    case 13:
      session_maxes_per_week = [6, 6, 6];
      break;
    case 14:
      session_maxes_per_week = [6, 6, 6];
      break;
    default:
      session_maxes_per_week = [2, 2, 2];
      break;
  }

  const push_pull_max = session_maxes_per_week[0];
  const total = push + pull + lower;

  const pushDecimal = push / total;
  const pullDecimal = pull / total;
  const lowerDecimal = lower / total;

  const pushRatio = total_sessions * pushDecimal;
  const pullRatio = total_sessions * pullDecimal;
  const lowerRatio = total_sessions * lowerDecimal;

  const pushInteger = Math.floor(pushRatio);
  const pullInteger = Math.floor(pullRatio);
  const lowerInteger = Math.floor(lowerRatio);

  const pushTenths = pushRatio - pushInteger;
  const pullTenths = pullRatio - pullInteger;
  const lowerTenths = lowerRatio - lowerInteger;

  let pushSessions = pushInteger;
  let pullSessions = pullInteger;
  let lowerSessions = lowerInteger;
  let upperSessions = 0;
  let fullSessions = 0;

  switch (split_name) {
    case "BRO":
      const bro_sessions = distributeIntoSessionsBro(
        frequency,
        muscle_priority_list
      );
      return { split: "BRO", sessions: bro_sessions };
    case "PPL":
      const ppl_sessions = distributeRatioIntoSessionsPPL(
        pushTenths,
        lowerTenths,
        pullTenths
      );

      pullSessions = pullSessions + ppl_sessions.pull;
      pushSessions = pushSessions + ppl_sessions.push;
      lowerSessions = lowerSessions + ppl_sessions.legs;
      return {
        split: "PPL",
        sessions: {
          push: pushSessions,
          legs: lowerSessions,
          pull: pullSessions,
        },
      };
    case "PPLUL":
      const pplul_sessions = divideRatioIntoSessionsOPT(
        pushTenths,
        lowerTenths,
        pullTenths
      );

      pullSessions = pullSessions + pplul_sessions.pull;
      pushSessions = pushSessions + pplul_sessions.push;
      lowerSessions = lowerSessions + pplul_sessions.legs;
      upperSessions = upperSessions + pplul_sessions.upper;
      fullSessions = fullSessions + pplul_sessions.full;

      return {
        split: "PPLUL",
        sessions: {
          push: pushSessions,
          legs: lowerSessions,
          pull: pullSessions,
          upper: upperSessions,
          lower: fullSessions,
        },
      };
    case "CUS":
      return {
        split: "CUS",
        sessions: {},
      };
    case "OPT":
      const opt_sessions = divideRatioIntoSessionsOPT(
        pushTenths,
        lowerTenths,
        pullTenths
      );

      pullSessions = pullSessions + opt_sessions.pull;
      pushSessions = pushSessions + opt_sessions.push;
      lowerSessions = lowerSessions + opt_sessions.legs;
      upperSessions = upperSessions + opt_sessions.upper;
      fullSessions = fullSessions + opt_sessions.full;

      // -- Maximize frequency by combining push and pulls --
      while (pullSessions + upperSessions < push_pull_max) {
        if (pushSessions > 0) {
          upperSessions++;
          pushSessions--;
        } else {
          break;
        }
      }
      while (pushSessions + upperSessions < push_pull_max) {
        if (pullSessions > 0) {
          upperSessions++;
          pullSessions--;
        } else {
          break;
        }
      }

      return {
        split: "OPT",
        sessions: {
          push: pushSessions,
          pull: pullSessions,
          lower: lowerSessions,
          upper: upperSessions,
          full: fullSessions,
        },
      };
    case "FB":
      return {
        split: "FB",
        sessions: {
          full: total_sessions,
        },
      };
    case "UL":
      const upper_lower = distributeRatioIntoSessionsUL(
        pushTenths,
        lowerTenths,
        pullTenths
      );
      return {
        split: "UL",
        sessions: {
          upper: pushSessions + pullSessions + upper_lower.upper,
          lower: lowerSessions + upper_lower.lower,
        },
      };
    default:
      return {
        split: "OPT",
        sessions: {
          push: pushSessions,
          pull: pullSessions,
          lower: lowerSessions,
          upper: upperSessions,
          full: fullSessions,
        },
      };
  }
}

function distributeIntoSessionsBro(
  total_sessions: [number, number],
  priority: MusclePriorityType[]
) {
  const BRO_WEIGHTS = {
    back: 0,
    chest: 0,
    legs: 0,
    arms: 0,
    shoulders: 0,
  };

  // NOTE: to even out distribution among each bro split, this modifier will take into
  //       account how many muscles make up split.
  const MODIFIER = 0;
  const WEIGHT = 4;

  for (let i = 0; i < priority.length; i++) {
    const rank = priority[i].rank;
    const muscle = priority[i].muscle;

    const split = getBroSplit(muscle);
    switch (split) {
      case "legs":
        BRO_WEIGHTS.legs = BRO_WEIGHTS.legs + rank;
        break;
      case "shoulders":
        BRO_WEIGHTS.shoulders = BRO_WEIGHTS.shoulders + rank;
        break;
      case "arms":
        BRO_WEIGHTS.arms = BRO_WEIGHTS.arms + rank;
        break;
      case "back":
        const back_total = (MODIFIER + 3) * WEIGHT - i;
        BRO_WEIGHTS.back = BRO_WEIGHTS.back + rank + back_total;
        break;
      case "chest":
        const chest_total = (MODIFIER + 3) * WEIGHT - i;
        BRO_WEIGHTS.chest = BRO_WEIGHTS.chest + rank + chest_total;
        break;
      default:
    }
  }
  BRO_WEIGHTS.arms = BRO_WEIGHTS.arms + (MODIFIER + 1) * WEIGHT;

  console.log(BRO_WEIGHTS, priority, "TEST: modifiers on ranking");
  const splitRanking = Object.keys(BRO_WEIGHTS).sort(
    (a, b) =>
      BRO_WEIGHTS[b as keyof typeof BRO_WEIGHTS] -
      BRO_WEIGHTS[a as keyof typeof BRO_WEIGHTS]
  );

  const total = total_sessions[0] + total_sessions[1];
  let index = 0;

  const BRO = {
    legs: 0,
    back: 0,
    chest: 0,
    arms: 0,
    shoulders: 0,
  };

  for (let j = 0; j < total; j++) {
    const session = splitRanking[index] as keyof typeof BRO;
    if (session) {
      BRO[session]++;

      if (splitRanking[index + 1]) {
        index++;
      } else {
        index = 0;
      }
    }
  }

  return BRO;
}

function distributeRatioIntoSessionsPPL(
  push: number,
  legs: number,
  pull: number
) {
  let PPL = {
    push: 0,
    legs: 0,
    pull: 0,
  };

  const PPL_VALUES = {
    push: push,
    legs: legs,
    pull: pull,
  };

  const total = Math.round(push + legs + pull);

  if (total <= 1) {
    const { key } = getKeyWithHighestValue(PPL_VALUES);
    PPL = { ...PPL, [key]: PPL[key] + 1 };
  } else {
    // lol my logic sucks
    let highestKey: keyof typeof PPL = "legs";
    let secondHighestKey: keyof typeof PPL = "pull";

    const first = getKeyWithHighestValue(PPL_VALUES);
    highestKey = first.key;

    const newPPL = { ...PPL, [highestKey]: 0 };
    const second = getKeyWithHighestValue(newPPL);
    secondHighestKey = second.key;

    if (highestKey === secondHighestKey) {
      PPL = {
        ...PPL,
        [highestKey]: PPL[highestKey] + 2,
      };
    } else {
      PPL = {
        ...PPL,
        [highestKey]: PPL[highestKey] + 1,
        [secondHighestKey]: PPL[secondHighestKey] + 1,
      };
    }
  }

  return PPL;
}

function distributeRatioIntoSessionsUL(
  push: number,
  legs: number,
  pull: number
) {
  const UL = {
    upper: 0,
    lower: 0,
  };

  const total = Math.round(push + legs + pull);

  if (total <= 1) {
    if (legs >= 0.55) {
      UL.lower++;
    } else {
      UL.upper++;
    }
  } else {
    if (legs <= 0.33) {
      UL.upper = UL.upper + 2;
    } else if (legs > 0.33 && legs <= 0.85) {
      UL.lower++;
      UL.upper++;
    } else {
      UL.lower = UL.lower + 2;
    }
  }

  return UL;
}

function divideRatioIntoSessionsOPT(push: number, legs: number, pull: number) {
  const OPT = {
    push: 0,
    legs: 0,
    pull: 0,
    upper: 0,
    full: 0,
  };

  const total = Math.round(push + legs + pull);

  if (total <= 1) {
    if (legs >= 0.55) {
      OPT.legs++;
    } else if (legs >= 0.25 && legs < 0.55) {
      OPT.full++;
    } else if (Math.round(pull) >= 0.6) {
      OPT.pull++;
    } else if (Math.round(push) >= 0.6) {
      OPT.push++;
    } else if (push + pull > 0.8) {
      OPT.upper++;
    } else {
      OPT.full++;
    }
  } else {
    if (legs <= 0.33) {
      OPT.push++;
      OPT.pull++;
    } else if (legs >= 0.6) {
      OPT.legs++;
      if (pull > push) {
        OPT.pull++;
      } else {
        OPT.push++;
      }
    } else {
      OPT.full = OPT.full + 1;
      if (pull > push) {
        OPT.pull++;
      } else {
        OPT.push++;
      }
    }
  }

  return OPT;
}
