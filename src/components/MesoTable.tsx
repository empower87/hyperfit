import { MEV_RANK, MRV_RANK } from "src/constants/prioritizeRanks";

import { MusclePriorityType, SessionType } from "~/pages";

function TotalRow({ split }: { split: SessionType[] }) {
  let total = 0;

  return (
    <tr>
      <td className="bg-slate-500 px-1 text-sm font-bold text-white">Total</td>
      {split.map((each, index) => {
        let value = each.sets.reduce(
          (acc: [string, number], current: [string, number]) => {
            acc = [current[0], acc[1] + current[1]];
            return acc;
          }
        );

        total += value[1];

        return (
          <td
            key={`${each.split}_${index}total`}
            className=" bg-slate-400 pl-2 text-xs"
          >
            {value[1]}
          </td>
        );
      })}
      <td className="bg-slate-300 px-1 text-xs">{total}</td>
    </tr>
  );
}

export const TestTable = ({
  list,
  split,
}: {
  list: MusclePriorityType[];
  split: SessionType[];
}) => {
  return (
    <div className="flex justify-center">
      <table className="w-300">
        <thead>
          <tr className="bg-slate-500">
            <th className="bg-slate-500 px-1 text-sm text-white">Muscle</th>
            {split.map((each, index) => {
              let color =
                each.split === "upper"
                  ? "bg-blue-500"
                  : each.split === "lower"
                  ? "bg-red-500"
                  : "bg-purple-500";
              return (
                <th
                  key={`${each.day}_${index}`}
                  className={color + " px-2 text-sm text-white"}
                >
                  {each.split}
                </th>
              );
            })}
            <th className="bg-slate-500 px-1 text-sm text-white">Total</th>
          </tr>
        </thead>

        <tbody>
          {list.map((each, index) => {
            let rankColor =
              index < MRV_RANK
                ? "bg-red-400"
                : index >= MRV_RANK && index < MEV_RANK
                ? "bg-orange-400"
                : "bg-green-400";

            let total = 0;
            return (
              <tr key={`${each.muscle}_vertical`} className="text-xs">
                <td className={"text-sm text-white " + rankColor}>
                  {each.muscle}
                </td>
                {split.map((e, i) => {
                  return e.sets.map((ea) => {
                    if (ea[0] === each.muscle) {
                      let bgColor =
                        ea[1] === 0
                          ? "bg-slate-400"
                          : split[i].split === "upper"
                          ? "bg-blue-200"
                          : split[i].split === "lower"
                          ? "bg-red-200"
                          : "bg-purple-200";
                      total += ea[1];
                      return (
                        <td
                          key={`${ea[0]}_${i}_sets`}
                          className={bgColor + " border border-slate-500 pl-2"}
                        >
                          {ea[1]}
                        </td>
                      );
                    } else {
                      return null;
                    }
                  });
                })}
                <td className="bg-slate-300 px-1 text-xs">{total}</td>
              </tr>
            );
          })}

          <TotalRow split={split} />
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
//  delts_s |    8   |   10   |   12   |   14   |
//  triceps |    8   |   10   |   12   |   14   |
//  hams    |    5   |    6   |    7   |   8    |
//  chest   |    4   |    5   |   6    |   6    |
//  biceps  |    4   |    5   |   6    |   6    |
//  quads   |    8   |   10   |   12   |   14   |
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
