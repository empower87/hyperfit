import {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  AddIcon,
  DeleteIcon,
  DotsIcon,
  PlusIcon,
  SubtractIcon,
} from "~/assets/icons/_icons";
import Dropdown from "~/components/Layout/Dropdown";
import Modal from "~/components/Modals/Modal";
import {
  BG_COLOR_M4,
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BG_COLOR_M8,
  BORDER_COLOR_M4,
  BORDER_COLOR_M6,
} from "~/constants/themes";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { Exercise } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
import { getMuscleData } from "~/utils/getMuscleData";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";

import { getSetProgressionForExercise } from "../../hooks/useTrainingProgram/utils/exercises/setProgressionHandlers";
import CollapsableHeader from "../Layout/CollapsableHeader";
import SelectExercise from "../Modals/ChangeExerciseModal/ChangeExerciseModal";
import SideMenu from "./components/SideMenu";
import {
  MuscleEditorProvider,
  useMuscleEditorContext,
} from "./context/MuscleEditorContext";

export default function MuscleEditor() {
  const { prioritized_muscle_list } = useTrainingProgramContext();

  const list = useMemo(
    () => prioritized_muscle_list.map((each) => structuredClone(each)),
    [prioritized_muscle_list]
  );

  return (
    <ul className={`space-y-2 scroll-smooth`}>
      {list.map((each, index) => {
        return (
          <MuscleEditorProvider
            key={`${each.id}_${index}_MuscleEditorProvider`}
            muscle={each}
          >
            <Muscle rank={index + 1} />
          </MuscleEditorProvider>
        );
      })}
    </ul>
  );
}

type MuscleProps = {
  rank: number;
};
function Muscle({ rank }: MuscleProps) {
  const {
    selectedMesocycleIndex,
    muscleGroup,
    onSelectMesocycle,
    volumes,
    mesocyclesArray,
    onResetMuscleGroup,
    onSaveMuscleGroupChanges,
    onFrequencyProgressionIncrement,
  } = useMuscleEditorContext();
  const bgColor = getRankColor(muscleGroup.volume.landmark);
  const title = getMuscleTitleForUI(muscleGroup.muscle);
  const muscleData = getMuscleData(muscleGroup.muscle);
  const volumeSets =
    muscleGroup.volume.landmark === "MRV"
      ? muscleData["MRV"][
          muscleGroup.frequency.progression[
            muscleGroup.frequency.progression.length - 1
          ] - 1
        ]
      : muscleData[muscleGroup.volume.landmark];

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSideMenuCollapsed, setIsSideMenuCollapsed] = useState(false);

  const onToggleSideMenu = () => setIsSideMenuCollapsed((prev) => !prev);
  const onExpandHandler = () => setIsCollapsed(false);
  const onCollapseHandler = () => setIsCollapsed(true);

  if (isCollapsed) {
    return (
      <li id={muscleGroup.muscle}>
        <CollapsableHeader className={`${bgColor.bg} rounded`}>
          <CollapsableHeader.Title label={`${rank} ${title}`} />

          <CollapsableHeader.Button
            isCollapsed={isCollapsed}
            onCollapse={onExpandHandler}
          />
        </CollapsableHeader>
      </li>
    );
  }
  return (
    <li
      id={muscleGroup.muscle}
      className={`flex flex-col ${BG_COLOR_M7} scroll-smooth rounded`}
    >
      <CollapsableHeader className={`${bgColor.bg}`}>
        <CollapsableHeader.Title label={`${rank} ${title}`} />

        <CollapsableHeader.Button
          isCollapsed={isCollapsed}
          onCollapse={onCollapseHandler}
        />
      </CollapsableHeader>

      <div className={`flex`}>
        <SideMenu
          isCollapsed={isSideMenuCollapsed}
          onCollapse={onToggleSideMenu}
        >
          <SideMenu.Contents>
            <SideMenu.Container alignment="y">
              <SideMenu.Section title="Volume Landmark" alignment="x">
                <div
                  className={`flex items-center justify-center space-x-1 p-0.5`}
                >
                  <div className={`p-0.5 text-xxs font-bold ${bgColor.text}`}>
                    {muscleGroup.volume.landmark}
                  </div>
                  <div className={`p-0.5 text-xxs font-bold ${bgColor.text}`}>
                    {volumeSets}
                  </div>
                </div>
              </SideMenu.Section>

              <SideMenu.ToggleMesocycle
                mesocycles={
                  <div className={`flex justify-center`}>
                    {mesocyclesArray?.map((each, index) => {
                      const isSelected = index === selectedMesocycleIndex;

                      return (
                        <SideMenu.MesocycleCell
                          key={`${each}_ToggleMesocycleMesocycles_${index}`}
                          selectedValue={isSelected}
                          onClick={() => onSelectMesocycle(index)}
                        >
                          {each + 1}
                        </SideMenu.MesocycleCell>
                      );
                    })}
                  </div>
                }
                frequency={
                  <div className={`flex justify-center p-0.5`}>
                    {muscleGroup.frequency.progression.map((each, index) => {
                      const isSelected = index === selectedMesocycleIndex;
                      return (
                        <SideMenu.Cell
                          key={`${each}_ToggleMesocycleFrequency_${index}`}
                          selectedValue={isSelected}
                        >
                          <Button
                            className={`${BG_COLOR_M7}`}
                            onClick={() =>
                              onFrequencyProgressionIncrement(index, "-")
                            }
                          >
                            <SubtractIcon fill="white" />
                          </Button>
                          <div className={`px-1`}>{each}</div>
                          <Button
                            className={`${BG_COLOR_M7}`}
                            onClick={() =>
                              onFrequencyProgressionIncrement(index, "+")
                            }
                          >
                            <AddIcon fill="white" />
                          </Button>
                        </SideMenu.Cell>
                      );
                    })}
                  </div>
                }
                volume={
                  <div className={`flex justify-center p-0.5`}>
                    {volumes.map((each, index) => {
                      const isSelected = index === selectedMesocycleIndex;
                      return (
                        <SideMenu.Cell
                          key={`${each}_ToggleMesocycleVolume_${index}`}
                          selectedValue={isSelected}
                        >
                          {each}
                        </SideMenu.Cell>
                      );
                    })}
                  </div>
                }
              />
            </SideMenu.Container>

            <SideMenu.Container alignment="x">
              <SideMenu.Button label="Reset" onClick={onResetMuscleGroup} />
              <SideMenu.Button
                label="Save Changes"
                onClick={onSaveMuscleGroupChanges}
              />
            </SideMenu.Container>
          </SideMenu.Contents>
        </SideMenu>
        <div className={`w-auto overflow-x-auto p-2`}>
          <Exercises />
        </div>
      </div>
    </li>
  );
}

type SessionProps = {
  index: number;
  exercises: ExerciseType[];
  indices: number[];
};
function Session({ index, exercises, indices }: SessionProps) {
  const { onRemoveTrainingDay } = useMuscleEditorContext();
  const [isOpen, setIsOpen] = useState(false);
  const onDropdownClose = () => setIsOpen(false);
  const onDropdownOpen = () => setIsOpen(true);

  return (
    <div
      key={`${exercises[0]?.id}_SessionItem_${index}`}
      className={`flex flex-col rounded-md ${BG_COLOR_M6} mb-2`}
    >
      <div className={`flex justify-between p-1`}>
        <div className={`indent-1 text-xs font-bold text-white`}>
          Day {index + 1}
        </div>

        <button className={`relative w-3`} onClick={onDropdownOpen}>
          <DotsIcon fill="#1E293B" />
          {isOpen ? (
            <Dropdown onClose={onDropdownClose} className={`-bottom-6`}>
              <Dropdown.Item onClick={() => onRemoveTrainingDay(index)}>
                Delete Session
              </Dropdown.Item>
            </Dropdown>
          ) : null}
        </button>
      </div>

      <ul className={`space-y-1 p-1 `}>
        <SessionItem
          exercises={exercises}
          indices={indices}
          dayIndex={index + 1}
        />
      </ul>
    </div>
  );
}

function Exercises() {
  const { muscleGroup, selectedMesocycleIndex, onAddTrainingDay } =
    useMuscleEditorContext();
  const { training_program_params } = useTrainingProgramContext();
  const { mesocycles } = training_program_params;

  // const [exercisesByMeso, setExercisesByMeso] = useState<ExerciseType[][]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const canAddSessionAtMesocycle =
    !muscleGroup.frequency.progression[selectedMesocycleIndex + 1] ||
    (muscleGroup.frequency.progression[selectedMesocycleIndex + 1] &&
      muscleGroup.frequency.progression[selectedMesocycleIndex] <
        muscleGroup.frequency.progression[selectedMesocycleIndex + 1])
      ? true
      : false;

  const isLastMesocycle = mesocycles - 1 === selectedMesocycleIndex;
  const totalExercisesByMeso =
    muscleGroup.frequency.progression[selectedMesocycleIndex];
  const exercisesByMeso = muscleGroup.exercises.slice(0, totalExercisesByMeso);

  const totalSessions = exercisesByMeso.length;
  const remaining = totalSessions < 5 ? 5 - totalSessions : 0;
  const addButtonDivs = Array.from(Array(remaining), (e, i) => i);

  const exerciseIndices = Array.from(
    Array(exercisesByMeso.flat().length),
    (e, i) => i + 1
  );

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const onSelectHandler = useCallback(
    (newExercise: Exercise) => {
      onAddTrainingDay(newExercise, exercisesByMeso.length);
    },
    [exercisesByMeso]
  );

  const addTrainingDayHandler = useCallback(() => {
    if (!isLastMesocycle) {
      onAddTrainingDay();
    } else {
      onOpen();
    }
  }, [isLastMesocycle, onAddTrainingDay]);

  return (
    <div className={`flex min-h-[95px] space-x-1 overflow-x-auto`}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <SelectExercise
          muscle={muscleGroup}
          exerciseId=""
          onSelect={onSelectHandler}
          onClose={onClose}
        />
      </Modal>

      {exercisesByMeso.map((each, index) => {
        const indices = exerciseIndices.splice(0, each.length);
        return (
          <Session
            key={`${each[0].id}_${index}_Session`}
            exercises={each}
            index={index}
            indices={indices}
          />
        );
      })}
      {addButtonDivs.map((e, i) => {
        return (
          <AddDayItem key={`${i}_AddButtonDivs`}>
            {i === 0 && canAddSessionAtMesocycle ? (
              <button
                onClick={addTrainingDayHandler}
                className={`flex items-center justify-center p-1 hover:${BG_COLOR_M7}`}
              >
                <PlusIcon fill="white" />
              </button>
            ) : null}
          </AddDayItem>
        );
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
  const { muscleGroup, microcyclesArray, onAddExercise } =
    useMuscleEditorContext();
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <div className={`flex flex-col rounded ${BG_COLOR_M6}`}>
      <div
        className={`flex justify-between text-xxs text-slate-300 ${BG_COLOR_M7}`}
      >
        <div className={`pl-2`}>Exercise</div>
        <div className={`flex pr-4`}>
          <div className={``}>Week </div>
          {microcyclesArray.map((e, i) => {
            return (
              <div
                key={`${i}_WeeksSessionHeader`}
                className={cn(`flex w-3 items-center justify-center text-xxs`, {
                  ["w-11"]: i === 0,
                })}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <SelectExercise
          muscle={muscleGroup}
          exerciseId=""
          onSelect={(newExercise) => onAddExercise(newExercise, dayIndex - 1)}
          onClose={onClose}
        />
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
              totalExercisesInSession={exercises.length}
            />
          );
        })}
        <AddExerciseItem onClick={() => onOpen()} />
      </div>
    </div>
  );
}

type AddItemProps = {
  children?: ReactNode;
};
function AddDayItem({ children }: AddItemProps) {
  return (
    <div
      className={`mb-2 flex w-56 items-center justify-center rounded-md p-2 ${BG_COLOR_M8} opacity-[40%]`}
    >
      {children}
    </div>
  );
}
function AddExerciseItem({ onClick }: { onClick: () => void }) {
  return (
    <li
      onClick={onClick}
      className={`flex cursor-pointer p-0.5 text-xxs ${BG_COLOR_M6} ${BORDER_COLOR_M4} border indent-1 text-slate-300`}
    >
      <div className={`ml-0.5 flex items-center justify-center`}>
        <Button onClick={onClick}>
          <AddIcon fill="white" />
        </Button>
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
  totalExercisesInSession: number;
};

function ExerciseItem({
  exercise,
  index,
  exerciseIndex,
  dayIndex,
  onOpen,
  totalExercisesInSession,
}: ExerciseItemProps) {
  const {
    selectedMesocycleIndex,
    onSetIncrement,
    onRemoveExercise,
    toggleSetProgression,
  } = useMuscleEditorContext();
  const { training_program_params } = useTrainingProgramContext();
  const { microcycles } = training_program_params;

  const sets = getSetProgressionForExercise(
    exercise.setProgressionSchema[selectedMesocycleIndex],
    selectedMesocycleIndex,
    exercise,
    microcycles,
    totalExercisesInSession,
    index - 1
  );

  return (
    <li className={`flex text-xxs text-white ${BG_COLOR_M5}`}>
      <div className={`flex w-3 items-center justify-center`}>
        <button onClick={toggleSetProgression} className={``}>
          {exerciseIndex}
        </button>
      </div>

      <div
        onClick={onOpen}
        className={`flex w-32 cursor-pointer items-center truncate indent-0.5 hover:${BG_COLOR_M4}`}
      >
        {exercise.name}
      </div>

      <div className={`flex`}>
        {sets?.map((each, i) => {
          if (i === 0)
            return (
              <WeekOneSets key={`${exercise.id}_WeekOneSets_${i}`}>
                <WeekOneSets.Button
                  onClick={() => onSetIncrement("-", exercise.id)}
                >
                  <SubtractIcon fill="white" />
                </WeekOneSets.Button>
                <div
                  className={`flex w-3 items-center justify-center px-1 text-xxs text-white`}
                >
                  {each}
                </div>
                <WeekOneSets.Button
                  onClick={() => onSetIncrement("+", exercise.id)}
                >
                  <AddIcon fill="white" />
                </WeekOneSets.Button>
              </WeekOneSets>
            );
          return (
            <div
              key={`${exercise.id}_WeekOneSets_${each}_${i}`}
              className={`flex w-3 justify-center border-r-2 p-0.5 ${BORDER_COLOR_M6}`}
            >
              {each}
            </div>
          );
        })}
        <div
          onClick={() => onRemoveExercise(exercise.id)}
          className={`flex w-3 cursor-pointer items-center justify-center border bg-red-400 ${BORDER_COLOR_M6} hover:bg-rose-500`}
        >
          <DeleteIcon fill="white" />
        </div>
      </div>
    </li>
  );
}

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        `flex w-[11px] border ${BORDER_COLOR_M4} ${BG_COLOR_M6} h-[11px] items-center justify-center p-[2px] text-xxs text-white hover:${BG_COLOR_M5}`,
        className
      )}
    >
      {children}
    </button>
  );
}
WeekOneSets.Button = Button;
function WeekOneSets({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex w-11 items-center justify-center border-x-2 px-1 ${BORDER_COLOR_M6}`}
    >
      {children}
    </div>
  );
}
