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
import workouts from "src/constants/workouts.json";
import { featureTest } from "src/utils/distributeSets";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { LOWER_MUSCLES, UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType, SplitType } from "~/pages";

type PrioritizeFocusProps = {
  totalWorkouts: number;
  musclePriority: MusclePriorityType[];
  setMusclePriority: Dispatch<SetStateAction<MusclePriorityType[]>>;
  split: number[];
  workoutSplit: SplitType[];
  setWorkoutSplit: Dispatch<SetStateAction<SplitType[]>>;
  setSplitTest: Dispatch<SetStateAction<SessionType[]>>;
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

const updateNewList = (items: MusclePriorityType[]) => {
  let newList: MusclePriorityType[] = [];

  for (let i = 0; i < items.length; i++) {
    const getMuscleObj = workouts.filter(
      (each) => each.name === items[i].muscle
    );

    const { name, MEV, MRV, featureMatrix } = getMuscleObj[0];
    let rank = i < 4 ? 0 : i >= 4 && i < 9 ? 1 : 2;
    const sets = featureMatrix[rank];

    if (UPPER_MUSCLES.includes(name)) {
      newList.push({
        id: items[i].id,
        rank: i + 1,
        muscle: items[i].muscle,
        sets: sets,
      });
    } else {
      newList.push({
        id: items[i].id,
        rank: i + 1,
        muscle: items[i].muscle,
        sets: sets,
      });
    }
  }

  return newList;
};

export default function PrioritizeFocus({
  split,
  totalWorkouts,
  workoutSplit,
  musclePriority,
  setMusclePriority,
  setWorkoutSplit,
  setSplitTest,
}: PrioritizeFocusProps) {
  const [newList, setNewList] = useState<MusclePriorityType[]>([]);

  useEffect(() => {
    const getNewList = updateNewList(musclePriority);
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
      const newerList = updateNewList(items);
      console.log(items, split, "OK LETS SEE WHAT ITS DOING");
      setMusclePriority(newerList);

      const testSplit = featureTest(items, totalWorkouts);
      setSplitTest(testSplit);
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
    // const newList = [...MUSCLE_PRIORITY_LIST];

    for (let i = 0; i < newList.length; i++) {
      if (UPPER_MUSCLES.includes(newList[i].muscle)) {
        let sessions = divideSetsAmongDays(split[0], newList[i].sets[split[0]]);

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
        let sessions = divideSetsAmongDays(split[1], newList[i].sets[split[1]]);

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

    const testSplit = featureTest(newList, totalWorkouts);
    if (testSplit) {
      console.log(testSplit, "ok what this look like???");
      setSplitTest(testSplit);
    }

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
                          sets={each.sets[0]}
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

      <div className="flex w-full items-center justify-center">
        <button
          className="mt-2 flex h-6 w-full items-center justify-center rounded-md border-slate-500 bg-slate-700"
          onClick={() => onClickHandler()}
        >
          <p className="m-2 text-sm text-white">Set Priority</p>
        </button>
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
  const bgColor =
    index < MRV_RANK
      ? "bg-red-500"
      : index >= MRV_RANK && index < MEV_RANK
      ? "bg-orange-400"
      : "bg-green-400";
  return (
    <li
      className={
        "mt-1 flex justify-between rounded border-2 border-slate-700 p-1 text-xs text-white " +
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
