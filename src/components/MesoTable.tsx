import { useEffect, useState } from "react";
import workouts from "src/constants/workouts.json";
import { splitSetsAmongSessions } from "src/utils/distributeSets";
import { LOWER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType } from "~/pages";

const SESSION: SessionType = {
  day: 1,
  sets: [],
  totalSets: 0,
  maxSets: 30,
  split: "full",
  testSets: [],
};

// 4 = MAX_MRV
// 3 = FULL_MRV
// 2, 2 = FULL_MRV
// 1, 2 = MRV
// 0, 2 = LOW_MRV
// 1, 1 = LOW_MRV
// 0, 1 = MEV
// 0 = MV

const getLowerPosition = (list: MusclePriorityType[]) => {
  let priority = [0, 0];

  for (let i = 0; i < list.length; i++) {
    if (i < 4) {
      let muscle = list[i].muscle;

      if (LOWER_MUSCLES.includes(list[i].muscle)) {
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

  console.log(priority, "what diss look like?? hehehehe this is funky");
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

type SplitType = "upper" | "lower" | "full";

const getTrainingSplit = (
  list: MusclePriorityType[],
  sessions: number
): SplitType[] => {
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

const requireThreeSetsMin = (
  volume: number,
  total1: number,
  total2: number
): [number, number] => {
  let sets = Math.floor(volume / total1 + total2);

  if (sets < 3) {
    if (total2 > 1) {
      total2 = total2 - 1;
      return requireThreeSetsMin(volume, total1, total2); // Recursive call
    } else if (total1 > 1 && total2 === 0) {
      total1 = total1 - 1;
      return requireThreeSetsMin(volume, total1, total2);
    } else {
      return [total1, total2]; // If total can no longer be reduced, return the current values
    }
  }

  return [total1, total2];
};

const getSessionSets = (sessionVolume: number, totalSessions: number) => {
  let totalSets = sessionVolume;
  let sets = Math.floor(totalSets / totalSessions);

  // if (sets < 3) {
  //   let [volume, total] = requireThreeSetsMin(totalSets, totalSessions);
  //   totalSessions = total;
  //   sets = Math.floor(totalSets / totalSessions);
  // }

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

  let sets = Math.floor(
    (primaryVolume + fullVolume) / (primaryTotal + fullTotal)
  );

  if (sets < 3) {
    let [total1, total2] = requireThreeSetsMin(
      primaryVolume + fullVolume,
      primaryTotal,
      fullTotal
    );
    primaryTotal = total1;
    fullTotal = total2;
  }

  let primarySets = getSessionSets(primaryVolume, primaryIndex);
  let fullSets = getSessionSets(fullVolume, fullIndex);

  return {
    primarySessions: primarySets,
    fullSessions: fullSets,
  };
};

const matchFrequencies = (
  val1: number,
  val2: number,
  max: number
): [number, number] => {
  if (max < val1 + val2) {
    if (val2 - 1 >= 0) {
      return matchFrequencies(val1, val2 - 1, max);
    } else if (val1 - 1 >= 0) {
      return matchFrequencies(val1 - 1, 0, max);
    }
  }

  return [val1, val2];
};

export const distributeMRVAmongSessions = (
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

  let MEVList: number[] = [];
  let MVList: number[] = [];

  let sessionLength = sessions + full;
  for (let i = 0; i < sessionLength; i++) {
    MEVList.push(MEV);
    MVList.push(MV);
  }

  let primaryVolume = rank < 4 ? MRV : rank >= 8 ? MVList : MEVList;

  let max_sessions = rank < 4 ? frequency_max : rank >= 8 ? 2 : 3;
  let fullVolume = 0;

  let uppers = 0;
  let fulls = 0;

  switch (sessionsStringified) {
    // ZERO PRIMARY
    case "0-0":
      return { primarySessions: [], fullSessions: [] };
    case "0-1":
      return { primarySessions: [], fullSessions: [MAV] };
    case "0-2":
      let pos = primaryVolume[1];
      let getIt = Math.floor(pos / 2);
      return { primarySessions: [], fullSessions: [getIt, getIt] };
    case "0-3":
      fullVolume = primaryVolume[2];
      return getAllSets(0, 3, 0, fullVolume);
    case "0-4":
      fullVolume = primaryVolume[3];
      return getAllSets(0, 4, 0, fullVolume);
    case "0-5":
      fullVolume = primaryVolume[frequency_max - 1];
      return getAllSets(0, 5, 0, fullVolume);
    case "0-6":
      fullVolume = primaryVolume[frequency_max - 1];
      return getAllSets(0, 6, 0, fullVolume);
    case "0-7":
      fullVolume = primaryVolume[frequency_max - 1];
      return getAllSets(0, 7, 0, fullVolume);

    // ONE PRIMARY
    case "1-0":
      return getAllSets(1, 0, primaryVolume[1], 0);
    case "1-1":
      fullVolume = primaryVolume[1] - MAV;
      let prim = primaryVolume[1] - fullVolume;
      return getAllSets(1, 1, prim, fullVolume);
    case "1-2":
      fullVolume = primaryVolume[2] - MAV;
      return getAllSets(1, 2, MAV, fullVolume);
    case "1-3":
      fullVolume = primaryVolume[3] - MAV;
      return getAllSets(1, 3, primaryVolume[4], fullVolume);
    case "1-4":
      fullVolume = primaryVolume[frequency_max - 1] - MAV;
      return getAllSets(1, 4, primaryVolume[frequency_max - 1], fullVolume);
    case "1-5":
      fullVolume = primaryVolume[frequency_max - 1] - MAV;
      return getAllSets(1, 5, primaryVolume[frequency_max - 1], fullVolume);
    case "1-6":
      fullVolume = primaryVolume[frequency_max - 1] - MAV;
      return getAllSets(1, 6, primaryVolume[frequency_max - 1], fullVolume);

    // TWO PRIMARY
    case "2-0":
      return getAllSets(2, 0, primaryVolume[1], 0);
    case "2-1":
      fullVolume = primaryVolume[2] - MAV * 2;
      return getAllSets(2, 1, primaryVolume[2], fullVolume);
    case "2-2":
      fullVolume = primaryVolume[3] - MAV * 2;
      return getAllSets(2, 2, primaryVolume[3] - fullVolume, fullVolume);
    case "2-3":
      fullVolume = primaryVolume[4] - MAV * 2;
      return getAllSets(2, 3, primaryVolume[4], fullVolume);
    case "2-4":
      fullVolume = primaryVolume[4] - MAV * 2;
      return getAllSets(2, 4, primaryVolume[4], fullVolume);
    case "2-5":
      fullVolume = primaryVolume[4] - MAV * 2;
      return getAllSets(2, 5, primaryVolume[4], fullVolume);

    // THREE PRIMARY
    case "3-0":
      // fullVolume = primaryVolume[4] - MAV * 2;
      return getAllSets(3, 0, primaryVolume[2], 0);
    case "3-1":
      // fullVolume = primaryVolume[3] - MAV * 2;
      return getAllSets(3, 1, primaryVolume[3], 6);
    case "3-2":
      const result = matchFrequencies(3, 2, max_sessions);
      console.log(
        result,
        max_sessions,
        muscle,
        "LETS LOOK AT THIS GPT FUNCTION???!!"
      );

      let totVol = primaryVolume[result[0] + result[1]];
      let total = getSessionSets(totVol, result[0] + result[1]);

      const splitVol = (
        total: number[],
        times: number,
        max: number,
        min: number
      ) => {
        let count = 0;
        let lastIndex = total.length - 1;

        for (let i = 0; i < total.length; i++) {
          if (total[i] < max) {
          }
        }

        return total;
      };

      fullVolume = primaryVolume[result[0]] - MAV * 3;
      let lol = result[1];
      let newVol = lol * 5;
      let primVol = primaryVolume[result[0]] - newVol;

      return getAllSets(result[0], result[1], primVol, newVol);
    case "3-3":
      fullVolume = primaryVolume[frequency_max - 1] - MAV * 3;
      return getAllSets(3, 3, primaryVolume[frequency_max - 1], fullVolume);
    case "3-4":
      fullVolume = primaryVolume[frequency_max - 1] - MAV * 3;
      return getAllSets(3, 4, primaryVolume[frequency_max - 1], fullVolume);

    // FOUR PRIMARY
    case "4-0":
      return getAllSets(4, 0, primaryVolume[3], fullVolume);
    case "4-1":
      return getAllSets(4, 1, primaryVolume[frequency_max - 1], 5);
    case "4-2":
      return getAllSets(4, 2, primaryVolume[frequency_max - 1], 10);
    case "4-3":
      return getAllSets(4, 3, primaryVolume[frequency_max - 1], 15);

    // FIVE PRIMARY
    case "5-0":
      return getAllSets(5, 0, primaryVolume[frequency_max - 1], 0);
    case "5-1":
      // fullVolume = primaryVolume[frequency_max - 1] - MAV * 3;
      return getAllSets(5, 1, primaryVolume[frequency_max - 1], 5);
    case "5-2":
      // fullVolume = primaryVolume[frequency_max - 1] - MAV * 3;
      return getAllSets(5, 2, primaryVolume[frequency_max - 1], 8);

    // SIX PRIMARY
    case "6":
      fullVolume = primaryVolume[frequency_max - 1] - MAV * 3;
      return getAllSets(3, 4, primaryVolume[frequency_max - 1], fullVolume);
    // SEVEN PRIMARY
    case "7":
      fullVolume = primaryVolume[frequency_max - 1] - MAV * 3;
      return getAllSets(3, 4, primaryVolume[frequency_max - 1], fullVolume);
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

export const featureTest = (list: MusclePriorityType[], sessions: number) => {
  const split = getTrainingSplit(list, sessions);
  let sessionsMRV: SessionType[] = [];

  for (let j = 0; j < sessions; j++) {
    sessionsMRV.push({
      ...SESSION,
      day: j + 1,
      sets: [],
      totalSets: 0,
      maxSets: 30,
      split: split[j],
      testSets: [],
    });
  }

  for (let i = 0; i < list.length; i++) {
    let muscle_name = list[i].muscle;
    const oneLine = splitSetsAmongSessions({
      split: split,
      rank: i,
      _name: muscle_name,
    });

    sessionsMRV[0].testSets.push(oneLine);

    // const getUpperSessions = split.filter((each) => each === "upper");
    // const getFullSessions = split.filter((each) => each === "full");

    // const upper = getUpperSessions.length + getFullSessions.length;

    // const lower = sessions - getUpperSessions.length;

    // let muscle = workouts.find((each) => list[i].muscle === each.name);
    // if (!muscle) return;

    // if (UPPER_MUSCLES.includes(muscle.name)) {
    //   let getSets = Math.floor(muscle.MRV[upper - 1] / upper);

    //   for (let i = 0; i < sessionsMRV.length; i++) {
    //     const totalSets = sessionsMRV[i].maxSets;

    //     if (
    //       sessionsMRV[i].split === "full" ||
    //       sessionsMRV[i].split === "upper"
    //     ) {
    //       if (totalSets - getSets < 0) {
    //         getSets--;
    //       } else {
    //         sessionsMRV[i].sets.push([muscle.name, getSets]);
    //         sessionsMRV[i].maxSets = sessionsMRV[i].maxSets - getSets;
    //       }
    //     }
    //   }
    // } else {
    //   let getSets = Math.floor(muscle.MRV[lower - 1] / lower);

    //   for (let i = 0; i < sessionsMRV.length; i++) {
    //     const totalSets = sessionsMRV[i].maxSets;

    //     if (
    //       sessionsMRV[i].split === "full" ||
    //       sessionsMRV[i].split === "lower"
    //     ) {
    //       if (totalSets - getSets < 0) {
    //         getSets--;
    //       } else {
    //         sessionsMRV[i].sets.push([muscle.name, getSets]);
    //         sessionsMRV[i].maxSets = sessionsMRV[i].maxSets - getSets;
    //       }
    //     }
    //   }
    // }
  }

  console.log(sessionsMRV, split, "1. sessionsMRV, 2. split array");
  return sessionsMRV;
};

export const TestTable = ({
  list,
  split,
}: {
  list: MusclePriorityType[];
  split: SessionType[];
}) => {
  const [rows, setRows] = useState<(string | number)[][]>([]);
  const [testRows, setTestRows] = useState<[string, number[], number][]>([]);

  useEffect(() => {
    if (split[0]) {
      setTestRows(split[0].testSets);
    }
  }, [split]);

  // useEffect(() => {
  //   let newList = [];

  //   for (let i = 0; i < list.length; i++) {
  //     let pushList: (string | number)[] = [list[i].muscle];

  //     for (let j = 0; j < split.length; j++) {
  //       let sets = split[j].sets;
  //       let setsFound = false;

  //       for (let k = 0; k < sets.length; k++) {
  //         if (sets[k].includes(list[i].muscle)) {
  //           pushList.push(sets[k][1]);
  //           setsFound = true;
  //         }
  //       }

  //       if (!setsFound) {
  //         pushList.push(0);
  //       }
  //     }

  //     newList.push(pushList);
  //   }

  //   setRows(newList);
  // }, [list, split]);

  return (
    <div className="flex justify-center">
      <table className="w-300">
        <thead>
          <tr className="bg-slate-500">
            <th className="bg-slate-300 px-1 text-sm text-white">Muscle</th>
            {split.map((each) => {
              let color =
                each.split === "upper"
                  ? "bg-blue-500"
                  : each.split === "lower"
                  ? "bg-red-500"
                  : "bg-purple-500";
              return (
                <th className={color + " px-2 text-sm text-white"}>
                  {each.split}
                </th>
              );
            })}
            <th className="bg-slate-300 px-1 text-sm text-white">Total</th>
          </tr>
        </thead>
        <tbody>
          {testRows.map((each) => {
            return (
              <tr className="text-xs">
                <td className="bg-slate-300">{each[0]}</td>
                {each[1].map((e, i) => {
                  let bgColor =
                    e === 0
                      ? "bg-slate-400"
                      : split[i - 1]?.split === "upper"
                      ? "bg-blue-200"
                      : split[i - 1]?.split === "lower"
                      ? "bg-red-200"
                      : "bg-purple-200";

                  return (
                    <td className={bgColor + " border border-slate-500 pl-2"}>
                      {e}
                    </td>
                  );
                })}
                <td className="bg-slate-400 px-1 text-xs">{each[2]}</td>
              </tr>
            );
          })}
          {/* {rows.map((each) => {
            return (
              <tr className="text-xs">
                {each.map((e, i) => {
                  let bgColor =
                    i == 0
                      ? "bg-slate-300"
                      : e === 0
                      ? "bg-slate-400"
                      : split[i - 1]?.split === "upper"
                      ? "bg-blue-200"
                      : split[i - 1]?.split === "lower"
                      ? "bg-red-200"
                      : "bg-purple-200";
                  return (
                    <td className={bgColor + " border border-slate-500 pl-2"}>
                      {e}
                    </td>
                  );
                })}
              </tr>
            );
          })} */}
          <tr>
            <td className="pl-2">Total</td>
            {split.map((each) => {
              let total = each.sets.reduce(
                (total, [, number]) => total + number,
                0
              );
              return <td className="pl-2 text-xs">{total}</td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

//          |    1    |    2    |    3    |    4    |    5    |    6
//   Sun    |   Mon   |   Tue   |   Wed   |   Thu   |   Fri   |   Sat
//  ==================================================================
//          |    8    |         |    8    |         |    8    |         back        MRV
//          |    2    |         |    2    |         |    2    |         chest       MEV
//          |         |    8    |         |    7    |         |    7    quads       MRV
//          |         |    5    |         |    6    |         |    6    hamstrings  MRV
//          |    5    |    4    |    5    |    4    |    5    |    4    side_delts  MRV
//          |    7    |         |    7    |         |    6    |         triceps     MRV
//          |    2    |         |    2    |         |    2    |         biceps      MEV
//          |         |    5    |         |    5    |         |    5    calves      MEV

//          |    0    |    0    |    0    |    0    |    0    |    0    rear_delts  MV
//          |    0    |    0    |    0    |    0    |    0    |    0    traps       MV
//          |    0    |    0    |    0    |    0    |    0    |    0    forearms    MV
//          |    0    |    0    |    0    |    0    |    0    |    0    side_delts  MV
//          |    0    |    0    |    0    |    0    |    0    |    0    frnt_delts  MV
//          |    0    |    0    |    0    |    0    |    0    |    0    abs         MV
//          |    24   |    22   |    24   |    22   |    24   |    22

//  meso 1  |  wk 1  |  wk 2  |  wk 3  |  wk 4  |  deload
//  =======================================================
//  back    |   10   |   12   |   14   |   16   |
//  chest   |    4   |    5   |   6    |   6    |
//  triceps |    8   |   10   |   12   |   14   |
//  biceps  |    4   |    5   |   6    |   6    |
//  delts   |    8   |   10   |   12   |   14   |
//  quads   |    8   |   10   |   12   |   14   |
//  hams    |        |        |        |        |
//  calves  |        |        |        |        |

//  meso 2  |  wk 1  |  wk 2  |  wk 3  |  wk 4  |  deload
//  =======================================================
//  back    |   14   |   17   |   20   |   23   |
//  chest   |   5    |   5    |    6   |    6   |
//  triceps |   12   |   14   |   15   |   16   |
//  biceps  |   5    |   5    |    6   |    6   |
//  delts   |   14   |   17   |   20   |   23   |
//  quads   |   14   |   16   |   16   |   18   |
//  hams    |        |        |        |        |
//  calves  |        |        |        |        |

//  meso 3  |  wk 1  |  wk 2  |  wk 3  |  wk 4  |  deload
//  =======================================================
//  back    |   22   |   23   |   24   |   25   |
//  chest   |    6   |    6   |    6   |    6   |
//  triceps |   16   |   18   |   18   |   20   |
//  biceps  |    6   |    6   |    6   |    6   |
//  delts   |   20   |   23   |   25   |   27   |
//  quads   |   18   |   20   |   20   |   22   |
//  hams    |        |        |        |        |
//  calves  |        |        |        |        |
