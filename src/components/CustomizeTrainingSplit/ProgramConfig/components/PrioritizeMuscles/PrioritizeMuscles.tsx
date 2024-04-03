import { DragDropContext, Draggable } from "react-beautiful-dnd";
import Settings from "~/components/CustomizeTrainingSplit/ProgramConfig/components/PrioritizeMuscles/Settings";
import { CardS as Card } from "~/components/Layout/Sections";
import { VOLUME_BG_COLORS } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
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

export function PrioritizeMuscles() {
  const { muscle_priority_list, onPriorityListDragEnd } =
    useProgramConfigContext();

  const colors = VOLUME_BG_COLORS;
  const onSelectHandler = () => {};
  return (
    <Card title="PRIORITIZE MUSCLES">
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
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div
                          className={`flex ${
                            colors[each.volume_landmark]
                          } rounded-sm text-xxs text-white`}
                        >
                          <Cell value={index + 1} className="w-5" />
                          <Cell
                            value={getMuscleTitleForUI(each.muscle)}
                            className="w-20 justify-start indent-1"
                          />
                          {/* <VolumeLandmark
                            landmark={each.volume.landmark}
                            onSelectHandler={onSelectHandler}
                          /> */}
                          <Select
                            volume_landmark={each.volume.landmark}
                            options={["MRV", "MEV", "MV"]}
                            onSelect={onSelectHandler}
                            bgColor={colors[each.volume.landmark]}
                          />
                          {/* <Cell value={each.volume.landmark} className="w-10" /> */}
                        </div>
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
