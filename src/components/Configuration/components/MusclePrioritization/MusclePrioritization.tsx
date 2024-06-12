import { ReactNode } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { DragHandleIcon } from "~/assets/icons/_icons";
import { CardS as Card } from "~/components/Layout/Sections";
import type { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getRankColor } from "~/utils/getIndicatorColors";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
import { useProgramConfigContext } from "../../hooks/useProgramConfig";
import Settings from "./Settings";
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
  children: ReactNode;
};
function Item({ muscle, index, children }: ItemProps) {
  const colors = getRankColor(muscle.volume.landmark);

  return (
    <div
      className={`flex ${colors.bg} justify-between rounded-sm text-xs text-white`}
    >
      <div className={`flex`}>
        {children}

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

export default function MusclePrioritization() {
  const { muscle_priority_list, onPriorityListDragEnd } =
    useProgramConfigContext();

  return (
    <Card title="PRIORITIZE MUSCLES" className={`w-full`}>
      <div className={`pb-2`}>
        <Settings>
          <Settings.Section title="Breakpoints">
            <Settings.Breakpoints />
          </Settings.Section>

          <Settings.Section title="Toggles">
            <Settings.Toggles />
          </Settings.Section>
        </Settings>
      </div>

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
                        <Item muscle={each} index={index}>
                          <div
                            {...provided.dragHandleProps}
                            className={`flex w-4 items-center justify-center`}
                          >
                            <DragHandleIcon fill="white" />
                          </div>
                        </Item>
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
    </Card>
  );
}
