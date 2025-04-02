import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode, useState } from "react";
import Modal from "~/components/Modals/Modal";
import { Card } from "~/components/ui/card";
import {
  ExerciseType,
  SessionSplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { useToggleCyclesContext } from "~/pages/programConfig/components/MesocycleToggle/hooks/useMesocycleToggle";
import { getSplitColor } from "~/utils/getIndicatorColors";
import { DraggableSessionType } from "../../hooks/useExerciseSelection";
import { ExerciseItem, SortableExerciseItem } from "../Exercise/Exercise";
import SessionDurationVariables from "../Settings/SessionDuration/SessionDurationVariables";
import { useSessionDurationVariablesContext } from "../Settings/SessionDuration/sessionDurationVariablesContext";

type DroppableSessionItemProps = {
  split: SessionSplitType;
  exercises: ExerciseType[];
  children: ReactNode;
};

const SessionItem = ({
  split,
  exercises,
  children,
}: DroppableSessionItemProps) => {
  const { sessionDurationCalculator, durationTimeConstants } =
    useSessionDurationVariablesContext();
  const { selectedMicrocycle } = useToggleCyclesContext();
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);

  const totalDuration = sessionDurationCalculator(
    exercises,
    selectedMicrocycle
  );

  const onCloseDurationModal = () => setIsDurationModalOpen(false);

  return (
    <li className={`overflow`}>
      <div className={"flex flex-col"}>
        <div
          className={cn(
            `flex items-center rounded-sm p-2 pl-0 indent-1 text-sm font-semibold ${
              getSplitColor(split).text
            }`
          )}
        >
          {split.charAt(0).toUpperCase() + split.slice(1)}
        </div>
      </div>

      {children}

      <div className={`m-1 flex justify-between p-1`}>
        <div className="grid grid-cols-4 grid-rows-2 text-xs">
          <div>Totals</div>
          <div className=" text-muted-foreground">Sets</div>
          <div className=" text-muted-foreground">Reps</div>
          <div className=" text-muted-foreground">Duration</div>

          <div className="col-start-2  text-white">10</div>
          <div className=" text-white">100</div>
          <div className=" text-white">{totalDuration}min</div>
        </div>

        {isDurationModalOpen ? (
          <Modal isOpen={isDurationModalOpen} onClose={onCloseDurationModal}>
            <div className="mb-2 flex justify-center space-x-2 text-xxs text-white">
              <Card title="SETTINGS">
                <SessionDurationVariables />
              </Card>
            </div>
          </Modal>
        ) : null}
      </div>
    </li>
  );
};

type SortableSessionItemContainerProps = {
  containerId: string;
  container: DraggableSessionType;
};

export const SortableSessionItemContainer = ({
  containerId,
  container,
}: SortableSessionItemContainerProps) => {
  return (
    <SortableContext
      id={containerId}
      items={container.exercises.map((item) => item.id)}
      strategy={verticalListSortingStrategy}
    >
      <SessionItem split={container.split} exercises={container.exercises}>
        <ul className="space-y-2">
          {/* <li className="flex text-xs text-primary-800">warmup: 5:00</li> */}
          {container.exercises.map((item, index) => (
            <>
              <SortableExerciseItem key={item.id} id={item.id}>
                <ExerciseItem
                  index={index + 1}
                  exerciseName={item.name}
                  muscle={item.muscle}
                  volumeLandmark={item.rank}
                  sets={item.sets}
                  reps={item.reps}
                  lbs={item.weight}
                />
              </SortableExerciseItem>
              {/* <div className="flex text-xs text-primary-800">
                rest between exercises: 2:00
              </div> */}
            </>
          ))}
        </ul>
      </SessionItem>
    </SortableContext>
  );
};
