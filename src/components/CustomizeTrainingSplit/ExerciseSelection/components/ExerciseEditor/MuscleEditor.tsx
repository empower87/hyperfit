import { ReactNode, useEffect, useState } from "react";
import { DotsIcon, PlusIcon } from "~/assets/icons/_icons";
import { SectionH2 } from "~/components/Layout/Sections";
import Modal from "~/components/Modals/Modal";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BG_COLOR_M8,
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
    muscleGroup,
    onSelectMesocycle,
    totalVolume,
    mesocyclesArray,
  } = useMuscleEditorContext();
  const bgColor = getRankColor(muscle.volume.landmark);
  const title = getMuscleTitleForUI(muscle.muscle);

  return (
    <div id={muscle.id} className={`flex flex-col ${BG_COLOR_M7} rounded`}>
      <div className={`flex rounded-t ${bgColor.bg} border-b`}>
        <div className={`flex w-1/3 p-1 text-sm text-white`}>
          <div className={`flex w-3 items-center justify-center text-xxs`}>
            {rank}
          </div>
          <div className={`flex w-full items-center indent-1`}>{title}</div>
        </div>

        <div className={`flex space-x-1 pt-1 text-sm text-white`}>
          {mesocyclesArray?.map((each, index) => {
            return (
              <div
                className={cn(`cursor-pointer px-2 py-0.5 text-xs`, {
                  [`bg-white ${bgColor.text} font-bold`]:
                    selectedMesocycleIndex === index,
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
            {muscleGroup.volume.frequencyProgression.map((each, index) => {
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
  const { selectedMesocycleIndex, muscleGroup, onAddTrainingDay } =
    useMuscleEditorContext();

  const [exercisesByMeso, setExercisesByMeso] = useState<ExerciseType[][]>([]);

  useEffect(() => {
    const totalExercisesByMeso =
      muscleGroup.volume.setProgressionMatrix[selectedMesocycleIndex][0]
        ?.length;
    const exercises = muscle.exercises;
    const exercisesByMeso = exercises.slice(0, totalExercisesByMeso);
    setExercisesByMeso(exercisesByMeso);
  }, [selectedMesocycleIndex, muscleGroup]);

  const totalSessions = exercisesByMeso.length;
  const remaining = totalSessions < 5 ? 5 - totalSessions : 0;
  const addButtonDivs = Array.from(Array(remaining), (e, i) => i);

  const exerciseIndices = Array.from(
    Array(exercisesByMeso.flat().length),
    (e, i) => i + 1
  );
  return (
    <div className={`flex space-x-1 overflow-x-auto`}>
      {exercisesByMeso.map((each, index) => {
        const indices = exerciseIndices.splice(0, each.length);
        return (
          <div
            key={`${each[0]?.id}_SessionItem_${index}`}
            className={`flex flex-col rounded-md ${BG_COLOR_M6}`}
          >
            {/* <ListHeader /> */}
            <div className={`flex justify-between p-1`}>
              <div className={`indent-1 text-xs font-bold text-white`}>
                Day {index + 1}
              </div>
              <button className={`w-3`}>
                <DotsIcon fill="#1E293B" />
              </button>
            </div>

            <ul className={`space-y-1 p-1 `}>
              <SessionItem
                exercises={each}
                indices={indices}
                dayIndex={index + 1}
              />
            </ul>
          </div>
        );
      })}
      {addButtonDivs.map(() => {
        return <AddDayItem onClick={() => onAddTrainingDay()} />;
      })}
    </div>
  );
}

type SessionItemProps = {
  exercises: ExerciseType[];
  indices: number[];
  dayIndex: number;
};
function SessionItem({ exercises, indices, dayIndex }: SessionItemProps) {
  return (
    <div className={`flex flex-col rounded ${BG_COLOR_M6}`}>
      {/* <div className={`w-10 p-0.5 text-xs text-white `}>Day {dayIndex}</div> */}
      <div
        className={`flex justify-between text-xxs text-white ${BG_COLOR_M7}`}
      >
        <div className={`pl-2`}>Exercise</div>
        <div className={`pr-4`}>Weekly Sets</div>
      </div>
      <div className={`flex flex-col space-y-1 p-1`}>
        {exercises.map((each, index) => {
          return (
            <ExerciseItem
              key={`${each.id}_exerciseItem_${index}`}
              exercise={each}
              index={index + 1}
              exerciseIndex={indices[index]}
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
      className={`flex border-b p-0.5 text-xs  text-slate-300 ${BORDER_COLOR_M6}`}
    >
      <div className={`w-10`}>Days</div>

      <div className={`flex w-32 justify-between`}>
        <div>Exercise</div>
        <div>Weeks</div>
      </div>

      <div className={`flex`}>
        {microcyclesArray.map((each) => {
          return (
            <div
              key={`${each}_ListHeader`}
              className={`flex w-3 items-center justify-center`}
            >
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
      onClick={onClick}
      className={` flex w-56 cursor-pointer items-center justify-center rounded-md p-2 ${BG_COLOR_M8} opacity-[40%]`}
    >
      <div>
        <PlusIcon fill="white" />
      </div>
    </div>
  );
}
type AddItemProps = {
  onClick: () => void;
};
function AddExerciseItem({ onClick }: AddItemProps) {
  return (
    <li
      className={`flex cursor-pointer p-0.5 text-xxs ${BG_COLOR_M6} ${BORDER_COLOR_M4} border indent-1 text-slate-300`}
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
  exerciseIndex: number;
  dayIndex: number;
};
function ExerciseItem({
  exercise,
  index,
  exerciseIndex,
  dayIndex,
}: ExerciseItemProps) {
  const { selectedMesocycleIndex, muscleGroup, onOperationHandler } =
    useMuscleEditorContext();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <li className={`flex cursor-pointer text-xxs text-white ${BG_COLOR_M5}`}>
      <div className={`flex w-3 items-center justify-center`}>
        {exerciseIndex}
      </div>
      <div
        onClick={onOpen}
        className={`flex w-32 items-center truncate indent-1`}
      >
        {exercise.exercise}
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ChangeExerciseProvider muscle={muscleGroup} exerciseId={exercise.id}>
          <SelectExercise />
        </ChangeExerciseProvider>
      </Modal>

      <div className={`flex`}>
        {muscleGroup.volume.setProgressionMatrix[selectedMesocycleIndex]?.map(
          (each, i) => {
            const session = each[dayIndex - 1];
            let sets = 0;
            if (session) {
              sets = session[index - 1];
            }
            if (i === 0)
              return (
                <WeekOneSets key={`${exercise.id}_WeekOneSets_${each}_${i}`}>
                  <WeekOneSets.Button
                    operation="-"
                    onClick={() => onOperationHandler("-", dayIndex, index)}
                  />
                  <div
                    className={`flex w-3 items-center justify-center px-0.5 text-xxs text-white`}
                  >
                    {sets}
                  </div>
                  <WeekOneSets.Button
                    operation="+"
                    onClick={() => onOperationHandler("+", dayIndex, index)}
                  />
                </WeekOneSets>
              );
            return (
              <div
                key={`${exercise.id}_WeekOneSets_${sets}_${i}`}
                className={`flex w-3 justify-center border-x p-0.5 ${BORDER_COLOR_M6}`}
              >
                {sets}
              </div>
            );
          }
        )}
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
  return (
    <div
      className={`flex w-10 items-center justify-center border-r px-1 ${BORDER_COLOR_M6}`}
    >
      {children}
    </div>
  );
}
