import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  AddIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  DeleteIcon,
  DotsIcon,
  PlusIcon,
  SubtractIcon,
} from "~/assets/icons/_icons";
import Dropdown from "~/components/Layout/Dropdown";
import { SectionH2 } from "~/components/Layout/Sections";
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
import { cn } from "~/lib/clsx";
import { Exercise } from "~/utils/getExercises";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
import { getRankColor } from "~/utils/getRankColor";
import { ChangeExerciseProvider } from "../ChangeExerciseModal/ChangeExerciseContext";
import SelectExercise from "../ChangeExerciseModal/ChangeExerciseModal";
import BottomBar from "./components/BottomBar";
import SideMenu from "./components/SideMenu";
import {
  MuscleEditorProvider,
  useMuscleEditorContext,
} from "./context/MuscleEditorContext";
import { getSetProgressionForExercise } from "./utils/setProgressionHandlers";

export default function MuscleEditor() {
  const { prioritized_muscle_list } = useTrainingProgramContext();

  const list = useMemo(
    () => prioritized_muscle_list.map((each) => structuredClone(each)),
    [prioritized_muscle_list]
  );

  return (
    <SectionH2 title="MUSCLE EDITOR">
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
    </SectionH2>
  );
}

type MuscleCollapsedProps = {
  id: string;
  rank: number;
  title: string;
  bgColor: string;
  onExpand: () => void;
};
function MuscleCollapsed({
  id,
  rank,
  title,
  bgColor,
  onExpand,
}: MuscleCollapsedProps) {
  return (
    <li id={id} className={`flex justify-between rounded ${bgColor}`}>
      <div className={`flex w-32 p-1 text-sm text-white`}>
        <div className={`flex w-3 items-center justify-center text-xs`}>
          {rank}
        </div>
        <div className={`flex w-full items-center indent-1`}>{title}</div>
      </div>

      <div
        onClick={onExpand}
        className={`flex cursor-pointer items-center justify-center pr-2`}
      >
        <ArrowDownIcon fill="white" />
      </div>
    </li>
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
  } = useMuscleEditorContext();
  const bgColor = getRankColor(muscleGroup.volume.landmark);
  const title = getMuscleTitleForUI(muscleGroup.muscle);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSideMenuCollapsed, setIsSideMenuCollapsed] = useState(false);

  const onToggleSideMenu = () => setIsSideMenuCollapsed((prev) => !prev);
  const onExpandHandler = () => setIsCollapsed(false);
  const onCollapseHandler = () => setIsCollapsed(true);
  if (isCollapsed) {
    return (
      <MuscleCollapsed
        id={muscleGroup.muscle}
        rank={rank}
        title={title}
        bgColor={bgColor.bg}
        onExpand={() => onExpandHandler()}
      />
    );
  }
  return (
    <li
      id={muscleGroup.muscle}
      className={`flex flex-col ${BG_COLOR_M7} scroll-smooth rounded`}
    >
      <div className={`flex rounded-t ${bgColor.bg} justify-between `}>
        <div className={`flex w-32 p-1 text-sm text-white`}>
          <div className={`flex w-3 items-center justify-center text-xs`}>
            {rank}
          </div>
          <div className={`flex w-full items-center indent-1`}>{title}</div>
        </div>

        <div
          onClick={() => onCollapseHandler()}
          className={`flex cursor-pointer items-center justify-center pr-2`}
        >
          <ArrowUpIcon fill="white" />
        </div>
      </div>

      <div className={`flex `}>
        <SideMenu
          isCollapsed={isSideMenuCollapsed}
          onCollapse={onToggleSideMenu}
        >
          <BottomBar>
            <BottomBar.Container alignment="y">
              <BottomBar.Section title="Volume Landmark" alignment="x">
                <div className={`flex justify-center space-x-1 p-0.5`}>
                  <div className={`p-0.5 text-xxs ${bgColor.text}`}>
                    {muscleGroup.volume.landmark}
                  </div>
                </div>
              </BottomBar.Section>

              <BottomBar.ToggleMesocycle
                mesocycles={
                  <div className={`flex justify-center`}>
                    {mesocyclesArray?.map((each, index) => {
                      const isSelected = index === selectedMesocycleIndex;

                      return (
                        <BottomBar.MesocycleCell
                          selectedValue={isSelected}
                          onClick={() => onSelectMesocycle(index)}
                        >
                          {each + 1}
                        </BottomBar.MesocycleCell>
                      );
                    })}
                  </div>
                }
                frequency={
                  <div className={`flex justify-center p-0.5`}>
                    {muscleGroup.volume.frequencyProgression.map(
                      (each, index) => {
                        const isSelected = index === selectedMesocycleIndex;
                        return (
                          <BottomBar.Cell selectedValue={isSelected}>
                            <Button onClick={() => {}}>
                              <SubtractIcon fill="white" />
                            </Button>
                            <div className={`px-1`}>{each}</div>
                            <Button onClick={() => {}}>
                              <AddIcon fill="white" />
                            </Button>
                          </BottomBar.Cell>
                        );
                      }
                    )}
                  </div>
                }
                volume={
                  <div className={`flex justify-center p-0.5`}>
                    {volumes.map((each, index) => {
                      const isSelected = index === selectedMesocycleIndex;
                      return (
                        <BottomBar.Cell selectedValue={isSelected}>
                          {each}
                        </BottomBar.Cell>
                      );
                    })}
                  </div>
                }
              />
            </BottomBar.Container>

            <BottomBar.Container alignment="x">
              <BottomBar.Button label="Reset" onClick={onResetMuscleGroup} />
              <BottomBar.Button
                label="Save Changes"
                onClick={onSaveMuscleGroupChanges}
              />
            </BottomBar.Container>
          </BottomBar>
        </SideMenu>
        <div className={`w-auto overflow-x-auto p-2`}>
          <Exercises />
        </div>
      </div>
    </li>
  );
}
// function Muscle({ rank }: MuscleProps) {
//   const {
//     selectedMesocycleIndex,
//     muscleGroup,
//     onSelectMesocycle,
//     volumes,
//     mesocyclesArray,
//     onResetMuscleGroup,
//     onSaveMuscleGroupChanges,
//   } = useMuscleEditorContext();
//   const bgColor = getRankColor(muscleGroup.volume.landmark);
//   const title = getMuscleTitleForUI(muscleGroup.muscle);
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const onExpandHandler = () => setIsCollapsed(false);
//   const onCollapseHandler = () => setIsCollapsed(true);
//   if (isCollapsed) {
//     return (
//       <MuscleCollapsed
//         id={muscleGroup.muscle}
//         rank={rank}
//         title={title}
//         bgColor={bgColor.bg}
//         onExpand={() => onExpandHandler()}
//       />
//     );
//   }
//   return (
//     <li
//       id={muscleGroup.muscle}
//       className={`flex flex-col ${BG_COLOR_M7} scroll-smooth rounded`}
//     >
//       <div className={`flex rounded-t ${bgColor.bg} justify-between border-b`}>
//         <div className={`flex w-32 p-1 text-sm text-white`}>
//           <div className={`flex w-3 items-center justify-center text-xs`}>
//             {rank}
//           </div>
//           <div className={`flex w-full items-center indent-1`}>{title}</div>
//         </div>

//         <div className={`flex space-x-1 pt-1 text-sm text-white`}>
//           {mesocyclesArray?.map((each, index) => {
//             return (
//               <div
//                 key={`${each}_${index}_mesocyclesArray`}
//                 className={cn(`cursor-pointer px-2 py-0.5 text-xs`, {
//                   [`bg-white ${bgColor.text} font-bold`]:
//                     selectedMesocycleIndex === index,
//                 })}
//                 onClick={() => onSelectMesocycle(index)}
//               >
//                 Mesocycle {each + 1}
//               </div>
//             );
//           })}
//         </div>

//         <div
//           onClick={() => onCollapseHandler()}
//           className={`flex cursor-pointer items-center justify-center pr-2`}
//         >
//           <ArrowUpIcon fill="white" />
//         </div>
//       </div>

//       <div className={`p-2`}>
//         <Exercises />
//       </div>

//       <BottomBar>
//         <BottomBar.Container>
//           <BottomBar.Section title="Volume Landmark">
//             <div className={`flex justify-center space-x-1 p-0.5`}>
//               <div className={`p-0.5 text-xxs text-white`}>
//                 {muscleGroup.volume.landmark}
//               </div>
//             </div>
//           </BottomBar.Section>

//           <BottomBar.Section title="Frequency">
//             <div className={`flex justify-center space-x-1 p-0.5`}>
//               {muscleGroup.volume.frequencyProgression.map((each, index) => {
//                 return (
//                   <div
//                     key={`${each}_${index}_FrequencyProgressionBottomBar`}
//                     className={cn(`p-0.5 text-xxs text-white`, {
//                       ["border"]: selectedMesocycleIndex === index,
//                     })}
//                   >
//                     {each}
//                   </div>
//                 );
//               })}
//             </div>
//           </BottomBar.Section>

//           <BottomBar.Section title="Total Volume">
//             <div className={`flex justify-center space-x-1 p-0.5`}>
//               {volumes.map((each, index) => {
//                 return (
//                   <div
//                     key={`${each}_${index}_TotalVolumeBottomBar`}
//                     className={cn(`p-0.5 text-xxs text-white`, {
//                       ["border"]: selectedMesocycleIndex === index,
//                     })}
//                   >
//                     {each}
//                   </div>
//                 );
//               })}
//             </div>
//           </BottomBar.Section>
//         </BottomBar.Container>
//         <BottomBar.Container>
//           <BottomBar.Button label="Reset" onClick={onResetMuscleGroup} />
//           <BottomBar.Button
//             label="Save Changes"
//             onClick={onSaveMuscleGroupChanges}
//           />
//         </BottomBar.Container>
//       </BottomBar>
//     </li>
//   );
// }

// TODO: create a blank session card to add a day to list and select exercises to fill it.
//       However if the selected mesocycle is less than the last mesocycle, this button
//       should automatically add the last mesocycles session.
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
    !muscleGroup.volume.frequencyProgression[selectedMesocycleIndex + 1] ||
    (muscleGroup.volume.frequencyProgression[selectedMesocycleIndex + 1] &&
      muscleGroup.volume.frequencyProgression[selectedMesocycleIndex] <
        muscleGroup.volume.frequencyProgression[selectedMesocycleIndex + 1])
      ? true
      : false;

  const isLastMesocycle = mesocycles - 1 === selectedMesocycleIndex;
  const totalExercisesByMeso =
    muscleGroup.volume.frequencyProgression[selectedMesocycleIndex];
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
        <ChangeExerciseProvider muscle={muscleGroup} exerciseId={""}>
          <SelectExercise onSelect={onSelectHandler} onClose={onClose} />
        </ChangeExerciseProvider>
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
        <ChangeExerciseProvider muscle={muscleGroup} exerciseId={""}>
          <SelectExercise
            onSelect={(newExercise) => onAddExercise(newExercise, dayIndex - 1)}
            onClose={onClose}
          />
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
        {exercise.exercise}
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
              key={`${exercise.id}_WeekOneSets_${sets}_${i}`}
              className={`flex w-3 justify-center border-r-2 p-0.5 ${BORDER_COLOR_M6}`}
            >
              {each}
            </div>
          );
        })}
        <div
          onClick={() => onRemoveExercise(exercise.id)}
          className={`flex w-3 cursor-pointer items-center justify-center border bg-rose-400 ${BORDER_COLOR_M6} hover:bg-rose-500`}
        >
          <DeleteIcon fill="white" />
        </div>
      </div>
    </li>
  );
}

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
};
function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-[11px] border ${BORDER_COLOR_M4} ${BG_COLOR_M6} h-[11px] items-center justify-center p-[2px] text-xxs text-white hover:${BG_COLOR_M5}`}
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
