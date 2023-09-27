import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProps,
} from "react-beautiful-dnd";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { MusclePriorityType } from "~/pages";

type PrioritizeFocusProps = {
  // totalWorkouts: number;
  musclePriority: MusclePriorityType[];
  updateMusclePriority: (items: MusclePriorityType[]) => void;
  // setMusclePriority: Dispatch<SetStateAction<MusclePriorityType[]>>;
  // setWorkoutSplit: Dispatch<SetStateAction<SessionType[]>>;
  // split: SessionDayType[];
  // setSplit: Dispatch<SetStateAction<SessionDayType[]>>;
  // totalSessions: [number, number];
};

function StrictModeDroppable({ children, ...props }: DroppableProps) {
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
}

export default function PrioritizeFocus({
  // totalWorkouts,
  musclePriority,
  updateMusclePriority,
}: // setMusclePriority,
// setWorkoutSplit,
// split,
// setSplit,
// totalSessions,
PrioritizeFocusProps) {
  // const { newList } = usePrioritizeMuscles(
  //   musclePriority,
  //   totalWorkouts,
  //   setWorkoutSplit,
  //   split,
  //   setSplit,
  //   totalSessions
  // );
  const [copyList, setCopyList] = useState<MusclePriorityType[]>([]);
  const [updateList, setUpdateList] = useState<boolean>(false);

  useEffect(() => {
    if (!copyList.length) {
      setCopyList([...musclePriority]);
    }
  }, [musclePriority]);

  useEffect(() => {
    if (updateList && copyList.length) {
      updateMusclePriority(copyList);
      setUpdateList(false);
    }
  }, [updateList, copyList]);

  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    const items = [...copyList];
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    // updateMusclePriority(items);
    setCopyList(items);
    setUpdateList(true);
  }, []);

  // const onDragEnd = useCallback(
  //   (result: any) => {
  //     if (!result.destination) return;
  //     const items = [...newList];
  //     const [removed] = items.splice(result.source.index, 1);
  //     items.splice(result.destination.index, 0, removed);

  //     setMusclePriority(items);
  //   },
  //   [newList, totalWorkouts]
  // );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="droppable">
        {(provided, snapshot) => (
          <ul
            id="droppable"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {copyList.map((each, index) => {
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
