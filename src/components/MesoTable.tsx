import { useEffect, useState } from "react";
import {
  LOWER_MUSCLES,
  MusclesType,
  UPPER_MUSCLES,
} from "~/constants/workoutSplits";
import { MusclePriorityType } from "~/pages";
import workouts from "./workouts.json";

export default function MesoTable() {
  return (
    <div className="">
      <table className="bg-slate-100 shadow">
        <thead className="rounded-md border-2 border-r-2 border-slate-700 bg-slate-400">
          <tr className="text-xs text-white ">
            <th className="p-1 text-start">Split</th>
            <th className="p-1 text-start">Week 1</th>
            <th className="p-1 text-start">Week 2</th>
            <th className="p-1 text-start">Week 3</th>
            <th className="p-1 text-start">Week 4</th>
            <th className="p-1 text-start">Deload</th>
          </tr>
        </thead>
        <tbody className="">{}</tbody>
      </table>
    </div>
  );
}

// SYSTEMIC_FATIGUE
// QUADS  1
// BACK   2
// CHEST  2
// HAMS   2
// GLUTES 3
// TRIS   4
// EVERY  5

type SessionType = {
  day: number;
  sets: [string, number][];
  totalSets: number;
  maxSets: number;
  split: "full" | "upper" | "lower";
};

const SESSION: SessionType = {
  day: 1,
  sets: [],
  totalSets: 0,
  maxSets: 30,
  split: "full",
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

type SplitAmongSetsType = {
  split: SplitType[];
  rank: number;
  muscle: MusclesType;
  MRV: number[];
  MEV: number;
  MV: number;
  maxFreq: number;
};

4;
// upper upper upper full
//  9 8 8 5
// upper upper full full
// 10 10 5 5
// upper full full full
//  10 5 5 5
// full full full full
// 6 6 6 6

3;
// upper upper upper
// 9 8 8
// upper upper full
// 9 9 6
// upper full full
// 9 6 6
// full full full
// 6 6 6

2;
// upper upper
// 9 9
// upper full
// 9 7
// full full
// 7 7

const splitSetsAmongSessions = ({
  split,
  rank,
  muscle,
  MRV,
  MEV,
  MV,
  maxFreq,
}: SplitAmongSetsType) => {
  let getUpperSessions = split.filter((each) => each === "upper");
  let getLowerSessions = split.filter((each) => each === "lower");
  let getFullSessions = split.filter((each) => each === "full");

  let MEVList = [];
  let MVList = [];

  let UPPER_SESSION_MAX = 9;
  let LOWER_SESSION_MAX = 9;
  let FULL_SESSION_MAX =
    getUpperSessions.length + getFullSessions.length > 3
      ? 5
      : getUpperSessions.length + getFullSessions.length < 3
      ? 7
      : 6;

  for (let i = 0; i < split.length; i++) {
    MEVList.push(MEV);
    MVList.push(MV);
  }

  let volume = rank < 4 ? MRV : rank < 8 ? MEVList : MVList;

  if (UPPER_MUSCLES.includes(muscle)) {
    let totalSessions = getUpperSessions.length + getFullSessions.length;

    if (totalSessions > maxFreq) {
      totalSessions = maxFreq;
    }

    for (let u = 0; u < split.length; u++) {}
  } else {
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
    });
  }

  for (let i = 0; i < list.length; i++) {
    const getUpperSessions = split.filter((each) => each === "upper");
    const getFullSessions = split.filter((each) => each === "full");

    const upper = getUpperSessions.length + getFullSessions.length;

    const lower = sessions - getUpperSessions.length;

    let muscle = workouts.find((each) => list[i].muscle === each.name);
    if (!muscle) return;

    if (UPPER_MUSCLES.includes(muscle.name)) {
      let getSets = Math.floor(muscle.MRV[upper - 1] / upper);

      for (let i = 0; i < sessionsMRV.length; i++) {
        const totalSets = sessionsMRV[i].maxSets;

        if (
          sessionsMRV[i].split === "full" ||
          sessionsMRV[i].split === "upper"
        ) {
          if (totalSets - getSets < 0) {
            getSets--;
          } else {
            sessionsMRV[i].sets.push([muscle.name, getSets]);
            sessionsMRV[i].maxSets = sessionsMRV[i].maxSets - getSets;
          }
        }
      }
    } else {
      let getSets = Math.floor(muscle.MRV[lower - 1] / lower);

      for (let i = 0; i < sessionsMRV.length; i++) {
        const totalSets = sessionsMRV[i].maxSets;

        if (
          sessionsMRV[i].split === "full" ||
          sessionsMRV[i].split === "lower"
        ) {
          if (totalSets - getSets < 0) {
            getSets--;
          } else {
            sessionsMRV[i].sets.push([muscle.name, getSets]);
            sessionsMRV[i].maxSets = sessionsMRV[i].maxSets - getSets;
          }
        }
      }
    }
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

  useEffect(() => {
    let newList = [];

    for (let i = 0; i < list.length; i++) {
      let pushList: (string | number)[] = [list[i].muscle];

      for (let j = 0; j < split.length; j++) {
        let sets = split[j].sets;
        let setsFound = false;

        for (let k = 0; k < sets.length; k++) {
          if (sets[k].includes(list[i].muscle)) {
            pushList.push(sets[k][1]);
            setsFound = true;
          }
        }

        if (!setsFound) {
          pushList.push(0);
        }
      }

      newList.push(pushList);
    }

    setRows(newList);
  }, [list, split]);

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
          </tr>
        </thead>
        <tbody>
          {rows.map((each) => {
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
          })}
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
