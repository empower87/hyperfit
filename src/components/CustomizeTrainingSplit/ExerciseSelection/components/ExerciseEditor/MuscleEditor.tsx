import { ReactNode, useEffect, useState } from "react";
import { SectionH2 } from "~/components/Layout/Sections";
import Modal from "~/components/Modals/Modal";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M4,
  BORDER_COLOR_M6,
} from "~/constants/themes";
import {
  ExerciseType,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
import { getRankColor } from "~/utils/getRankColor";
import { ChangeExerciseProvider } from "../ChangeExerciseModal/ChangeExerciseContext";
import SelectExercise from "../ChangeExerciseModal/ChangeExerciseModal";
import BottomBar from "./components/BottomBar";
import HeaderScrollNav from "./components/HeaderScrollNav";
import {
  MuscleEditorProvider,
  useMuscleEditorContext,
} from "./context/MuscleEditorContext";

export default function MuscleEditor() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const [list, setList] = useState<MusclePriorityType[]>([]);

  useEffect(() => {
    setList([...prioritized_muscle_list]);
  }, [prioritized_muscle_list]);

  return (
    <SectionH2 title="MUSCLE EDITOR">
      <HeaderScrollNav />
      <div className={`space-y-2`}>
        {list.map((each, index) => {
          return (
            <MuscleEditorProvider muscle={each}>
              <Muscle muscle={each} rank={index + 1} />
            </MuscleEditorProvider>
          );
        })}
      </div>
    </SectionH2>
  );
}

type MuscleProps = {
  muscle: MusclePriorityType;
  rank: number;
};
function Muscle({ muscle, rank }: MuscleProps) {
  const {
    selectedMesocycleIndex,
    frequencyProgression,
    onSelectMesocycle,
    totalVolume,
    mesocyclesArray,
  } = useMuscleEditorContext();
  const bgColor = getRankColor(muscle.volume.landmark);
  const title = getMuscleTitleForUI(muscle.muscle);

  return (
    <div id={muscle.id} className={`flex flex-col ${BG_COLOR_M6} rounded`}>
      <div className={`flex`}>
        <div className={`${bgColor.bg} flex w-1/3 p-1 text-sm text-white`}>
          <div className={`flex w-3 items-center justify-center text-xxs`}>
            {rank}
          </div>
          <div className={`flex w-full items-center indent-1`}>{title}</div>
        </div>

        <div className={`flex space-x-1 p-1 text-sm text-white`}>
          {mesocyclesArray?.map((each, index) => {
            return (
              <div
                className={cn(`cursor-pointer rounded p-0.5 text-xs`, {
                  [`${BG_COLOR_M5}`]: selectedMesocycleIndex === index,
                })}
                onClick={() => onSelectMesocycle(index)}
              >
                Mesocycle {each + 1}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`p-2`}>
        <Exercises muscle={muscle} />
      </div>

      <BottomBar>
        <BottomBar.Section title="Frequency">
          <div className={`flex justify-center space-x-1 p-0.5`}>
            {frequencyProgression.map((each, index) => {
              return (
                <div
                  className={cn(`p-0.5 text-xxs text-white`, {
                    ["border"]: selectedMesocycleIndex === index,
                  })}
                >
                  {each}
                </div>
              );
            })}
          </div>
        </BottomBar.Section>
        <BottomBar.Section title="Total Volume">
          <div>{totalVolume}</div>
        </BottomBar.Section>
      </BottomBar>
    </div>
  );
}

// TODO: create a blank session card to add a day to list and select exercises to fill it.
//       However if the selected mesocycle is less than the last mesocycle, this button
//       should automatically add the last mesocycles session.

type ExercisesProps = {
  muscle: MusclePriorityType;
};
function Exercises({ muscle }: ExercisesProps) {
  const { selectedMesocycleIndex } = useMuscleEditorContext();

  const totalExercisesByMeso =
    muscle.volume.setProgressionMatrix[selectedMesocycleIndex][0]?.length;
  const exercises = muscle.exercises;
  const exercisesByMeso = exercises.slice(0, totalExercisesByMeso);

  const totalSessions = exercisesByMeso.length;
  const remaining = totalSessions < 5 ? 5 - totalSessions : 0;
  const addButtonDivs = Array.from(Array(remaining), (e, i) => i);

  return (
    <div className={`flex space-x-1 overflow-x-auto`}>
      {exercisesByMeso.map((each, index) => {
        return (
          <div className={`flex flex-col `}>
            <ListHeader />
            <ul className={`space-y-1 p-1 ${BG_COLOR_M7}`}>
              <SessionItem exercises={each} dayIndex={index + 1} />
            </ul>
          </div>
        );
      })}
      {addButtonDivs.map(() => {
        return <AddDayItem onClick={() => {}} />;
      })}
    </div>
  );
}

type SessionItemProps = {
  exercises: ExerciseType[];
  dayIndex: number;
};
function SessionItem({ exercises, dayIndex }: SessionItemProps) {
  return (
    <div className={`flex flex-col rounded ${BG_COLOR_M6}`}>
      <div className={`w-10 p-0.5 text-xs text-white `}>Day {dayIndex}</div>
      <div className={`flex flex-col space-y-1 p-1`}>
        {exercises.map((each, index) => {
          return (
            <ExerciseItem
              exercise={each}
              index={index + 1}
              dayIndex={dayIndex}
            />
          );
        })}
        <AddExerciseItem onClick={() => {}} />
      </div>
    </div>
  );
}

function ListHeader() {
  const { training_program_params } = useTrainingProgramContext();
  const { microcycles } = training_program_params;
  const microcyclesArray = Array.from(Array(microcycles), (e, i) => i);
  return (
    <div
      className={`flex p-0.5 text-xs text-slate-300 ${BG_COLOR_M7} border-b ${BORDER_COLOR_M6}`}
    >
      <div className={`w-10`}>Days</div>

      <div className={`flex w-32 justify-between`}>
        <div>Exercise</div>
        <div>Weeks</div>
      </div>

      <div className={`flex`}>
        {microcyclesArray.map((each) => {
          return (
            <div className={`flex w-3 items-center justify-center`}>
              {each + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddDayItem({ onClick }: AddItemProps) {
  return (
    <div
      className={` flex w-56 items-center justify-center p-2 ${BG_COLOR_M7}`}
    >
      <Button operation="+" onClick={onClick} />
    </div>
  );
}
type AddItemProps = {
  onClick: () => void;
};
function AddExerciseItem({ onClick }: AddItemProps) {
  return (
    <li
      className={`flex cursor-pointer p-0.5 text-xxs ${BG_COLOR_M6} border indent-1 text-slate-300`}
    >
      <div className={`ml-0.5 flex items-center justify-center`}>
        <Button operation="+" onClick={onClick} />
      </div>
      Add Exercise
    </li>
  );
}
type ExerciseItemProps = {
  exercise: ExerciseType;
  index: number;
  dayIndex: number;
};
function ExerciseItem({ exercise, index, dayIndex }: ExerciseItemProps) {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const { selectedMesocycleIndex, setProgressionMatrix, onOperationHandler } =
    useMuscleEditorContext();

  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const muscleIndex = prioritized_muscle_list.findIndex(
    (each) => each.muscle === exercise.muscle
  );
  return (
    <li
      className={`flex cursor-pointer p-0.5 text-xxs text-white ${BG_COLOR_M5}`}
    >
      <div className={`flex w-3 items-center justify-center`}>{index}</div>
      <div
        onClick={onOpen}
        className={`flex w-32 items-center truncate indent-1`}
      >
        {exercise.exercise}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ChangeExerciseProvider
          muscle={prioritized_muscle_list[muscleIndex]}
          exerciseId={exercise.id}
        >
          <SelectExercise />
        </ChangeExerciseProvider>
      </Modal>

      <div className={`flex`}>
        {setProgressionMatrix[selectedMesocycleIndex]?.map((each, i) => {
          const session = each[dayIndex - 1];
          let sets = 0;
          if (session) {
            sets = session[index - 1];
          }
          if (i === 0)
            return (
              <WeekOneSets>
                <WeekOneSets.Button
                  operation="-"
                  onClick={() => onOperationHandler("-", dayIndex, index)}
                />
                <div
                  className={`flex w-3 items-center justify-center text-xxs text-white`}
                >
                  {sets}
                </div>
                <WeekOneSets.Button
                  operation="+"
                  onClick={() => onOperationHandler("+", dayIndex, index)}
                />
              </WeekOneSets>
            );
          return <div className={`flex w-3 justify-center`}>{sets}</div>;
        })}
      </div>
    </li>
  );
}

type ButtonProps = {
  operation: "+" | "-";
  onClick: () => void;
};
function Button({ operation, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-3 border ${BORDER_COLOR_M4} ${BG_COLOR_M6} h-3 items-center justify-center text-xxs text-white`}
    >
      {operation}
    </button>
  );
}
WeekOneSets.Button = Button;
function WeekOneSets({ children }: { children: ReactNode }) {
  return <div className={`mr-1 flex w-9 items-center`}>{children}</div>;
}
