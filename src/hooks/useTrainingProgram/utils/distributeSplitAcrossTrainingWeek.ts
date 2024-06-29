import {
  INITIAL_WEEK,
  SessionType,
  SplitSessionsSplitsType,
  SplitSessionsType,
  TrainingDayType,
} from "../reducer/trainingProgramReducer";

export const createTrainingWeek = (
  sessions: [number, number],
  split_sessions: SplitSessionsType
) => {
  const week_sessions = sessions[0];
  const off_days = 7 - week_sessions;

  const counterMap = new Map<string, number>(
    Object.entries(split_sessions.sessions).map(([key, val]) => [key, val])
  );
};

export const distributeSplitAcrossWeek = (
  sessions: [number, number],
  split_sessions: SplitSessionsType
) => {
  const week_sessions = sessions[0];
  const off_days = 7 - week_sessions;
  const off_day_indices = getOffDayIndices(off_days);

  const initWeek = structuredClone(INITIAL_WEEK);

  const initOffDays = initWeek.map((each, index) => {
    if (off_day_indices.includes(index)) {
      return { ...each, isTrainingDay: false };
    } else return each;
  });

  return distributeSplitHandler(initOffDays, split_sessions);
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
      return [0, 3, 5];
    case 4:
      return [0, 2, 4, 6];
    default:
      return [];
  }
};
// const getOffDayIndices = (number: number) => {
//   switch (number) {
//     case 0:
//       return [];
//     case 1:
//       return [0];
//     case 2:
//       return [0, 4];
//     case 3:
//       return [0, 4, 6];
//     case 4:
//       return [0, 2, 4, 6];
//     default:
//       return [];
//   }
// };

const distributeSplitHandler = (
  week: TrainingDayType[],
  split_sessions: SplitSessionsType
) => {
  const counterMap = new Map<string, number>(
    Object.entries(split_sessions.sessions).map(([key, val]) => [key, val])
  );

  let lastIn = "";
  for (let i = 0; i < week.length; i++) {
    const sortedNextSplit = getNextSplit(lastIn, split_sessions);

    let nextSession: string | null = null;
    for (let j = 0; j < sortedNextSplit.length; j++) {
      const hasKey = counterMap.has(sortedNextSplit[j]);
      const hasValue = counterMap.get(sortedNextSplit[j]);

      if (hasKey && hasValue) {
        nextSession = sortedNextSplit[j];
        break;
      }
    }

    if (week[i].isTrainingDay) {
      if (!nextSession) continue;
      const session: SessionType = {
        id: `${i}_${nextSession}_session`,
        split: nextSession as keyof SplitSessionsSplitsType,
        exercises: [],
      };

      lastIn = nextSession;
      week[i].sessions.push(session);

      const value = counterMap.get(nextSession);
      if (value && value >= 0) {
        counterMap.set(nextSession, value - 1);
      }
    } else {
      const session: SessionType = {
        id: `${i}_off_session`,
        split: "off",
        exercises: [],
      };

      lastIn = "off";
      week[i].sessions.push(session);
    }
    // if (week[i].isTrainingDay && nextSession) {
    //   const session: SessionType = {
    //     id: `${i}_${nextSession}_session`,
    //     split: nextSession as keyof SplitSessionsSplitsType,
    //     exercises: [],
    //   };

    //   lastIn = nextSession;
    //   week[i].sessions.push(session);

    //   const value = counterMap.get(nextSession);
    //   if (value && value >= 0) {
    //     counterMap.set(nextSession, value - 1);
    //   }
    // } else {
    //   lastIn = "off";
    // }
  }

  return week;
};

const getNextSplit = (lastIn: string, split_sessions: SplitSessionsType) => {
  switch (split_sessions.split) {
    case "OPT":
      return getNextSplit_OPT(lastIn);
    case "PPL":
      return getNextSplit_PPL(lastIn);
    case "PPLUL":
      return getNextSplit_PPLUL(lastIn);
    case "UL":
      return getNextSplit_UL(lastIn, "lower");
    case "BRO":
      return getNextSplit_BRO(lastIn);
    case "FB":
      return ["full"];
    default:
      return [];
  }
};

const getNextSplit_OPT = (prevSplit: string) => {
  switch (prevSplit) {
    case "upper":
      return ["push", "pull", "full", "lower", "upper"];
    case "lower":
      return ["push", "pull", "full", "upper", "lower"];
    case "full":
      return ["push", "pull", "full", "upper", "lower"];
    case "push":
      return ["lower", "pull", "full", "upper", "push"];
    case "pull":
      return ["lower", "push", "full", "upper", "pull"];
    default:
      return ["lower", "upper", "push", "pull", "full"];
  }
};

const getNextSplit_PPL = (prevSplit: string) => {
  switch (prevSplit) {
    case "push":
      return ["legs", "pull", "push"];
    case "pull":
      return ["legs", "push", "pull"];
    case "legs":
      return ["pull", "push", "legs"];
    default:
      return ["push", "legs", "pull"];
  }
};

const getNextSplit_PPLUL = (prevSplit: string) => {
  switch (prevSplit) {
    case "push":
      return ["legs", "lower", "pull", "upper", "push"];
    case "pull":
      return ["lower", "upper", "legs", "push", "pull"];
    case "legs":
      return ["pull", "upper", "push", "lower", "legs"];
    case "upper":
      return ["lower", "legs", "push", "pull", "upper"];
    case "lower":
      return ["upper", "push", "pull", "legs", "lower"];
    default:
      return ["push", "lower", "upper", "legs", "pull"];
  }
};

const getNextSplit_UL = (prevSplit: string, preferred: "upper" | "lower") => {
  switch (prevSplit) {
    case "upper":
      return ["lower", "upper"];
    case "lower":
      return ["upper", "lower"];
    default:
      if (preferred === "upper") {
        return ["upper", "lower"];
      } else {
        return ["lower", "upper"];
      }
  }
};

const getNextSplit_BRO = (prevSplit: string) => {
  switch (prevSplit) {
    case "legs":
      return ["shoulders", "arms", "chest", "back", "legs"];
    case "back":
      return ["shoulders", "arms", "chest", "legs", "back"];
    case "chest":
      return ["shoulders", "arms", "back", "legs", "chest"];
    case "arms":
      return ["shoulders", "legs", "back", "chest", "arms"];
    case "shoulders":
      return ["legs", "back", "chest", "arms", "shoulders"];
    default:
      return ["legs", "back", "chest", "arms", "shoulders"];
  }
};
