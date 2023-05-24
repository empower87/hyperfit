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
import { UPPER_MUSCLES } from "~/constants/workoutSplits";
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
      <button onClick={() => onClickHandler()}>Set Priority</button>
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
