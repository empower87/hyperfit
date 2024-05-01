import {
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import { DotsIcon } from "~/assets/icons/_icons";
import { getSetProgressionForExercise } from "~/components/CustomizeMuscleProgression/utils/setProgressionHandlers";
import Dropdown from "~/components/Layout/Dropdown";
import { CardS as Card } from "~/components/Layout/Sections";
import Modal from "~/components/Modals/Modal";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M5,
  BORDER_COLOR_M6,
  BORDER_COLOR_M7,
} from "~/constants/themes";
import {
  EXERCISE_TRAINING_MODALITIES,
  ExerciseType,
  SessionSplitType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getGroupList } from "~/utils/getExercises";
import { getRankColor, getSplitColor } from "~/utils/getIndicatorColors";
import { capitalizeFirstLetter } from "~/utils/uiHelpers";
import Settings from "../Configuration/components/MusclePrioritization/Settings";
import MesocycleToggle from "./components/MesocycleToggle";
import SessionDurationVariables from "./components/Settings/SessionDuration/SessionDurationVariables";
import {
  SessionDurationVariablesProvider,
  useSessionDurationVariablesContext,
} from "./components/Settings/SessionDuration/sessionDurationVariablesContext";
import useExerciseSelection, {
  DraggableExercises,
} from "./components/hooks/useExerciseSelection";
import { getSupersetMap } from "./components/utils/exerciseSelectUtils";

type PromptProps = {
  splitOptions: { id: string; options: SplitType[] } | undefined;
  isOpen: boolean;
  onClose: (sessionId: string, split: SplitType) => void;
};

// probably don't even need to prompt user for this, just automatically change it.
function Prompt({ splitOptions, isOpen, onClose }: PromptProps) {
  const root = document.getElementById("modal-body")!;

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className="absolute flex h-full w-full items-center justify-center"
      style={{ background: "#00000082" }}
    >
      <div className={BG_COLOR_M7 + " flex w-64 flex-col p-2"}>
        <div className=" flex flex-col text-xxs text-white">
          <div className=" mb-0.5 text-slate-300">
            Adding this Exercise to this day would change the Training Split for
            that day.
          </div>
          <div className=" mb-1">
            Please select the Split you want to change it to:
          </div>
        </div>

        <ul>
          {splitOptions?.options.map((each, index) => {
            return (
              <li
                key={`${each}_${index}`}
                className={cn(
                  `${BG_COLOR_M6} flex cursor-pointer text-sm text-white hover:${BG_COLOR_M5}`
                )}
                onClick={() => onClose(splitOptions.id, each)}
              >
                <div className=" mr-1 indent-1">{index + 1}</div>
                <div className=" ">{each}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    root
  );
}

type DropdownProps = {
  onDropdownClick: () => void;
};

type DropdownListProps = {
  items: ExerciseType[];
  supersets: Map<string, string>;
  selectedId: ExerciseType["id"];
  onClose: () => void;
  onItemClick: (exercise: ExerciseType) => void;
};

function DropdownListModal({
  items,
  supersets,
  selectedId,
  onClose,
  onItemClick,
}: DropdownListProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center"
      onClick={() => onClose()}
    >
      <ul className={cn(`w-52 ${BG_COLOR_M6}`)}>
        {items.map((each, index) => {
          const getBGColor = supersets.get(each.id);
          const bgColor = getBGColor ? getBGColor : "";
          return (
            <li
              className={cn(
                `${BORDER_COLOR_M7} m-0.5 cursor-pointer border-2 text-xs text-white hover:${BG_COLOR_M5}`,
                getRankColor(each.rank),
                {
                  [`${BG_COLOR_M5} border-white`]: each.id === selectedId,
                  [bgColor]: supersets.get(each.id),
                }
              )}
              key={each.id}
              onClick={() => onItemClick(each)}
            >
              {index + 1} {each.exercise}
            </li>
          );
        })}
      </ul>

      <div className="">
        <button className="text-xs text-white">Cancel</button>
        <button className="text-xs text-white">Select</button>
      </div>
    </div>
  );
}

function DropdownButton({ onDropdownClick }: DropdownProps) {
  return (
    <div
      id="dropdown-modal"
      className={
        "relative flex w-full cursor-pointer flex-col items-center justify-center"
      }
      onClick={() => onDropdownClick()}
    >
      <DotsIcon />
    </div>
  );
}

interface SelectDropdownProps extends HTMLAttributes<HTMLSelectElement> {
  options: string[];
  selectedOption: string;
}
const SelectDropdown: FC<SelectDropdownProps> = ({
  options,
  selectedOption,
  className,
  ...props
}) => {
  return (
    <select
      {...props}
      className={cn(`bg-inherit`, className)}
      defaultValue={selectedOption}
    >
      {options.map((option, index) => {
        return (
          <option
            key={`${option}_${index}`}
            className={cn(`${BG_COLOR_M6}`)}
            value={option}
            selected={option === selectedOption}
          >
            {capitalizeFirstLetter(option)}
          </option>
        );
      })}
    </select>
  );
};

interface ItemCellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
const ItemCell: FC<ItemCellProps> = ({ children, className, ...props }) => {
  return (
    <div {...props} className={cn(`flex p-0.5 text-xxs`, className)}>
      {children}
    </div>
  );
};

function DaySessionItemHeaders() {
  return (
    <div className="flex text-white">
      <ItemCell
        className={`${BORDER_COLOR_M5} ${BG_COLOR_M5} ${ITEM_CELL_WIDTHS.index} text-xxxs`}
      >
        {" "}
      </ItemCell>
      <div className="flex w-full overflow-hidden rounded-sm">
        <ItemCell
          className={`${BORDER_COLOR_M5} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.sets} justify-center text-xxxs`}
        >
          Sets
        </ItemCell>
        <ItemCell
          className={`${BORDER_COLOR_M5} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.reps} justify-center text-xxxs`}
        >
          Reps
        </ItemCell>
        <ItemCell
          className={`${BORDER_COLOR_M5} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.lbs} justify-center text-xxxs`}
        >
          Lbs
        </ItemCell>
        <div className="flex flex-col">
          <ItemCell
            className={`${BORDER_COLOR_M5} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.exercise} text-xxxs`}
          >
            Exercise
          </ItemCell>
        </div>
        <ItemCell
          className={`${BORDER_COLOR_M6} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.actions} rounded-r-sm text-xxxs`}
        >
          {" "}
        </ItemCell>
      </div>
    </div>
  );
}

type DaySessionItemProps = {
  index: number;
  exercise: ExerciseType;
  sessionId: string;
  exercises: ExerciseType[];
  selectedMicrocycleIndex: number;
  selectedMesocycleIndex: number;
  onSupersetUpdate: (
    _exercise: ExerciseType,
    exercise: ExerciseType,
    sessionId: string
  ) => void;
};

const ITEM_CELL_WIDTHS = {
  index: "w-4",
  sets: "w-6",
  reps: "w-6",
  lbs: "w-6",
  exercise: "w-36",
  actions: "w-4",
  modality: "w-14",
};

function DaySessionItem({
  index,
  exercise,
  sessionId,
  exercises,
  selectedMicrocycleIndex,
  selectedMesocycleIndex,
  onSupersetUpdate,
}: DaySessionItemProps) {
  const [bgColor, setBgColor] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const supersets = getSupersetMap(exercises);

  const allExercises = getGroupList(exercise.muscle).map((each) => each.name);

  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(
    exercise.exercise
  );

  const setProgressionSchema =
    exercise.setProgressionSchema[selectedMesocycleIndex];
  const setsOverWeek = getSetProgressionForExercise(
    setProgressionSchema,
    selectedMesocycleIndex,
    exercise,
    4,
    2,
    0
  );

  const mesocycle_progression = exercise.mesocycle_progression;
  // const sets = mesocycle_progression[selectedMicrocycleIndex].sets;
  const sets = setsOverWeek[selectedMicrocycleIndex];
  const reps = mesocycle_progression[selectedMicrocycleIndex].reps;
  const lbs = mesocycle_progression[selectedMicrocycleIndex].weight;
  const modality = exercise.trainingModality;

  const onItemClick = useCallback((exerciseOne: ExerciseType) => {
    // sorts supersetted exercises by place in list
    const indexOne = exercises.findIndex((each) => each.id === exerciseOne.id);
    const indexTwo = exercises.findIndex((each) => each.id === exercise.id);

    if (indexOne === indexTwo) return;

    let one = exerciseOne;
    let two = exercise;
    if (indexOne > indexTwo) {
      one = exercise;
      two = exerciseOne;
    }
    onSupersetUpdate(one, two, sessionId);
  }, []);

  const onDropdownClick = () => {
    setIsOpen(true);
  };

  const onDropdownClose = () => {
    setIsOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onModalOpen = () => {
    setIsModalOpen(true);
    onDropdownClose();
  };
  const onModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const supersettedColor = supersets?.get(exercise.id);
    let bgColor = "";
    if (supersettedColor) {
      bgColor = supersettedColor;
    } else {
      const bgColorByRank = getRankColor(exercise.rank);
      bgColor = bgColorByRank.bg;
    }
    setBgColor(bgColor);
  }, [supersets, exercise]);

  const BORDER_COLOR = exercise.supersetWith ? "border-white" : BORDER_COLOR_M7;
  return (
    <li className={cn(`mb-0.5 flex text-white `)}>
      <ItemCell
        className={cn(
          `${BORDER_COLOR} ${ITEM_CELL_WIDTHS.index} justify-center`
        )}
      >
        {index}
      </ItemCell>

      <div
        className={cn(
          `${BG_COLOR_M7} ${BORDER_COLOR_M7} flex space-x-0.5 overflow-hidden rounded border-2`
        )}
      >
        <div className="flex flex-col space-y-0.5">
          <div className={cn(`flex space-x-0.5`)}>
            <ItemCell
              className={`${bgColor} ${ITEM_CELL_WIDTHS.sets} justify-center`}
            >
              {sets}
            </ItemCell>
            <ItemCell
              className={`${bgColor} ${ITEM_CELL_WIDTHS.reps} justify-center`}
            >
              {reps}
            </ItemCell>
            <ItemCell
              className={`${bgColor} ${ITEM_CELL_WIDTHS.lbs} justify-center`}
            >
              {lbs}
            </ItemCell>
          </div>
          <ItemCell className={`${bgColor}`}>
            <SelectDropdown
              options={[...EXERCISE_TRAINING_MODALITIES]}
              className={`${ITEM_CELL_WIDTHS.modality}`}
              selectedOption={modality}
            />
          </ItemCell>
        </div>

        <div className=" flex flex-col space-y-0.5 text-xxs">
          <ItemCell className={`${bgColor} ${ITEM_CELL_WIDTHS.exercise}`}>
            <SelectDropdown
              className={`w-full truncate`}
              options={allExercises}
              selectedOption={selectedExerciseName}
            />
          </ItemCell>
          <ItemCell
            className={`${bgColor} ${ITEM_CELL_WIDTHS.exercise} truncate indent-1 text-slate-300`}
          >
            {exercise.muscle}
          </ItemCell>
        </div>

        <ItemCell className={`${bgColor} ${ITEM_CELL_WIDTHS.actions} relative`}>
          <DropdownButton onDropdownClick={onDropdownClick} />
          {isOpen ? (
            <Dropdown onClose={onDropdownClose}>
              <Dropdown.Item onClick={onModalOpen}>
                Create Superset
              </Dropdown.Item>
            </Dropdown>
          ) : null}
        </ItemCell>

        {isModalOpen ? (
          <Modal isOpen={isModalOpen} onClose={onModalClose}>
            <DropdownListModal
              items={exercises}
              supersets={supersets}
              selectedId={exercise.id}
              onClose={onDropdownClose}
              onItemClick={onItemClick}
            />
          </Modal>
        ) : null}
      </div>
    </li>
  );
}
// function DaySessionItemHeaders() {
//   return (
//     <div className="flex text-white">
//       <ItemCell
//         className={`${BORDER_COLOR_M5} ${BG_COLOR_M5} ${ITEM_CELL_WIDTHS.index} text-xxxs`}
//       >
//         {" "}
//       </ItemCell>
//       <div className="flex w-full overflow-hidden rounded-sm">
//         <ItemCell
//           className={`${BORDER_COLOR_M5} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.sets} justify-center text-xxxs`}
//         >
//           Sets
//         </ItemCell>
//         <ItemCell
//           className={`${BORDER_COLOR_M5} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.reps} justify-center text-xxxs`}
//         >
//           Reps
//         </ItemCell>
//         <ItemCell
//           className={`${BORDER_COLOR_M5} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.lbs} justify-center text-xxxs`}
//         >
//           Lbs
//         </ItemCell>
//         <div className="flex flex-col">
//           <ItemCell
//             className={`${BORDER_COLOR_M5} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.exercise} text-xxxs`}
//           >
//             Exercise
//           </ItemCell>
//         </div>
//         <ItemCell
//           className={`${BORDER_COLOR_M6} ${BG_COLOR_M6} ${ITEM_CELL_WIDTHS.actions} rounded-r-sm text-xxxs`}
//         >
//           {" "}
//         </ItemCell>
//       </div>
//     </div>
//   );
// }

// type DaySessionItemProps = {
//   index: number;
//   exercise: ExerciseType;
//   sessionId: string;
//   exercises: ExerciseType[];
//   selectedMicrocycleIndex: number;
//   selectedMesocycleIndex: number;
//   onSupersetUpdate: (
//     _exercise: ExerciseType,
//     exercise: ExerciseType,
//     sessionId: string
//   ) => void;
// };

// const ITEM_CELL_WIDTHS = {
//   index: "w-4",
//   sets: "w-6",
//   reps: "w-6",
//   lbs: "w-6",
//   exercise: "w-36",
//   actions: "w-4",
//   modality: "w-14",
// };

// function DaySessionItem({
//   index,
//   exercise,
//   sessionId,
//   exercises,
//   selectedMicrocycleIndex,
//   selectedMesocycleIndex,
//   onSupersetUpdate,
// }: DaySessionItemProps) {
//   const [bgColor, setBgColor] = useState<string>("");
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const supersets = getSupersetMap(exercises);

//   const allExercises = getGroupList(exercise.muscle).map((each) => each.name);

//   const [selectedExerciseName, setSelectedExerciseName] = useState<string>(
//     exercise.exercise
//   );

//   const setProgressionSchema =
//     exercise.setProgressionSchema[selectedMesocycleIndex];
//   const setsOverWeek = getSetProgressionForExercise(
//     setProgressionSchema,
//     selectedMesocycleIndex,
//     exercise,
//     4,
//     2,
//     0
//   );

//   const mesocycle_progression = exercise.mesocycle_progression;
//   // const sets = mesocycle_progression[selectedMicrocycleIndex].sets;
//   const sets = setsOverWeek[selectedMicrocycleIndex];
//   const reps = mesocycle_progression[selectedMicrocycleIndex].reps;
//   const lbs = mesocycle_progression[selectedMicrocycleIndex].weight;
//   const modality = exercise.trainingModality;

//   const onItemClick = useCallback((exerciseOne: ExerciseType) => {
//     // sorts supersetted exercises by place in list
//     const indexOne = exercises.findIndex((each) => each.id === exerciseOne.id);
//     const indexTwo = exercises.findIndex((each) => each.id === exercise.id);

//     if (indexOne === indexTwo) return;

//     let one = exerciseOne;
//     let two = exercise;
//     if (indexOne > indexTwo) {
//       one = exercise;
//       two = exerciseOne;
//     }
//     onSupersetUpdate(one, two, sessionId);
//   }, []);

//   const onDropdownClick = () => {
//     setIsOpen(true);
//   };

//   const onDropdownClose = () => {
//     setIsOpen(false);
//   };

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const onModalOpen = () => {
//     setIsModalOpen(true);
//     onDropdownClose();
//   };
//   const onModalClose = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     const supersettedColor = supersets?.get(exercise.id);
//     let bgColor = "";
//     if (supersettedColor) {
//       bgColor = supersettedColor;
//     } else {
//       const bgColorByRank = getRankColor(exercise.rank);
//       bgColor = bgColorByRank.bg;
//     }
//     setBgColor(bgColor);
//   }, [supersets, exercise]);

//   const BORDER_COLOR = exercise.supersetWith ? "border-white" : BORDER_COLOR_M7;
//   return (
//     <li className={cn(`mb-0.5 flex text-white`)}>
//       <ItemCell
//         className={cn(
//           `${BORDER_COLOR} ${ITEM_CELL_WIDTHS.index} justify-center`
//         )}
//       >
//         {index}
//       </ItemCell>

//       <div
//         className={cn(
//           `${BORDER_COLOR} flex overflow-hidden rounded border-y-2 ${bgColor}`
//         )}
//       >
//         <div className="flex flex-col">
//           <div className={cn(`${BORDER_COLOR} flex border-b`)}>
//             <ItemCell
//               className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.sets} justify-center border-r`}
//             >
//               {sets}
//             </ItemCell>
//             <ItemCell
//               className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.reps} justify-center border-r`}
//             >
//               {reps}
//             </ItemCell>
//             <ItemCell
//               className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.lbs} justify-center`}
//             >
//               {lbs}
//             </ItemCell>
//           </div>
//           <ItemCell className={`${BORDER_COLOR}`}>
//             <SelectDropdown
//               options={[...EXERCISE_TRAINING_MODALITIES]}
//               className={`${ITEM_CELL_WIDTHS.modality}`}
//               selectedOption={modality}
//             />
//           </ItemCell>
//         </div>

//         <div className=" flex flex-col text-xxs">
//           <ItemCell className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.exercise}`}>
//             <SelectDropdown
//               className={`w-full truncate`}
//               options={allExercises}
//               selectedOption={selectedExerciseName}
//             />
//           </ItemCell>
//           <ItemCell
//             className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.exercise} truncate border-t indent-1 text-slate-300`}
//           >
//             {exercise.muscle}
//           </ItemCell>
//         </div>

//         <ItemCell
//           className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.actions} relative`}
//         >
//           <DropdownButton onDropdownClick={onDropdownClick} />
//           {isOpen ? (
//             <Dropdown onClose={onDropdownClose}>
//               <Dropdown.Item onClick={onModalOpen}>
//                 Create Superset
//               </Dropdown.Item>
//             </Dropdown>
//           ) : null}
//         </ItemCell>

//         {isModalOpen ? (
//           <Modal isOpen={isModalOpen} onClose={onModalClose}>
//             <DropdownListModal
//               items={exercises}
//               supersets={supersets}
//               selectedId={exercise.id}
//               onClose={onDropdownClose}
//               onItemClick={onItemClick}
//             />
//           </Modal>
//         ) : null}
//       </div>
//     </li>
//   );
// }

type DroppableDayProps = {
  split: SessionSplitType;
  droppableId: string;
  mesocycleIndex: number;
  exercises: ExerciseType[];
  selectedMicrocycleIndex: number;
  onSupersetUpdate: (
    _exercise: ExerciseType,
    exercise: ExerciseType,
    sessionId: string
  ) => void;
};

function DroppableDay({
  split,
  droppableId,
  mesocycleIndex,
  exercises,
  selectedMicrocycleIndex,
  onSupersetUpdate,
}: DroppableDayProps) {
  const { sessionDurationCalculator, durationTimeConstants } =
    useSessionDurationVariablesContext();

  const [isDropdownOpen, setIsdropdownOpen] = useState(false);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);

  const totalDuration = sessionDurationCalculator(
    exercises,
    selectedMicrocycleIndex
  );

  const onOpenDropdown = () => setIsdropdownOpen(true);
  const onCloseDropdown = () => setIsdropdownOpen(false);
  const onOpenDurationModal = () => setIsDurationModalOpen(true);
  const onCloseDurationModal = () => setIsDurationModalOpen(false);
  return (
    <li className={`${BG_COLOR_M5} rounded p-1`}>
      <div className={"flex flex-col pb-1"}>
        <div
          className={
            getSplitColor(split).bg +
            " mx-1 mb-2 mt-1 flex items-center rounded-sm p-0.5 indent-1 text-sm font-bold text-white"
          }
        >
          {split.charAt(0).toUpperCase() + split.slice(1)}
        </div>

        <DaySessionItemHeaders />
      </div>

      <StrictModeDroppable
        droppableId={`${droppableId}_${mesocycleIndex}`}
        type={`week_${mesocycleIndex}`}
      >
        {(provided, snapshot) => (
          <ul
            id={`week_${mesocycleIndex}`}
            className="w-full pr-0.5"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {exercises.map((each, index) => {
              return (
                <Draggable
                  key={`${each.id}_${mesocycleIndex}`}
                  draggableId={`${each.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <DaySessionItem
                        index={index + 1}
                        exercise={each}
                        sessionId={droppableId}
                        exercises={exercises}
                        selectedMicrocycleIndex={selectedMicrocycleIndex}
                        selectedMesocycleIndex={mesocycleIndex}
                        onSupersetUpdate={onSupersetUpdate}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </StrictModeDroppable>

      <div className={`m-1 flex justify-between p-1`}>
        <Settings>
          <Settings.Section title="Total Duration">
            <div className="indent-1 text-xxs text-white">
              {totalDuration}min
            </div>
          </Settings.Section>
        </Settings>

        <div
          onClick={() => onOpenDropdown()}
          className="relative flex cursor-pointer items-center justify-center"
        >
          <DotsIcon fill="#1E293B" />
          {isDropdownOpen ? (
            <Dropdown onClose={onCloseDropdown}>
              <Dropdown.Item onClick={onOpenDurationModal}>
                Edit Duration Settings
              </Dropdown.Item>
            </Dropdown>
          ) : null}
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
}

type DayLayoutProps = {
  session: DraggableExercises;
  mesocycleIndex: number;
  selectedMicrocycleIndex: number;
  onSupersetUpdate: (
    _exercise: ExerciseType,
    exercise: ExerciseType,
    sessionId: string
  ) => void;
};

function DayLayout({
  session,
  mesocycleIndex,
  selectedMicrocycleIndex,
  onSupersetUpdate,
}: DayLayoutProps) {
  const { day, sessions } = session;

  return (
    <li className={`${BORDER_COLOR_M7} mb-2 rounded border-2`}>
      <div className={`${BORDER_COLOR_M7} ${BG_COLOR_M7} p-1`}>
        <h3 className="indent-1 text-white">{day}</h3>
      </div>

      <SessionDurationVariablesProvider>
        <StrictModeDroppable
          droppableId={`${day}_${mesocycleIndex}`}
          type={`session_${mesocycleIndex}`}
        >
          {(provided, snapshot) => (
            <ul
              id={`session_${mesocycleIndex}`}
              className="flex flex-col p-1"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sessions.map((each, index) => {
                return (
                  <DroppableDay
                    key={`${each.id}_${index}_${mesocycleIndex}`}
                    split={each.split}
                    mesocycleIndex={mesocycleIndex}
                    droppableId={each.id}
                    exercises={each.exercises}
                    selectedMicrocycleIndex={selectedMicrocycleIndex}
                    onSupersetUpdate={onSupersetUpdate}
                  />
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </StrictModeDroppable>
      </SessionDurationVariablesProvider>
    </li>
  );
}

export default function TrainingWeekOverview() {
  const { training_block, training_program_params } =
    useTrainingProgramContext();
  const { microcycles, mesocycles } = training_program_params;
  const mesocycleTitles = Array.from(
    Array(mesocycles),
    (e, i) => `Mesocycle ${i + 1}`
  );
  const microcycleTitles = Array.from(
    Array(microcycles),
    (e, i) => `Week ${i + 1}`
  );

  const [selectedMicrocycleIndex, setSelectedMicrocycleIndex] =
    useState<number>(0);
  const [selectedMesocycleIndex, setSelectedMesocycleIndex] =
    useState<number>(0);

  const onClickHandler = (value: string) => {
    const type = value.split(" ");
    const valueAsNumber = parseInt(type[1]) - 1;
    if (type[0] === "Mesocycle") {
      setSelectedMesocycleIndex(valueAsNumber);
    } else {
      setSelectedMicrocycleIndex(valueAsNumber);
    }
  };

  return (
    <div
      id="exercise_editor"
      className={`flex flex-col items-center rounded ${BG_COLOR_M6}`}
    >
      <MesocycleToggle
        mesocycles={mesocycleTitles}
        microcycles={microcycleTitles}
        selectedMesocycleIndex={selectedMesocycleIndex}
        selectedMicrocycleIndex={selectedMicrocycleIndex}
        onClickHandler={onClickHandler}
      />
      <WeekSessions
        selectedMesocycleIndex={selectedMesocycleIndex}
        selectedMicrocycleIndex={selectedMicrocycleIndex}
        training_week={training_block[selectedMesocycleIndex]}
      />
    </div>
  );
}

type WeekSessionsProps = {
  selectedMesocycleIndex: number;
  selectedMicrocycleIndex: number;
  training_week: TrainingDayType[];
};

function WeekSessions({
  selectedMesocycleIndex,
  selectedMicrocycleIndex,
  training_week,
}: WeekSessionsProps) {
  const {
    draggableExercises,
    onSplitChange,
    onSupersetUpdate,
    modalOptions,
    onDragEnd,
  } = useExerciseSelection(training_week, selectedMesocycleIndex);

  const [isModalPrompted, setIsModalPrompted] = useState<boolean>(false);

  // NOTE: a lot of logic missing here to determine if an exercise CAN move to another split
  //       as well as if it can should it change the split type??

  return (
    <div className={"flex w-full flex-col p-2"}>
      {modalOptions && isModalPrompted ? (
        <Prompt
          splitOptions={modalOptions}
          isOpen={isModalPrompted}
          onClose={onSplitChange}
        />
      ) : null}

      <ul className="flex space-x-1 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          {draggableExercises?.map((each, index) => {
            // NOTE: to not display days w/o any sessions
            const hasSessions = each.sessions.find((ea) => ea.exercises.length);
            if (!hasSessions) return null;
            return (
              <DayLayout
                key={`${each.day}_${selectedMesocycleIndex}_draggableExercisesObject_${index}`}
                session={each}
                mesocycleIndex={selectedMesocycleIndex}
                selectedMicrocycleIndex={selectedMicrocycleIndex}
                onSupersetUpdate={onSupersetUpdate}
              />
            );
          })}
        </DragDropContext>
      </ul>
    </div>
  );
}
