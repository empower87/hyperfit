import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MEV_RANK, MRV_RANK } from "src/constants/prioritizeRanks";
import { LOWER_MUSCLES, UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType } from "~/pages";
import { getMuscleData } from "./getMuscleData";
export type SessionSplitType = "upper" | "lower" | "full";

type SplitAmongSetsType = {
  split: SessionType[];
  rank: number;
  _name: string;
  // testSets: [string, number[], number][];
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
  const muscleData = getMuscleData(muscle);
  const { MRV, MAV, MEV, MV, frequency_max } = muscleData;

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
  split: SessionType[]
) => {
  let setTotals: objType[] = [];

  for (let h = 0; h < split.length; h++) {
    if (split[h].sets.length) {
      let value = split[h].sets.reduce(
        (acc: [string, number], current: [string, number]) => {
          acc = [current[0], acc[1] + current[1]];
          return acc;
        }
      );
      setTotals.push({ session: split[h].split, total: value[1], index: h });
    } else {
      setTotals.push({ session: split[h].split, total: 0, index: h });
    }
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
          return ["lower", "upper", "lower", "full", "lower"];
        case "FULL_MRV":
          // const meso1 = ["lower", "upper", "lower", "full"];
          // const meso2 = ["lower", "upper", "lower", "full"];
          // const meso3 = ["lower", "upper", "lower", "full", "full"];

          // return ["upper", "lower", "full", "lower", "full"];
          return ["lower", "upper", "lower", "full", "full"];
        case "MRV":
          // const meso1 = ["upper", "lower", "upper", "lower", "full"];
          // const meso2 = ["upper", "lower", "upper", "lower", "full"];
          // const meso3 = ["upper", "lower", "upper", "lower", "full"];

          // return ["upper", "lower", "upper", "full", "full"];
          return ["lower", "upper", "lower", "upper", "full"];
        case "LOW_MRV":
          return ["upper", "lower", "upper", "full", "full"];
        case "MEV":
          // const meso1 = ["upper", "lower", "upper", "full"];
          // const meso2 = ["upper", "lower", "upper", "full"];
          // const meso3 = ["upper", "lower", "upper", "full", "upper"];

          return ["upper", "lower", "upper", "full", "upper"];
        default:
          // return ["upper", "upper", "full", "upper", "upper"];
          return ["upper", "lower", "upper", "full", "upper"];
      }
    case 6:
      switch (lowerRank) {
        case "MAX_MRV":
          const meso1 = ["lower", "lower", "lower", "lower", "full", "upper"];
          const meso2 = ["lower", "lower", "lower", "lower", "full", "upper"];
          const meso3 = ["lower", "lower", "lower", "lower", "full", "upper"];

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

const getMesoProgression = (sessions: number) => {
  switch (sessions) {
    case 5:
      return [3, 4, 5];
    case 4:
      return [2, 3, 4];
    case 3:
      return [2, 3, 3];
    case 2:
      return [1, 2, 2];
    case 1:
      return [1, 1, 1];
    default:
      return [0, 0, 0];
  }
};

const updateMuscleListSets = (
  items: MusclePriorityType[],
  split: SessionSplitType[]
) => {
  let upper = split.filter((each) => each !== "lower");
  let lower = split.filter((each) => each !== "upper");

  for (let i = 0; i < items.length; i++) {
    const muscleData = getMuscleData(items[i].muscle);
    const { featureMatrix } = muscleData;

    let rank = i < MRV_RANK ? 0 : i >= MRV_RANK && i < MEV_RANK ? 1 : 2;

    let sessions = lower.length;
    if (UPPER_MUSCLES.includes(items[i].muscle)) {
      sessions = upper.length;
    }

    if (rank === 0) {
      let prog = getMesoProgression(sessions);
      items[i] = { ...items[i], mesoProgression: prog };
    } else if (rank === 1) {
      if (sessions <= 2) items[i] = { ...items[i], mesoProgression: [1, 2, 2] };
      else if (
        items[i].muscle === "back" ||
        items[i].muscle === "quads" ||
        items[i].muscle === "calves"
      ) {
        items[i] = { ...items[i], mesoProgression: [2, 3, 3] };
      } else {
        items[i] = { ...items[i], mesoProgression: [1, 1, 1] };
      }
    } else {
      if (sessions <= 1) items[i] = { ...items[i], mesoProgression: [1, 1, 1] };
      else if (
        items[i].muscle === "back" ||
        items[i].muscle === "quads" ||
        items[i].muscle === "calves"
      ) {
        items[i] = { ...items[i], mesoProgression: [1, 2, 2] };
      } else {
        items[i] = { ...items[i], mesoProgression: [1, 1, 1] };
      }
    }

    const sets = featureMatrix[rank];

    items[i] = { ...items[i], sets: sets };
  }
  return items;
};

const SESSION: SessionType = {
  day: 1,
  sets: [],
  totalSets: 0,
  maxSets: 30,
  split: "full",
  testSets: [],
};

const updateWorkoutSplit = (split: ("upper" | "lower" | "full")[]) => {
  let newSplit: SessionType[] = [];

  for (let i = 0; i < split.length; i++) {
    newSplit.push({ ...SESSION, day: i + 1, split: split[i] });
  }

  return newSplit;
};

export function usePrioritizeMuscles(
  musclePriorityList: MusclePriorityType[],
  max_workouts: number,
  setWorkoutSplit: Dispatch<SetStateAction<SessionType[]>>
) {
  const [newList, setNewList] = useState<MusclePriorityType[]>([
    ...musclePriorityList,
  ]);

  useEffect(() => {
    const split = getTrainingSplit(newList, max_workouts);
    const getNewList = updateMuscleListSets(musclePriorityList, split);
    console.log(split, getNewList, "USE EFFECT IN PRIORITIZE FOCUS");
    setNewList(getNewList);

    const updatedWorkoutSplit = updateWorkoutSplit(split);
    setWorkoutSplit(updatedWorkoutSplit);
  }, [max_workouts, musclePriorityList, newList]);

  return { newList };
}
