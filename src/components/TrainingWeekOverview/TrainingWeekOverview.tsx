import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import Modal from "~/components/Modals/Modal";
import {
  ExerciseType,
  SessionSplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import {
  getExerciseSetsOverMicrocycles,
  getGroupList,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getRankColor, getSplitColor } from "~/utils/getIndicatorColors";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ExerciseItemLayout from "./components/Exercise/Exercise";
import MesocycleToggle from "./components/MesocycleToggle";
import SessionDurationVariables from "./components/Settings/SessionDuration/SessionDurationVariables";
import {
  SessionDurationVariablesProvider,
  useSessionDurationVariablesContext,
} from "./components/Settings/SessionDuration/sessionDurationVariablesContext";
import { getSupersetMap } from "./components/utils/exerciseSelectUtils";
import useExerciseSelection, {
  DraggableExercises,
} from "./hooks/useExerciseSelection";
import useTrainingWeek from "./hooks/useTrainingWeek";

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

export function DropdownListModal({
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
      <ul className={cn(`w-44 space-y-2`)}>
        {items.map((each, index) => {
          const getBGColor = supersets.get(each.id);
          const bgColor = getBGColor ? getBGColor : "";
          return (
            <li
              className={cn(
                `cursor-pointer rounded-sm bg-card p-2 text-xs text-white hover:bg-primary-500`,
                getRankColor(each.rank),
                {
                  [`border-white bg-primary-500`]: each.id === selectedId,
                  [bgColor]: supersets.get(each.id),
                }
              )}
              key={each.id}
              onClick={() => onItemClick(each)}
            >
              {index + 1} {each.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type ExerciseItemProps = {
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
function ExerciseItem({
  index,
  exercise,
  sessionId,
  exercises,
  selectedMicrocycleIndex,
  selectedMesocycleIndex,
  onSupersetUpdate,
}: ExerciseItemProps) {
  const { training_program_params, prioritized_muscle_list } =
    useTrainingProgramContext();
  const { microcycles } = training_program_params;
  const muscleGroup = prioritized_muscle_list.filter(
    (muscle) => muscle.muscle === exercise.muscle
  )[0];
  const [bgColor, setBgColor] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const supersets = getSupersetMap(exercises);

  const allExercises = getGroupList(exercise.muscle).map((each) => each.name);

  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(
    exercise.name
  );

  const setsOverWeek = getExerciseSetsOverMicrocycles(
    exercise.id,
    muscleGroup,
    selectedMesocycleIndex,
    microcycles
  );

  const sets = setsOverWeek[selectedMicrocycleIndex];
  const reps = 10;
  const lbs = 100;
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

  useEffect(() => {
    const supersettedColor = supersets?.get(exercise.id);
    let bgColor = "";
    if (supersettedColor) {
      bgColor = supersettedColor;
    } else {
      const bgColorByRank = getRankColor(exercise.rank);
      bgColor = bgColorByRank.text;
    }
    setBgColor(bgColor);
  }, [supersets, exercise]);

  const BORDER_COLOR = exercise.supersetWith
    ? "border-white"
    : `border-primary-700`;

  return (
    <ExerciseItemLayout
      index={index}
      exerciseName={exercise.name}
      muscle={muscleGroup.muscle}
      muscleColor={bgColor}
      sets={sets}
      reps={reps}
      lbs={lbs}
      supersetModal={
        <DropdownListModal
          items={exercises}
          supersets={supersets}
          selectedId={exercise.id}
          onClose={() => console.log("lol")}
          onItemClick={() => console.log("lol")}
        />
      }
    />
  );
}

type DroppableSessionProps = {
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

function DroppableSession({
  split,
  droppableId,
  mesocycleIndex,
  exercises,
  selectedMicrocycleIndex,
  onSupersetUpdate,
}: DroppableSessionProps) {
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
    <li className={``}>
      <div className={"flex flex-col"}>
        <div
          className={cn(
            `flex items-center rounded-sm p-2 indent-1 text-sm font-semibold ${
              getSplitColor(split).text
            }`
          )}
        >
          {split.charAt(0).toUpperCase() + split.slice(1)}
        </div>
      </div>

      <StrictModeDroppable
        droppableId={`${droppableId}_${mesocycleIndex}`}
        type={`week_${mesocycleIndex}`}
      >
        {(provided, snapshot) => (
          <ul
            id={`week_${mesocycleIndex}`}
            className="w-full space-y-2 p-2 pt-1"
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
                      <ExerciseItem
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
        <div className="grid grid-cols-4 grid-rows-2 text-xs">
          <div>Totals</div>
          <div className=" text-muted-foreground">Sets</div>
          <div className=" text-muted-foreground">Reps</div>
          <div className=" text-muted-foreground">Duration</div>

          <div className="col-start-2  text-white">10</div>
          <div className=" text-white">100</div>
          <div className=" text-white">{totalDuration}min</div>
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
    <li className={``}>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 p-3">
          <CardTitle>{day}</CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <DotsVerticalIcon fill="white" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-44">
              <DropdownMenuItem>??</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-3 pt-0">
          <SessionDurationVariablesProvider>
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
                      <DroppableSession
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
        </CardContent>
      </Card>
    </li>
  );
}

// changes occur in muscle_list and training_week

export default function TrainingWeekOverview() {
  const { training_block, training_program_params, prioritized_muscle_list } =
    useTrainingProgramContext();
  const { microcycles, mesocycles } = training_program_params;

  const [selectedMesocycleIndex, setSelectedMesocycleIndex] = useState<number>(
    mesocycles - 1
  );

  const { hydratedTrainingBlock } = useTrainingWeek(
    training_block,
    prioritized_muscle_list,
    selectedMesocycleIndex
  );

  const mesocycleTitles = Array.from(
    Array(mesocycles),
    (e, i) => `Mesocycle ${i + 1}`
  );
  const microcycleTitles = Array.from(
    Array(microcycles),
    (e, i) => `Week ${i + 1}`
  );

  const [selectedMicrocycleIndex, setSelectedMicrocycleIndex] =
    useState<number>(microcycles - 1);

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
    <div id="exercise_editor" className={`flex flex-col space-y-5 rounded`}>
      <div className="flex flex-col rounded-md border border-primary-700">
        <MesocycleToggle
          mesocycles={mesocycleTitles}
          microcycles={microcycleTitles}
          selectedMesocycleIndex={selectedMesocycleIndex}
          selectedMicrocycleIndex={selectedMicrocycleIndex}
          onClickHandler={onClickHandler}
        />

        <SessionDurationVariables />
      </div>

      <WeekSessions
        selectedMesocycleIndex={selectedMesocycleIndex}
        selectedMicrocycleIndex={selectedMicrocycleIndex}
        training_week={hydratedTrainingBlock[selectedMesocycleIndex]}
      />
    </div>
  );
}

type WeekSessionsProps = {
  selectedMesocycleIndex: number;
  selectedMicrocycleIndex: number;
  training_week: DraggableExercises[];
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

  // NOTE: a lot of logic missing here to determine if an exercise CAN move to another split
  //       as well as if it can should it change the split type??

  return (
    <div className={"flex w-full flex-col"}>
      <ul className="flex space-x-2 overflow-x-auto">
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
