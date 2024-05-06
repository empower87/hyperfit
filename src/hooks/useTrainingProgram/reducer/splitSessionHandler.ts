import {
  BROSessionsType,
  FBSessionsType,
  INITIAL_WEEK,
  OPTSessionsType,
  PPLSessionsType,
  PPLULSessionsType,
  SessionSplitType,
  SessionType,
  SplitSessionsNameType,
  SplitSessionsSplitsType,
  SplitSessionsType,
  TrainingDayType,
  ULSessionsType,
} from "./trainingProgramReducer";

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

export const determineSplitHandler = (splitType: SessionSplitType[]) => {
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
  splits: SessionSplitType[]
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
