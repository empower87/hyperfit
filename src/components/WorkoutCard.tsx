import { useRef } from "react";
import { LOWER_MUSCLES } from "~/constants/workoutSplits";
import Lift, { LiftTable } from "./Lift";

type WorkoutCardProps = {
  day: number;
  split: string;
  sets: ListTuple[];
};

const AVERAGE_SET_DURATION = 20;
const REST_PERIOD = 60;

const getEstimatedWorkoutDuration = (sets: number) => {
  const setTime = sets * AVERAGE_SET_DURATION;
  const restTime = sets * REST_PERIOD;

  const totalMinutes = (setTime + restTime) / 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const hoursText = hours === 1 ? `${hours}hr` : hours > 0 ? `${hours}hrs` : "";
  const minutesText = minutes > 0 ? `${minutes}min` : "";

  if (hoursText && minutesText) {
    return `${hoursText} ${minutesText}`;
  } else {
    return hoursText || minutesText;
  }
};

function Header({ day, split }: Pick<WorkoutCardProps, "day" | "split">) {
  const textcolor = split === "upper" ? "text-red-500" : "text-blue-500";
  const capSplit = split === "upper" ? "Upper" : "Lower";

  return (
    <div className="flex justify-between bg-slate-700">
      <div className="flex w-1/2">
        <h2 className="p-1 text-sm font-medium text-white">Day {day}: </h2>
        <h2 className={`${textcolor} p-1 text-sm font-medium`}>{capSplit}</h2>
      </div>
      <div style={{ width: "150px" }} className="flex text-sm text-white">
        <h2 className="p-1 text-sm font-medium text-white">Week 1</h2>
      </div>
    </div>
  );
}

function Footer({ time, sets }: { time: string; sets: number }) {
  return (
    <div className="flex w-full justify-between bg-slate-300">
      <div className="flex flex-col">
        <p className="p-1 text-xs font-medium text-slate-500">Total Sets:</p>
        <p className="p-1 text-xs text-white"> {sets}</p>
      </div>
      <div className="flex flex-col">
        <p className="p-1 text-xs font-medium text-slate-500">
          Total Workout Duration:
        </p>
        <p className="p-1 text-xs text-white"> {time}</p>
      </div>
    </div>
  );
}

export default function WorkoutCard({ day, split, sets }: WorkoutCardProps) {
  const totalSets = sets.reduce((total, [, number]) => total + number, 0);

  const totalWorkoutTime = getEstimatedWorkoutDuration(totalSets);

  const renderRef = useRef<number>(0);
  console.log(renderRef.current++, "<WorkoutCard /> render count");
  return (
    <div className="mb-2 mr-2">
      <Header day={day} split={split} />
      <LiftTable>
        {sets.map((each, index) => {
          return (
            <Lift
              key={`${each[1]}_${index}}`}
              index={index}
              sets={each[1]}
              category={each[0]}
            />
          );
        })}
      </LiftTable>
      <Footer time={totalWorkoutTime} sets={totalSets} />
    </div>
  );
}

type ListTuple = [string, number];

export const updateList = (list: ListTuple[], tuple: ListTuple) => {
  const [searchString, searchNumber] = tuple;

  // Check if the tuple already exists in the list
  const existingTupleIndex = list.findIndex(([str]) => str === searchString);

  if (existingTupleIndex !== -1) {
    // Tuple exists, update its number value if it doesn't exceed 12
    const [existingString, existingNumber] = list[
      existingTupleIndex
    ] as ListTuple;
    const newNumber = existingNumber + searchNumber;

    if (newNumber <= 12) {
      list[existingTupleIndex] = [existingString, newNumber];
      return list;
    } else {
      return null;
    }
  } else {
    // Tuple does not exist, push it to the list
    list.push(tuple);
    return list;
  }
};

// check to see how many potential sessions
// check to see max frequency of target muscle

type SplitType = "upper" | "lower" | "full";

export const distributeMEVAmongSessions = (
  rank: number,
  name: string,
  MEV: number,
  MV: number,
  split: SplitType[],
  lower: number,
  upper: number,
  full: number
): [string, number[], number] => {
  // if (rank < 4) return null
  // const muscleObj = workouts.find((each) => name === each.name)
  // if (!muscleObj) return null

  // const { name: muscle, MEV, MV } = muscleObj
  const muscle = name;
  if (rank > 7) {
    if (LOWER_MUSCLES.includes(muscle)) {
      let count = 1;
      let sets = MV;

      if (sets > 4) {
        count = 2;
        sets = Math.floor(sets / 2);
      }

      let setsPerSession: number[] = [];
      for (let i = 0; i < split.length; i++) {
        if (MV === 0) {
          setsPerSession.push(0);
        } else {
          if (split[i] === "lower") {
            if (count === 0) {
              setsPerSession.push(0);
            } else {
              setsPerSession.push(sets);
              count--;
            }
          } else if (split[i] === "full" && lower < 2 && sets > 4) {
            console.log(
              count,
              sets,
              full,
              split,
              "WE GETTING ANYTHING HERE?? - LOWER"
            );
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

      console.log(
        setsPerSession,
        "SETS PER SESSION FINISHED LIST FOR MV IN LOWER"
      );
      return [name, setsPerSession, MV];
    } else {
      let count = 1;
      let sets = MV;

      if (sets > 4) {
        count = 2;
        sets = Math.floor(sets / 2);
      }

      let setsPerSession: number[] = [];
      for (let i = 0; i < split.length; i++) {
        if (MV === 0) {
          setsPerSession.push(0);
        } else {
          if (split[i] === "upper") {
            if (count === 0) {
              setsPerSession.push(0);
            } else {
              setsPerSession.push(sets);
              count--;
            }
          } else if (split[i] === "full" && upper < 2 && sets > 4) {
            console.log(
              count,
              sets,
              full,
              split,
              "WE GETTING ANYTHING HERE?? - UPPER"
            );
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
      console.log(
        setsPerSession,
        "SETS PER SESSION FINISHED LIST FOR MV IN UPPER"
      );
      return [name, setsPerSession, MV];
    }
  } else {
    // biceps      6
    // abs         6
    // triceps     6
    // chest       6
    // delts_rear  6

    // back        10
    // quads       8
    // delts_side  8
    // calves      8
    // forearms    8

    // traps       4
    // hamstrings  4

    // glutes      0
    // delts_front 0

    if (LOWER_MUSCLES.includes(muscle)) {
      let sessions = 1;
      let count = 1;
      let sets = MEV;

      if (sets > 7) {
        count = 3;
        sets = 3;
        sessions = 3;
      } else if (sets > 5) {
        count = 2;
        sets = 3;
        sessions = 2;
      }

      let setsPerSession: number[] = [];
      for (let i = 0; i < split.length; i++) {
        if (MEV === 0) {
          setsPerSession.push(0);
        } else {
          if (split[i] === "lower") {
            if (count === 0) {
              setsPerSession.push(0);
            } else {
              setsPerSession.push(sets);
              count--;
            }
          } else if (split[i] === "full" && lower < sessions) {
            console.log(
              count,
              sets,
              full,
              split,
              "WE GETTING ANYTHING HERE?? - LOWER"
            );
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

      console.log(
        setsPerSession,
        "SETS PER SESSION FINISHED LIST FOR MV IN LOWER"
      );
      return [name, setsPerSession, MEV];
    } else {
      let sessions = 1;
      let count = 1;
      let sets = MEV;

      if (sets > 7) {
        count = 3;
        sets = 3;
        sessions = 3;
      } else if (sets > 5) {
        count = 2;
        sets = 3;
        sessions = 2;
      }

      let setsPerSession: number[] = [];
      for (let i = 0; i < split.length; i++) {
        if (MEV === 0) {
          setsPerSession.push(0);
        } else {
          if (split[i] === "upper") {
            if (count === 0) {
              setsPerSession.push(0);
            } else {
              setsPerSession.push(sets);
              count--;
            }
          } else if (split[i] === "full" && upper < sessions) {
            console.log(
              count,
              sets,
              full,
              split,
              "WE GETTING ANYTHING HERE?? - UPPER"
            );
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
      console.log(
        setsPerSession,
        "SETS PER SESSION FINISHED LIST FOR MV IN UPPER"
      );
      return [name, setsPerSession, MEV];
    }
  }
};

// const splitSets = (split: SplitType[], muscleGroup: "upper" | "lower", volume: number) => {

//   let setsPerSession: number[] = [];

//   let sessions = 1
//   let count = 1
//   let sets = volume

//   if (sets > 7) {
//     count = 3;
//     sets = 3;
//     sessions = 3;
//   } else if (sets > 5) {
//     count = 2;
//     sets = 3;
//     sessions = 2;
//   }

//   for (let i = 0; i < split.length; i++) {
//     if (volume === 0) {
//       setsPerSession.push(0);
//     } else {
//       if (split[i] === muscleGroup) {
//         if (count === 0) {
//           setsPerSession.push(0);
//         } else {
//           setsPerSession.push(sets);
//           count--;
//         }
//       } else if (split[i] === "full" && upper < sessions) {
//         console.log(
//           count,
//           sets,
//           full,
//           split,
//           "WE GETTING ANYTHING HERE?? - UPPER"
//         );
//         if (count === 0) {
//           setsPerSession.push(0);
//         } else {
//           setsPerSession.push(sets);
//           count--;
//         }
//       } else {
//         setsPerSession.push(0);
//       }
//     }
//   }
// }

// upper upper upper lower full

// upper upper lower lower full

// upper lower lower full full

// upper lower full full full
