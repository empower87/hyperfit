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
import { featureTest } from "src/utils/distributeSets";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { LOWER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType } from "~/pages";
import { getMuscleData } from "~/utils/getMuscleData";

type PrioritizeFocusProps = {
  totalWorkouts: number;
  musclePriority: MusclePriorityType[];
  setMusclePriority: Dispatch<SetStateAction<MusclePriorityType[]>>;
  setWorkoutSplit: Dispatch<SetStateAction<SessionType[]>>;
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

const updateMuscleListSets = (items: MusclePriorityType[]) => {
  for (let i = 0; i < items.length; i++) {
    const muscleData = getMuscleData(items[i].muscle);
    const { featureMatrix } = muscleData;

    let rank = i < MRV_RANK ? 0 : i >= MRV_RANK && i < MEV_RANK ? 1 : 2;
    const sets = featureMatrix[rank];

    items[i].sets = sets;
  }
  return items;
};

export default function PrioritizeFocus({
  totalWorkouts,
  musclePriority,
  setMusclePriority,
  setWorkoutSplit,
}: PrioritizeFocusProps) {
  const [newList, setNewList] = useState<MusclePriorityType[]>([
    ...musclePriority,
  ]);

  useEffect(() => {
    const getNewList = updateMuscleListSets(musclePriority);
    setNewList(getNewList);
  }, [totalWorkouts, musclePriority]);

  useEffect(() => {
    const testSplit = featureTest(newList, totalWorkouts);
    setWorkoutSplit(testSplit);
  }, [newList, totalWorkouts]);

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;
      const items = [...newList];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      const split = handleUpperLowerSplit(items, totalWorkouts);
      const newerList = updateMuscleListSets(items);
      console.log(items, split, "OK LETS SEE WHAT ITS DOING");
      setMusclePriority(newerList);

      const testSplit = featureTest(items, totalWorkouts);
      setWorkoutSplit(testSplit);
    },
    [newList, totalWorkouts]
  );

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
        {/* --- not sure -- */}
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
