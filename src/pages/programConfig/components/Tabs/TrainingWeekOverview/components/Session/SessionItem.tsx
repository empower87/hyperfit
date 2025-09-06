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
import { ExerciseItem } from "../Exercise/Exercise";
import SessionDurationVariables from "../Settings/SessionDuration/SessionDurationVariables";
import { useSessionDurationVariablesContext } from "../Settings/SessionDuration/sessionDurationVariablesContext";

type SortableSessionItemContainerProps = {
  containerId: string;
  container: DraggableSessionType;
  filteredIds: string[];
};

// NOTE: 4/5/25.
// Potential button to sort exercises by equipment requirements.

export const SortableSessionItemContainer = ({
  containerId,
  container,
  filteredIds,
}: SortableSessionItemContainerProps) => {
  return (
    <SortableContext
      id={containerId}
      items={container.exercises.map((item) => item.id)}
      strategy={verticalListSortingStrategy}
    >
      <SessionItem
        split={container.split}
        exercises={container.exercises}
        totals={<TotalsCard sessionExercises={container.exercises} />}
      >
        <ul className="space-y-2">
          {/* <li className="flex text-xs text-primary-800">warmup: 5:00</li> */}
          {container.exercises.map((item, index) => (
            <ExerciseItem
              key={item.id}
              index={index + 1}
              exercise={item}
              filteredIds={filteredIds}
            />
          ))}
        </ul>
      </SessionItem>
    </SortableContext>
  );
};

type DroppableSessionItemProps = {
  split: SessionSplitType;
  exercises: ExerciseType[];
  children: ReactNode;
  totals: ReactNode;
};

const SessionItem = ({
  split,
  exercises,
  children,
  totals,
}: DroppableSessionItemProps) => {
  const { sessionDurationCalculator, durationTimeConstants } =
    useSessionDurationVariablesContext();
  const { selectedMicrocycle, selectedMesocycle } = useToggleCyclesContext();
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);

  const totalDuration = sessionDurationCalculator(
    exercises,
    selectedMicrocycle,
    selectedMesocycle
  );

  const onCloseDurationModal = () => setIsDurationModalOpen(false);

  return (
    <li className={``}>
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

          {totals}
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

type TotalsCardProps = {
  sessionExercises: ExerciseType[];
};
const TotalsCard = ({ sessionExercises }: TotalsCardProps) => {
  const { selectedMesocycle, selectedMicrocycle } = useToggleCyclesContext();
  const { sessionDurationCalculator } = useSessionDurationVariablesContext();

  const sets = sessionExercises.reduce(
    (acc, exercise) =>
      acc +
      (exercise.setProgression
        ? exercise.setProgression[selectedMesocycle][selectedMicrocycle]
        : 0),
    0
  );

  const reps = sessionExercises.reduce(
    (acc, exercise) => acc + exercise.reps,
    0
  );
  const totalDuration = sessionDurationCalculator(
    sessionExercises,
    selectedMicrocycle,
    selectedMesocycle
  );
  return (
    <>
      <div className="col-start-2  text-white">{sets}</div>
      <div className=" text-white">{reps}</div>
      <div className=" text-white">{totalDuration}min</div>
    </>
  );
};
