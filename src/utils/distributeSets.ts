import workouts from "src/constants/workouts.json";
import { distributeMRVAmongSessions } from "~/components/MesoTable";
import { LOWER_MUSCLES, UPPER_MUSCLES } from "~/constants/workoutSplits";

type SplitType = "upper" | "lower" | "full";

// MUSCLE      MEV   MV
// back        10    6
// quads       8     6
// delts_side  8     6
// calves      8     6

// biceps      6     4
// abs         6     0
// triceps     6     4
// chest       6     4
// delts_rear  6     0

// traps       4     0
// hamstrings  4     3
// forearms    2     0

// glutes      0     0
// delts_front 0     0

export const distributeMEVAmongSessions = (
  rank: number,
  name: string,
  split: SplitType[]
): [string, number[], number] => {
  const muscleObj = workouts.find((each) => each.name === name);
  if (!muscleObj) return [name, [], 0];
  const { MV, MEV } = muscleObj;

  const volume = rank > 7 ? MV : MEV;

  if (LOWER_MUSCLES.includes(name)) {
    const result = splitSets(split, "lower", volume);
    return [name, result, volume];
  } else {
    const result = splitSets(split, "upper", volume);
    return [name, result, volume];
  }
};

const splitSets = (
  split: SplitType[],
  sessionSplit: "upper" | "lower",
  volume: number
) => {
  let setsPerSession: number[] = [];

  let sessions = 1;
  let count = 1;
  let sets = volume;

  if (sets > 7) {
    count = 3;
    sets = 3;
    sessions = 3;
  } else if (sets > 5) {
    count = 2;
    sets = 3;
    sessions = 2;
  }

  for (let i = 0; i < split.length; i++) {
    if (volume === 0) {
      setsPerSession.push(0);
    } else {
      if (split[i] === sessionSplit) {
        if (count === 0) {
          setsPerSession.push(0);
        } else {
          setsPerSession.push(sets);
          count--;
        }
      } else if (split[i] === "full" && volume < sessions) {
        if (count === 0) {
          setsPerSession.push(0);
        } else {
          setsPerSession.push(sets);
          count--;
        }
      } else {
        setsPerSession.push(0);
      }
    }
  }

  return setsPerSession;
};

type SplitAmongSetsType = {
  split: SplitType[];
  rank: number;
  _name: string;
};

export const splitSetsAmongSessions = ({
  split,
  rank,
  _name,
}: SplitAmongSetsType): [string, number[], number] => {
  let getUpperSessions = split.filter((each) => each === "upper");
  let getLowerSessions = split.filter((each) => each === "lower");
  let getFullSessions = split.filter((each) => each === "full");

  if (rank > 3) {
    const result = distributeMEVAmongSessions(rank, _name, split);
    return result;
  }

  let upper = getUpperSessions.length;
  let lower = getLowerSessions.length;
  let full = getFullSessions.length;

  let sessionSplit = "lower";
  let setsPerSession: number[] = [];
  let sessionCounter = 0;
  let fullCounter = 0;

  if (UPPER_MUSCLES.includes(_name)) {
    sessionSplit = "upper";
  }

  const { primarySessions, fullSessions } = distributeMRVAmongSessions(
    _name,
    sessionSplit === "upper" ? upper : lower,
    full
  );

  for (let i = 0; i < split.length; i++) {
    if (split[i] === sessionSplit) {
      if (primarySessions[sessionCounter]) {
        setsPerSession.push(primarySessions[sessionCounter]);
        sessionCounter++;
      } else {
        setsPerSession.push(0);
      }
    } else if (split[i] === "full") {
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
