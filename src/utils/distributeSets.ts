import { MEV_RANK, MRV_RANK } from "src/constants/prioritizeRanks";
import workouts from "src/constants/workouts.json";
import { LOWER_MUSCLES, UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType } from "~/pages";
export type SessionSplitType = "upper" | "lower" | "full";

type SplitAmongSetsType = {
  split: SessionType[];
  rank: number;
  _name: string;
  testSets: [string, number[], number][];
};

const getSessionSets = (sessionVolume: number, totalSessions: number) => {
  let totalSets = sessionVolume;
  let sets = Math.floor(totalSets / totalSessions);

  let setRemainder = totalSets % totalSessions;

  let sessionSets: number[] = [];

  for (let i = 0; i < totalSessions; i++) {
    if (setRemainder > 0) {
      sessionSets.push(sets + 1);
      setRemainder--;
    } else {
      sessionSets.push(sets);
    }
  }

  return sessionSets;
};

const getAllSets = (
  primaryTotal: number,
  fullTotal: number,
  primaryVolume: number,
  fullVolume: number
) => {
  let primaryIndex = primaryTotal;
  let fullIndex = fullTotal;

  let primarySets = getSessionSets(primaryVolume, primaryIndex);
  let fullSets = getSessionSets(fullVolume, fullIndex);

  return {
    primarySessions: primarySets,
    fullSessions: fullSets,
  };
};

const distributeMEVorMV = (primary: number, full: number, vol: number) => {
  switch (vol) {
    case 2:
      if (primary >= 1) {
        return getAllSets(1, 0, vol, 0);
      } else {
        return getAllSets(0, 1, 0, vol);
      }
    case 3:
      if (primary >= 1) {
        return getAllSets(1, 0, vol, 0);
      } else {
        return getAllSets(0, 1, 0, vol);
      }
    case 4:
      if (primary >= 1) {
        return getAllSets(1, 0, vol, 0);
      } else {
        return getAllSets(0, 1, 0, vol);
      }
    case 6:
      if (primary >= 2) {
        return getAllSets(2, 0, vol, 0);
      } else if (primary === 1) {
        if (full >= 1) {
          return getAllSets(1, 1, 3, 3);
        } else {
          return getAllSets(1, 0, vol, 0);
        }
      } else if (primary === 0) {
        if (full >= 2) {
          return getAllSets(0, 2, 0, vol);
        } else {
          return getAllSets(0, 1, 0, vol);
        }
      }
    case 8:
      if (primary >= 3) {
        return getAllSets(3, 0, 9, 0);
      } else if (primary === 2) {
        if (full >= 1) {
          return getAllSets(2, 1, 6, 3);
        } else {
          return getAllSets(2, 0, vol, 0);
        }
      } else if (primary === 1) {
        if (full >= 2) {
          return getAllSets(1, 2, 3, 6);
        } else if (full === 1) {
          return getAllSets(1, 1, 4, 4);
        } else {
          return getAllSets(1, 0, vol, 0);
        }
      } else if (primary === 0) {
        if (full >= 3) {
          return getAllSets(0, 3, 0, 9);
        } else if (full === 2) {
          return getAllSets(0, 2, 0, vol);
        } else {
          return getAllSets(0, 1, 0, vol);
        }
      }
    case 10:
      if (primary >= 3) {
        return getAllSets(3, 0, vol, 0);
      } else if (primary === 2) {
        if (full >= 1) {
          return getAllSets(2, 1, 7, 3);
        } else {
          return getAllSets(2, 0, vol, 0);
        }
      } else if (primary === 1) {
        if (full >= 2) {
          return getAllSets(1, 2, 4, 6);
        } else if (full === 1) {
          return getAllSets(1, 1, 5, 5);
        } else {
          return getAllSets(1, 0, vol, 0);
        }
      } else if (primary === 0) {
        if (full >= 3) {
          return getAllSets(0, 3, 0, 10);
        } else if (full === 2) {
          return getAllSets(0, 2, 0, vol);
        } else {
          return getAllSets(0, 1, 0, vol);
        }
      }
    default:
      return { primarySessions: [], fullSessions: [] };
  }
};

const distributeMRVAmongSessions = (
  muscle: string,
  sessions: number,
  full: number,
  rank: number
) => {
  const muscleObj = workouts.find((each) => each.name === muscle);
  if (!muscleObj) return { primarySessions: [], fullSessions: [] };
  const { MRV, MAV, MEV, MV, frequency_max } = muscleObj;

  const sessionsStringified =
    sessions > 5 ? `${sessions}` : `${sessions}-${full}`;

  let volumeRange = MRV;
  let totalVolume = 0;

  let max_sessions = frequency_max;
  let fullVolume = 0;

  switch (sessionsStringified) {
    // ZERO PRIMARY
    case "0-0":
      return { primarySessions: [], fullSessions: [] };
    case "0-1":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(0, 1, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(0, 1, MV);
      }
      totalVolume = volumeRange[0];
      return { primarySessions: [], fullSessions: [totalVolume] };
    case "0-2":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(0, 2, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(0, 2, MV);
      }
      totalVolume = volumeRange[1];
      let splitVolume = Math.floor(totalVolume / 2);
      return { primarySessions: [], fullSessions: [splitVolume, splitVolume] };
    case "0-3":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(0, 3, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(0, 3, MV);
      }
      fullVolume = volumeRange[2];
      return getAllSets(0, 3, 0, fullVolume);
    case "0-4":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(0, 3, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(0, 3, MV);
      }
      fullVolume = volumeRange[3];
      return getAllSets(0, 4, 0, fullVolume);
    case "0-5":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(0, 3, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(0, 3, MV);
      }
      fullVolume = volumeRange[max_sessions - 1];
      return getAllSets(0, max_sessions, 0, fullVolume);
    case "0-6":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(0, 3, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(0, 3, MV);
      }
      fullVolume = volumeRange[max_sessions - 1];
      return getAllSets(0, max_sessions, 0, fullVolume);
    case "0-7":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(0, 3, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(0, 3, MV);
      }
      fullVolume = volumeRange[max_sessions - 1];
      return getAllSets(0, max_sessions, 0, fullVolume);

    // ONE PRIMARY
    case "1-0":
      return getAllSets(1, 0, volumeRange[0], 0);
    case "1-1":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(1, 1, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(1, 1, MV);
      }
      fullVolume = volumeRange[1] - MAV;
      let prim = volumeRange[1] - fullVolume;
      return getAllSets(1, 1, prim, fullVolume);
    case "1-2":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(1, 2, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(1, 2, MV);
      }
      fullVolume = volumeRange[2] - MAV;
      return getAllSets(1, 2, MAV, fullVolume);
    case "1-3":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(1, 2, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(1, 2, MV);
      }
      fullVolume = volumeRange[3] - MAV;
      return getAllSets(1, 3, volumeRange[4], fullVolume);
    case "1-4":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(1, 2, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(1, 2, MV);
      }
      fullVolume = volumeRange[frequency_max - 1] - MAV;
      return getAllSets(1, 4, volumeRange[frequency_max - 1], fullVolume);
    case "1-5":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(1, 2, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(1, 2, MV);
      }
      fullVolume = volumeRange[frequency_max - 1] - MAV;
      return getAllSets(1, 5, volumeRange[frequency_max - 1], fullVolume);
    case "1-6":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(1, 2, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(1, 2, MV);
      }
      fullVolume = volumeRange[frequency_max - 1] - MAV;
      return getAllSets(1, 6, volumeRange[frequency_max - 1], fullVolume);

    // TWO PRIMARY
    case "2-0":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(2, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(2, 0, MV);
      }
      return getAllSets(2, 0, volumeRange[1], 0);
    case "2-1":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(2, 1, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(2, 1, MV);
      }
      fullVolume = volumeRange[2] - MAV * 2;
      return getAllSets(2, 1, volumeRange[2], fullVolume);
    case "2-2":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(2, 1, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(2, 1, MV);
      }
      fullVolume = volumeRange[3] - MAV * 2;
      return getAllSets(2, 2, volumeRange[3] - fullVolume, fullVolume);
    case "2-3":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(2, 1, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(2, 1, MV);
      }
      fullVolume = volumeRange[4] - MAV * 2;
      return getAllSets(2, 3, volumeRange[4], fullVolume);
    case "2-4":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(2, 1, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(2, 1, MV);
      }
      fullVolume = volumeRange[4] - MAV * 2;
      return getAllSets(2, 4, volumeRange[4], fullVolume);
    case "2-5":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(2, 1, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(2, 1, MV);
      }
      fullVolume = volumeRange[4] - MAV * 2;
      return getAllSets(2, 5, volumeRange[4], fullVolume);

    // THREE PRIMARY
    case "3-0":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      // fullVolume = volumeRange[4] - MAV * 2;
      return getAllSets(3, 0, volumeRange[2], 0);
    case "3-1":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      // fullVolume = volumeRange[3] - MAV * 2;
      return getAllSets(3, 1, volumeRange[3], 6);
    case "3-2":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }

      const fullSessions = frequency_max === 4 ? 1 : 2;
      fullVolume = fullSessions * 5;

      return getAllSets(
        3,
        fullSessions,
        volumeRange[frequency_max - 1] - fullVolume,
        fullVolume
      );
    case "3-3":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      fullVolume = volumeRange[frequency_max - 1] - MAV * 3;
      return getAllSets(3, 3, volumeRange[frequency_max - 1], fullVolume);
    case "3-4":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      fullVolume = volumeRange[frequency_max - 1] - MAV * 3;
      return getAllSets(3, 4, volumeRange[frequency_max - 1], fullVolume);

    // FOUR PRIMARY
    case "4-0":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      return getAllSets(4, 0, volumeRange[3], fullVolume);
    case "4-1":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      return getAllSets(4, 1, volumeRange[frequency_max - 1], 5);
    case "4-2":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      return getAllSets(4, 2, volumeRange[frequency_max - 1], 10);
    case "4-3":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      return getAllSets(4, 3, volumeRange[frequency_max - 1], 15);

    // FIVE PRIMARY
    case "5-0":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      return getAllSets(5, 0, volumeRange[frequency_max - 1], 0);
    case "5-1":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      // fullVolume = volumeRange[frequency_max - 1] - MAV * 3;
      return getAllSets(5, 1, volumeRange[frequency_max - 1], 5);
    case "5-2":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      // fullVolume = volumeRange[frequency_max - 1] - MAV * 3;
      return getAllSets(5, 2, volumeRange[frequency_max - 1], 8);

    // SIX PRIMARY
    case "6":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      fullVolume = volumeRange[frequency_max - 1] - MAV * 3;
      return getAllSets(3, 4, volumeRange[frequency_max - 1], fullVolume);
    // SEVEN PRIMARY
    case "7":
      if (rank >= MRV_RANK && rank < MEV_RANK) {
        return distributeMEVorMV(3, 0, MEV);
      } else if (rank >= MEV_RANK) {
        return distributeMEVorMV(3, 0, MV);
      }
      fullVolume = volumeRange[frequency_max - 1] - MAV * 3;
      return getAllSets(3, 4, volumeRange[frequency_max - 1], fullVolume);
    // EIGHT+ -- Not yet determined
    default:
      console.log(
        muscle,
        sessions,
        full,
        "EDGE CASE CAUGHT IN SET DISTRIBUTION"
      );
      return { primarySessions: [], fullSessions: [] };
  }
};

type objType = {
  session: "upper" | "lower" | "full";
  total: number;
  index: number;
};

const findLowestVolumeSession = (
  sessionSplit: "upper" | "lower",
  split: SessionType[],
  sets: [string, number[], number][]
) => {
  const INITIAL_SETS = new Array(split.length).fill(0);

  let sessions = sets.length ? sets[0][1] : INITIAL_SETS;
  let setTotals: objType[] = [];

  for (let i = 0; i < sessions.length; i++) {
    let total = 0;
    for (let j = 0; j < sets.length; j++) {
      total = total + sets[j][1][i];
    }
    console.log(split, "WHY IS THIS FAILING?");
    setTotals.push({ session: split[i].split, total: total, index: i });
  }

  let sessionsIndices = [];
  let fullIndices = [];

  const sortSetTotals = setTotals.sort((a, b) => a.total - b.total);
  // get volume per session type
  for (let k = 0; k < sortSetTotals.length; k++) {
    if (sortSetTotals[k].session === sessionSplit) {
      sessionsIndices.push(sortSetTotals[k].index);
    } else if (sortSetTotals[k].session === "full") {
      fullIndices.push(sortSetTotals[k].index);
    }
  }

  return { sessionIndices: sessionsIndices, fullIndices: fullIndices };
};

const getLowerPosition = (list: MusclePriorityType[]) => {
  let priority = [0, 0];

  for (let i = 0; i < list.length; i++) {
    if (i < MRV_RANK) {
      let muscle = list[i].muscle;

      if (LOWER_MUSCLES.includes(muscle)) {
        if (i === 0 && muscle !== "calves") {
          priority[0] = 1;
          priority[1]++;
        } else if (i === 1 && muscle !== "calves") {
          if (priority[0] > 0) {
            priority[0]++;
          }
          priority[1]++;
        } else {
          priority[1]++;
        }
      }
    } else {
      break;
    }
  }

  // 4 = MAX_MRV
  // 3 = FULL_MRV
  // 2, 2 = FULL_MRV
  // 1, 2 = MRV
  // 0, 2 = LOW_MRV
  // 1, 1 = LOW_MRV
  // 0, 1 = MEV
  // 0 = MV
  switch (priority[1]) {
    case 4:
      return "MAX_MRV";
    case 3:
      return "FULL_MRV";
    case 2:
      if (priority[0] === 2) {
        return "FULL_MRV";
      } else if (priority[0] === 1) {
        return "MRV";
      } else {
        return "LOW_MRV";
      }
    case 1:
      if (priority[0] === 1) {
        return "LOW_MRV";
      } else {
        return "MEV";
      }
    default:
      return "MV";
  }
};

const getTrainingSplit = (
  list: MusclePriorityType[],
  sessions: number
): SessionSplitType[] => {
  const lowerRank = getLowerPosition(list);

  switch (sessions) {
    case 2:
      return ["full", "full"];
    case 3:
      return ["full", "full", "full"];
    case 4:
      return ["upper", "upper", "lower", "lower"];
    case 5:
      switch (lowerRank) {
        case "MAX_MRV":
          return ["lower", "lower", "lower", "lower", "full"];
        case "FULL_MRV":
          return ["upper", "lower", "full", "lower", "full"];
        case "MRV":
          return ["upper", "lower", "upper", "full", "full"];
        case "LOW_MRV":
          return ["upper", "lower", "upper", "full", "full"];
        case "MEV":
          return ["upper", "full", "upper", "full", "upper"];
        default:
          return ["upper", "upper", "full", "upper", "upper"];
      }
    case 6:
      switch (lowerRank) {
        case "MAX_MRV":
          return ["lower", "lower", "lower", "lower", "full", "upper"];
        case "FULL_MRV":
          return ["upper", "lower", "full", "lower", "full", "upper"];
        case "MRV":
          return ["upper", "lower", "upper", "full", "full", "upper"];
        case "LOW_MRV":
          return ["upper", "lower", "upper", "full", "full", "upper"];
        case "MEV":
          return ["upper", "lower", "upper", "full", "upper", "upper"];
        default:
          return ["upper", "lower", "upper", "upper", "upper", "upper"];
      }
    case 7:
      return ["upper", "upper", "upper", "lower", "lower", "lower", "full"];
    default:
      return ["full"];
  }
};

const splitSetsAmongSessions = ({
  split,
  rank,
  _name,
  testSets,
}: SplitAmongSetsType): [string, number[], number] => {
  let getUpperSessions = split.filter((each) => each.split === "upper");
  let getLowerSessions = split.filter((each) => each.split === "lower");
  let getFullSessions = split.filter((each) => each.split === "full");

  let upper = getUpperSessions.length;
  let lower = getLowerSessions.length;
  let full = getFullSessions.length;

  let sessionSplit = "lower";
  let sessionSplitFrequency = lower;
  let setsPerSession: number[] = [];
  let sessionCounter = 0;
  let fullCounter = 0;

  if (UPPER_MUSCLES.includes(_name)) {
    sessionSplit = "upper";
    sessionSplitFrequency = upper;
  }

  const { primarySessions, fullSessions } = distributeMRVAmongSessions(
    _name,
    sessionSplitFrequency,
    full,
    rank
  );

  const { sessionIndices, fullIndices } = findLowestVolumeSession(
    sessionSplit as "upper" | "lower",
    split,
    testSets
  );

  const reduceSessionIndices = (
    sessionIndices: number[],
    totalSessions: number
  ) => {
    if (sessionIndices.length > totalSessions) {
      while (sessionIndices.length > totalSessions) {
        sessionIndices.pop();
      }
    }
    return sessionIndices;
  };

  for (let i = 0; i < split.length; i++) {
    const sesh = reduceSessionIndices(sessionIndices, primarySessions.length);
    const fullz = reduceSessionIndices(fullIndices, fullSessions.length);

    if (split[i].split === sessionSplit) {
      if (primarySessions[sessionCounter]) {
        if (sesh.includes(i)) {
          setsPerSession.push(primarySessions[sessionCounter]);
          sessionCounter++;
        } else {
          setsPerSession.push(0);
        }
      } else {
        setsPerSession.push(0);
      }
    } else if (split[i].split === "full" && fullz.includes(i)) {
      if (fullSessions[fullCounter]) {
        setsPerSession.push(fullSessions[fullCounter]);
        fullCounter++;
      } else {
        setsPerSession.push(0);
      }
    } else {
      setsPerSession.push(0);
    }
  }
  const totalSets = setsPerSession.reduce((total, number) => total + number, 0);
  return [_name, setsPerSession, totalSets];
};

export const featureTest = (list: MusclePriorityType[], sessions: number) => {
  const split = getTrainingSplit(list, sessions);
  let sessionsMRV: SessionType[] = [];

  const SESSION: SessionType = {
    day: 1,
    sets: [],
    totalSets: 0,
    maxSets: 30,
    split: "full",
    testSets: [],
  };

  for (let i = 0; i < sessions; i++) {
    sessionsMRV.push({
      ...SESSION,
      day: i + 1,
      sets: [],
      totalSets: 0,
      maxSets: 30,
      split: split[i],
      testSets: [],
    });
  }

  for (let j = 0; j < list.length; j++) {
    let muscle_name = list[j].muscle;
    const oneLine = splitSetsAmongSessions({
      split: sessionsMRV,
      rank: j,
      _name: muscle_name,
      testSets: sessionsMRV[0].testSets,
    });

    for (let k = 0; k < sessionsMRV.length; k++) {
      sessionsMRV[k].sets.push([muscle_name, oneLine[1][k]]);
    }

    sessionsMRV[0].testSets.push(oneLine);
  }

  return sessionsMRV;
};
