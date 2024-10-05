import { ReactNode } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { DragHandleIcon } from "~/assets/icons/_icons";
import type { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getRankColor } from "~/utils/getIndicatorColors";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
import { useProgramConfigContext } from "../../hooks/useProgramConfig";
import { Select } from "./VolumeLandmark";

function Cell({
  value,
  className,
}: {
  value: string | number;
  className: string;
}) {
  return (
    <div className={cn(`flex items-center justify-center p-0.5`, className)}>
      {value}
    </div>
  );
}

type ItemProps = {
  muscle: MusclePriorityType;
  index: number;
  handle: ReactNode;
};
function Item({ muscle, index, handle }: ItemProps) {
  const colors = getRankColor(muscle.volume.landmark);

  return (
    <div
      className={`flex ${colors.bg} w-56 cursor-pointer justify-between rounded-sm text-xs text-white hover:scale-x-105 hover:scale-y-110`}
    >
      <div className={`flex`}>
        {handle}

        <Cell value={index + 1} className="w-4" />
        <Cell
          value={getMuscleTitleForUI(muscle.muscle)}
          className="w-20 justify-start"
        />

        <Cell
          value={`${muscle.frequency.range[0]} - ${muscle.frequency.range[1]}`}
          className=""
        />
        <Cell
          value={`${muscle.frequency.target}`}
          className="mx-1 font-bold text-slate-700"
        />
        <Cell
          value={`${muscle.frequency.progression}`}
          className="mx-1 font-bold text-slate-700"
        />
      </div>

      <div className={`flex items-center justify-center pr-2`}>
        <Select
          id={muscle.id}
          volume_landmark={muscle.volume.landmark}
          options={["MRV", "MEV", "MV"]}
          bgColor={colors.bg}
        />
      </div>
    </div>
  );
}
// function Item({ muscle, index, handle }: ItemProps) {
//   const colors = getRankColor(muscle.volume.landmark);

//   return (
//     <div
//       className={`flex ${colors.bg} cursor-pointer justify-between rounded-sm text-xs text-white hover:scale-x-105 hover:scale-y-110`}
//     >
//       <div className={`flex`}>
//         {handle}

//         <Cell value={index + 1} className="w-4" />
//         <Cell
//           value={getMuscleTitleForUI(muscle.muscle)}
//           className="w-20 justify-start"
//         />

//         <Cell
//           value={`${muscle.frequency.range[0]} - ${muscle.frequency.range[1]}`}
//           className=""
//         />
//         <Cell
//           value={`${muscle.frequency.target}`}
//           className="mx-1 font-bold text-slate-700"
//         />
//         <Cell
//           value={`${muscle.frequency.progression}`}
//           className="mx-1 font-bold text-slate-700"
//         />
//       </div>

//       <div className={`flex items-center justify-center pr-2`}>
//         <Select
//           id={muscle.id}
//           volume_landmark={muscle.volume.landmark}
//           options={["MRV", "MEV", "MV"]}
//           bgColor={colors.bg}
//         />
//       </div>
//     </div>
//   );
// }

export default function MusclePrioritization() {
  const { muscle_priority_list, onPriorityListDragEnd } =
    useProgramConfigContext();

  return (
    <DragDropContext onDragEnd={onPriorityListDragEnd}>
      <StrictModeDroppable droppableId="droppable">
        {(provided, snapshot) => (
          <ul
            id="droppable"
            className=" flex w-full flex-col space-y-0.5"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {muscle_priority_list.map((each, index) => {
              return (
                <Draggable
                  key={`${each.id}_draggable`}
                  draggableId={each.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <Item
                        muscle={each}
                        index={index}
                        handle={
                          <div
                            {...provided.dragHandleProps}
                            className={`flex w-4 items-center justify-center`}
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
          </ul>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}

// export default function MusclePrioritization() {
//   const { muscle_priority_list, onPriorityListDragEnd } =
//     useProgramConfigContext();

//   return (
//     <Card title="PRIORITIZE MUSCLES" className={`w-full`}>
//       <div className={`pb-2`}>
//         <Settings>
//           <Settings.Section title="Breakpoints">
//             <Settings.Breakpoints />
//           </Settings.Section>

//           <Settings.Section title="Toggles">
//             <Settings.Toggles />
//           </Settings.Section>
//         </Settings>
//       </div>

//     <DragDropContext onDragEnd={onPriorityListDragEnd}>
//       <StrictModeDroppable droppableId="droppable">
//         {(provided, snapshot) => (
//           <ul
//             id="droppable"
//             className=" flex w-full flex-col space-y-0.5"
//             {...provided.droppableProps}
//             ref={provided.innerRef}
//           >
//             {muscle_priority_list.map((each, index) => {
//               return (
//                 <Draggable
//                   key={`${each.id}_draggable`}
//                   draggableId={each.id}
//                   index={index}
//                 >
//                   {(provided, snapshot) => (
//                     <div ref={provided.innerRef} {...provided.draggableProps}>
//                       <Item muscle={each} index={index}>
//                         <div
//                           {...provided.dragHandleProps}
//                           className={`flex w-4 items-center justify-center`}
//                         >
//                           <DragHandleIcon fill="white" />
//                         </div>
//                       </Item>
//                     </div>
//                   )}
//                 </Draggable>
//               );
//             })}
//             {provided.placeholder}
//           </ul>
//         )}
//       </StrictModeDroppable>
//     </DragDropContext>
//     </Card>
//   );
// }
