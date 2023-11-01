import { useCallback, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import {
  MusclePriorityType,
  VOLUME_BG_COLORS,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import StrictModeDroppable from "~/utils/react-beautiful-dnd/StrictModeDroppable";

type PrioritizeFocusProps = {
  musclePriority: MusclePriorityType[];
  updateMusclePriority: (items: MusclePriorityType[]) => void;
};

export default function PrioritizeFocus({
  musclePriority,
  updateMusclePriority,
}: PrioritizeFocusProps) {
  const [list, setList] = useState<MusclePriorityType[]>([...musclePriority]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
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
                          index={index}
                          volume_landmark={each.volume_landmark}
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
  index,
  volume_landmark,
}: {
  muscle: string;
  index: number;
  volume_landmark: "MRV" | "MEV" | "MV";
}) => {
  const bgColor = VOLUME_BG_COLORS[volume_landmark];
  return (
    <li
      className={
        bgColor +
        " mt-1 flex h-5 items-center border-2 border-slate-700 p-1 text-white "
      }
    >
      <div className=" text-xxs flex w-1/12 justify-center">{index + 1}</div>
      <div className=" flex indent-1 text-xs font-bold">{muscle}</div>
      {/* <div className=" flex w-1/12 justify-center text-xs ">
        {mesoFrequency[0]}
      </div>
      <div className=" flex w-1/12 justify-center text-xs ">
        {mesoFrequency[1]}
      </div>
      <div className=" flex w-1/12 justify-center text-xs ">
        {mesoFrequency[2]}
      </div> */}
    </li>
  );
};

const Button = ({ value, onClick }: { value: string; onClick: () => void }) => {
  const classes =
    value === "Reset"
      ? "w-1/3 bg-slate-500 text-slate-700 mr-1"
      : "w-2/3 bg-slate-800 text-white";

  return (
    <button onClick={onClick} className={classes + " p-1 text-xs font-bold"}>
      {value}
    </button>
  );
};
