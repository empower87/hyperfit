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

const getSessionSets = (
  primarySessionVolume: number,
  secondarySessionVolume: number,
  totalSessions: number
) => {
  let totalSets = primarySessionVolume - secondarySessionVolume;
  let sets = Math.floor(totalSets / totalSessions);
  let setRemainder = totalSets % totalSessions;

  let primarySessionSets: number[] = [];

  for (let i = 0; i < totalSessions; i++) {
    if (setRemainder > 0) {
      primarySessionSets.push(sets + 1);
      setRemainder--;
    } else {
      primarySessionSets.push(sets);
    }
  }

  return primarySessionSets;
};

const getAllSets = (
  primaryTotal: number,
  fullTotal: number,
  primaryVolume: number,
  fullVolume: number
) => {
  // let primarySets: number[] = []
  // let fullSets: number[] = []

  let primaryIndex = primaryTotal;
  let fullIndex = fullTotal;

  let primarySets = getSessionSets(primaryVolume, fullVolume, primaryIndex);
  let fullSets = getSessionSets(fullVolume, primaryVolume, fullIndex);

  return {
    primarySessions: primarySets,
    fullSessions: fullSets,
  };
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

  let maxVolume = rank < 4 ? MRV : rank < 8 ? MEV : MV;

  let sessionSets: number[] = [];
  let fullSets: number[] = [];

  let loopCount = 0;
  let index = 0;

  let volume = 0;
  let primarySessionVolume = 0;
  let resultIsUpper = false;

  const fullBodyCase = (totalSessions: number) => {
    switch (totalSessions) {
    }
  };

  const sessionsStringified =
    sessions > 5 ? `${sessions}` : `${sessions}-${full}`;

  // let primary: number[] = []
  switch (sessionsStringified) {
    case "0-0":
      break;
    case "0-1":
      break;
    case "0-2":
      break;
    case "0-3":
      break;
    case "0-4":
      break;
    case "0-5":
      break;
    case "0-6":
      break;
    case "0-7":
      break;

    case "1-0":
    case "1-1":
    case "1-2":
    case "1-3":
    case "1-4":
    case "1-5":
    case "1-6":

    case "2-0":
      return getAllSets(2, 0, MRV[1], 0);
    case "2-1":
      let full = MRV[2] - MAV * 2;
      return getAllSets(2, 1, MRV[2], full);
    case "2-2":
      let full2 = MRV[3] - MAV * 2;
      return getAllSets(2, 1, MRV[3], full2);
    case "2-3":

    case "2-4":
    case "2-5":

    case "3-0":
    case "3-1":
    case "3-2":
    case "3-3":
    case "3-4":

    case "4-0":
    case "4-1":
    case "4-2":
    case "4-3":

    case "5-0":
    case "5-1":
    case "5-2":

    case "6":
    case "7":
    default:
  }

  switch (sessions) {
    case 0:
      if (full >= 4) {
        if (frequency_max >= 5) {
          index = 4;
          loopCount = 4;
        } else {
          index = 3;
          loopCount = 3;
        }
      } else if (full === 3) {
        index = 3;
        loopCount = 3;
      } else if (full === 2) {
        index = 2;
        loopCount = 2;
      } else if (full === 1) {
        index = 1;
        loopCount = 1;
      }

      volume = MRV[index];

      break;
    case 1:
      if (full >= 4) {
        if (frequency_max >= 5) {
          index = 4;
          loopCount = 4;
        } else {
          index = 3;
          loopCount = 3;
        }
      } else if (full === 3) {
        index = 3;
        loopCount = 3;
      } else if (full === 2) {
        index = 2;
        loopCount = 2;
      } else if (full === 1) {
        index = 1;
        loopCount = 1;
      }

      volume = MRV[index];
      primarySessionVolume = MAV;
      sessionSets.push(primarySessionVolume);

      break;
    case 2:
      if (full >= 3) {
        if (frequency_max >= 5) {
          index = 4;
          loopCount = 3;
        } else {
          index = 3;
          loopCount = 2;
        }
      } else if (full === 2) {
        index = 3;
        loopCount = 2;
      } else if (full === 1) {
        index = 2;
        loopCount = 1;
      } else {
        // index should = 0, thus no mapping over fullSets
      }
      volume = MRV[index];
      primarySessionVolume = MAV * 2;
      sessionSets = [MAV, MAV];

      break;
    case 3:
      let fullTotal = 0;

      if (full >= 2) {
        if (frequency_max >= 5) {
          index = 4;
          loopCount = 3;
          fullTotal = 10;
        } else {
          index = 3;
          loopCount = 3;
          fullTotal = 6;
        }
      } else if (full === 1) {
        index = 3;
        loopCount = 3;
        fullTotal = 6;
      } else {
      }

      volume = MRV[index];
      primarySessionVolume = fullTotal;
      fullSets = fullTotal === 10 ? [5, 5] : fullTotal === 6 ? [6] : [];
      resultIsUpper = true;

      break;
    case 4:
      let fullTotal2 = 0;

      if (full >= 1) {
        if (frequency_max >= 5) {
          fullTotal2 = 5;
          loopCount = 5;
        } else {
          loopCount = 4;
        }
      } else {
        loopCount = 4;
      }

      volume = MRV[4];
      fullSets = fullTotal2 > 0 ? [5] : [];
      resultIsUpper = true;

      break;
    case 5:
      volume = MRV[4];
      resultIsUpper = true;
      loopCount = 5;
      break;
    default:
    // return { primarySessions: [], fullSessions: [] };
    // would mean there are more than 5.
  }

  let result = getSessionSets(volume, primarySessionVolume, loopCount);

  return {
    primarySessions: resultIsUpper ? result : sessionSets,
    fullSessions: !resultIsUpper ? result : fullSets,
  };
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
