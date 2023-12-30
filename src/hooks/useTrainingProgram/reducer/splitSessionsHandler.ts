import { getBroSplit } from "~/constants/workoutSplits";
import {
  BROSessionsType,
  FBSessionsType,
  MusclePriorityType,
  OPTSessionsType,
  PPLSessionsType,
  PPLULSessionsType,
  SessionType,
  SplitSessionsType,
  TrainingDayType,
  ULSessionsType,
} from "./trainingProgramReducer";

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

export const distributePPLSplitAcrossWeek = (
  week: TrainingDayType[],
  sessions: PPLSessionsType["sessions"]
) => {
  let counter = { ...sessions };

  let _week = week.map((each, index) => {
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
  week: TrainingDayType[],
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
  week: TrainingDayType[],
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
  week: TrainingDayType[],
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
  week: TrainingDayType[],
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
  week: TrainingDayType[],
  sessions: OPTSessionsType
) => {
  let counter = { ...sessions.sessions };

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
    } else {
      stack.push("off");
    }
  }
  return _week;
};

const getOffDayIndices = (number: number) => {
  switch (number) {
    case 0:
      return [];
    case 1:
      return [0];
    case 2:
      return [0, 4];
    case 3:
      return [0, 4, 6];
    case 4:
      return [0, 2, 4, 6];
    default:
      return [];
  }
};

export const distributeSplitAcrossWeek = (
  _week: TrainingDayType[],
  sessions: [number, number],
  split_sessions: SplitSessionsType
) => {
  const week_sessions = sessions[0];
  const off_days = 7 - week_sessions;
  const off_day_indices = getOffDayIndices(off_days);

  // let counter = getSessionCounter(split_sessions.name, split_sessions.sessions);
  let counter = { ...split_sessions };

  let week = _week.map((each, index) => {
    if (off_day_indices.includes(index)) {
      return { ...each, isTrainingDay: false };
    } else return each;
  });

  switch (counter.split) {
    case "PPL":
      week = distributePPLSplitAcrossWeek(week, counter.sessions);
      break;
    case "PPLUL":
      week = distributePPLULSplitAcrossWeek(week, counter);
      break;
    case "BRO":
      week = distributeBROSplitAcrossWeek(week, counter);
      break;
    case "UL":
      week = distributeULSplitAcrossWeek(week, counter);
      break;
    case "FB":
      week = distributeFBSplitAcrossWeek(week, counter);
      break;
    case "OPT":
      week = distributeOPTSplitAcrossWeek(week, counter);
      break;
    default:
    // return week;
  }
  return week;
};
