import { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import Section from "~/components/Layout/Section";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M7,
  BORDER_COLOR_M8,
} from "~/constants/themes";
import {
  DayType,
  ExerciseType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getGroupList } from "~/utils/getExercises";
import { getRankColor } from "~/utils/getRankColor";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import { canAddExerciseToSplit, findOptimalSplit } from "./exerciseSelectUtils";

type PromptProps = {
  splitOptions: SplitType[];
  isOpen: boolean;
  onClose: (split: SplitType) => void;
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
        <div className=" text-xxs flex flex-col text-white">
          <div className=" mb-0.5 text-slate-300">
            Adding this Exercise to this day would change the Training Split for
            that day.
          </div>
          <div className=" mb-1">
            Please select the Split you want to change it to:
          </div>
        </div>

        <ul>
          {splitOptions.map((each, index) => {
            return (
              <li
                key={`${each}_${index}`}
                className={cn(
                  `${BG_COLOR_M6} flex cursor-pointer text-sm text-white hover:${BG_COLOR_M5}`
                )}
                onClick={() => onClose(each)}
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
  items: ExerciseType[];
  selectedId: ExerciseType["id"];
};

type DropdownListProps = DropdownProps & {
  onClose: () => void;
  isOpen: boolean;
};
function DropdownList({
  items,
  selectedId,
  isOpen,
  onClose,
}: DropdownListProps) {
  const root = document.getElementById("modal-body")!;
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className="absolute flex h-full w-full items-center justify-center"
      onClick={onClose}
    >
      <ul className={cn(`w-52 ${BG_COLOR_M6}`)}>
        {items.map((each, index) => {
          return (
            <li
              className={cn("text-xs text-white", getRankColor(each.rank), {
                "border-2 border-white": each.id === selectedId,
              })}
              key={each.id}
            >
              {index + 1} {each.exercise}
            </li>
          );
        })}
      </ul>
    </div>,
    root
  );
}

function Dropdown({ items, selectedId }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onDropdownClick = () => {
    setIsOpen(true);
  };

  const onDropdownClose = () => {
    setIsOpen(false);
  };
  return (
    <div
      id="dropdown-modal"
      className={
        BORDER_COLOR_M7 +
        " relative flex w-1/12 flex-col items-center justify-center border-l-2"
      }
      onClick={() => onDropdownClick()}
    >
      <div className="flex h-2 w-2 items-center justify-center">.</div>
      <div className="flex h-2 w-2 items-center justify-center">.</div>
      <div className="flex h-2 w-2 items-center justify-center">.</div>
      {isOpen ? (
        <DropdownList
          items={items}
          selectedId={selectedId}
          isOpen={isOpen}
          onClose={onDropdownClose}
        />
      ) : null}
    </div>
  );
}

type DaySessionItemProps = {
  index: number;
  exercise: ExerciseType;
  exercises: ExerciseType[];
  selectedMicrocycleIndex: number;
};
function DaySessionItem({
  index,
  exercise,
  exercises,
  selectedMicrocycleIndex,
}: DaySessionItemProps) {
  const bgColor = getRankColor(exercise.rank);
  const allExercises = getGroupList(exercise.muscle);
  const mesocycle_progression = exercise.mesocycle_progression;

  const sets = mesocycle_progression[selectedMicrocycleIndex].sets;
  const reps = mesocycle_progression[selectedMicrocycleIndex].reps;
  return (
    <li className={" text-xxs mb-0.5 flex w-full text-white"}>
      <div className={" flex w-1/12 indent-1"}>{index}</div>

      <div className={BORDER_COLOR_M7 + " flex w-11/12 border-2 " + bgColor.bg}>
        <div className={BORDER_COLOR_M7 + " w-1/12 border-r-2"}>{sets}x</div>
        <div className={BORDER_COLOR_M7 + " w-1/12 border-r-2"}>{reps}</div>
        <div className=" flex w-9/12 flex-col">
          <select className={bgColor.bg + " truncate"}>
            {allExercises.map((each, index) => {
              return (
                <option
                  key={`${each}_option_${index}`}
                  selected={each.name === exercise.exercise ? true : false}
                >
                  {each.name}
                </option>
              );
            })}
          </select>

          <div
            className={
              BORDER_COLOR_M7 + " truncate border-t indent-1 text-slate-300"
            }
          >
            {exercise.muscle}
          </div>
        </div>
        <Dropdown items={exercises} selectedId={exercise.id} />
      </div>
    </li>
  );
}

type DroppableDayProps = {
  split: SplitType;
  droppableId: string;
  exercises: ExerciseType[];
  selectedMicrocycleIndex: number;
  sessionDurationCalculator: (
    exercises: ExerciseType[],
    currentMicrocycleIndex: number
  ) => number;
};
function DroppableDay({
  split,
  droppableId,
  exercises,
  selectedMicrocycleIndex,
  sessionDurationCalculator,
}: DroppableDayProps) {
  const [totalDuration, setTotalDuration] = useState(0);
  const [isSelectingSuperset, setIsSelectingSuperset] = useState(false);

  useEffect(() => {
    const totalDuration = sessionDurationCalculator(
      exercises,
      selectedMicrocycleIndex
    );
    setTotalDuration(totalDuration);
  }, [selectedMicrocycleIndex, exercises]);

  return (
    <li className=" w-52">
      <div className={" mb-1 p-1"}>
        <div
          className={
            getSessionSplitColor(split).bg + " indent-1 text-sm text-white"
          }
        >
          {split}
        </div>
      </div>

      <StrictModeDroppable droppableId={droppableId} type={"week"}>
        {(provided, snapshot) => (
          <ul
            id="week"
            className=" w-full"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {exercises.map((each, index) => {
              return (
                <Draggable
                  key={`${each.id}`}
                  draggableId={each.id}
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
                        exercises={exercises}
                        selectedMicrocycleIndex={selectedMicrocycleIndex}
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
        <div className=" text-xxs text-white">Total Est. Duration</div>
        <div className=" text-xxs text-white">{totalDuration}min</div>
      </div>
    </li>
  );
}

type DayLayoutProps = {
  session: DraggableExercisesObjectType;
  sessionDurationCalculator: (
    exercises: ExerciseType[],
    currentMicrocycleIndex: number
  ) => number;
  selectedMicrocycleIndex: number;
};

function DayLayout({
  session,
  sessionDurationCalculator,
  selectedMicrocycleIndex,
}: DayLayoutProps) {
  const { day, sessions } = session;

  return (
    <div className={BG_COLOR_M6 + " mr-1"}>
      <div className={BORDER_COLOR_M8 + " mb-1 border-b-2"}>
        <h3 className=" indent-1 text-white">{day}</h3>
      </div>

      <StrictModeDroppable droppableId={day} type={"session"}>
        {(provided, snapshot) => (
          <ul
            id="session"
            className=" flex flex-col"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {sessions.map((each, index) => {
              // const totalDuration = sessionDurationCalcuator(each.exercises);
              return (
                <DroppableDay
                  key={`${each.id}_${index}`}
                  split={each.split}
                  droppableId={each.id}
                  exercises={each.exercises}
                  selectedMicrocycleIndex={selectedMicrocycleIndex}
                  sessionDurationCalculator={sessionDurationCalculator}
                />
              );
            })}
          </ul>
        )}
      </StrictModeDroppable>
    </div>
  );
}

type DraggableExercisesObjectType = {
  day: DayType;
  sessions: {
    id: string;
    split: SplitType;
    exercises: ExerciseType[];
  }[];
};

type TitleProps = {
  title: string;
  selected: string;
  onClick: (title: string) => void;
};
function Title({ title, selected, onClick }: TitleProps) {
  const isSelected = title === selected;
  const text = isSelected ? "text-sm text-white" : "text-xs text-slate-400";
  return (
    <div
      className={cn(
        `mb-1 w-full cursor-pointer p-0.5 ${BG_COLOR_M7} hover:${BG_COLOR_M6}`,
        { [BG_COLOR_M6]: isSelected }
      )}
      onClick={() => onClick(title)}
    >
      <p className={text}>{title}</p>
    </div>
  );
}

type WeekSessionsProps = {
  mesocycle_index: number;
  microcycles: number;
  selectedMesocycle: string;
  training_week: TrainingDayType[];
  onTitleClick: (title: string) => void;
  sessionDurationCalculator: (
    exercises: ExerciseType[],
    currentMicrocycleIndex: number
  ) => number;
};
export default function WeekSessions({
  mesocycle_index,
  microcycles,
  selectedMesocycle,
  training_week,
  onTitleClick,
  sessionDurationCalculator,
}: WeekSessionsProps) {
  const title = `Mesocycle ${mesocycle_index}`;

  const [draggableExercisesObject, setDraggableExercisesObject] = useState<
    DraggableExercisesObjectType[]
  >([]);
  const [isModalPrompted, setIsModalPrompted] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<SplitType[]>([]);
  const [updateSplit, setUpdateSplit] = useState<{
    id: string;
    oldSplit: string;
    newSplit: string;
  }>();
  const [selectedMicrocycleIndex, setSelectedMicrocycleIndex] =
    useState<number>(0);

  useEffect(() => {
    let draggableExerciseList: DraggableExercisesObjectType[] = [];
    for (let i = 0; i < training_week.length; i++) {
      const sessions = training_week[i].sessions;
      let day: DraggableExercisesObjectType = {
        day: training_week[i].day,
        sessions: [],
      };

      for (let j = 0; j < sessions.length; j++) {
        if (training_week[i].isTrainingDay) {
          day.sessions.push({
            id: `${training_week[i].day}_${j}`,
            split: sessions[j].split,
            exercises: sessions[j].exercises.flat(),
          });
        }
      }

      draggableExerciseList.push(day);
    }
    setDraggableExercisesObject(draggableExerciseList);
  }, [training_week]);

  // NOTE: a lot of logic missing here to determine if an exercise CAN move to another split
  //       as well as if it can should it change the split type?
  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      let outerDestinationId = 0;
      let outerDestinationSessionId = 0;
      let outerDestinationExerciseIndex = result.destination.index;

      let outerSourceId = 0;
      let outerSourceSessionId = 0;
      let innerSourceId = result.source.index;

      const getOutterIndex = (droppableId: string) => {
        const splitId = droppableId.split("_");
        const index = parseInt(splitId[1]);
        switch (splitId[0]) {
          case "Monday":
            return [1, index];
          case "Tuesday":
            return [2, index];
          case "Wednesday":
            return [3, index];
          case "Thursday":
            return [4, index];
          case "Friday":
            return [5, index];
          case "Saturday":
            return [6, index];
          default:
            return [0, index];
        }
      };

      const destIndices = getOutterIndex(result.destination.droppableId);
      outerDestinationId = destIndices[0];
      outerDestinationSessionId = destIndices[1];

      const sourceIndices = getOutterIndex(result.source.droppableId);
      outerSourceId = sourceIndices[0];
      outerSourceSessionId = sourceIndices[1];

      const items = [...draggableExercisesObject];

      const sourceExercise =
        items[outerSourceId].sessions[outerSourceSessionId].exercises[
          innerSourceId
        ];
      const targetSplit =
        items[outerDestinationId].sessions[outerDestinationSessionId];
      const canAdd = canAddExerciseToSplit(
        sourceExercise.muscle,
        targetSplit.split
      );

      if (!canAdd) {
        const splitOptions = findOptimalSplit(
          sourceExercise.muscle,
          targetSplit.exercises
        );

        setModalOptions(splitOptions);
        setUpdateSplit({
          id: targetSplit.id,
          oldSplit: targetSplit.split,
          newSplit: "",
        });
        setIsModalPrompted(true);
      }

      const [removed] = items[outerSourceId].sessions[
        outerSourceSessionId
      ].exercises.splice(innerSourceId, 1);

      items[outerDestinationId].sessions[
        outerDestinationSessionId
      ].exercises.splice(outerDestinationExerciseIndex, 0, removed);

      setDraggableExercisesObject(items);
    },
    [draggableExercisesObject]
  );

  const onCloseModal = (split: SplitType) => {
    if (!updateSplit) return;

    const updateList: DraggableExercisesObjectType[] =
      draggableExercisesObject.map((each) => {
        const sessions = each.sessions.map((each) => {
          if (each.id === updateSplit.id) {
            return { ...each, split: split };
          } else return each;
        });

        return { ...each, sessions: sessions };
      });

    setDraggableExercisesObject(updateList);
    setIsModalPrompted(false);
  };

  const selectWeekIndexHandler = (week: string) => {
    const weekNumber = week.split(" ")[1];
    setSelectedMicrocycleIndex(parseInt(weekNumber) - 1);
  };

  if (title !== selectedMesocycle) {
    return (
      <Title
        title={title}
        selected={selectedMesocycle}
        onClick={onTitleClick}
      />
    );
  }
  return (
    <div className={" mb-1 flex flex-col"}>
      <Title
        title={title}
        selected={selectedMesocycle}
        onClick={onTitleClick}
      />
      <SelectMicrocycleList
        microcycles={microcycles}
        onWeekClick={selectWeekIndexHandler}
      />

      {isModalPrompted && (
        <Prompt
          splitOptions={modalOptions}
          isOpen={isModalPrompted}
          onClose={onCloseModal}
        />
      )}
      <div className="flex">
        <DragDropContext onDragEnd={onDragEnd}>
          {draggableExercisesObject.map((each, index) => {
            // NOTE: to not display days w/o any sessions
            const hasSessions = each.sessions.find((ea) => ea.exercises.length);
            if (!hasSessions) return null;
            return (
              <DayLayout
                key={`${each.day}_${index}_draggableExercisesObject`}
                session={each}
                sessionDurationCalculator={sessionDurationCalculator}
                selectedMicrocycleIndex={selectedMicrocycleIndex}
              />
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

type SelectMicrocycleListProps = {
  microcycles: number;
  onWeekClick: (week: string) => void;
};

const SelectMicrocycleList = ({
  microcycles,
  onWeekClick,
}: SelectMicrocycleListProps) => {
  const list = Array.from(Array(microcycles), (e, i) => `Week ${i + 1}`);
  const selectedClasses = `${BG_COLOR_M5} text-white font-bold`;
  const [selectedWeek, setSelectedWeek] = useState<string>("Week 1");

  const onClickHandler = (week: string) => {
    setSelectedWeek(week);
    onWeekClick(week);
  };
  return (
    <ul className={cn(`mb-1 flex w-full`)}>
      {list.map((week, i) => {
        return (
          <li
            key={week}
            className={cn(
              `text-xs hover:${BG_COLOR_M5} mr-1 cursor-pointer p-1 text-slate-400`,
              {
                [selectedClasses]: selectedWeek === week,
              }
            )}
            onClick={() => onClickHandler(week)}
          >
            {week}
          </li>
        );
      })}
    </ul>
  );
};

type DurationTimeConstraint = {
  value: number;
  min: number;
  max: number;
  increment: number;
};
type DurationTimeConstants = {
  warmup: DurationTimeConstraint;
  rest: DurationTimeConstraint;
  rep: DurationTimeConstraint;
};
type DurationTimeConstantsKeys = keyof DurationTimeConstants;

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
  rep: {
    value: 2,
    min: 1,
    max: 10,
    increment: 1,
  },
};

type MesocycleExerciseLayoutProps = {
  training_block: TrainingDayType[][];
  microcycles: number;
};

export const MesocycleExerciseLayout = ({
  training_block,
  microcycles,
}: MesocycleExerciseLayoutProps) => {
  const lastMesocycle = training_block.length;
  const [selectedMesocycle, setSelectedMesocycle] = useState(
    `Mesocycle ${lastMesocycle}`
  );
  const [durationTimeConstants, setDurationTimeConstants] =
    useState<DurationTimeConstants>({ ...DURATION_TIME_CONSTRAINTS });

  const onTitleClick = (title: string) => {
    if (title === selectedMesocycle) return;
    setSelectedMesocycle(title);
  };

  const onTimeChange = (key: DurationTimeConstantsKeys, time: number) => {
    const newDurationTimeConstants = {
      ...durationTimeConstants,
      [key]: { ...durationTimeConstants[key], value: time },
    };
    setDurationTimeConstants(newDurationTimeConstants);
  };

  const sessionDurationCalculator = useCallback(
    (exercises: ExerciseType[], currentMicrocycleIndex: number) => {
      const { warmup, rest, rep } = durationTimeConstants;
      // const totalSets = exercises.reduce((acc, prev) => acc + prev.sets, 0);
      const totalExercises = exercises.length;
      const restTime = totalExercises * rest.value;
      let totalRepTime = 0;
      let totalRestTime = 0;

      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i].mesocycle_progression;
        const { sets, reps } = exercise[currentMicrocycleIndex];
        const repTime = sets * reps * rep.value;
        const restTime = sets * rest.value;
        totalRestTime += restTime;
        totalRepTime += repTime;
      }
      const totalTimeInMinutes = Math.round(
        (warmup.value + restTime + totalRepTime + totalRestTime) / 60
      );

      return totalTimeInMinutes;
    },
    [durationTimeConstants]
  );

  return (
    <Section title={"Exercises"}>
      <div className=" text-xxs mb-2 flex text-white">
        <div className=" flex flex-col">
          <div className="mb-0.5 text-sm">Workout Duration Variables</div>
          <TimeIncrementFrame
            title="warmup"
            constraints={durationTimeConstants.warmup}
            onTimeChange={onTimeChange}
          />
          <TimeIncrementFrame
            title="rest"
            constraints={durationTimeConstants.rest}
            onTimeChange={onTimeChange}
          />
          <TimeIncrementFrame
            title="rep"
            constraints={durationTimeConstants.rep}
            onTimeChange={onTimeChange}
          />
        </div>
      </div>

      {training_block.map((each, index) => {
        return (
          <WeekSessions
            mesocycle_index={index + 1}
            microcycles={microcycles}
            training_week={each}
            selectedMesocycle={selectedMesocycle}
            onTitleClick={onTitleClick}
            sessionDurationCalculator={sessionDurationCalculator}
          />
        );
      })}
    </Section>
  );
};

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
      <div className="flex ">
        <IncrementBtn operation={"-"} onClick={() => onIncrement("-")} />
        <div className="m-1 flex w-6 items-center justify-center text-xs text-white">
          {time}
        </div>
        <IncrementBtn operation={"+"} onClick={() => onIncrement("+")} />
      </div>
    </div>
  );
};
