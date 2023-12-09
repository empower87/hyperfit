import {
  distributeBROSplitAcrossWeek,
  distributeFBSplitAcrossWeek,
  distributeOPTSplitAcrossWeek,
  distributePPLSplitAcrossWeek,
  distributePPLULSplitAcrossWeek,
  distributeULSplitAcrossWeek,
  getSessionCounter,
} from "~/hooks/useWeeklySessionSplit/reducer/getSplitSessions";
import {
  DayType,
  SplitSessionsType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";

export const getNextSession = (
  upper: number,
  lower: number,
  push: number,
  pull: number,
  full: number,
  off: number,
  totalLower: number,
  totalPush: number,
  totalPull: number,
  previousSession: SplitType,
  previousDaysSessions?: [SplitType, SplitType],
  nextDaysSessions?: [SplitType, SplitType]
) => {
  const hasTrainedLowerBodyPreviously =
    previousDaysSessions && previousDaysSessions.includes("lower")
      ? true
      : false;

  const isTrainingLowerBodyTomorrow =
    nextDaysSessions && nextDaysSessions.includes("lower") ? true : false;

  const canNotTrainLowerTomorrow =
    isTrainingLowerBodyTomorrow &&
    lower === 1 &&
    upper + push + pull + full + off === 1
      ? true
      : false;

  const canSkipLowerCurrently =
    hasTrainedLowerBodyPreviously &&
    upper + push + pull + full + off > 0 &&
    !canNotTrainLowerTomorrow
      ? true
      : false;

  const hasTrainedFullBodyPreviously =
    previousDaysSessions && previousDaysSessions.includes("full")
      ? true
      : false;
  const canSkipFullCurrently =
    hasTrainedFullBodyPreviously && upper + push + pull + off + lower > 0
      ? true
      : false;

  switch (previousSession) {
    case "upper":
      if (lower > 0) {
        if (hasTrainedLowerBodyPreviously && canSkipLowerCurrently) {
          if (off > 0) {
            return "off";
          } else if (pull > 0) {
            return "pull";
          } else if (push > 0) {
            return "push";
          } else if (full > 0) {
            return "full";
          } else {
            return "upper";
          }
        } else {
          return "lower";
        }
      } else if (full > 0) {
        return "full";
      } else if (off > 0) {
        return "off";
      } else if (push > 0) {
        return "push";
      } else if (pull > 0) {
        return "pull";
      } else {
        return "upper";
      }
    case "lower":
      if (upper > 0) {
        return "upper";
      } else if (push > 0) {
        return "push";
      } else if (pull > 0) {
        return "pull";
      } else if (off > 0) {
        return "off";
      } else if (full > 0) {
        return "full";
      } else if (lower > 0) {
        return "lower";
      } else {
        return "off";
      }
    case "push":
      if (pull > 0) {
        return "pull";
      } else if (lower > 0) {
        return "lower";
      } else if (full > 0) {
        return "full";
      } else if (upper > 0) {
        return "upper";
      } else if (off > 0) {
        return "off";
      } else {
        return "push";
      }
    case "pull":
      if (push > 0) {
        return "push";
      } else if (lower > 0) {
        return "lower";
      } else if (full > 0) {
        return "full";
      } else if (upper > 0) {
        return "upper";
      } else if (off > 0) {
        return "off";
      } else {
        return "pull";
      }
    case "full":
      if (upper > 0) {
        return "upper";
      } else if (lower > 0) {
        return "lower";
      } else if (push > 0) {
        return "push";
      } else if (pull > 0) {
        return "pull";
      } else if (off > 0) {
        return "off";
      } else {
        return "full";
      }
    default:
      // off
      if (
        lower > 0 &&
        ((totalLower >= totalPush && totalLower >= totalPull) ||
          (totalPush >= totalPull && totalPush - 1 <= totalLower) ||
          (totalPull >= totalPush && totalPull - 1 <= totalLower))
      ) {
        return "lower";
      } else if (upper > 0) {
        return "upper";
      } else if (totalPush >= totalPull && push > 0) {
        return "push";
      } else if (totalPull >= totalPush && pull > 0) {
        return "pull";
      } else if (full > 0) {
        return "full";
      } else {
        return "off";
      }
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
export const INITIAL_WEEK_TEST: TrainingDay[] = [
  {
    day: "Sunday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Monday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Tuesday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Wednesday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Thursday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Friday",
    isTrainingDay: true,
    sessions: [],
  },
  {
    day: "Saturday",
    isTrainingDay: true,
    sessions: [],
  },
];

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
  _week: TrainingDay[],
  sessions: [number, number],
  split_sessions: SplitSessionsType
) => {
  const week_sessions = sessions[0];
  const off_days = 7 - week_sessions;
  const off_day_indices = getOffDayIndices(off_days);

  let counter = getSessionCounter(split_sessions.name, split_sessions.sessions);

  let week = [...INITIAL_WEEK_TEST].map((each, index) => {
    if (off_day_indices.includes(index)) {
      return { ...each, isTrainingDay: false };
    } else return each;
  });

  switch (counter.name) {
    case "PPL":
      week = distributePPLSplitAcrossWeek(week, counter.sessions);
      break;
    case "PPLUL":
      week = distributePPLULSplitAcrossWeek(week, counter.sessions);
      break;
    case "BRO":
      week = distributeBROSplitAcrossWeek(week, counter.sessions);
      break;
    case "UL":
      week = distributeULSplitAcrossWeek(week, counter.sessions);
      break;
    case "FB":
      week = distributeFBSplitAcrossWeek(week, counter.sessions);
      break;
    case "OPT":
      week = distributeOPTSplitAcrossWeek(week, counter.sessions);
      break;
    default:
    // return week;
  }
  return week;
};
