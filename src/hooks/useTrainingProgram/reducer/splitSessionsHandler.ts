import {
  getBroSplit,
  getPushPullLegsSplit,
  getUpperLowerSplit,
} from "~/constants/workoutSplits";
import {
  BROSessionsType,
  DayType,
  FBSessionsType,
  MusclePriorityType,
  PPLULSessionsType,
  ULSessionsType,
} from "./trainingProgramReducer";

const getPPLULSplitSessions = (
  total_sessions: [number, number],
  list: MusclePriorityType[]
) => {
  const totalSessions = total_sessions[0] + total_sessions[1];
  let initEvenDistribution = Math.floor(totalSessions / 5);
  let count = totalSessions % 5;

  const pplul_sessions = {
    push: initEvenDistribution,
    legs: initEvenDistribution,
    pull: initEvenDistribution,
    upper: initEvenDistribution,
    lower: initEvenDistribution,
  };

  let added: ("push" | "pull" | "legs" | "upper" | "lower")[] = [];

  for (let i = 0; i < list.length; i++) {
    if (count < 1) break;
    const pplKey = getPushPullLegsSplit(list[i].muscle);
    const pplulKey = getUpperLowerSplit(list[i].muscle);

    if (added.includes(pplKey)) {
      pplul_sessions[pplulKey]++;
      count--;
      added.push(pplulKey);
    } else {
      pplul_sessions[pplKey]++;
      count--;
      added.push(pplKey);
    }
  }
  return pplul_sessions;
};

const getPPLSplitSessions = (
  total_sessions: [number, number],
  list: MusclePriorityType[]
) => {
  const totalSessions = total_sessions[0] + total_sessions[1];
  let initEvenDistribution = Math.floor(totalSessions / 3);
  let count = totalSessions % 3;

  const ppl_sessions = {
    push: initEvenDistribution,
    legs: initEvenDistribution,
    pull: initEvenDistribution,
  };

  let added: ("push" | "pull" | "legs")[] = [];
  for (let i = 0; i < list.length; i++) {
    if (count < 1) break;
    const pplKey = getPushPullLegsSplit(list[i].muscle);

    ppl_sessions[pplKey]++;
    count--;
    added.push(pplKey);
  }
  return ppl_sessions;
};

export const getBroSplitSessions = (
  total_sessions: [number, number],
  priority: MusclePriorityType[]
) => {
  const totalSessions = total_sessions[0] + total_sessions[1];

  let initEvenDistribution = Math.floor(totalSessions / 5);
  let count = totalSessions % 5;

  const bro_sessions = {
    legs: initEvenDistribution,
    back: initEvenDistribution,
    chest: initEvenDistribution,
    arms: initEvenDistribution,
    shoulders: initEvenDistribution,
  };

  let added: ("legs" | "back" | "chest" | "arms" | "shoulders")[] = [];
  for (let i = 0; i < priority.length; i++) {
    if (count < 1) break;
    const broKey = getBroSplit(priority[i].muscle);
    bro_sessions[broKey]++;
    count--;
    added.push(broKey);
  }

  return bro_sessions;
};

const getULSplitSessions = (
  total: [number, number],
  priority: MusclePriorityType[]
) => {
  const totalSessions = total[0] + total[1];

  let initEvenDistribution = Math.floor(totalSessions / 2);
  let count = totalSessions % 2;

  const ul_sessions = {
    upper: 0,
    lower: 0,
  };
};

// export const getSessionCounter = (split_sessions: SplitSessionsType) => {
//   switch (split_sessions.split) {
//     case "BRO":
//       return {
//         name: split,
//         sessions: {
//           legs: sessions.legs,
//           back: sessions.back,
//           chest: sessions.chest,
//           arms: sessions.arms,
//           shoulders: sessions.shoulders,
//         },
//       };
//     case "PPL":
//       return {
//         name: split,
//         sessions: {
//           push: sessions.push,
//           legs: sessions.legs,
//           pull: sessions.pull,
//         },
//       };
//     case "PPLUL":
//       return {
//         name: split,
//         sessions: {
//           push: sessions.push,
//           legs: sessions.legs,
//           pull: sessions.pull,
//           lower: sessions.lower,
//           upper: sessions.upper,
//         },
//       };
//     case "UL":
//       return {
//         name: split,
//         sessions: {
//           lower: sessions.lower,
//           upper: sessions.upper,
//         },
//       };
//     case "FB":
//       return {
//         name: split,
//         sessions: {
//           full: sessions.full,
//         },
//       };
//     case "OPT":
//       return {
//         name: split,
//         sessions: {
//           upper: sessions.upper,
//           lower: sessions.lower,
//           full: sessions.full,
//           push: sessions.push,
//           pull: sessions.pull,
//         },
//       };
//     case "CUS":
//       return { name: split, sessions: sessions };
//     default:
//       return { name: "OPT", sessions: sessions };
//   }
// };

const getNextSplitPPL = (
  prevSplit: string,
  count: { push: number; pull: number; legs: number }
) => {
  switch (prevSplit) {
    case "push":
      if (count.legs > 0) return "legs";
      else if (count.pull > 0) return "pull";
      else if (count.push > 0) return "push";
      else return null;
    case "pull":
      if (count.legs > 0) return "legs";
      else if (count.push > 0) return "push";
      else if (count.pull > 0) return "pull";
      else return null;
    case "legs":
      if (count.pull > 0) return "pull";
      else if (count.push > 0) return "push";
      else if (count.legs > 0) return "legs";
      else return null;
    case "off":
      if (count.push > 0) return "push";
      else if (count.legs > 0) return "legs";
      else if (count.pull > 0) return "pull";
      else return null;
    default:
      return null;
  }
};
const getNextSplitPPLUL = (
  prevSplit: string,
  count: {
    push: number;
    pull: number;
    legs: number;
    upper: number;
    lower: number;
  }
) => {
  switch (prevSplit) {
    case "push":
      if (count.legs > 0) return "legs";
      else if (count.lower > 0) return "lower";
      else if (count.pull > 0) return "pull";
      else if (count.upper > 0) return "upper";
      else if (count.push > 0) return "push";
      else return null;
    case "pull":
      if (count.lower > 0) return "lower";
      else if (count.upper > 0) return "upper";
      else if (count.legs > 0) return "legs";
      else if (count.push > 0) return "push";
      else if (count.pull > 0) return "pull";
      else return null;
    case "legs":
      if (count.pull > 0) return "pull";
      else if (count.upper > 0) return "upper";
      else if (count.push > 0) return "push";
      else if (count.lower > 0) return "lower";
      else if (count.legs > 0) return "legs";
      else return null;
    case "upper":
      if (count.lower > 0) return "lower";
      else if (count.legs > 0) return "legs";
      else if (count.push > 0) return "push";
      else if (count.pull > 0) return "pull";
      else if (count.upper > 0) return "upper";
      else return null;
    case "lower":
      if (count.upper > 0) return "upper";
      else if (count.push > 0) return "push";
      else if (count.pull > 0) return "pull";
      else if (count.legs > 0) return "legs";
      else if (count.lower > 0) return "lower";
      else return null;
    case "off":
      if (count.push > 0) return "push";
      else if (count.lower > 0) return "lower";
      else if (count.upper > 0) return "upper";
      else if (count.legs > 0) return "legs";
      else if (count.pull > 0) return "pull";
      else return null;
    default:
      return null;
  }
};

const getNextSplitBRO = (
  prevSplit: string,
  count: {
    legs: number;
    back: number;
    chest: number;
    arms: number;
    shoulders: number;
  }
) => {
  switch (prevSplit) {
    case "legs":
      if (count.back > 0) return "back";
      else if (count.chest > 0) return "chest";
      else if (count.shoulders > 0) return "shoulders";
      else if (count.arms > 0) return "arms";
      else if (count.legs > 0) return "legs";
      else return null;
    case "back":
      if (count.chest > 0) return "chest";
      else if (count.arms > 0) return "arms";
      else if (count.shoulders > 0) return "shoulders";
      else if (count.legs > 0) return "legs";
      else if (count.back > 0) return "back";
      else return null;
    case "chest":
      if (count.arms > 0) return "arms";
      else if (count.shoulders > 0) return "shoulders";
      else if (count.legs > 0) return "legs";
      else if (count.back > 0) return "back";
      else if (count.chest > 0) return "chest";
      else return null;
    case "arms":
      if (count.shoulders > 0) return "shoulders";
      else if (count.legs > 0) return "legs";
      else if (count.back > 0) return "back";
      else if (count.chest > 0) return "chest";
      else if (count.arms > 0) return "arms";
      else return null;
    case "shoulders":
      if (count.legs > 0) return "legs";
      else if (count.back > 0) return "back";
      else if (count.chest > 0) return "chest";
      else if (count.arms > 0) return "arms";
      else if (count.shoulders > 0) return "shoulders";
      else return null;
    case "off":
      if (count.legs > 0) return "legs";
      else if (count.back > 0) return "back";
      else if (count.chest > 0) return "chest";
      else if (count.arms > 0) return "arms";
      else if (count.shoulders > 0) return "shoulders";
      else return null;
    default:
      return null;
  }
};

type TrainingDay = {
  day: DayType;
  isTrainingDay: boolean;
  sessions: SessionType[];
};
type SessionType = {
  id: string;
  split: string;
  exercises: [];
};

export const distributePPLSplitAcrossWeek = (
  week: TrainingDay[],
  sessions: { push: number; legs: number; pull: number }
) => {
  let counter = { ...sessions };

  let _week = week.map((each) => {
    return { ...each, sessions: [] as SessionType[] };
  });

  let stack: ("push" | "pull" | "legs" | "off")[] = [];

  for (let i = 0; i < _week.length; i++) {
    let lastIn = stack[stack.length - 1];
    const nextSession = getNextSplitPPL(lastIn, counter);

    if (_week[i].isTrainingDay && nextSession) {
      let session: SessionType = {
        id: "",
        split: nextSession,
        exercises: [],
      };

      _week[i].sessions.push(session);
      stack.push(nextSession);
      counter[nextSession]--;

      console.log(nextSession, lastIn, stack, counter, _week, "AFTER ALL");
    } else {
      stack.push("off");
    }
  }
  return _week;
};

export const distributePPLULSplitAcrossWeek = (
  week: TrainingDay[],
  split_sessions: PPLULSessionsType
) => {
  let counter = { ...split_sessions.sessions };

  let _week = week.map((each) => {
    return { ...each, sessions: [] as SessionType[] };
  });

  let stack: ("push" | "pull" | "legs" | "upper" | "lower" | "off")[] = [];

  for (let i = 0; i < _week.length; i++) {
    let lastIn = stack[stack.length - 1];
    const nextSession = getNextSplitPPLUL(lastIn, counter);

    if (_week[i].isTrainingDay && nextSession) {
      let session: SessionType = {
        id: "",
        split: nextSession,
        exercises: [],
      };

      _week[i].sessions.push(session);
      stack.push(nextSession);
      counter[nextSession]--;

      console.log(nextSession, lastIn, stack, counter, _week, "AFTER ALL");
    } else {
      stack.push("off");
    }
  }
  return _week;
};

export const distributeBROSplitAcrossWeek = (
  week: TrainingDay[],
  split_sessions: BROSessionsType
) => {
  let counter = { ...split_sessions.sessions };

  let _week = week.map((each) => {
    return { ...each, sessions: [] as SessionType[] };
  });

  let stack: ("legs" | "back" | "chest" | "arms" | "shoulders" | "off")[] = [];

  for (let i = 0; i < _week.length; i++) {
    let lastIn = stack[stack.length - 1];
    const nextSession = getNextSplitBRO(lastIn, counter);

    if (_week[i].isTrainingDay && nextSession) {
      let session: SessionType = {
        id: "",
        split: nextSession,
        exercises: [],
      };

      _week[i].sessions.push(session);
      stack.push(nextSession);
      counter[nextSession]--;

      console.log(nextSession, lastIn, stack, counter, _week, "AFTER ALL");
    } else {
      stack.push("off");
    }
  }
  return _week;
};

const getNextSplitUL = (
  prevSplit: string,
  count: { upper: number; lower: number },
  preferred: "upper" | "lower"
) => {
  switch (prevSplit) {
    case "upper":
      if (count.lower > 0) return "lower";
      else if (count.upper > 0) return "upper";
      else return null;
    case "lower":
      if (count.upper > 0) return "upper";
      else if (count.lower > 0) return "lower";
      else return null;
    case "off":
      if (preferred === "upper") {
        if (count.upper > 0) return "upper";
        else return "lower";
      } else if (preferred === "lower") {
        if (count.lower > 0) return "lower";
        else return "upper";
      } else return null;
    default:
      return null;
  }
};

export const distributeULSplitAcrossWeek = (
  week: TrainingDay[],
  split_sessions: ULSessionsType
) => {
  let preferred: "upper" | "lower" =
    split_sessions.sessions.upper >= split_sessions.sessions.lower
      ? "upper"
      : "lower";
  let counter = { ...split_sessions.sessions };

  let _week = week.map((each) => {
    return { ...each, sessions: [] as SessionType[] };
  });

  let stack: ("upper" | "lower" | "off")[] = [];

  for (let i = 0; i < _week.length; i++) {
    let lastIn = stack[stack.length - 1];
    const nextSession = getNextSplitUL(lastIn, counter, preferred);

    if (_week[i].isTrainingDay && nextSession) {
      let session: SessionType = {
        id: "",
        split: nextSession,
        exercises: [],
      };

      _week[i].sessions.push(session);
      stack.push(nextSession);
      counter[nextSession]--;

      console.log(nextSession, lastIn, stack, counter, _week, "AFTER ALL");
    } else {
      stack.push("off");
    }
  }
  return _week;
};

export const distributeFBSplitAcrossWeek = (
  week: TrainingDay[],
  split_sessions: FBSessionsType
) => {
  let counter = { ...split_sessions.sessions };

  let _week = week.map((each) => {
    return { ...each, sessions: [] as SessionType[] };
  });

  for (let i = 0; i < _week.length; i++) {
    if (_week[i].isTrainingDay) {
      let session: SessionType = {
        id: "",
        split: "full",
        exercises: [],
      };

      _week[i].sessions.push(session);
      counter["full"]--;
    }
  }
  return _week;
};

const getNextSplitOPT = (
  prevSplit: string,
  count: {
    upper: number;
    lower: number;
    full: number;
    push: number;
    pull: number;
  }
) => {
  switch (prevSplit) {
    case "upper":
      if (count.lower > 0) return "lower";
      else if (count.full > 0) return "full";
      else if (count.push > 0) return "push";
      else if (count.pull > 0) return "pull";
      else if (count.upper > 0) return "upper";
      else return null;
    case "lower":
      if (count.upper > 0) return "upper";
      else if (count.push > 0) return "push";
      else if (count.pull > 0) return "pull";
      else if (count.full > 0) return "full";
      else if (count.lower > 0) return "lower";
      else return null;
    case "full":
      if (count.pull > 0) return "pull";
      else if (count.push > 0) return "push";
      else if (count.upper > 0) return "upper";
      else if (count.lower > 0) return "lower";
      else if (count.full > 0) return "full";
      else return null;
    case "push":
      if (count.lower > 0) return "lower";
      else if (count.pull > 0) return "pull";
      else if (count.full > 0) return "full";
      else if (count.upper > 0) return "upper";
      else if (count.push > 0) return "push";
      else return null;
    case "pull":
      if (count.lower > 0) return "lower";
      else if (count.push > 0) return "push";
      else if (count.full > 0) return "full";
      else if (count.upper > 0) return "upper";
      else if (count.pull > 0) return "pull";
      else return null;
    case "off":
      if (count.lower > 0) return "lower";
      else if (count.upper > 0) return "upper";
      else if (count.push > 0) return "push";
      else if (count.pull > 0) return "pull";
      else if (count.full > 0) return "full";
      else return null;
    default:
      return null;
  }
};

export const distributeOPTSplitAcrossWeek = (
  week: TrainingDay[],
  sessions: {
    upper: number;
    lower: number;
    full: number;
    push: number;
    pull: number;
  }
) => {
  let counter = { ...sessions };

  let _week = week.map((each) => {
    return { ...each, sessions: [] as SessionType[] };
  });

  let stack: ("upper" | "lower" | "full" | "push" | "pull" | "off")[] = [];

  for (let i = 0; i < _week.length; i++) {
    let lastIn = stack[stack.length - 1];
    const nextSession = getNextSplitOPT(lastIn, counter);

    if (_week[i].isTrainingDay && nextSession) {
      let session: SessionType = {
        id: "",
        split: nextSession,
        exercises: [],
      };

      _week[i].sessions.push(session);
      stack.push(nextSession);
      counter[nextSession]--;

      console.log(nextSession, lastIn, stack, counter, _week, "AFTER ALL");
    } else {
      stack.push("off");
    }
  }
  return _week;
};
