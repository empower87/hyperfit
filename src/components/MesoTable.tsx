import { useEffect, useState } from "react";
import { MEV_RANK, MRV_RANK } from "src/constants/prioritizeRanks";

import {
  SessionSplitType,
  splitSetsAmongSessions,
} from "src/utils/distributeSets";
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
      testSets: sessionsMRV[0].testSets,
    });

    sessionsMRV[0].testSets.push(oneLine);
  }

  return sessionsMRV;
};

export const TestTable = ({
  list,
  split,
}: {
  list: MusclePriorityType[];
  split: SessionType[];
}) => {
  const [rows, setRows] = useState<[string, number[], number][]>([]);
  const [sessionSetTotal, setSessionsSetTotal] = useState<number[]>([]);

  useEffect(() => {
    if (split[0]) {
      setRows(split[0].testSets);
      let sets = split[0].testSets;
      let sessions = sets[0][1];
      let setTotals = [];

      for (let i = 0; i < sessions.length; i++) {
        let total = 0;
        for (let j = 0; j < sets.length; j++) {
          total = total + sets[j][1][i];
        }
        setTotals.push(total);
      }

      console.log(setTotals, "this is probably way off");
      setSessionsSetTotal(setTotals);
    }
  }, [split]);

  return (
    <div className="flex justify-center">
      <table className="w-300">
        <thead>
          <tr className="bg-slate-500">
            <th className="bg-slate-500 px-1 text-sm text-white">Muscle</th>
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
            <th className="bg-slate-500 px-1 text-sm text-white">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((each, index) => {
            let rankColor =
              index < MRV_RANK
                ? "bg-red-400"
                : index >= MRV_RANK && index < MEV_RANK
                ? "bg-orange-400"
                : "bg-green-400";
            return (
              <tr className="text-xs">
                <td className={"text-sm text-white " + rankColor}>{each[0]}</td>
                {each[1].map((e, i) => {
                  let bgColor =
                    e === 0
                      ? "bg-slate-400"
                      : split[i].split === "upper"
                      ? "bg-blue-200"
                      : split[i].split === "lower"
                      ? "bg-red-200"
                      : "bg-purple-200";

                  return (
                    <td className={bgColor + " border border-slate-500 pl-2"}>
                      {e}
                    </td>
                  );
                })}
                <td className="bg-slate-300 px-1 text-xs">{each[2]}</td>
              </tr>
            );
          })}

          <tr>
            <td className="bg-slate-500 px-1 text-sm font-bold text-white">
              Total
            </td>
            {split.map((each, index) => {
              return (
                <td className=" bg-slate-400 pl-2 text-xs">
                  {sessionSetTotal[index]}
                </td>
              );
            })}
            <td className="bg-slate-300 px-1 text-xs">
              {sessionSetTotal.length > 0
                ? sessionSetTotal?.reduce((total, num) => total + num)
                : null}
            </td>
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
