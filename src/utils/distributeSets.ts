import workouts from "src/constants/workouts.json";
import { distributeUpperMRVSets } from "~/components/MesoTable";
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
  MEV: number,
  MV: number,
  split: SplitType[]
): [string, number[], number] => {
  const muscle = name;
  const volume = rank > 7 ? MV : MEV;

  if (LOWER_MUSCLES.includes(muscle)) {
    const result = splitSets(split, "lower", volume);
    return [muscle, result, volume];
  } else {
    const result = splitSets(split, "upper", volume);
    return [muscle, result, volume];
  }
};

const splitSets = (
  split: SplitType[],
  muscleGroup: "upper" | "lower",
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
      if (split[i] === muscleGroup) {
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
  let muscleObj = workouts.find((each) => _name === each.name);
  if (!muscleObj) return [_name, [0, 0, 0, 0, 0], 0];

  const { name: muscle, MEV, MRV, MV, frequency_max: maxFreq } = muscleObj;

  let UPPER_SESSION_MAX = 9;
  let LOWER_SESSION_MAX = 9;
  let FULL_SESSION_MAX =
    getUpperSessions.length + getFullSessions.length > 3
      ? 5
      : getUpperSessions.length + getFullSessions.length < 3
      ? 7
      : 6;

  let volume = MRV;

  if (rank > 3) {
    const result = distributeMEVAmongSessions(rank, muscle, MEV, MV, split);
    return result;
  }

  let totalSessions = 0;
  let totalVolume = 0;
  let skipFullSessions = false;
  let fullSessionVolume = FULL_SESSION_MAX * getFullSessions.length;
  let sessionVolume = 0;
  let sessionRemainder = 0;
  let volumePerSession = 0;
  let muscleGroup = "lower";
  let SESSION_MAX = LOWER_SESSION_MAX;

  let upper = getUpperSessions.length;
  let lower = getLowerSessions.length;
  let full = getFullSessions.length;

  if (UPPER_MUSCLES.includes(muscle)) {
    const { primarySessions, fullSessions } = distributeUpperMRVSets(
      muscle,
      upper,
      full
    );
    // return [muscle, setsPerSession, totalSets];

    let setsPerSession: number[] = [];
    let upperCounter = 0;
    let fullCounter = 0;

    for (let i = 0; i < split.length; i++) {
      if (split[i] === "upper") {
        if (primarySessions[upperCounter]) {
          setsPerSession.push(primarySessions[upperCounter]);
          upperCounter++;
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
    const totalSets = setsPerSession.reduce(
      (total, number) => total + number,
      0
    );
    return [muscle, setsPerSession, totalSets];

    // muscleGroup = "upper";
    // SESSION_MAX = UPPER_SESSION_MAX;

    // totalSessions = getUpperSessions.length + getFullSessions.length;

    // if (totalSessions > maxFreq) {
    //   totalSessions = maxFreq;
    // }

    // if (totalSessions <= getUpperSessions.length) {
    //   skipFullSessions = true;
    //   fullSessionVolume = 0;
    // }

    // totalVolume = volume[totalSessions - 1];
    // sessionVolume = totalVolume - fullSessionVolume;

    // sessionRemainder = sessionVolume % getUpperSessions.length;
    // volumePerSession = Math.floor(sessionVolume / getUpperSessions.length);

    // if (volumePerSession > UPPER_SESSION_MAX) {
    //   volumePerSession = UPPER_SESSION_MAX;
    // }
  } else {
    const { primarySessions, fullSessions } = distributeUpperMRVSets(
      muscle,
      lower,
      full
    );
    // return [muscle, setsPerSession, totalSets];

    let setsPerSession: number[] = [];
    let upperCounter = 0;
    let fullCounter = 0;

    for (let i = 0; i < split.length; i++) {
      if (split[i] === "lower") {
        if (primarySessions[upperCounter]) {
          setsPerSession.push(primarySessions[upperCounter]);
          upperCounter++;
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
    const totalSets = setsPerSession.reduce(
      (total, number) => total + number,
      0
    );
    return [muscle, setsPerSession, totalSets];
    // let totalSessions = getLowerSessions.length + getFullSessions.length;

    // if (totalSessions > maxFreq) {
    //   totalSessions = maxFreq;
    // }

    // if (totalSessions <= getLowerSessions.length) {
    //   skipFullSessions = true;
    //   fullSessionVolume = 0;
    // }
    // totalVolume = volume[totalSessions - 1];
    // sessionVolume = totalVolume - fullSessionVolume;

    // sessionRemainder = sessionVolume % getLowerSessions.length;
    // volumePerSession = Math.floor(sessionVolume / getLowerSessions.length);

    // if (volumePerSession > LOWER_SESSION_MAX) {
    //   volumePerSession = LOWER_SESSION_MAX;
    // }
  }

  // console.log(
  //   sessionVolume,
  //   volumePerSession,
  //   totalSessions,
  //   "OK TEST TEST TEST TESTIOS"
  // );
  // let setsPerSession: number[] = [];
  // for (let u = 0; u < split.length; u++) {
  //   let session = split[u];

  //   if (totalSessions <= 0) break;

  //   if (session === muscleGroup) {
  //     if (sessionRemainder > 0 && volumePerSession + 1 <= SESSION_MAX) {
  //       let value = volumePerSession + 1;
  //       setsPerSession.push(value);
  //       sessionRemainder--;
  //     } else {
  //       setsPerSession.push(volumePerSession);
  //     }
  //     totalSessions--;
  //   } else if (session === "full" && !skipFullSessions) {
  //     setsPerSession.push(FULL_SESSION_MAX);
  //     totalSessions--;
  //   } else {
  //     setsPerSession.push(0);
  //   }
  // }
  // const totalSets = setsPerSession.reduce((total, number) => total + number, 0);
  // return [muscle, setsPerSession, totalSets];
};
// export const splitSetsAmongSessions = ({
//   split,
//   rank,
//   _name,
// }: SplitAmongSetsType): [string, number[], number] => {
//   let getUpperSessions = split.filter((each) => each === "upper");
//   let getLowerSessions = split.filter((each) => each === "lower");
//   let getFullSessions = split.filter((each) => each === "full");
//   let muscleObj = workouts.find((each) => _name === each.name);
//   if (!muscleObj) return [_name, [0, 0, 0, 0, 0], 0];

//   const { name: muscle, MEV, MRV, MV, frequency_max: maxFreq } = muscleObj;

//   let UPPER_SESSION_MAX = 9;
//   let LOWER_SESSION_MAX = 9;
//   let FULL_SESSION_MAX =
//     getUpperSessions.length + getFullSessions.length > 3
//       ? 5
//       : getUpperSessions.length + getFullSessions.length < 3
//       ? 7
//       : 6;

//   let volume = MRV;

//   if (rank > 3) {
//     const result = distributeMEVAmongSessions(rank, muscle, MEV, MV, split);
//     return result;
//   }

//   let totalSessions = 0;
//   let totalVolume = 0;
//   let skipFullSessions = false;
//   let fullSessionVolume = FULL_SESSION_MAX * getFullSessions.length;
//   let sessionVolume = 0;
//   let sessionRemainder = 0;
//   let volumePerSession = 0;
//   let muscleGroup = "lower";
//   let SESSION_MAX = LOWER_SESSION_MAX;

//   if (UPPER_MUSCLES.includes(muscle)) {

//     muscleGroup = "upper";
//     SESSION_MAX = UPPER_SESSION_MAX;

//     totalSessions = getUpperSessions.length + getFullSessions.length;

//     if (totalSessions > maxFreq) {
//       totalSessions = maxFreq;
//     }

//     if (totalSessions <= getUpperSessions.length) {
//       skipFullSessions = true;
//       fullSessionVolume = 0;
//     }

//     totalVolume = volume[totalSessions - 1];
//     sessionVolume = totalVolume - fullSessionVolume;

//     sessionRemainder = sessionVolume % getUpperSessions.length;
//     volumePerSession = Math.floor(sessionVolume / getUpperSessions.length);

//     if (volumePerSession > UPPER_SESSION_MAX) {
//       volumePerSession = UPPER_SESSION_MAX;
//     }
//   } else {
//     let totalSessions = getLowerSessions.length + getFullSessions.length;

//     if (totalSessions > maxFreq) {
//       totalSessions = maxFreq;
//     }

//     if (totalSessions <= getLowerSessions.length) {
//       skipFullSessions = true;
//       fullSessionVolume = 0;
//     }
//     totalVolume = volume[totalSessions - 1];
//     sessionVolume = totalVolume - fullSessionVolume;

//     sessionRemainder = sessionVolume % getLowerSessions.length;
//     volumePerSession = Math.floor(sessionVolume / getLowerSessions.length);

//     if (volumePerSession > LOWER_SESSION_MAX) {
//       volumePerSession = LOWER_SESSION_MAX;
//     }
//   }

//   console.log(
//     sessionVolume,
//     volumePerSession,
//     totalSessions,
//     "OK TEST TEST TEST TESTIOS"
//   );
//   let setsPerSession: number[] = [];
//   for (let u = 0; u < split.length; u++) {
//     let session = split[u];

//     if (totalSessions <= 0) break;

//     if (session === muscleGroup) {
//       if (sessionRemainder > 0 && volumePerSession + 1 <= SESSION_MAX) {
//         let value = volumePerSession + 1;
//         setsPerSession.push(value);
//         sessionRemainder--;
//       } else {
//         setsPerSession.push(volumePerSession);
//       }
//       totalSessions--;
//     } else if (session === "full" && !skipFullSessions) {
//       setsPerSession.push(FULL_SESSION_MAX);
//       totalSessions--;
//     } else {
//       setsPerSession.push(0);
//     }
//   }
//   const totalSets = setsPerSession.reduce((total, number) => total + number, 0);
//   return [muscle, setsPerSession, totalSets];
// };
// export const splitSetsAmongSessions = ({
//   split,
//   rank,
//   _name,
// }: SplitAmongSetsType): [string, number[], number] => {
//   let getUpperSessions = split.filter((each) => each === "upper");
//   let getLowerSessions = split.filter((each) => each === "lower");
//   let getFullSessions = split.filter((each) => each === "full");
//   let muscleObj = workouts.find((each) => _name === each.name);
//   if (!muscleObj) return [_name, [0, 0, 0, 0, 0], 0];

//   const { name: muscle, MEV, MRV, MV, frequency_max: maxFreq } = muscleObj;

//   let UPPER_SESSION_MAX = 9;
//   let LOWER_SESSION_MAX = 9;
//   let FULL_SESSION_MAX =
//     getUpperSessions.length + getFullSessions.length > 3
//       ? 5
//       : getUpperSessions.length + getFullSessions.length < 3
//       ? 7
//       : 6;

//   let volume = MRV;

//   if (rank > 3) {
//     const result = distributeMEVAmongSessions(rank, muscle, MEV, MV, split);
//     return result;
//   }

//   let totalSessions = 0
//   let totalVolume = volume[totalSessions - 1]
//   let skipFullSessions = false;
//   let fullSessionVolume = FULL_SESSION_MAX * getFullSessions.length;
//   let sessionVolume = 0

//   if (UPPER_MUSCLES.includes(muscle)) {
//     totalSessions = getUpperSessions.length + getFullSessions.length;

//     if (totalSessions > maxFreq) {
//       totalSessions = maxFreq;
//     }

//     // let totalVolume = volume[totalSessions - 1];
//     // let skipFullSessions = false;
//     // let fullSessionVolume = FULL_SESSION_MAX * getFullSessions.length;

//     if (totalSessions <= getUpperSessions.length) {
//       skipFullSessions = true;
//       fullSessionVolume = 0;
//     }

//     let upperSessionVolume = totalVolume - fullSessionVolume;

//     let upperRemainder = upperSessionVolume % getUpperSessions.length;
//     let upperVolumePerSession = Math.floor(
//       upperSessionVolume / getUpperSessions.length
//     );

//     if (upperVolumePerSession > UPPER_SESSION_MAX) {
//       upperVolumePerSession = UPPER_SESSION_MAX;
//     }

//     let setsPerSession: number[] = [];
//     for (let u = 0; u < split.length; u++) {
//       let session = split[u];

//       if (totalSessions <= 0) break;

//       if (session === "upper") {
//         if (
//           upperRemainder > 0 &&
//           upperVolumePerSession + 1 <= UPPER_SESSION_MAX
//         ) {
//           let value = upperVolumePerSession + 1;
//           setsPerSession.push(value);
//           upperRemainder--;
//         } else {
//           setsPerSession.push(upperVolumePerSession);
//         }
//         totalSessions--;
//       } else if (session === "full" && !skipFullSessions) {
//         setsPerSession.push(FULL_SESSION_MAX);
//         totalSessions--;
//       } else {
//         setsPerSession.push(0);
//       }
//     }
//     const totalSets = setsPerSession.reduce(
//       (total, number) => total + number,
//       0
//     );
//     return [muscle, setsPerSession, totalSets];
//   } else {
//     let totalSessions = getLowerSessions.length + getFullSessions.length;

//     if (totalSessions > maxFreq) {
//       totalSessions = maxFreq;
//     }

//     let totalVolume = volume[totalSessions - 1];
//     let fullSessionVolume = FULL_SESSION_MAX * getFullSessions.length;
//     let lowerSessionVolume = totalVolume - fullSessionVolume;

//     let lowerRemainder = lowerSessionVolume % getLowerSessions.length;
//     let lowerVolumePerSession = Math.floor(
//       lowerSessionVolume / getLowerSessions.length
//     );

//     if (lowerVolumePerSession > LOWER_SESSION_MAX) {
//       lowerVolumePerSession = LOWER_SESSION_MAX;
//     }

//     let setsPerSession: number[] = [];
//     for (let u = 0; u < split.length; u++) {
//       let session = split[u];

//       if (session === "lower") {
//         if (
//           lowerRemainder > 0 &&
//           lowerVolumePerSession + 1 <= LOWER_SESSION_MAX
//         ) {
//           let value = lowerVolumePerSession + 1;
//           setsPerSession.push(value);
//           lowerRemainder--;
//         } else {
//           setsPerSession.push(lowerVolumePerSession);
//         }
//       } else if (session === "full") {
//         setsPerSession.push(FULL_SESSION_MAX);
//       } else {
//         setsPerSession.push(0);
//       }
//     }
//     const totalSets = setsPerSession.reduce(
//       (total, number) => total + number,
//       0
//     );
//     return [muscle, setsPerSession, totalSets];
//   }
// };
