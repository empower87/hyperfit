import {
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import {
  CardS as Card,
  SectionH2 as Section,
} from "~/components/Layout/Sections";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M6,
  BORDER_COLOR_M7,
  BORDER_COLOR_M8,
} from "~/constants/themes";
import {
  EXERCISE_TRAINING_MODALITIES,
  ExerciseType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getGroupList } from "~/utils/getExercises";
import { getRankColor } from "~/utils/getRankColor";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import { capitalizeFirstLetter } from "~/utils/uiHelpers";
import ExercisesPreview from "./components/ExercisesPreview";
import MesocycleToggle from "./components/MesocycleToggle";
import SessionDurationVariables from "./components/Settings/SessionDuration/SessionDurationVariables";
import {
  SessionDurationVariablesProvider,
  useSessionDurationVariablesContext,
} from "./components/Settings/SessionDuration/sessionDurationVariablesContext";
import { getSupersetMap } from "./exerciseSelectUtils";
import useExerciseSelection, {
  DraggableExercises,
} from "./useExerciseSelection";

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
  supersets: Map<string, string> | undefined;
  selectedId: ExerciseType["id"];
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (exercise: ExerciseType) => void;
};

function DropdownListModal({
  items,
  supersets,
  selectedId,
  isOpen,
  onClose,
  onItemClick,
}: DropdownListProps) {
  const root = document.getElementById("modal-body")!;

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className="absolute z-10 flex h-full w-full flex-col items-center justify-center"
      onClick={() => onClose()}
    >
      <ul className={cn(`w-52 ${BG_COLOR_M6}`)}>
        {items.map((each, index) => {
          const supersetted = supersets?.get(each.id);
          return (
            <li
              className={cn(
                `${BORDER_COLOR_M7} m-0.5 cursor-pointer border-2 text-xs text-white hover:${BG_COLOR_M5}`,
                getRankColor(each.rank),
                {
                  [`${BG_COLOR_M5} border-white`]: each.id === selectedId,
                  [`${supersets?.get(each.id)}`]: supersets?.get(each.id),
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
    </div>,
    root
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
      <div className="flex h-2 w-2 items-center justify-center">.</div>
      <div className="flex h-2 w-2 items-center justify-center">.</div>
      <div className="flex h-2 w-2 items-center justify-center">.</div>
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
      className={cn(` bg-inherit`, className)}
      defaultValue={selectedOption}
    >
      {options.map((option, index) => {
        return (
          <option
            key={`${option}_${index}`}
            className={cn(`${BG_COLOR_M6}`)}
            value={option}
            // selected={option === selectedOption}
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
    <div {...props} className={cn(`flex border-r-2 p-0.5 text-xxs`, className)}>
      {children}
    </div>
  );
};
function DaySessionItemHeaders({}) {
  return (
    <div className="mt-1 flex w-full text-white">
      <ItemCell
        className={`${BORDER_COLOR_M6} ${BG_COLOR_M7} ${ITEM_CELL_WIDTHS.index} text-xxxs`}
      >
        {" "}
      </ItemCell>
      <div className="flex w-full">
        <ItemCell
          className={`${BORDER_COLOR_M6} ${BG_COLOR_M7} ${ITEM_CELL_WIDTHS.sets} justify-center text-xxxs`}
        >
          Sets
        </ItemCell>
        <ItemCell
          className={`${BORDER_COLOR_M6} ${BG_COLOR_M7} ${ITEM_CELL_WIDTHS.reps} justify-center text-xxxs`}
        >
          Reps
        </ItemCell>
        <ItemCell
          className={`${BORDER_COLOR_M6} ${BG_COLOR_M7} ${ITEM_CELL_WIDTHS.lbs} justify-center text-xxxs`}
        >
          Lbs
        </ItemCell>
        <div className="flex flex-col">
          <ItemCell
            className={`${BORDER_COLOR_M6} ${BG_COLOR_M7} ${ITEM_CELL_WIDTHS.exercise} text-xxxs`}
          >
            Exercise
          </ItemCell>
        </div>
        <ItemCell
          className={`${BORDER_COLOR_M6} ${BG_COLOR_M7} ${ITEM_CELL_WIDTHS.actions} text-xxxs`}
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
  onSupersetUpdate,
}: DaySessionItemProps) {
  // const bgColor = getRankColor(exercise.rank);
  const [bgColor, setBgColor] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const supersets = getSupersetMap(exercises);

  const allExercises = getGroupList(exercise.muscle).map((each) => each.name);

  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(
    exercise.exercise
  );
  const mesocycle_progression = exercise.mesocycle_progression;
  const sets = mesocycle_progression[selectedMicrocycleIndex].sets;
  const reps = mesocycle_progression[selectedMicrocycleIndex].reps;
  const lbs = mesocycle_progression[selectedMicrocycleIndex].weight;
  const modality = exercise.trainingModality;

  const onItemClick = useCallback((exerciseOne: ExerciseType) => {
    // sorts supersetted exercises by place in list
    let indexOne = exercises.findIndex((each) => each.id === exerciseOne.id);
    let indexTwo = exercises.findIndex((each) => each.id === exercise.id);
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
    <li className={cn(`mb-0.5 flex text-white`)}>
      <ItemCell
        className={cn(
          `${BORDER_COLOR} ${ITEM_CELL_WIDTHS.index} justify-center`
        )}
      >
        {index}
      </ItemCell>
      <div className={cn(`${BORDER_COLOR} flex border-y-2 ${bgColor}`)}>
        <div className="flex flex-col">
          <div className={cn(`${BORDER_COLOR} flex border-b`)}>
            <ItemCell
              className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.sets} justify-center border-r`}
            >
              {sets}
            </ItemCell>
            <ItemCell
              className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.reps} justify-center border-r`}
            >
              {reps}
            </ItemCell>
            <ItemCell
              className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.lbs} justify-center`}
            >
              {lbs}
            </ItemCell>
          </div>
          <ItemCell className={`${BORDER_COLOR}`}>
            <SelectDropdown
              options={[...EXERCISE_TRAINING_MODALITIES]}
              className={`${ITEM_CELL_WIDTHS.modality}`}
              selectedOption={modality}
            />
          </ItemCell>
        </div>

        <div className=" flex flex-col text-xxs">
          <ItemCell className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.exercise}`}>
            <SelectDropdown
              className={`w-full truncate`}
              options={allExercises}
              selectedOption={selectedExerciseName}
            />
          </ItemCell>
          <ItemCell
            className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.exercise} truncate border-t indent-1 text-slate-300`}
          >
            {exercise.muscle}
          </ItemCell>
        </div>

        <ItemCell className={`${BORDER_COLOR} ${ITEM_CELL_WIDTHS.actions}`}>
          <DropdownButton onDropdownClick={onDropdownClick} />
        </ItemCell>
        {isOpen ? (
          <DropdownListModal
            items={exercises}
            supersets={supersets}
            selectedId={exercise.id}
            isOpen={isOpen}
            onClose={onDropdownClose}
            onItemClick={onItemClick}
          />
        ) : null}
      </div>
    </li>
  );
}

type DroppableDayProps = {
  split: SplitType;
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
  const [totalDuration, setTotalDuration] = useState(0);
  const { sessionDurationCalculator, durationTimeConstants } =
    useSessionDurationVariablesContext();
  useEffect(() => {
    const totalDuration = sessionDurationCalculator(
      exercises,
      selectedMicrocycleIndex
    );
    setTotalDuration(totalDuration);
  }, [selectedMicrocycleIndex, exercises, durationTimeConstants]);

  return (
    <li className="">
      <div className={"flex flex-col px-1"}>
        <div
          className={
            getSessionSplitColor(split).bg +
            " indent-1 text-sm font-bold text-white"
          }
        >
          {split}
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
            className="w-full p-1"
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

      <div className=" mt-1 flex w-full flex-col">
        <div className=" indent-1 text-xxs text-white">Total Est. Duration</div>
        <div className=" indent-1 text-xxs text-white">{totalDuration}min</div>
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
    <div className={BG_COLOR_M6 + " rounded-md"}>
      <div className={BORDER_COLOR_M8 + " mb-1 border-b-2 p-1"}>
        <h3 className=" indent-1 text-white">{day}</h3>
      </div>

      <StrictModeDroppable
        droppableId={`${day}_${mesocycleIndex}`}
        type={`session_${mesocycleIndex}`}
      >
        {(provided, snapshot) => (
          <ul
            id={`session_${mesocycleIndex}`}
            className="flex flex-col"
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
    </div>
  );
}

type TitleProps = {
  title: string;
  selected: string;
  onClick: (title: string) => void;
};
function Title({ title, selected, onClick }: TitleProps) {
  const isSelected = title === selected;
  const text = isSelected ? "text-sm text-white" : "text-xxs text-slate-400";
  return (
    <div
      className={cn(
        `w-full cursor-pointer p-0.5 ${BG_COLOR_M7} hover:${BG_COLOR_M6}`,
        {
          [`${BG_COLOR_M6} text-m mb-1 text-white`]: isSelected,
          [`${BG_COLOR_M7} text-sm text-slate-400`]: !isSelected,
        }
      )}
      onClick={() => onClick(title)}
    >
      <p className={cn(`indent-1 ${text}`)}>{title}</p>
    </div>
  );
}

function SessionsWithExercises() {
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
    <div className={`flex flex-col items-center`}>
      <MesocycleToggle
        mesocycles={mesocycleTitles}
        microcycles={microcycleTitles}
        selectedMesocycleIndex={selectedMesocycleIndex}
        selectedMicrocycleIndex={selectedMicrocycleIndex}
        onClickHandler={onClickHandler}
      />
      <WeekSessions
        mesocycle_index={selectedMesocycleIndex}
        selectedMicrocycleIndex={selectedMicrocycleIndex}
        training_week={training_block[selectedMesocycleIndex]}
      />
    </div>
  );
}

type WeekSessionsProps = {
  mesocycle_index: number;
  selectedMicrocycleIndex: number;
  training_week: TrainingDayType[];
};

function WeekSessions({
  mesocycle_index,
  selectedMicrocycleIndex,
  training_week,
}: WeekSessionsProps) {
  const {
    draggableExercises,
    onSplitChange,
    onSupersetUpdate,
    modalOptions,
    onDragEnd,
  } = useExerciseSelection(training_week, mesocycle_index);

  const [isModalPrompted, setIsModalPrompted] = useState<boolean>(false);

  // NOTE: a lot of logic missing here to determine if an exercise CAN move to another split
  //       as well as if it can should it change the split type??

  return (
    <div className={" my-1 flex flex-col"}>
      {modalOptions && isModalPrompted ? (
        <Prompt
          splitOptions={modalOptions}
          isOpen={isModalPrompted}
          onClose={onSplitChange}
        />
      ) : null}

      <div className="flex space-x-1">
        <DragDropContext onDragEnd={onDragEnd}>
          {draggableExercises?.map((each, index) => {
            // NOTE: to not display days w/o any sessions
            const hasSessions = each.sessions.find((ea) => ea.exercises.length);
            if (!hasSessions) return null;
            return (
              <DayLayout
                key={`${each.day}_${mesocycle_index}_draggableExercisesObject_${index}`}
                session={each}
                mesocycleIndex={mesocycle_index}
                selectedMicrocycleIndex={selectedMicrocycleIndex}
                onSupersetUpdate={onSupersetUpdate}
              />
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

type DurationTimeConstants = typeof DURATION_TIME_CONSTRAINTS;
type DurationTimeConstantsKeys = keyof DurationTimeConstants;
type DurationTimeConstraint = DurationTimeConstants[DurationTimeConstantsKeys];

const MODALITY_TIME_CONSTRAINTS = {
  myoreps: {
    value: 10,
    min: 1,
    max: 15,
    increment: 1,
    rir: "0-2",
    initialReps: 10,
    followingReps: 5,
    followingRepsPercentageConstant: 0.41,
  },
  dropsets: {
    value: 5,
    min: 0,
    max: 10,
    increment: 1,
    rir: "0-4",
  },
};
// NOTE: use seconds
const DURATION_TIME_CONSTRAINTS = {
  warmup: {
    value: 300,
    min: 0,
    max: 600,
    increment: 30,
  },
  rest: {
    value: 120,
    min: 0,
    max: 300,
    increment: 15,
  },
  superset: {
    value: 90,
    min: 0,
    max: 120,
    increment: 10,
  },
  rep: {
    value: 2,
    min: 1,
    max: 10,
    increment: 1,
  },
};

ExerciseOverview.ExercisePreview = ExercisesPreview;
export default function ExerciseOverview({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Section title={"EXERCISES"}>
      <SessionDurationVariablesProvider>
        <div className="mb-2 flex justify-center space-x-2 text-xxs text-white">
          {children}
          <Card title="SETTINGS">
            <SessionDurationVariables />
          </Card>
        </div>

        <SessionsWithExercises />
      </SessionDurationVariablesProvider>
    </Section>
  );
}

type TimeIncrementFrameProps = {
  title: DurationTimeConstantsKeys;
  constraints: DurationTimeConstraint;
  onTimeChange: (key: DurationTimeConstantsKeys, time: number) => void;
};

type IncrementBtnProps = {
  operation: "+" | "-";
  onClick: () => void;
};
const IncrementBtn = ({ operation, onClick }: IncrementBtnProps) => {
  return (
    <button
      className={cn(
        `${BG_COLOR_M5} m-1 flex h-4 w-4 items-center justify-center p-1 text-xs text-white`
      )}
      onClick={onClick}
    >
      {operation}
    </button>
  );
};

const TimeIncrementFrame = ({
  title,
  constraints,
  onTimeChange,
}: TimeIncrementFrameProps) => {
  const [time, setTime] = useState<string>("00:00");
  const { value, min, max, increment } = constraints;
  const timeInSecondsRef = useRef<number>(value);

  useEffect(() => {
    const formattedTime = formatTime(timeInSecondsRef.current);
    setTime(formattedTime);
  }, [timeInSecondsRef]);

  const onIncrement = (operation: "+" | "-") => {
    if (operation === "+") {
      if (timeInSecondsRef.current + increment > max) return;
      timeInSecondsRef.current = timeInSecondsRef.current + increment;
    } else {
      if (timeInSecondsRef.current - increment < min) return;
      timeInSecondsRef.current = timeInSecondsRef.current - increment;
    }
    const formattedTime = formatTime(timeInSecondsRef.current);
    setTime(formattedTime);
    onTimeChange(title, timeInSecondsRef.current);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex">
      <div className="m-1 w-12 text-xs text-white">{title}</div>

      <div className="flex">
        <IncrementBtn operation={"-"} onClick={() => onIncrement("-")} />
        <div className="m-1 flex w-6 items-center justify-center text-xs text-white">
          {time}
        </div>
        <IncrementBtn operation={"+"} onClick={() => onIncrement("+")} />
      </div>
    </div>
  );
};
