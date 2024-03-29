import {
  getBroSplit,
  getOptimizedSplitForWeights,
} from "~/constants/workoutSplits";
import { getKeyWithHighestValue } from "~/utils/getKeyWithHighestValue";
import {
  MusclePriorityType,
  SplitSessionsNameType,
  SplitSessionsType,
} from "./trainingProgramReducer";

export function getSplitFromWeights(
  sessions: [number, number],
  priority: MusclePriorityType[],
  split_name: SplitSessionsNameType
): SplitSessionsType {
  let push = 0;
  let pull = 0;
  let lower = 0;

  for (let i = 0; i < priority.length; i++) {
    const rank = priority[i].rank;
    const muscle = priority[i].muscle;
    const split = getOptimizedSplitForWeights(muscle);
    switch (split) {
      case "both":
        let split = Math.round(rank / 2);
        push = push + split;
        pull = pull + split;
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

  const total_sessions = sessions[0] + sessions[1];

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

  let pushDecimal = push / total;
  let pullDecimal = pull / total;
  let lowerDecimal = lower / total;

  let pushRatio = total_sessions * pushDecimal;
  let pullRatio = total_sessions * pullDecimal;
  let lowerRatio = total_sessions * lowerDecimal;

  let pushInteger = Math.floor(pushRatio);
  let pullInteger = Math.floor(pullRatio);
  let lowerInteger = Math.floor(lowerRatio);

  let pushTenths = pushRatio - pushInteger;
  let pullTenths = pullRatio - pullInteger;
  let lowerTenths = lowerRatio - lowerInteger;

  let pushSessions = pushInteger;
  let pullSessions = pullInteger;
  let lowerSessions = lowerInteger;
  let upperSessions = 0;
  let fullSessions = 0;

  switch (split_name) {
    case "BRO":
      const bro_sessions = distributeIntoSessionsBro(sessions, priority);
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

      console.log(
        pullSessions,
        pushSessions,
        lowerSessions,
        ppl_sessions,
        "PPL TEST"
      );
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
      return {
        split: "UL",
        sessions: {
          upper: pushSessions + pullSessions,
          lower: lowerSessions,
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
  let BRO_WEIGHTS = {
    back: 0,
    chest: 0,
    legs: 0,
    arms: 0,
    shoulders: 0,
  };

  // NOTE: to even out distribution among each bro split, this modifier will take into
  //       account how many muscles make up split.
  let MODIFIER = 0;
  let WEIGHT = 4;

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
        let back_total = (MODIFIER + 3) * WEIGHT - i;
        BRO_WEIGHTS.back = BRO_WEIGHTS.back + rank + back_total;
        break;
      case "chest":
        let chest_total = (MODIFIER + 3) * WEIGHT - i;
        BRO_WEIGHTS.chest = BRO_WEIGHTS.chest + rank + chest_total;
        break;
      default:
    }
  }
  BRO_WEIGHTS.arms = BRO_WEIGHTS.arms + (MODIFIER + 1) * WEIGHT;

  console.log(BRO_WEIGHTS, priority, "TEST: modifiers on ranking");
  let splitRanking = Object.keys(BRO_WEIGHTS).sort(
    (a, b) =>
      BRO_WEIGHTS[b as keyof typeof BRO_WEIGHTS] -
      BRO_WEIGHTS[a as keyof typeof BRO_WEIGHTS]
  );

  let total = total_sessions[0] + total_sessions[1];
  let index = 0;

  let BRO = {
    legs: 0,
    back: 0,
    chest: 0,
    arms: 0,
    shoulders: 0,
  };

  for (let j = 0; j < total; j++) {
    let session = splitRanking[index] as keyof typeof BRO;
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

  let total = Math.round(push + legs + pull);

  if (total <= 1) {
    let { key } = getKeyWithHighestValue(PPL);
    PPL = { ...PPL, [key]: PPL[key] + 1 };
  } else {
    // lol my logic sucks
    let highestKey: keyof typeof PPL = "push";
    let secondHighestKey: keyof typeof PPL = "pull";

    let first = getKeyWithHighestValue(PPL);
    highestKey = first.key;

    let newPPL = { ...PPL, [highestKey]: 0 };
    let second = getKeyWithHighestValue(newPPL);
    secondHighestKey = second.key;

    PPL = {
      ...PPL,
      [highestKey]: PPL[highestKey] + 1,
      [secondHighestKey]: PPL[secondHighestKey] + 1,
    };
  }

  return PPL;
}

function divideRatioIntoSessionsOPT(push: number, legs: number, pull: number) {
  let OPT = {
    push: 0,
    legs: 0,
    pull: 0,
    upper: 0,
    full: 0,
  };

  let total = Math.round(push + legs + pull);

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
