import { getBroSplit } from "~/constants/workoutSplits";
import {
  BROSessionsType,
  FBSessionsType,
  MusclePriorityType,
  OPTSessionsType,
  PPLSessionsType,
  PPLULSessionsType,
  SessionType,
  SplitSessionsNameType,
  SplitSessionsType,
  SplitType,
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
        id: `${i}_${nextSession}_session`,
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
        id: `${i}_${nextSession}_session`,
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
        id: `${i}_${nextSession}_session`,
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
        id: `${i}_${nextSession}_session`,
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
        id: `${i}_full_session`,
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
        id: `${i}_${nextSession}_session`,
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

const getPotentialSplits = (splitType: SplitType): SplitSessionsNameType[] => {
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

export const determineSplitHandler = (splitType: SplitType[]) => {
  let splits: SplitSessionsNameType[] = [];

  for (let i = 0; i < splitType.length; i++) {
    const potential = getPotentialSplits(splitType[i]);
    if (i === 0) {
      splits = potential;
    } else {
      splits = splits.filter((split) => potential.includes(split));
    }
  }
  return splits;
};

export const redistributeSessionsIntoNewSplit = (
  split: SplitSessionsNameType,
  splits: SplitType[]
): SplitSessionsType => {
  switch (split) {
    case "BRO":
      const BRO_SPLIT: BROSessionsType["sessions"] = {
        arms: 0,
        shoulders: 0,
        back: 0,
        chest: 0,
        legs: 0,
      };

      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        BRO_SPLIT[key as keyof typeof BRO_SPLIT] =
          BRO_SPLIT[key as keyof typeof BRO_SPLIT] + 1;
      }
      return { split: "BRO", sessions: BRO_SPLIT };
    case "PPL":
      const PPL_SPLIT: PPLSessionsType["sessions"] = {
        push: 0,
        pull: 0,
        legs: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        PPL_SPLIT[key as keyof typeof PPL_SPLIT] =
          PPL_SPLIT[key as keyof typeof PPL_SPLIT] + 1;
      }
      return { split: "PPL", sessions: PPL_SPLIT };
    case "PPLUL":
      const PPLUL_SPLIT: PPLULSessionsType["sessions"] = {
        push: 0,
        pull: 0,
        legs: 0,
        upper: 0,
        lower: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        PPLUL_SPLIT[key as keyof typeof PPLUL_SPLIT] =
          PPLUL_SPLIT[key as keyof typeof PPLUL_SPLIT] + 1;
      }
      return { split: "PPLUL", sessions: PPLUL_SPLIT };
    case "UL":
      const UL_SPLIT: ULSessionsType["sessions"] = {
        upper: 0,
        lower: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        UL_SPLIT[key as keyof typeof UL_SPLIT] =
          UL_SPLIT[key as keyof typeof UL_SPLIT] + 1;
      }
      return { split: "UL", sessions: UL_SPLIT };
    case "FB":
      const FB_SPLIT: FBSessionsType["sessions"] = {
        full: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        FB_SPLIT[key as keyof typeof FB_SPLIT] =
          FB_SPLIT[key as keyof typeof FB_SPLIT] + 1;
      }
      return { split: "FB", sessions: FB_SPLIT };
    case "OPT":
      const OPT_SPLIT: OPTSessionsType["sessions"] = {
        upper: 0,
        lower: 0,
        push: 0,
        pull: 0,
        full: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        OPT_SPLIT[key as keyof typeof OPT_SPLIT] =
          OPT_SPLIT[key as keyof typeof OPT_SPLIT] + 1;
      }
      return { split: "OPT", sessions: OPT_SPLIT };
    default:
      const CUS_SPLIT = {
        upper: 0,
        lower: 0,
        push: 0,
        pull: 0,
        legs: 0,
        full: 0,
        back: 0,
        chest: 0,
        arms: 0,
        shoulders: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i] as keyof typeof CUS_SPLIT;
        CUS_SPLIT[key] = CUS_SPLIT[key] + 1;
      }
      return { split: "CUS", sessions: CUS_SPLIT };
  }
};
