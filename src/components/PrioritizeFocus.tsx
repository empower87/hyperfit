import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProps,
} from "react-beautiful-dnd";
import { LOWER_MUSCLES, UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MUSCLE_PRIORITY_LIST, MusclePriorityType, Workout } from "~/pages";
import workouts from "./workouts.json";

type ListTuple = [string, number];

type PrioritizeFocusProps = {
  totalSessions: number;
  list: ListTuple[];
  setList: Dispatch<SetStateAction<ListTuple[]>>;
  setPriority: (type: "upper" | "lower") => void;
  setSplitTuple: Dispatch<SetStateAction<number[] | null>>;
  splitList: Workout[];
  setSplitList: Dispatch<SetStateAction<Workout[]>>;
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

export default function PrioritizeFocus({
  totalSessions,
  list,
  setList,
  setPriority,
  setSplitTuple,
  splitList,
  setSplitList,
}: PrioritizeFocusProps) {
  // const filteredUpper = splitList.filter((each) => each.session === "upper");
  // const upperFrequency = filteredUpper.length;
  // const lowerFrequency = splitList.length - upperFrequency;

  const [newList, setNewList] = useState<MusclePriorityType[]>([]);
  const [split, setSplit] = useState<number[]>([]);

  useEffect(() => {
    setNewList([...MUSCLE_PRIORITY_LIST]);
  }, []);

  useEffect(() => {
    const sessions = totalSessions;
    const split = handleUpperLowerSplit(newList, sessions);
    setSplit(split);
  }, [totalSessions, newList]);

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
        // const getMRV = MRV[upperFrequency - 1];
        // let totalSets = 0;

        // if (i <= 2) {

        //   totalSets = featureMatrix[i][upperFrequency - 1];
        // } else if (i > 2 && i <= 6) {
        //   totalSets = getMRV - 4;
        // } else {
        //   totalSets = MEV;
        // }

        // console.log(
        //   i,
        //   items.length,
        //   muscle,
        //   MEV,
        //   getMRV,
        //   upperFrequency,
        //   totalSets,
        //   "LETS TAKE A DEEPER LOOK"
        // );

        newList.push({
          id: items[i].id,
          muscle: items[i].muscle,
          sets: featureMatrix[i][splitFrequency[0] - 1],
        });
      } else {
        // const getMRV = MRV[lowerFrequency - 1];
        // let totalSets = 0;

        // if (i <= 2) {
        //   totalSets = getMRV;
        // } else if (i > 2 && i <= 6) {
        //   totalSets = getMRV - 4;
        // } else {
        //   totalSets = MEV;
        // }

        newList.push({
          id: items[i].id,
          muscle: items[i].muscle,
          sets: featureMatrix[i][splitFrequency[1] - 1],
        });
      }
    }
    console.log(newList, "OK IS THIS LIST WAVK?");
    // setNewList(newList);
    return newList;
  };

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;
      const items = [...newList];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);
      const newestList = updateNewList([...items], split);
      console.log(items, newestList, "OK LETS SEE WHAT ITS DOING");
      setNewList(newestList);
      // updateNewList(items);
    },
    [newList]
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
    const items: ListTuple[] = newList.map((each) => {
      return [each.muscle, each.sets];
    });

    // for (let i = 0; i < newList.length; i++) {
    //   if (split[0] >= split[1]) {
    //     if (UPPER_MUSCLES.includes(newList[i].muscle)) {
    //       for (let j = 0; j < splitList.length; j++) {
    //         if (splitList[j].session === "upper") {

    //         }
    //       }
    //       const updateSplitList = splitList.map(each => {
    //         if (each.session === "upper") {

    //         }
    //       })

    //     }
    //   } else {

    //   }
    // }

    setList(items);
    setPriority(split[0] >= split[1] ? "upper" : "lower");
    setSplitTuple(split);
  };

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
        <div className="mx-1 flex-col">
          <h3>frequency: {totalSessions}</h3>
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
        <button onClick={() => onClickHandler()}>Set Priority</button>
      </div>
    </>
  );
}

const Muscle = ({
  muscle,
  sets,
  index,
}: {
  muscle: string;
  sets: number;
  index: number;
}) => {
  return (
    <li className="mt-1 rounded border-2 border-slate-700 bg-slate-400 p-1 text-xs text-white">
      {index + 1} {muscle} - {sets}
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

const handleUpperLowerSplit = (
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

// EXERCISES    |    1   |   2   |   3   |   4   |   5   |   6   |   7
// --------------------------------------------------------------------
// 1 delts_side |   12   |  24   |  30   |  35   |  40   |  40   |  40
// 2 delts_side |   11   |  20   |  27   |  31   |  35   |  35   |  35
// 3 delts_side |   10   |  16   |  24   |  27   |  31   |  31   |  31
// --------------------------------------------------------------------
// 4 delts_side |    9   |  14   |  21   |  23   |  25   |  25   |  25
// 5 delts_side |    8   |  12   |  18   |  19   |  20   |  20   |  20
// 6 delts_side |    8   |  12   |  18   |  19   |  20   |  20   |  20
// 7 delts_side |    8   |  10   |  18   |  19   |  20   |  20   |  20
// --------------------------------------------------------------------
// 8 delts_side |    8   |   9   |  10   |  10   |  10   |  10   |  10
// 9 delts_side |    7   |   8   |   8   |   8   |   8   |   8   |   8
// 0 delts_side |    6   |   6   |   6   |   6   |   6   |   6   |   6

// EXERCISES    |   1   |   2   |   3   |   4   |   5   |   6   |   7
// -------------------------------------------------------------------
// 1 hamstrings |   6   |  12   |  16   |  18   |  18   |  18   |  18
// 2 hamstrings |   6   |  12   |  16   |  18   |  18   |  18   |  18
// 3 hamstrings |   6   |  12   |  16   |  18   |  18   |  18   |  18
// -------------------------------------------------------------------
// 4 hamstrings |   5   |  10   |  12   |  15   |  15   |  16   |  16
// 5 hamstrings |   5   |  10   |  12   |  15   |  15   |  16   |  16
// 6 hamstrings |   5   |   8   |   9   |  12   |  12   |  14   |  14
// 7 hamstrings |   4   |   8   |   9   |  12   |  12   |  14   |  14
// -------------------------------------------------------------------
// 8 hamstrings |   4   |   5   |   6   |   6   |   6   |   6   |   6
// 9 hamstrings |   4   |   4   |   4   |   4   |   4   |   4   |   4
// 0 hamstrings |   3   |   4   |   4   |   4   |   4   |   4   |   4

// EXERCISES    |   1   |   2   |   3   |   4   |   5   |   6   |   7
// -------------------------------------------------------------------
// 1 glutes     |   6   |  12   |  16   |  18   |  18   |  18   |  18
// 2 glutes     |   6   |  12   |  16   |  18   |  18   |  18   |  18
// 3 glutes     |   6   |  12   |  16   |  18   |  18   |  18   |  18
// -------------------------------------------------------------------
// 4 glutes     |   5   |  10   |  12   |  16   |  15   |  16   |  16
// 5 glutes     |   4   |   8   |  10   |  14   |  15   |  16   |  16
// 6 glutes     |   3   |   6   |   9   |  12   |  12   |  14   |  14
// 7 glutes     |   2   |   4   |   8   |  10   |  12   |  14   |  14
// -------------------------------------------------------------------
// 8 glutes     |   0   |   0   |   0   |   0   |   0   |   0   |   0
// 9 glutes     |   0   |   0   |   0   |   0   |   0   |   0   |   0
// 0 glutes     |   0   |   0   |   0   |   0   |   0   |   0   |   0

// EXERCISES    |   1   |   2   |   3   |   4   |   5   |   6   |   7
// -------------------------------------------------------------------
// 1 back       |  10   |  20   |  25   |  30   |  35   |  35   |  35
// 2 back       |   9   |  18   |  21   |  24   |  30   |  30   |  30
// 3 back       |   9   |  18   |  21   |  24   |  30   |  30   |  30
// -------------------------------------------------------------------
// 4 back       |   8   |  14   |  18   |  20   |  22   |  22   |  22
// 5 back       |   8   |  13   |  16   |  18   |  20   |  20   |  20
// 6 back       |   7   |  12   |  14   |  16   |  18   |  18   |  18
// 7 back       |   7   |  11   |  12   |  14   |  16   |  16   |  16
// -------------------------------------------------------------------
// 8 back       |   7   |  11   |  12   |  12   |  12   |  12   |  12
// 9 back       |   7   |  10   |  10   |  10   |  10   |  10   |  10
// 0 back       |   6   |   6   |   6   |   6   |   6   |   6   |   6

// EXERCISES    |   1   |   2   |   3   |   4   |   5   |   6   |   7
// -------------------------------------------------------------------
// 1 triceps    |   8   |   16  |  21   |  25   |  35   |  35   |  35
// 2 triceps    |   7   |   14  |  18   |  20   |  25   |  25   |  25
// 3 triceps    |   7   |   14  |  18   |  20   |  25   |  25   |  25
// -------------------------------------------------------------------
// 4 triceps    |   7   |   11  |  15   |  18   |  21   |  21   |  21
// 5 triceps    |   7   |   10  |  14   |  17   |  20   |  20   |  20
// 6 triceps    |   6   |   9   |  13   |  16   |  19   |  19   |  19
// 7 triceps    |   6   |   8   |  12   |  15   |  18   |  18   |  18
// -------------------------------------------------------------------
// 8 triceps    |   6   |   7   |   8   |   8   |   8   |   8   |   8
// 9 triceps    |   6   |   6   |   6   |   6   |   6   |   6   |   6
// 0 triceps    |   4   |   4   |   4   |   4   |   4   |   4   |   4

// EXERCISES   |    1    2    3    4    5    6    7
// ------------------------------------------------
//  back       |
//  biceps     |
//  chest      |
//  delts_rear |
//  delts_side |
//  glutes     |
//  hamstrings |
//  quads      |
//  traps      |
//  triceps    |
