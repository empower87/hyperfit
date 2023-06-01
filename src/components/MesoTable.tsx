import { LOWER_MUSCLES, UPPER_MUSCLES } from "~/constants/workoutSplits";
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

const MRVList = [["back", 30], ["triceps", 25], ["side_delts", 35], []];
export const LiftTableTesting = ({ sessions }: { sessions: number[] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Muscle Group</th>
          {sessions.map((each) => {
            return <th>{each}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {muscles.map((each) => {
          return (
            <tr>
              <td>{each.muscle}</td>
              <td>{each.sets}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
// total
// 5 total
// quads MRV
// back MRV

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

const distributeSets = (list: MusclePriorityType[], sessions: number[]) => {};
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
  if (priority[1] === 4) {
    return "MAX_MRV";
  } else if (priority[1] === 3) {
    return "FULL_MRV";
  } else if (priority[1] === 2) {
    if (priority[0] === 2) {
      return "FULL_MRV";
    } else if (priority[0] === 1) {
      return "MRV";
    } else {
      return "LOW_MRV";
    }
  } else if (priority[1] === 1) {
    if (priority[0] === 1) {
      return "LOW_MRV";
    } else {
      return "MEV";
    }
  }

  return "MV";
};

const getTrainingSplit = (
  list: MusclePriorityType[],
  sessions: number[]
): ("full" | "upper" | "lower")[] => {
  const lowerRank = getLowerPosition(list);

  switch (sessions.length) {
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
          return ["upper", "lower", "lower", "full", "full"];
        case "MRV":
          return ["upper", "upper", "lower", "full", "full"];
        case "LOW_MRV":
          return ["upper", "upper", "full", "full", "lower"];
        case "MEV":
          return ["upper", "upper", "upper", "full", "full"];
        default:
          return ["upper", "upper", "upper", "upper", "full"];
      }

    case 6:
      return ["upper", "upper", "upper", "lower", "lower", "lower"];
    case 7:
      return ["upper", "upper", "upper", "lower", "lower", "lower", "full"];
    default:
      return ["full"];
  }
};

const featureTest = (list: MusclePriorityType[], sessions: number[]) => {
  const split = getTrainingSplit(list, sessions);

  let sessionsMRV: SessionType[] = sessions.map((each, index) => {
    return {
      ...SESSION,
      day: index + 1,
      sets: [],
      totalSets: 0,
      maxSets: 30,
      split: split[index],
    };
  });

  for (let i = 0; i < list.length; i++) {
    const getUpperSessions = split.filter(
      (each) => each === "upper" || each === "full"
    );

    const upper = getUpperSessions.length;
    const lower = sessions.length - upper;

    let muscle = workouts.find((each) => list[i].muscle === each.muscle);
    if (!muscle) return;

    // let sessionsForMuscle = sessions.length
    // if (muscle.muscle === "quads" || muscle.muscle === "chest" || muscle.muscle === "back") {
    //   if (sessions.length > 4) {
    //     sessionsForMuscle = 4
    //   }
    // }
    if (UPPER_MUSCLES.includes(muscle.muscle)) {
      let getSets = Math.floor(muscle.MRV[upper - 1] / upper);

      for (let i = 0; i < sessionsMRV.length; i++) {
        const totalSets = sessionsMRV[i].maxSets;
        if (
          sessionsMRV[i].split === "full" ||
          sessionsMRV[i].split === "upper"
        ) {
          if (totalSets - getSets < 0) {
            getSets--;
          }
          sessionsMRV[i].sets.push([muscle.muscle, getSets]);
        }
      }
    } else {
    }

    for (let i = 0; i < sessionsMRV.length; i++) {
      if (sessionsMRV[i].split == null) {
        if (muscle.muscle === "quads") {
        } else if (muscle.muscle === "back" || muscle.muscle === "chest") {
        } else {
        }
      }
    }

    sessionsMRV.map((each) => {
      return {
        ...each,
        sets: each.sets.push([list[i].muscle, muscle.MRV[sessionsForMuscle]]),
      };
    });
  }
};

// 4   5   6   7
//

//

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
