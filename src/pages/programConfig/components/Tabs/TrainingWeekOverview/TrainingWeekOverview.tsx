import { DotsVerticalIcon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { memo, ReactNode, useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import Modal from "~/components/Modals/Modal";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  ExerciseType,
  SessionSplitType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import {
  getExerciseSetsOverMicrocycles,
  getGroupList,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getRankColor, getSplitColor } from "~/utils/getIndicatorColors";
import ExerciseItemLayout from "./components/Exercise/Exercise";
import MesocycleToggle from "./components/MesocycleToggle";
import SessionDurationVariables from "./components/Settings/SessionDuration/SessionDurationVariables";
import {
  SessionDurationVariablesProvider,
  useSessionDurationVariablesContext,
} from "./components/Settings/SessionDuration/sessionDurationVariablesContext";
import { DraggableExercises } from "./hooks/useExerciseSelection";
import { hydrateTrainingWeek } from "./hooks/useTrainingWeek";
import {
  canAddExerciseToSplit,
  getSupersetMap,
} from "./utils/exerciseSelectUtils";

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
  children: ReactNode;
};
const ExerciseItem = memo(
  ({
    index,
    exercise,
    sessionId,
    exercises,
    selectedMicrocycleIndex,
    selectedMesocycleIndex,
    onSupersetUpdate,
    children,
  }: ExerciseItemProps) => {
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
      const indexOne = exercises.findIndex(
        (each) => each.id === exerciseOne.id
      );
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
        bgColor = bgColorByRank.bg;
      }
      setBgColor(bgColor);
    }, [supersets, exercise]);

    const BORDER_COLOR = exercise.supersetWith
      ? "border-white"
      : `border-primary-700`;

    const onCloseHandler = () => {};
    const onItemClickHandler = () => {};
    return (
      <ExerciseItemLayout
        index={index}
        exerciseName={exercise.name}
        muscle={muscleGroup.muscle}
        sets={sets}
        reps={reps}
        lbs={lbs}
        supersetModal={
          <DropdownListModal
            items={exercises}
            supersets={supersets}
            selectedId={exercise.id}
            onClose={onCloseHandler}
            onItemClick={onItemClickHandler}
          />
        }
      >
        {children}
      </ExerciseItemLayout>
    );
  }
);

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

const DroppableSession = memo(
  ({
    split,
    droppableId,
    mesocycleIndex,
    exercises,
    selectedMicrocycleIndex,
    onSupersetUpdate,
  }: DroppableSessionProps) => {
    const { sessionDurationCalculator, durationTimeConstants } =
      useSessionDurationVariablesContext();

    const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);

    const totalDuration = sessionDurationCalculator(
      exercises,
      selectedMicrocycleIndex
    );

    const onCloseDurationModal = () => setIsDurationModalOpen(false);

    return (
      <li className={`overflow`}>
        <div className={"flex flex-col"}>
          <div
            className={cn(
              `flex items-center rounded-sm p-2 pl-0 indent-1 text-sm font-semibold ${
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
                const bgColorByRank = getRankColor(each.rank).bg;
                return (
                  <Draggable
                    key={`${each.id}_${mesocycleIndex}`}
                    draggableId={`${each.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <ExerciseItem
                          index={index + 1}
                          exercise={each}
                          sessionId={droppableId}
                          exercises={exercises}
                          selectedMicrocycleIndex={selectedMicrocycleIndex}
                          selectedMesocycleIndex={mesocycleIndex}
                          onSupersetUpdate={onSupersetUpdate}
                        >
                          <div
                            className={`flex items-center justify-start border-r border-input ${bgColorByRank}`}
                            {...provided.dragHandleProps}
                          >
                            <DragHandleDots2Icon fill="white" />
                          </div>
                        </ExerciseItem>
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
);

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

const DayLayout = memo(
  ({
    session,
    mesocycleIndex,
    selectedMicrocycleIndex,
    onSupersetUpdate,
  }: DayLayoutProps) => {
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
);

// changes occur in muscle_list and training_week

export default function TrainingWeekOverview() {
  const { training_program_params } = useTrainingProgramContext();
  const { microcycles, mesocycles } = training_program_params;

  const [selectedMesocycleIndex, setSelectedMesocycleIndex] = useState<number>(
    mesocycles - 1
  );
  const [selectedMicrocycleIndex, setSelectedMicrocycleIndex] =
    useState<number>(microcycles - 1);
  // const [draggableExercises, setDraggableExercises] = useState<
  //   DraggableExercises[][]
  // >([]);

  // useEffect(() => {
  //   const hydratedTrainingBlock = training_block.map((each) =>
  //     hydrateTrainingWeek(each, prioritized_muscle_list)
  //   );
  //   setDraggableExercises(hydratedTrainingBlock);
  // }, [training_block, prioritized_muscle_list]);

  const mesocycleTitles = Array.from(
    Array(mesocycles),
    (e, i) => `Mesocycle ${i + 1}`
  );
  const microcycleTitles = Array.from(
    Array(microcycles),
    (e, i) => `Week ${i + 1}`
  );

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
        // training_week={draggableExercises}
        // setDraggableExercises={setDraggableExercises}
      />
    </div>
  );
}

type WeekSessionsProps = {
  selectedMesocycleIndex: number;
  selectedMicrocycleIndex: number;
  // training_week: DraggableExercises[][];
  // setDraggableExercises: React.Dispatch<SetStateAction<DraggableExercises[][]>>;
};

const WeekSessions = memo(
  ({
    selectedMesocycleIndex,
    selectedMicrocycleIndex,
  }: // training_week,
  // setDraggableExercises,
  WeekSessionsProps) => {
    // const { draggableExercises, setDraggableExercises, onSupersetUpdate } =
    //   useExerciseSelection(training_week, selectedMesocycleIndex);
    const { training_block, prioritized_muscle_list } =
      useTrainingProgramContext();
    const [draggableExercises, setDraggableExercises] = useState<
      DraggableExercises[][]
    >([]);
    const [exercisesBySelectedMeso, setExercisesBySelectedMeso] = useState<
      DraggableExercises[]
    >([]);

    useEffect(() => {
      const hydratedTrainingBlock = training_block.map((each) =>
        hydrateTrainingWeek(each, prioritized_muscle_list)
      );
      setDraggableExercises(hydratedTrainingBlock);
    }, [training_block, prioritized_muscle_list]);

    useEffect(() => {
      setExercisesBySelectedMeso(draggableExercises[selectedMesocycleIndex]);
    }, [draggableExercises, selectedMesocycleIndex]);
    // const exercises_selected_meso = draggableExercises[selectedMesocycleIndex];

    const onDragEnd = useCallback(
      (result: DropResult) => {
        if (!result.destination) return;
        const destination_id = result.destination.droppableId;
        const source_id = result.source.droppableId;
        const destination_day_index = parseInt(destination_id.split("_")[0]);
        const source_day_index = parseInt(source_id.split("_")[0]);
        // NOTE: only deals with days with 1 session as seen by the hardcoded zero.
        const destination_session_index = 0;
        const source_session_index = 0;
        const destination_exercise_index = result.destination.index;
        const source_exercise_index = result.source.index;

        const items = structuredClone(exercisesBySelectedMeso);

        const sourceExercise =
          items[source_day_index].sessions[source_session_index].exercises[
            source_exercise_index
          ];
        const targetSplit =
          items[destination_day_index].sessions[destination_session_index];

        const can_add_exercise_to_session = canAddExerciseToSplit(
          sourceExercise.muscle,
          targetSplit.split as SplitType
        );

        if (!can_add_exercise_to_session) {
          console.log(
            can_add_exercise_to_session,
            `ERROR: Cannot place an exercise of the ${sourceExercise.muscle} muscle type in a ${targetSplit.split} session.`
          );
        }

        const [removed] = items[source_day_index].sessions[
          source_session_index
        ].exercises.splice(source_exercise_index, 1);

        items[destination_day_index].sessions[
          destination_session_index
        ].exercises.splice(destination_exercise_index, 0, removed);

        const lol = draggableExercises.map((meso, mesoIndex) => {
          if (mesoIndex === selectedMesocycleIndex) return items;
          else return meso;
        });

        setDraggableExercises(lol);
        console.log(
          draggableExercises,
          exercisesBySelectedMeso,
          "WHERE'd MY LIST GO YO?"
        );
      },
      [exercisesBySelectedMeso, draggableExercises, selectedMicrocycleIndex]
    );

    const onSupersetUpdate = () => {};
    return (
      <div className={"flex w-full flex-col"}>
        <ul className="flex space-x-2 overflow-x-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            {exercisesBySelectedMeso?.map((each, index) => {
              // NOTE: to not display days w/o any sessions
              const hasSessions = each.sessions.find(
                (ea) => ea.exercises.length
              );
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
);
