import { ReactNode, useCallback, useEffect, useState } from "react";
import { ArrowUpIcon, DotsIcon, PlusIcon } from "~/assets/icons/_icons";
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
import { MuscleType } from "~/constants/workoutSplits";
import {
  ExerciseType,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import { Exercise } from "~/utils/getExercises";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
import { getRankColor } from "~/utils/getRankColor";
import { ChangeExerciseProvider } from "../ChangeExerciseModal/ChangeExerciseContext";
import SelectExercise from "../ChangeExerciseModal/ChangeExerciseModal";
import BottomBar from "./components/BottomBar";
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

  // const { ref, inView } = useInView({
  //   rootMargin: "0% 0% -80% 0%",
  // });
  // const [sticky, setSticky] = useState(false);

  // useEffect(() => {
  //   if (inView) {
  //     setSticky(true);
  //   } else {
  //     setSticky(false);
  //   }
  // }, [inView]);
  return (
    <SectionH2 title="MUSCLE EDITOR">
      {/* <HeaderScrollNav isSticky={sticky} /> */}
      <ul className={`space-y-2 scroll-smooth`}>
        {list.map((each, index) => {
          return (
            <MuscleEditorProvider muscle={each}>
              <Muscle muscle={each} rank={index + 1} />
            </MuscleEditorProvider>
          );
        })}
      </ul>
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
    volumes,
    mesocyclesArray,
  } = useMuscleEditorContext();
  const bgColor = getRankColor(muscle.volume.landmark);
  const title = getMuscleTitleForUI(muscle.muscle);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <li
      id={muscle.muscle}
      className={`flex flex-col ${BG_COLOR_M7} scroll-smooth rounded`}
    >
      <div className={`flex rounded-t ${bgColor.bg} justify-between border-b`}>
        <div className={`flex w-32 p-1 text-sm text-white`}>
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

        <div className={`flex items-center justify-center pr-2`}>
          <ArrowUpIcon fill="white" />
        </div>
      </div>

      <div className={`p-2`}>
        <Exercises />
      </div>

      <BottomBar>
        <BottomBar.Section title="Volume Landmark">
          <div className={`flex justify-center space-x-1 p-0.5`}>
            <div className={`p-0.5 text-xxs text-white`}>
              {muscleGroup.volume.landmark}
            </div>
          </div>
        </BottomBar.Section>

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
          <div className={`flex justify-center space-x-1 p-0.5`}>
            {volumes.map((each, index) => {
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
      </BottomBar>
    </li>
  );
}

// TODO: create a blank session card to add a day to list and select exercises to fill it.
//       However if the selected mesocycle is less than the last mesocycle, this button
//       should automatically add the last mesocycles session.

function Exercises() {
  const { selectedMesocycleIndex, muscleGroup, onAddTrainingDay } =
    useMuscleEditorContext();

  const [exercisesByMeso, setExercisesByMeso] = useState<ExerciseType[][]>([]);

  useEffect(() => {
    const totalExercisesByMeso =
      muscleGroup.volume.setProgressionMatrix[selectedMesocycleIndex][0]
        ?.length;
    const exercises = muscleGroup.exercises;
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
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const onSelectHandler = (newExercise: Exercise) => {
    const new_exercise: ExerciseType = {
      id: newExercise.id,
      exercise: newExercise.name,
      muscle: newExercise.group as MuscleType,
      session: 0,
      rank: muscleGroup.volume.landmark,
      sets: 2,
      reps: 10,
      weight: 100,
      rir: 3,
      weightIncrement: 2,
      trainingModality: "straight",
      mesocycle_progression: [],
      supersetWith: null,
    };
    onAddTrainingDay(new_exercise);
    onClose();
  };

  const addTrainingDayHandler = useCallback(() => {
    const frequencyProgression = muscleGroup.volume.frequencyProgression;
    const canAddDay =
      frequencyProgression[selectedMesocycleIndex + 1] &&
      frequencyProgression[selectedMesocycleIndex] <
        frequencyProgression[selectedMesocycleIndex + 1]
        ? true
        : false;
    if (canAddDay) {
      onAddTrainingDay();
    } else {
      onOpen();
    }
  }, [muscleGroup, selectedMesocycleIndex]);

  return (
    <div className={`flex min-h-[95px] space-x-1 overflow-x-auto`}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ChangeExerciseProvider muscle={muscleGroup} exerciseId={""}>
          <SelectExercise onSelect={onSelectHandler} />
        </ChangeExerciseProvider>
      </Modal>

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
        return <AddDayItem onClick={() => addTrainingDayHandler()} />;
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
  const { muscleGroup, onAddExercise } = useMuscleEditorContext();
  const [currentExercise, setCurrentExercise] = useState<ExerciseType>(
    exercises[0]
  );

  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const onSelectHandler = (newExercise: Exercise) => {
    const new_exercise: ExerciseType = {
      id: newExercise.id,
      exercise: newExercise.name,
      muscle: newExercise.group as MuscleType,
      session: dayIndex,
      rank: muscleGroup.volume.landmark,
      sets: 2,
      reps: 10,
      weight: 100,
      rir: 3,
      weightIncrement: 2,
      trainingModality: "straight",
      mesocycle_progression: [],
      supersetWith: null,
    };
    onAddExercise(new_exercise, dayIndex - 1);
  };

  const microcycles = muscleGroup.volume.setProgressionMatrix[0]
    ? muscleGroup.volume.setProgressionMatrix[0]
    : [];

  return (
    <div className={`flex flex-col rounded ${BG_COLOR_M6}`}>
      <div
        className={`flex justify-between text-xxs text-slate-300 ${BG_COLOR_M7}`}
      >
        <div className={`pl-2`}>Exercise</div>
        <div className={`flex pr-1`}>
          <div className={``}>Week </div>
          {microcycles.map((e, i) => {
            return (
              <div
                className={cn(`flex w-3 items-center justify-center text-xxs`, {
                  ["w-10"]: i === 0,
                })}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ChangeExerciseProvider
          muscle={muscleGroup}
          exerciseId={currentExercise.id}
        >
          <SelectExercise onSelect={onSelectHandler} />
        </ChangeExerciseProvider>
      </Modal>

      <div className={`flex flex-col space-y-1 p-1`}>
        {exercises.map((each, index) => {
          return (
            <ExerciseItem
              key={`${each.id}_exerciseItem_${index}`}
              exercise={each}
              index={index + 1}
              exerciseIndex={indices[index]}
              dayIndex={dayIndex}
              onOpen={onOpen}
            />
          );
        })}
        <AddExerciseItem onClick={() => onOpen()} />
      </div>
    </div>
  );
}

type AddItemProps = {
  onClick: () => void;
};
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
function AddExerciseItem({ onClick }: AddItemProps) {
  return (
    <li
      onClick={onClick}
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
  onOpen: () => void;
};
function ExerciseItem({
  exercise,
  index,
  exerciseIndex,
  dayIndex,
  onOpen,
}: ExerciseItemProps) {
  const { selectedMesocycleIndex, muscleGroup, onOperationHandler } =
    useMuscleEditorContext();

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
