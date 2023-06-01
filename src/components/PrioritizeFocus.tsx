import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProps,
} from "react-beautiful-dnd";
import { LOWER_MUSCLES, UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MUSCLE_PRIORITY_LIST, MusclePriorityType, SplitType } from "~/pages";
import workouts from "./workouts.json";

type PrioritizeFocusProps = {
  totalWorkouts: number;
  musclePriority: MusclePriorityType[];
  setMusclePriority: Dispatch<SetStateAction<MusclePriorityType[]>>;
  split: number[];
  workoutSplit: SplitType[];
  setWorkoutSplit: Dispatch<SetStateAction<SplitType[]>>;
};

export const PickPriority = ({
  sessions,
  onClick,
}: {
  sessions: number;
  onClick: (type: "upper" | "lower") => void;
}) => {
  const [isOdd, setIsOdd] = useState<boolean>(false);

  const onClickHandler = (type: "upper" | "lower") => {
    onClick(type);
    setIsOdd(false);
  };

  useEffect(() => {
    const isOdd = sessions % 2 > 0 ? true : false;
    setIsOdd(isOdd);
  }, [sessions]);

  if (isOdd) {
    return (
      <div>
        <p>Would you like to prioritize your upper body or lower body?</p>
        <div>
          <button
            className="m-1 rounded  bg-red-500 p-1 text-sm text-white"
            onClick={() => onClickHandler("upper")}
          >
            Upper
          </button>
          <button
            className="m-1 rounded bg-blue-500  p-1 text-sm text-white"
            onClick={() => onClickHandler("lower")}
          >
            Lower
          </button>
        </div>
      </div>
    );
  } else return null;
};

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

const updateNewList = (
  items: MusclePriorityType[],
  splitFrequency: number[]
) => {
  let newList: MusclePriorityType[] = [];

  for (let i = 0; i < items.length; i++) {
    const getMuscleObj = workouts.filter(
      (each) => each.muscle === items[i].muscle
    );

    const { muscle, MEV, MRV, featureMatrix } = getMuscleObj[0];

    if (UPPER_MUSCLES.includes(muscle)) {
      newList.push({
        id: items[i].id,
        muscle: items[i].muscle,
        sets: featureMatrix[i][splitFrequency[0] - 1],
      });
    } else {
      newList.push({
        id: items[i].id,
        muscle: items[i].muscle,
        sets: featureMatrix[i][splitFrequency[1] - 1],
      });
    }
  }

  console.log(newList, "OK IS THIS LIST WAVK?");

  return newList;
};

export default function PrioritizeFocus({
  split,
  totalWorkouts,
  workoutSplit,
  musclePriority,
  setMusclePriority,
  setWorkoutSplit,
}: PrioritizeFocusProps) {
  const [newList, setNewList] = useState<MusclePriorityType[]>([]);

  useEffect(() => {
    const getNewList = updateNewList(musclePriority, split);
    setNewList(getNewList);
  }, [split, musclePriority]);

  useEffect(() => {
    const sessions = totalWorkouts;

    const upperOnEven = split[0] >= split[1] ? true : false;

    let splitList: SplitType[] = [];

    for (let i = 0; i < sessions; i++) {
      if (upperOnEven && i % 2 === 0) {
        splitList.push({ day: i + 1, split: "upper", sets: [] });
      } else {
        splitList.push({ day: i + 1, split: "lower", sets: [] });
      }
    }

    setWorkoutSplit(splitList);
  }, [split]);

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;
      const items = [...newList];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      const split = handleUpperLowerSplit(items, totalWorkouts);
      const newerList = updateNewList(items, split);
      console.log(items, split, items, "OK LETS SEE WHAT ITS DOING");

      setMusclePriority(newerList);
      // updateNewList(items);
    },
    [newList, split]
  );

  const divideSetsAmongDays = (days: number, sets: number): number[] => {
    const setsPerDay = Math.floor(sets / days); // Number of sets per day (integer division)
    let remainingSets = sets % days; // Remaining sets after distributing equally
    const result: number[] = [];

    for (let i = 0; i < days; i++) {
      if (remainingSets > 0) {
        result.push(Math.min(setsPerDay + 1, 12)); // Add one set to the day if there are remaining sets
        remainingSets--;
      } else {
        result.push(Math.min(setsPerDay, 12)); // Distribute the sets equally among the days
      }
    }

    return result;
  };

  const onClickHandler = () => {
    let copyList = [...workoutSplit];
    const newList = [...MUSCLE_PRIORITY_LIST];

    for (let i = 0; i < newList.length; i++) {
      if (UPPER_MUSCLES.includes(newList[i].muscle)) {
        let sessions = divideSetsAmongDays(split[0], newList[i].sets);

        console.log(
          sessions,
          newList[i].sets,
          "OK WHY AREN'T THESE ADDING UP??"
        );

        let count = 0;
        for (let j = 0; j < copyList.length; j++) {
          const sets = sessions[count];

          if (copyList[j].split === "upper" && sets) {
            copyList[j].sets.push([newList[i].muscle, sessions[count]]);
            count++;
            console.log(
              sessions,
              count,
              copyList[j].sets,
              newList[i].muscle,
              "WHAT ARE THESE VALUES IN UPPPER????"
            );
          }
        }
      } else {
        let sessions = divideSetsAmongDays(split[1], newList[i].sets);

        let count = 0;

        for (let j = 0; j < copyList.length; j++) {
          const sets = sessions[count];

          if (copyList[j].split === "lower" && sets) {
            copyList[j].sets.push([newList[i].muscle, sessions[count]]);
            count++;
          }
        }
      }
    }
    console.log(copyList, "ok what this look like???");
    setWorkoutSplit(copyList);
  };

  const renderRef = useRef<number>(0);
  console.log(renderRef.current++, "<PrioritizeFocus /> render count");

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="droppable">
          {(provided, snapshot) => (
            <ul
              id="droppable"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {newList.map((each, index) => {
                return (
                  <Draggable
                    key={`${each.id}`}
                    draggableId={each.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Muscle
                          muscle={each.muscle}
                          sets={each.sets}
                          index={index}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <div className="flex">
        <div className="mx-1 w-1/2 flex-col">
          <h3>frequency: {totalWorkouts}</h3>
          {split[0] >= split[1] ? (
            <>
              <p className="text-red-500">upper set: {split[0]}</p>
              <p className="text-blue-500">lower set: {split[1]}</p>
            </>
          ) : (
            <>
              <p className="text-blue-500">lower set: {split[1]}</p>
              <p className="text-red-500">upper set: {split[0]}</p>
            </>
          )}
        </div>
        <div className="flex w-1/2 items-center justify-center">
          <button
            className="flex h-6 items-center justify-center rounded-md border-slate-500 bg-slate-700"
            onClick={() => onClickHandler()}
          >
            <p className="m-2 text-sm text-white">Set Priority</p>
          </button>
        </div>
      </div>
    </>
  );
}

const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-yellow-500",
  "bg-yellow-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-blue-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-green-500",
  "bg-green-500",
  "bg-green-500",
];

const Muscle = ({
  muscle,
  sets,
  index,
}: {
  muscle: string;
  sets: number;
  index: number;
}) => {
  const bgColor = ` ${COLORS[index]}`;
  return (
    <li
      className={
        "mt-1 flex justify-between rounded border-2 border-slate-700 p-1 text-xs text-white" +
        bgColor
      }
    >
      <div>{index + 1}</div>
      <div className="font-bold">{muscle}</div>
      <div className="font-bold">{sets}</div>
    </li>
  );
};

const getLowerPosition = (list: MusclePriorityType[]) => {
  let top = 0;
  let bottom = 0;

  for (let i = 0; i < list.length; i++) {
    if (i < 4) {
      if (LOWER_MUSCLES.includes(list[i].muscle)) {
        top++;
      }
    }

    if (i >= list.length - 4) {
      if (LOWER_MUSCLES.includes(list[i].muscle)) {
        bottom++;
      }
    }
  }

  if (top === 3) {
    return "top";
  }

  if (bottom === 3) {
    return "bottom";
  }

  return "mid";
};

export const handleUpperLowerSplit = (
  list: MusclePriorityType[],
  sessions: number
) => {
  const lowerPriority = getLowerPosition(list);
  console.log(
    lowerPriority,
    "WHAT IS THIS VALUE IN HANDLE UPPER LOWER SPLIT??"
  );
  switch (sessions) {
    case 2:
      return [1, 1];
    case 3:
      if (lowerPriority === "top") {
        return [1, 2];
      } else return [2, 1];
    case 4:
      if (lowerPriority === "top") {
        return [1, 3];
      } else if (lowerPriority === "bottom") {
        return [3, 1];
      } else {
        return [2, 2];
      }
    case 5:
      if (lowerPriority === "top") {
        return [2, 3];
      } else if (lowerPriority === "bottom") {
        return [4, 1];
      } else {
        return [3, 2];
      }
    case 6:
      if (lowerPriority === "top") {
        return [3, 3];
      } else if (lowerPriority === "bottom") {
        return [5, 1];
      } else {
        return [4, 2];
      }
    case 7:
      if (lowerPriority === "top") {
        return [4, 3];
      } else if (lowerPriority === "bottom") {
        return [5, 2];
      } else {
        return [4, 3];
      }
    default:
      return [1, 0];
  }
};

// rear_delts should be trained at least 2x a week at MEV if growth is desired

// EXERCISES    |   1   |   2   |   3   |   4   |   5   |   6   |   7
// -------------------------------------------------------------------
// 1 triceps    |   8   |   16  |  21   |  25   |  35   |  35   |  35
// -------------------------------------------------------------------
// 2 triceps    |   7   |   12  |  15   |  18   |  21   |  21   |  21
// 3 triceps    |   7   |   12  |  15   |  18   |  21   |  21   |  21
// -------------------------------------------------------------------
// 4 triceps    |   5   |   8   |  12   |  15   |  18   |  18   |  18
// 5 triceps    |   5   |   10  |  14   |  17   |  20   |  20   |  20
// 6 triceps    |   5   |   9   |  13   |  16   |  19   |  19   |  19
// 7 triceps    |   5   |   8   |  12   |  15   |  18   |  18   |  18
// -------------------------------------------------------------------
// 8 triceps    |   4   |   6   |   6   |   6   |   6   |   6   |   6
// 9 triceps    |   4   |   6   |   6   |   6   |   6   |   6   |   6
// 0 triceps    |   4   |   6   |   6   |   6   |   6   |   6   |   6
// -------------------------------------------------------------------
// 1 triceps    |   4   |   4   |   4   |   4   |   4   |   4   |   4
// 2 triceps    |   4   |   4   |   4   |   4   |   4   |   4   |   4
// 3 triceps    |   4   |   4   |   4   |   4   |   4   |   4   |   4
// 4 triceps    |   4   |   4   |   4   |   4   |   4   |   4   |   4

// prompt user for splits
// which is higher priority
// back - chest - legs
// high - mid - low - maintenance

// frequency 5 legs on backburner

// TRAINING BLOCK

// MESO 1  |  week 1   |   week 2   |   week 3   |   week 4   |  deload    |
// ========================================================================|
//         |           |            |            |            |            |
//  sets   |     5     |     6      |      8     |     10     |            |
//         |           |            |            |            |            |
//  sets   |     5     |     6      |      8     |     10     |            |

// MESO 2  |  week 1   |   week 2   |   week 3   |   week 4   |  deload    |
// ========================================================================|
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |

// MESO 3  |  week 1   |   week 2   |   week 3   |   week 4   |  deload    |
// ========================================================================|
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |

// resensitization meso
// MESO 4  |  week 1   |   week 2   |   week 3   |   week 4   |  deload    |
// ========================================================================|
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |
//         |           |            |            |            |            |
//  sets   |           |            |            |            |            |
