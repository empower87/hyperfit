import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { DragHandleIcon } from "~/assets/icons/_icons";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { useProgramSettingsContext } from "../../hooks/useProgramSettings";

type ItemProps = {
  muscle: MusclePriorityType;
  index: number;
  handle: ReactNode;
  isCollapsed: boolean;
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

function Item({ muscle, index, handle, isCollapsed }: ItemProps) {
  const colors = getRankColor(muscle.volume.landmark);
  const title = getMuscleTitleForUI(muscle.muscle);

  const handleSelectChange = () => {};

  const progression = muscle.frequency.progression;

  if (isCollapsed) return <CollapsedItem bgColor={colors.bg} text={title} />;
  return (
    <div className="m-2 flex h-8">
      {/* <div className="flex w-4 items-center text-xs font-semibold text-primary-300">
        {index + 1}
      </div> */}
      <div
        className={`flex w-full cursor-pointer overflow-hidden rounded-md border border-input bg-background/50 text-sm text-white hover:scale-x-105 hover:scale-y-110`}
      >
        <div
          className={`flex w-6 items-center justify-center text-xs ${colors.bg}`}
        >
          {handle}
        </div>

        <div className={`flex`}>
          <div className="flex w-24 items-center justify-start p-1 px-2 text-xs">
            {index + 1} {title}
          </div>
        </div>

        <div className={`flex items-center justify-center pl-3`}>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="h-6 w-[55px] border-none px-1 text-xs">
              <SelectValue placeholder={muscle.volume.landmark} />
            </SelectTrigger>

            <SelectContent>
              {["MRV", "MEV", "MV"].map((split, index) => {
                return (
                  <SelectItem
                    key={`${split}_${index}_SelectItemMusclePrioritization`}
                    value={split}
                  >
                    {split}
                  </SelectItem>
                );
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
export const MusclePrioritizationList = ({
  isCollapsed,
  onMuscleClick,
}: MusclePrioritizationListProps) => {
  const { musclePrioritization, onPriorityListDragEnd } =
    useProgramSettingsContext();

  return (
    <DragDropContext onDragEnd={onPriorityListDragEnd}>
      <StrictModeDroppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            id="droppable"
            className="grid h-64 w-full grid-flow-col grid-cols-2 grid-rows-7"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {musclePrioritization.map((muscle, index) => {
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
                        isCollapsed={isCollapsed}
                        handle={
                          <div
                            {...provided.dragHandleProps}
                            className={`${colors.bg} flex h-full w-3 items-center justify-center`}
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
};

export default function MusclePrioritizationCard() {
  const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);

  const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  const onExpandPriorityList = () => setIsPriorityListCollapsed(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between space-x-2 border-b border-primary-500 pb-2 ">
          <CardTitle>1. Priority</CardTitle>
          {isPriorityListCollapsed ? (
            <Button
              className="bg-card"
              variant="outline"
              size="icon"
              onClick={onExpandPriorityList}
            >
              <ChevronRightIcon />
            </Button>
          ) : (
            <Button
              className="bg-card"
              variant="outline"
              size="icon"
              onClick={onCollapsePriorityList}
            >
              <ChevronLeftIcon />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <MusclePrioritizationList isCollapsed={isPriorityListCollapsed} />
      </CardContent>
    </Card>
  );
}

// PREVIOUS SIDE PANEL VERSION 12/13/25
// import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
// import { ReactNode, useState } from "react";
// import { DragDropContext, Draggable } from "react-beautiful-dnd";
// import { DragHandleIcon } from "~/assets/icons/_icons";
// import { Button } from "~/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "~/components/ui/select";
// import type { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
// import { cn } from "~/lib/clsx";
// import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
// import { getRankColor } from "~/utils/getIndicatorColors";
// import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
// import { useProgramSettingsContext } from "../../hooks/useProgramSettings";

// type ItemProps = {
//   muscle: MusclePriorityType;
//   index: number;
//   handle: ReactNode;
//   isCollapsed: boolean;
// };

// type CollapsedItemProps = {
//   bgColor: string;
//   text: string;
// };

// function CollapsedItem({ bgColor, text }: CollapsedItemProps) {
//   const clippedText = text.slice(0, 4);
//   return (
//     <div className={cn(`rounded p-1 text-sm text-white`, bgColor)}>{text}</div>
//   );
// }

// function Item({ muscle, index, handle, isCollapsed }: ItemProps) {
//   const colors = getRankColor(muscle.volume.landmark);
//   const title = getMuscleTitleForUI(muscle.muscle);

//   const handleSelectChange = () => {};

//   const progression = muscle.frequency.progression;

//   if (isCollapsed) return <CollapsedItem bgColor={colors.bg} text={title} />;
//   return (
//     <div className="flex">
//       {/* <div className="flex w-4 items-center text-xs font-semibold text-primary-300">
//         {index + 1}
//       </div> */}
//       <div
//         className={`flex w-full cursor-pointer overflow-hidden rounded-md border border-input bg-background/50 text-sm text-white hover:scale-x-105 hover:scale-y-110`}
//       >
//         <div
//           className={`flex w-6 items-center justify-center border-r border-primary-500 text-xs ${colors.bg}`}
//         >
//           {/* {handle} */}
//           {index + 1}
//         </div>

//         <div className={`flex`}>
//           <div className="flex w-24 items-center justify-start p-1 px-2 text-xs">
//             {title}
//           </div>

//           {/* <div className="flex items-center justify-center">
//             {progression.map((prog, index) => {
//               const isLastMeso = progression.length - 1 === index;
//               return (
//                 <div
//                   className={cn(
//                     `flex items-center justify-center p-1 text-xs text-muted-foreground`,
//                     { ["font-semibold text-white"]: isLastMeso }
//                   )}
//                 >
//                   {prog}
//                 </div>
//               );
//             })}
//           </div> */}

//           {/* <div className="flex items-center justify-center truncate p-1 px-2 font-bold text-primary-700">
//             {`${muscle.frequency.range[0]} - ${muscle.frequency.range[1]}`}
//           </div>

//           <div className="flex items-center justify-center font-bold text-primary-700">
//             {muscle.frequency.progression}
//           </div> */}
//         </div>

//         <div className={`flex items-center justify-center pl-3`}>
//           <Select onValueChange={handleSelectChange}>
//             <SelectTrigger className="h-6 w-[55px] border-none px-1 text-xs">
//               <SelectValue placeholder={muscle.volume.landmark} />
//             </SelectTrigger>

//             <SelectContent>
//               {["MRV", "MEV", "MV"].map((split, index) => {
//                 return (
//                   <SelectItem
//                     key={`${split}_${index}_SelectItemMusclePrioritization`}
//                     value={split}
//                   >
//                     {split}
//                   </SelectItem>
//                 );
//               })}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </div>
//   );
// }

// type MusclePrioritizationListProps = {
//   isCollapsed: boolean;
//   onMuscleClick?: (id: MusclePriorityType["id"]) => void;
// };
// export const MusclePrioritizationList = ({
//   isCollapsed,
//   onMuscleClick,
// }: MusclePrioritizationListProps) => {
//   const { musclePrioritization, onPriorityListDragEnd } =
//     useProgramSettingsContext();

//   return (
//     <DragDropContext onDragEnd={onPriorityListDragEnd}>
//       <StrictModeDroppable droppableId="droppable">
//         {(provided, snapshot) => (
//           <div
//             id="droppable"
//             className=" flex w-full flex-col space-y-1"
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//           >
//             {musclePrioritization.map((muscle, index) => {
//               const colors = getRankColor(muscle.volume.landmark);
//               return (
//                 <Draggable
//                   key={`${muscle.id}_draggable`}
//                   draggableId={muscle.id}
//                   index={index}
//                 >
//                   {(provided, snapshot) => (
//                     <div ref={provided.innerRef} {...provided.draggableProps}>
//                       <Item
//                         muscle={muscle}
//                         index={index}
//                         isCollapsed={isCollapsed}
//                         handle={
//                           <div
//                             {...provided.dragHandleProps}
//                             className={`${colors.bg} flex h-full w-4 items-center justify-center border-r border-input`}
//                           >
//                             <DragHandleIcon fill="white" />
//                           </div>
//                         }
//                       />
//                     </div>
//                   )}
//                 </Draggable>
//               );
//             })}
//             {provided.placeholder}
//           </div>
//         )}
//       </StrictModeDroppable>
//     </DragDropContext>
//   );
// };

// export default function MusclePrioritizationCard() {
//   const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);

//   const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
//   const onExpandPriorityList = () => setIsPriorityListCollapsed(false);

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between space-x-2 border-b border-primary-500 pb-2 ">
//           <CardTitle>1. Priority</CardTitle>
//           {isPriorityListCollapsed ? (
//             <Button
//               className="bg-card"
//               variant="outline"
//               size="icon"
//               onClick={onExpandPriorityList}
//             >
//               <ChevronRightIcon />
//             </Button>
//           ) : (
//             <Button
//               className="bg-card"
//               variant="outline"
//               size="icon"
//               onClick={onCollapsePriorityList}
//             >
//               <ChevronLeftIcon />
//             </Button>
//           )}
//         </div>
//       </CardHeader>

//       <CardContent>
//         {/* <MusclePrioritizationList isCollapsed={isPriorityListCollapsed} /> */}
//       </CardContent>
//     </Card>
//   );
// }
