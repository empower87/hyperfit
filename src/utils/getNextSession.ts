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

// chest - 2, 1
// back - 2, 1
// shoulders - 1, 1
// arms - 1, 1
// lower - 2, 1
// legs - 2, 1
// push - 1, 1
// pull - 1, 1
// full -

// prioritize 1 day off
// legs - [off, shoulders, arms, pull, push, chest, back, upper, full, lower, legs]
// lower - [off, shoulders, arms, pull, push, chest, back, upper, full, legs, lower]
// upper - [off, lower, legs, arms, shoulders, full, push, pull, chest, back, upper]
// push -

const PREFERED_NEXT_SESSIONS = {
  lower: [
    "off",
    "shoulders",
    "arms",
    "pull",
    "push",
    "chest",
    "back",
    "upper",
    "full",
    "legs",
    "lower",
  ],
  legs: [
    "off",
    "shoulders",
    "arms",
    "pull",
    "push",
    "chest",
    "back",
    "upper",
    "full",
    "lower",
    "legs",
  ],
  upper: [
    "off",
    "lower",
    "legs",
    "arms",
    "shoulders",
    "full",
    "push",
    "pull",
    "chest",
    "back",
    "upper",
  ],
  full: [
    "off",
    "shoulders",
    "arms",
    "chest",
    "back",
    "push",
    "pull",
    "upper",
    "lower",
    "legs",
    "full",
  ],
  push: [
    "pull",
    "back",
    "legs",
    "lower",
    "shoulders",
    "arms",
    "off",
    "full",
    "upper",
    "chest",
    "push",
  ],
  pull: [
    "push",
    "chest",
    "legs",
    "lower",
    "shoulders",
    "arms",
    "off",
    "full",
    "upper",
    "back",
    "pull",
  ],
  back: [
    "chest",
    "shoulders",
    "arms",
    "push",
    "legs",
    "lower",
    "off",
    "full",
    "upper",
    "pull",
    "back",
  ],
  chest: [
    "back",
    "arms",
    "shoulders",
    "pull",
    "legs",
    "lower",
    "off",
    "full",
    "upper",
    "push",
    "chest",
  ],
  arms: [
    "shoulders",
    "lower",
    "legs",
    "full",
    "chest",
    "back",
    "push",
    "pull",
    "upper",
    "off",
    "arms",
  ],
  shoulders: [
    "arms",
    "lower",
    "legs",
    "full",
    "chest",
    "back",
    "push",
    "pull",
    "upper",
    "off",
    "shoulders",
  ],
  off: [
    "lower",
    "legs",
    "upper",
    "full",
    "pull",
    "push",
    "back",
    "chest",
    "arms",
    "shoulders",
    "off",
  ],
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
const INITIAL_SESSION: SessionType = {
  id: "1_push_0",
  split: "push",
  exercises: [],
};
// push legs pull off push legs pull
// legs pull push off legs pull push
// pull push legs off pull push legs

export type SplitSessionsNameType =
  | "OPT"
  | "CUS"
  | "PPL"
  | "PPLUL"
  | "UL"
  | "FB"
  | "BRO";

type SessionKey =
  | "lower"
  | "upper"
  | "push"
  | "pull"
  | "legs"
  | "full"
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "off";

type SplitSessionsSessionsType = {
  lower: number;
  upper: number;
  push: number;
  pull: number;
  legs: number;
  full: number;
  chest: number;
  back: number;
  shoulders: number;
  arms: number;
  off: number;
};

const getOffDayIndices = (number: number) => {
  const specifiedSplitForDaysOff = (
    split: SplitSessionsNameType,
    daysOff: 2 | 3
  ) => {
    let twoDaysOffIndices = [];
    let threeDaysOffIndices = [];

    switch (split) {
      case "OPT":
      case "PPL":
        twoDaysOffIndices = [0, 4];
        threeDaysOffIndices = [0, 4, 6];
      case "PPLUL":
        twoDaysOffIndices = [0, 4];
        threeDaysOffIndices = [0, 4, 6];
      case "UL":
      case "FB":
      case "BRO":
      case "CUS":
      default:
    }
  };

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

const distributePPLSplit = (sessions: [number, number]) => {
  const week = [...INITIAL_WEEK_TEST];

  const order = ["push", "legs", "pull"];
  const off_day_breakpoints = ["Sunday", "Thursday"];
  let number_of_off_days = 7 - sessions[0];
  const off_day_indices = getOffDayIndices(number_of_off_days);

  for (let i = 0; i < week.length; i++) {
    if (!off_day_indices.includes(i)) {
    }
  }
};

const getSplitValues = (sessions: SplitSessionsSessionsType) => {
  let counter = {};

  Object.entries(sessions).forEach((each) => {
    if (each[1] > 0) {
      Object.assign(counter, { [each[0]]: each[1] });
    }
  });
  return counter;
};

const getSplitOrder = (split_sessions: SplitSessionsType) => {
  switch (split_sessions.name) {
    case "OPT":
      return ["upper", "lower", "upper"];
    case "PPL":
      return ["push", "legs", "pull"];
    case "PPLUL":
      return ["push", "legs", "pull", "lower", "upper"];
    case "UL":
      return ["upper", "lower"];
    case "BRO":
      return ["chest", "legs", "back", "shoulders", "arms"];
    case "FB":
      return ["full"];
    case "CUS":
      return ["upper"];
    default:
      return ["upper"];
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
  let counter = { ...split_sessions.sessions };
  let order = getSplitOrder(split_sessions);

  const week = [...INITIAL_WEEK_TEST].map((each, index) => {
    if (off_day_indices.includes(index)) {
      return { ...each, isTrainingDay: false };
    } else return each;
  });

  let order_index = 0;

  console.log(week, order, counter, split_sessions, "ALL STATE DATA");

  for (let i = 0; i < week.length; i++) {
    let split = order[order_index] as keyof typeof counter;
    let splitCounter = counter[split];

    if (week[i].isTrainingDay) {
      let session: SessionType = {
        id: "",
        split: split,
        exercises: [],
      };

      if (splitCounter > 0) {
        week[i].sessions.push(session);

        let value = counter[split] - 1;
        counter[split] = value;
        order_index = order_index + 1 < order.length - 1 ? order_index + 1 : 0;

        console.log(
          counter[split],
          split,
          splitCounter,
          order_index,
          week,
          "ALL STATE DATA"
        );
      } else {
        order_index = order_index + 1 < order.length - 1 ? order_index + 1 : 0;
      }

      // let key = order[order_index] as keyof typeof counter;
    }
  }
  return week;
};
