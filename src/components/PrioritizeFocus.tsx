import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProps,
} from "react-beautiful-dnd";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { MusclePriorityType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";

type PrioritizeFocusProps = {
  musclePriority: MusclePriorityType[];
  updateMusclePriority: (items: MusclePriorityType[]) => void;
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
  musclePriority,
  updateMusclePriority,
}: PrioritizeFocusProps) {
  const [list, setList] = useState<MusclePriorityType[]>([...musclePriority]);

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;
      const items = [...list];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);
      setList(items);
    },
    [list]
  );

  const updateListHandler = () => {
    updateMusclePriority(list);
  };

  const resetListHandler = () => {
    setList([...musclePriority]);
  };

  return (
    <div className="flex h-full w-full flex-col justify-between p-2">
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="droppable">
          {(provided, snapshot) => (
            <ul
              id="droppable"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {list.map((each, index) => {
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
                        <MuscleItem
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

      <div className="flex justify-between">
        <Button value="Reset" onClick={resetListHandler} />
        <Button value="Set" onClick={updateListHandler} />
      </div>
    </div>
  );
}

const MuscleItem = ({
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
        "mt-1 flex h-5 items-center justify-between rounded border-2 border-slate-700 p-1 text-white " +
        bgColor
      }
    >
      <div className="text-xs">{index + 1}</div>
      <div className="text-xs font-bold">{muscle}</div>
      <div className="text-xs font-bold">{sets}</div>
    </li>
  );
};

const Button = ({ value, onClick }: { value: string; onClick: () => void }) => {
  const classes =
    value === "Reset"
      ? "w-1/3 bg-slate-200 text-slate-500 mr-1"
      : "w-2/3 bg-slate-500 text-white";

  return (
    <button
      onClick={onClick}
      className={
        classes + " rounded border-2 border-slate-500 p-1 text-xs font-bold"
      }
    >
      {value}
    </button>
  );
};
