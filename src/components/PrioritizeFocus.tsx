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
import { SORTED_PRIORITY_LIST_2, SortObj } from "~/pages";
import workouts from "./workouts.json";

type ListTuple = [string, number];

const SORTED_PRIORITY_LIST: ListTuple[] = [
  ["back", 25],
  ["triceps", 20],
  ["delts_side", 25],
  ["delts_rear", 25],
  ["traps", 12],
  ["chest", 8],
  ["biceps", 8],
  ["quads", 30],
  ["hamstrings", 18],
  ["glutes", 12],
];
type Workout = { day: number; session: string; sets: ListTuple[] };

type PrioritizeFocusProps = {
  // totalSessions: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  // priority: "upper" | "lower";
  list: ListTuple[];
  setList: Dispatch<SetStateAction<ListTuple[]>>;
  splitList: Workout[];
  setPriority: (type: "upper" | "lower") => void;
};

export const PickPriority = ({
  sessions,
  onClick,
}: {
  sessions: string;
  onClick: (type: "upper" | "lower") => void;
}) => {
  const [isOdd, setIsOdd] = useState<boolean>(false);

  const onClickHandler = (type: "upper" | "lower") => {
    onClick(type);
    setIsOdd(false);
  };

  useEffect(() => {
    const isOdd = parseInt(sessions) % 2 > 0 ? true : false;
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

// 1 - 3 MRV
// 4 - 6 MRV - 4 per
// 7 - 10 MEV

export default function PrioritizeFocus({
  // totalSessions,
  // priority,
  list,
  setList,
  splitList,
  setPriority,
}: PrioritizeFocusProps) {
  // const list = [...SORTED_PRIORITY_LIST];
  const filteredUpper = splitList.filter((each) => each.session === "upper");
  const upperFrequency = filteredUpper.length;
  const lowerFrequency = splitList.length - upperFrequency;

  const [newList, setNewList] = useState<SortObj[]>([]);

  useEffect(() => {
    setNewList([...SORTED_PRIORITY_LIST_2]);
  }, []);

  const updateNewList = (items: SortObj[]) => {
    let newList: SortObj[] = [];

    for (let i = 0; i < items.length; i++) {
      const getMuscleObj = workouts.filter(
        (each) => each.muscle === items[i].muscle
      );

      const { muscle, MEV, MRV } = getMuscleObj[0];

      if (UPPER_MUSCLES.includes(muscle)) {
        const getMRV = MRV[upperFrequency - 1];
        let totalSets = 0;

        if (i <= 2) {
          totalSets = getMRV;
        } else if (i > 2 && i <= 6) {
          totalSets = getMRV - 4;
        } else {
          totalSets = MEV;
        }

        console.log(
          i,
          items.length,
          muscle,
          MEV,
          getMRV,
          upperFrequency,
          totalSets,
          "LETS TAKE A DEEPER LOOK"
        );

        newList.push({
          id: items[i].id,
          muscle: items[i].muscle,
          sets: totalSets,
        });
      } else {
        const getMRV = MRV[lowerFrequency - 1];
        let totalSets = 0;

        if (i <= 2) {
          totalSets = getMRV;
        } else if (i > 2 && i <= 6) {
          totalSets = getMRV - 4;
        } else {
          totalSets = MEV;
        }

        newList.push({
          id: items[i].id,
          muscle: items[i].muscle,
          sets: totalSets,
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
      const newestList = updateNewList([...items]);
      console.log(items, newestList, "OK LETS SEE WHAT ITS DOING");
      setNewList(newestList);
      // updateNewList(items);
    },
    [newList]
  );

  const onClickHandler = () => {
    const items: ListTuple[] = [];

    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < newList.length; j++) {
        if (list[i][0] === newList[j].muscle) {
          items.push([list[i][0], newList[j].sets]);
          break;
        }
      }
    }
    setList(items);
    setPriority(split[0] >= split[1] ? "upper" : "lower");
  };

  const [split, setSplit] = useState<number[]>([]);

  useEffect(() => {
    const sessions = splitList.length;
    const split = handleUpperLowerSplit(newList, sessions);
    setSplit(split);
  }, [splitList, newList]);

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
          <h3>frequency: {splitList.length}</h3>
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

// 1 2 3 4 5 6 7
// 1 0 1 0 1 0 0
// 0 0 1 0 0 1 0

// lower should have at most 3 workouts seeing that it takes at least one day in between to recover

const handleUpperLowerSplit = (list: SortObj[], sessions: number) => {
  const lowerPriority = getLowerPosition(list);
  console.log(
    lowerPriority,
    "WHAT IS THIS VALUE IN HANDLE UPPER LOWER SPLIT??"
  );
  switch (sessions) {
    case 2:
      return [1, 1];
    case 3:
      // if top 3 are all lower then return [1, 2]
      // else return [2, 1]
      // if lower is in bottom 4 then probably do a upper upper, full
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
    // if top 3 are all upper then return [3, 1]
    // if top 3 are all lower then return [2, 2]
    // if top 3 are 2x upper and 1x lower [2, 2]
    // if top 3 are 2x lower and 1x upper. Move to 4th priority and if its a lower then [3, 1] else [2, 2]
    case 5:
      if (lowerPriority === "top") {
        return [2, 3];
      } else if (lowerPriority === "bottom") {
        return [4, 1];
      } else {
        return [3, 2];
      }
    case 6:
      // priority has legs in 3 out of 4 top
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
      // case === 1 here
      // regardless gonna have to do a full body workout
      return [1, 0];
  }
};

const getLowerPosition = (list: SortObj[]) => {
  let top = [];
  let bottom = [];

  for (let i = 0; i < list.length; i++) {
    if (i < 4) {
      if (LOWER_MUSCLES.includes(list[i].muscle)) {
        top.push(1);
      } else {
        top.push(0);
      }
    }

    if (i >= list.length - 4) {
      if (LOWER_MUSCLES.includes(list[i].muscle)) {
        bottom.push(1);
      } else {
        top.push(0);
      }
    }
  }

  const topSum = top.reduce((total, number) => total + number, 0);
  const bottomSum = bottom.reduce((total, number) => total + number, 0);

  console.log(topSum, bottomSum, "WHAT DISS??");

  if (topSum === 3) {
    return "top";
  }

  if (bottomSum === 3) {
    return "bottom";
  }

  return "mid";
};
