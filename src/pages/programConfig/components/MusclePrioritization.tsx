import { ReactNode, useCallback } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { DragHandleIcon } from "~/assets/icons/_icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getRankColor } from "~/utils/getIndicatorColors";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
import { useProgramConfigContext } from "../hooks/useProgramConfig";

type ItemProps = {
  muscle: MusclePriorityType;
  index: number;
  handle: ReactNode;
  isCollapsed: boolean;
  onMuscleClick?: (id: MusclePriorityType["id"]) => void;
};

type CollapsedItemProps = {
  bgColor: string;
  text: string;
};

function CollapsedItem({ bgColor, text }: CollapsedItemProps) {
  const clippedText = text.slice(0, 4);
  return (
    <div className={cn(`rounded p-1 text-sm text-white`, bgColor)}>{text}</div>
  );
}
function Item({
  muscle,
  index,
  handle,
  isCollapsed,
  onMuscleClick,
}: ItemProps) {
  const colors = getRankColor(muscle.volume.landmark);
  const title = getMuscleTitleForUI(muscle.muscle);
  const onClickHandler = useCallback(() => {
    if (onMuscleClick) {
      onMuscleClick(muscle.id);
    }
  }, [onMuscleClick, muscle]);

  const handleSelectChange = () => {};

  const progression = muscle.frequency.progression;
  console.log(muscle, progression, "WTF ");
  if (isCollapsed) return <CollapsedItem bgColor={colors.bg} text={title} />;
  return (
    <div className="flex">
      <div className="flex w-4 items-center text-xs font-semibold text-primary-300">
        {index + 1}
      </div>
      <div
        onClick={onClickHandler}
        className={`flex cursor-pointer justify-between overflow-hidden rounded-md border border-input bg-background/50 text-sm text-white hover:scale-x-105 hover:scale-y-110`}
      >
        <div className="flex">{handle}</div>
        <div className={`flex`}>
          <div className="flex w-24 items-center justify-start p-1 px-2">
            {title}
          </div>

          <div className="flex items-center justify-center">
            {progression.map((prog, index) => {
              const isLastMeso = progression.length - 1 === index;
              return (
                <div
                  className={cn(
                    `flex items-center justify-center p-1 text-xs text-muted-foreground`,
                    { ["font-semibold text-white"]: isLastMeso }
                  )}
                >
                  {prog}
                </div>
              );
            })}
          </div>

          {/* <div className="flex items-center justify-center truncate p-1 px-2 font-bold text-primary-700">
            {`${muscle.frequency.range[0]} - ${muscle.frequency.range[1]}`}
          </div>

          <div className="flex items-center justify-center font-bold text-primary-700">
            {muscle.frequency.progression}
          </div> */}
        </div>

        <div className={`flex items-center justify-center pl-3`}>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="h-6 w-[55px] border-none px-1 text-xs">
              <SelectValue placeholder={muscle.volume.landmark} />
            </SelectTrigger>
            <SelectContent>
              {["MRV", "MEV", "MV"].map((split, index) => {
                return <SelectItem value={split}>{split}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

type MusclePrioritizationListProps = {
  isCollapsed: boolean;
  onMuscleClick?: (id: MusclePriorityType["id"]) => void;
};
export default function MusclePrioritizationList({
  isCollapsed,
  onMuscleClick,
}: MusclePrioritizationListProps) {
  const { muscle_priority_list, onPriorityListDragEnd } =
    useProgramConfigContext();

  return (
    <DragDropContext onDragEnd={onPriorityListDragEnd}>
      <StrictModeDroppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            id="droppable"
            className=" flex w-full flex-col space-y-1.5"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {muscle_priority_list.map((muscle, index) => {
              const colors = getRankColor(muscle.volume.landmark);
              return (
                <Draggable
                  key={`${muscle.id}_draggable`}
                  draggableId={muscle.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Item
                        muscle={muscle}
                        index={index}
                        onMuscleClick={onMuscleClick}
                        isCollapsed={isCollapsed}
                        handle={
                          <div
                            {...provided.dragHandleProps}
                            className={`${colors.bg} flex h-full w-4 items-center justify-center border-r border-input`}
                          >
                            <DragHandleIcon fill="white" />
                          </div>
                        }
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}
