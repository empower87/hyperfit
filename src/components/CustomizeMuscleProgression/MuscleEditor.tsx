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
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
import { getMuscleData } from "~/utils/getMuscleData";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";

import { JSONExercise } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import CollapsableHeader from "../Layout/CollapsableHeader";
import SelectExercise from "../Modals/ChangeExerciseModal/ChangeExerciseModal";
import Modal from "../Modals/Modal";
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
    onSelectedFrequencyProgressionIncrement,
    onSelectedFrequencyProgressionDecrement,
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
                              onSelectedFrequencyProgressionDecrement(index)
                            }
                          >
                            <SubtractIcon fill="white" />
                          </Button>
                          <div className={`px-1`}>{each}</div>
                          <Button
                            className={`${BG_COLOR_M7}`}
                            onClick={() =>
                              onSelectedFrequencyProgressionIncrement(index)
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

function Exercises() {
  const {
    muscleGroup,
    frequencyProgression,
    exercisesInView,
    selectedMesocycleIndex,
    onAddExercise,
    onAddTrainingDay,
    onRemoveTrainingDay,
  } = useMuscleEditorContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectExerciseModalOpen, setIsSelectExerciseModalOpen] =
    useState(false);
  const onSelectExerciseModalClose = () => setIsSelectExerciseModalOpen(false);
  const onSelectExerciseModalOpen = () => setIsSelectExerciseModalOpen(true);
  const onDropdownClose = () => setIsOpen(false);
  const onDropdownOpen = () => setIsOpen(true);

  const canAddSessionAtMesocycle =
    !frequencyProgression[selectedMesocycleIndex + 1] ||
    (frequencyProgression[selectedMesocycleIndex + 1] &&
      frequencyProgression[selectedMesocycleIndex] <
        frequencyProgression[selectedMesocycleIndex + 1])
      ? true
      : false;

  const totalSessions = exercisesInView.length;
  const remaining = totalSessions < 5 ? 5 - totalSessions : 0;
  const addButtonDivs = Array.from(Array(remaining), (e, i) => i);

  const exerciseIndices = Array.from(
    Array(exercisesInView.flat().length),
    (e, i) => i + 1
  );

  return (
    <div className={`flex min-h-[95px] space-x-1 overflow-x-auto`}>
      {exercisesInView.map((sessionExercises, sessionIndex) => {
        const indices = exerciseIndices.splice(0, sessionExercises.length);
        return (
          <Session
            key={`${sessionExercises[0]?.id}_${sessionIndex}_Session`}
            index={sessionIndex}
          >
            <SessionItem
              sessionExercises={sessionExercises}
              sessionIndex={sessionIndex}
              exerciseIndices={indices}
            ></SessionItem>
          </Session>
        );
      })}
      {addButtonDivs.map((e, i) => {
        return (
          <AddDayItem key={`${i}_AddButtonDivs`}>
            {i === 0 && canAddSessionAtMesocycle ? (
              <button
                onClick={onAddTrainingDay}
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

type SessionProps = {
  index: number;
  children: ReactNode;
};
function Session({ index, children }: SessionProps) {
  const { onRemoveTrainingDay } = useMuscleEditorContext();
  const [isDropdownOpen, setIsDropownOpen] = useState(false);
  const onDropdownClose = () => setIsDropownOpen(false);
  const onDropdownOpen = () => setIsDropownOpen(true);

  return (
    <div className={`flex flex-col rounded-md ${BG_COLOR_M6} mb-2`}>
      <div className={`flex justify-between p-1`}>
        <div className={`indent-1 text-xs font-bold text-white`}>
          Day {index + 1}
        </div>

        <DotsButton
          onClick={onDropdownOpen}
          dropdown={
            isDropdownOpen ? (
              <Dropdown onClose={onDropdownClose} className={`-bottom-6`}>
                <Dropdown.Item onClick={() => onRemoveTrainingDay(index)}>
                  Delete Session
                </Dropdown.Item>
              </Dropdown>
            ) : null
          }
        />
      </div>

      <ul className={`space-y-1 p-1 `}>{children}</ul>
    </div>
  );
}

type DotsButtonProps = {
  onClick: () => void;
  dropdown: ReactNode;
};
function DotsButton({ onClick, dropdown }: DotsButtonProps) {
  return (
    <button className={`relative w-3`} onClick={onClick}>
      <DotsIcon fill="#1E293B" />
      {dropdown}
    </button>
  );
}

type SessionItemProps = {
  // children: ReactNode;
  sessionExercises: ExerciseType[];
  sessionIndex: number;
  exerciseIndices: number[];
};
function SessionItem({
  sessionExercises,
  sessionIndex,
  exerciseIndices,
}: SessionItemProps) {
  const { microcyclesArray, muscleGroup, onAddExercise, onChangeExercise } =
    useMuscleEditorContext();
  const [selectExerciseParams, setSelectExerciseParams] = useState<
    ["CHANGE" | "ADD", string | number] | null
  >(null);

  const [isOpen, setIsOpen] = useState(false);

  const onExerciseChangeClick = (exerciseId: ExerciseType["id"]) =>
    setSelectExerciseParams(["CHANGE", exerciseId]);
  const onAddExerciseClick = (sessionIndex: number) =>
    setSelectExerciseParams(["ADD", sessionIndex]);

  const onSelectExerciseHandler = useCallback(
    (newExercise: JSONExercise) => {
      if (!selectExerciseParams) return;
      if (selectExerciseParams[0] === "CHANGE") {
        if (typeof selectExerciseParams[1] === "number") return;
        onChangeExercise(selectExerciseParams[1], newExercise);
      } else {
        if (typeof selectExerciseParams[1] === "string") return;
        onAddExercise(newExercise, selectExerciseParams[1]);
      }
    },
    [selectExerciseParams]
  );

  const onCloseModal = () => setSelectExerciseParams(null);
  return (
    <div className={`flex flex-col rounded ${BG_COLOR_M6}`}>
      <Modal
        isOpen={selectExerciseParams ? true : false}
        onClose={onCloseModal}
      >
        <SelectExercise
          muscle={muscleGroup}
          exerciseId=""
          onSelect={(newExercise) => onSelectExerciseHandler(newExercise)}
          onClose={onCloseModal}
        />
      </Modal>
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

      <div className={`flex flex-col space-y-1 p-1`}>
        {sessionExercises.map((exercise, exerciseIndex) => {
          return (
            <ExerciseItem
              exercise={exercise}
              index={exerciseIndex}
              exerciseIndex={exerciseIndices[exerciseIndex]}
              dayIndex={sessionIndex}
              totalExercisesInSession={sessionExercises.length}
              openSelectModal={() => onExerciseChangeClick(exercise.id)}
            />
          );
        })}

        <AddExerciseItem onClick={() => onAddExerciseClick(sessionIndex)} />
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
  totalExercisesInSession: number;
  openSelectModal: () => void;
};

function ExerciseItem({
  exercise,
  index,
  exerciseIndex,
  dayIndex,
  totalExercisesInSession,
  openSelectModal,
}: ExerciseItemProps) {
  const { getSetsByExerciseId, onRemoveExercise, toggleSetProgression } =
    useMuscleEditorContext();

  const sets = getSetsByExerciseId(exercise.id);

  console.log(exercise.name, sets, "WHY IS FIRST INDEX UNDEFINED???");
  return (
    <li className={`flex text-xxs text-white ${BG_COLOR_M5}`}>
      {/* <Modal isOpen={isOpen} onClose={onClose}>
        <SelectExercise
          muscle={muscleGroup}
          exerciseId=""
          onSelect={(newExercise) => onAddExercise(newExercise, index)}
          onClose={onClose}
        />
      </Modal> */}

      <div className={`flex w-3 items-center justify-center`}>
        <button onClick={toggleSetProgression} className={``}>
          {exerciseIndex}
        </button>
      </div>

      <div
        onClick={openSelectModal}
        className={`flex w-32 cursor-pointer items-center truncate indent-0.5 hover:${BG_COLOR_M4}`}
      >
        {exercise.name}
      </div>

      <div className={`flex`}>
        {sets.map((set, index) => {
          return (
            <Sets
              key={`${exercise.id}_${index}_${set}`}
              index={index}
              set={set}
              exerciseId={exercise.id}
            />
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

type SetsProps = {
  index: number;
  set: number;
  exerciseId: ExerciseType["id"];
};
function Sets({ index, set, exerciseId }: SetsProps) {
  const { onSelectedExerciseSetIncrement, onSelectedExerciseSetDecrement } =
    useMuscleEditorContext();
  if (index === 0) {
    return (
      <WeekOneSets>
        <WeekOneSets.Button
          onClick={() => onSelectedExerciseSetDecrement(exerciseId)}
        >
          <SubtractIcon fill="white" />
        </WeekOneSets.Button>
        <div
          className={`flex w-3 items-center justify-center px-1 text-xxs text-white`}
        >
          {set}
        </div>
        <WeekOneSets.Button
          onClick={() => onSelectedExerciseSetIncrement(exerciseId)}
        >
          <AddIcon fill="white" />
        </WeekOneSets.Button>
      </WeekOneSets>
    );
  }
  return (
    <div
      className={`flex w-3 justify-center border-r-2 p-0.5 ${BORDER_COLOR_M6}`}
    >
      {set}
    </div>
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
