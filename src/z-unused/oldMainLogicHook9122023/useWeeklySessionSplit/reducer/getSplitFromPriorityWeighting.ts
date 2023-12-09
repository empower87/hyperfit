import {
  ARMS_MUSCLES,
  BACK_MUSCLES,
  CHEST_MUSCLES,
  LEGS_MUSCLES,
  LOWER_MUSCLES,
  PULL_MUSCLES,
  PUSH_AND_PULL_MUSCLES,
  PUSH_MUSCLES,
  SHOULDERS_MUSCLES,
} from "~/constants/workoutSplits";
import {
  MusclePriorityType,
  SplitSessionsNameType,
} from "./weeklySessionSplitReducer";

const getKeyWithHighestValue = <TObj extends Record<string, number>>(
  obj: TObj
): { key: keyof TObj; value: number } => {
  const keys = Object.keys(obj) as Array<keyof TObj>;
  let highestKey = keys[0] as keyof TObj;
  let highestValue = obj[highestKey];

  for (const key of keys) {
    if (obj[key] > highestValue) {
      highestKey = key;
      highestValue = obj[key];
    }
  }
  return { key: highestKey, value: highestValue };
};

export function getSplitFromWeights(
  sessions: [number, number],
  priority: MusclePriorityType[],
  split_name: SplitSessionsNameType
) {
  let push = 0;
  let pull = 0;
  let lower = 0;

  const SYSTEMIC_FATIGUE_MODIFIER = 2;
  const LOWER_MODIFIER = 1.15;
  const RANK_WEIGHTS = [14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0];

  for (let i = 0; i < priority.length; i++) {
    if (PUSH_AND_PULL_MUSCLES.includes(priority[i].muscle)) {
      let split = Math.round(RANK_WEIGHTS[i] / 2);
      push = push + split;
      pull = pull + split;
    } else if (PUSH_MUSCLES.includes(priority[i].muscle)) {
      push = push + RANK_WEIGHTS[i];
    } else if (PULL_MUSCLES.includes(priority[i].muscle)) {
      pull = pull + RANK_WEIGHTS[i];
    } else if (LOWER_MUSCLES.includes(priority[i].muscle)) {
      let lowerMod = Math.round(RANK_WEIGHTS[i] * LOWER_MODIFIER);
      if (priority[i].muscle === "quads" && i < 3) {
        lowerMod = lowerMod * SYSTEMIC_FATIGUE_MODIFIER;
      }
      lower = lower + lowerMod;
    }
  }

  const total_sessions = sessions[0] + sessions[1];
  const first_sessions = sessions[0];
  const second_sessions = sessions[1];

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
  let offSessions =
    second_sessions === 0 ? 0 : first_sessions - second_sessions;

  // let totalTenths = Math.round(pushTenths + pullTenths + lowerTenths);

  switch (split_name) {
    case "BRO":
      const bro_sessions = distributeIntoSessionsBro(sessions, priority);
      return { ...bro_sessions, off: offSessions };
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
        push: pushSessions,
        legs: lowerSessions,
        pull: pullSessions,
        off: offSessions,
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
        push: pushSessions,
        legs: lowerSessions,
        pull: pullSessions,
        upper: upperSessions,
        lower: fullSessions,
        off: offSessions,
      };
    case "CUS":
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
        push: pushSessions,
        pull: pullSessions,
        lower: lowerSessions,
        upper: upperSessions,
        full: fullSessions,
        off: offSessions,
      };
    case "FB":
      return {
        full: total_sessions,
        off: offSessions,
      };
    case "UL":
      return {
        upper: pushSessions + pullSessions,
        lower: lowerSessions,
        off: offSessions,
      };
    default:
      return {
        push: pushSessions,
        pull: pullSessions,
        lower: lowerSessions,
        upper: upperSessions,
        full: fullSessions,
        off: offSessions,
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

  const SYSTEMIC_FATIGUE_MODIFIER = 2;
  const LOWER_MODIFIER = 1.15;
  const RANK_WEIGHTS = [14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0];

  for (let i = 0; i < priority.length; i++) {
    if (LEGS_MUSCLES.includes(priority[i].muscle)) {
      let lowerMod = Math.round(RANK_WEIGHTS[i] * LOWER_MODIFIER);
      if (priority[i].muscle === "quads" && i < 3) {
        lowerMod = lowerMod * SYSTEMIC_FATIGUE_MODIFIER;
      }
      BRO_WEIGHTS.legs = BRO_WEIGHTS.legs + lowerMod;
    } else if (CHEST_MUSCLES.includes(priority[i].muscle)) {
      BRO_WEIGHTS.chest =
        BRO_WEIGHTS.chest + RANK_WEIGHTS[i] * SYSTEMIC_FATIGUE_MODIFIER;
    } else if (BACK_MUSCLES.includes(priority[i].muscle)) {
      BRO_WEIGHTS.back =
        BRO_WEIGHTS.back + RANK_WEIGHTS[i] * SYSTEMIC_FATIGUE_MODIFIER;
    } else if (SHOULDERS_MUSCLES.includes(priority[i].muscle)) {
      let split = Math.round(RANK_WEIGHTS[i] / 3);
      BRO_WEIGHTS.shoulders = BRO_WEIGHTS.shoulders + split;
    } else if (ARMS_MUSCLES.includes(priority[i].muscle)) {
      let split = Math.round(RANK_WEIGHTS[i] / 2);
      BRO_WEIGHTS.arms = BRO_WEIGHTS.arms + split;
    }
  }

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
