import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { DotsVerticalIcon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Draggable, DropResult } from "react-beautiful-dnd";
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
import { getRankColor, getSplitColor } from "~/utils/getIndicatorColors";
import {ExerciseItem as ExerciseItemLayout} from "./components/Exercise/Exercise";
import MesocycleToggle from "./components/MesocycleToggle";
import SessionDurationVariables from "./components/Settings/SessionDuration/SessionDurationVariables";
import { useSessionDurationVariablesContext } from "./components/Settings/SessionDuration/sessionDurationVariablesContext";
import { DraggableExercises } from "./hooks/useExerciseSelection";
import { hydrateTrainingWeek } from "./hooks/useTrainingWeek";
import {
  canAddExerciseToSplit,
  getSupersetMap,
} from "./utils/exerciseSelectUtils";
import { SortableSessionItemContainer } from "./components/Session/SessionItem";
import { arrayMove } from "@dnd-kit/sortable";



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
      onClick={onClose}
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


type DayLayoutProps = {
  session: DraggableExercises;
  children: ReactNode;
};

const DayLayout = ({ session, children }: DayLayoutProps) => {
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

        <CardContent className="p-3 pt-0">{children}</CardContent>
      </Card>
    </li>
  );
};

export default function TrainingWeekOverview() {
  const { training_program_params, training_block, prioritized_muscle_list } = useTrainingProgramContext();
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
  const [draggableExercises, setDraggableExercises] = useState<
    DraggableExercises[][]
  >([]);

  useEffect(() => {
    const hydratedTrainingBlock = training_block.map((each) =>
      hydrateTrainingWeek(each, prioritized_muscle_list)
    );
    setDraggableExercises(hydratedTrainingBlock);
  }, [training_block, prioritized_muscle_list]);

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
        training_week={draggableExercises[selectedMesocycleIndex]}
        // setDraggableExercises={setDraggableExercises}
      />
    </div>
  );
}

type WeekSessionsProps = {
  selectedMesocycleIndex: number;
  selectedMicrocycleIndex: number;
  training_week: DraggableExercises[]
  // setDraggableExercises: React.Dispatch<SetStateAction<DraggableExercises[][]>>;
};

const WeekSessions = memo(
  ({ selectedMesocycleIndex, selectedMicrocycleIndex, training_week }: WeekSessionsProps) => {
    // const { draggableExercises, setDraggableExercises, onSupersetUpdate } =
    //   useExerciseSelection(training_week, selectedMesocycleIndex);
    // const { training_block, prioritized_muscle_list } =
    //   useTrainingProgramContext();
    // const [draggableExercises, setDraggableExercises] = useState<
    //   DraggableExercises[][]
    // >([]);
    
    const [exercisesBySelectedMeso, setExercisesBySelectedMeso] = useState<
      DraggableExercises[]
    >(training_week);



    // useEffect(() => {
    //   const hydratedTrainingBlock = training_block.map((each) =>
    //     hydrateTrainingWeek(each, prioritized_muscle_list)
    //   );
    //   setDraggableExercises(hydratedTrainingBlock);
    // }, [training_block, prioritized_muscle_list]);

    useEffect(() => {
      setExercisesBySelectedMeso(training_week);
    }, [training_week ]);
    // const exercises_selected_meso = draggableExercises[selectedMesocycleIndex];

    // const onDragEnd = useCallback(
    //   (result: DropResult) => {
    //     if (!result.destination) return;
    //     const destination_id = result.destination.droppableId;
    //     const source_id = result.source.droppableId;
    //     const destination_day_index = parseInt(destination_id.split("_")[0]);
    //     const source_day_index = parseInt(source_id.split("_")[0]);
    //     // NOTE: only deals with days with 1 session as seen by the hardcoded zero.
    //     const destination_session_index = 0;
    //     const source_session_index = 0;
    //     const destination_exercise_index = result.destination.index;
    //     const source_exercise_index = result.source.index;

    //     const items = structuredClone(exercisesBySelectedMeso);

    //     const sourceExercise =
    //       items[source_day_index].sessions[source_session_index].exercises[
    //         source_exercise_index
    //       ];
    //     const targetSplit =
    //       items[destination_day_index].sessions[destination_session_index];

    //     const can_add_exercise_to_session = canAddExerciseToSplit(
    //       sourceExercise.muscle,
    //       targetSplit.split as SplitType
    //     );

    //     if (!can_add_exercise_to_session) {
    //       console.log(
    //         can_add_exercise_to_session,
    //         `ERROR: Cannot place an exercise of the ${sourceExercise.muscle} muscle type in a ${targetSplit.split} session.`
    //       );
    //     }

    //     const [removed] = items[source_day_index].sessions[
    //       source_session_index
    //     ].exercises.splice(source_exercise_index, 1);

    //     items[destination_day_index].sessions[
    //       destination_session_index
    //     ].exercises.splice(destination_exercise_index, 0, removed);

    //     const lol = draggableExercises.map((meso, mesoIndex) => {
    //       if (mesoIndex === selectedMesocycleIndex) return items;
    //       else return meso;
    //     });

    //     setDraggableExercises(lol);
    //     console.log(
    //       result,
    //       draggableExercises,
    //       exercisesBySelectedMeso,
    //       "WHERE'd MY LIST GO YO?"
    //     );
    //   },
    //   [exercisesBySelectedMeso, draggableExercises, selectedMicrocycleIndex]
    // );

    const [activeContainer, setActiveContainer] = useState<string | number | null>(null)

    const handleDragStart = (event: DragStartEvent) => {
      setActiveContainer(event.active.data.current?.sortable.containerId);
    };
  
    const handleDragOver = (event: DragOverEvent) => {
      const { over, active } = event;
  
      if (!over || !active || active.id === over.id) {
        return;
      }
  
      const activeContainerId = active.data.current?.sortable.containerId;
      const overContainerId = over.data.current?.sortable.containerId;
  
      if (activeContainerId === overContainerId) {
        return; // within the same container, do nothing on drag over, only on drag end
      }
  
      let activeExercise: ExerciseType | null = null

      exercisesBySelectedMeso.find(c => {
        if (c.day === activeContainerId) {
          const exercise = c.sessions[0]?.exercises.find(item => item.id === active.id);
          if (exercise) {
            activeExercise = exercise;
          }
        } 
      })

      const newContainers = exercisesBySelectedMeso.map((container) => {

        if (container.day === activeContainerId) {
          const activeIndex = container.sessions[0].exercises.findIndex((item) => item.id === active.id);
          container.sessions[0].exercises.splice(activeIndex, 1);
        }
        if (container.day === overContainerId) {
          const overIndex = container.sessions[0].exercises.findIndex((item) => item.id === over.id);
            console.log(activeExercise, "OK IS THIS THE PROB?")
            container.sessions[0].exercises.splice(overIndex, 0, activeExercise!);
          
        }
        return container;
      });
      setExercisesBySelectedMeso(newContainers);
    };

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveContainer(null);
      
      console.log(event, "WTF IS GOING ON WITH THIS NEED TO DO A DEEP DIVE")
      if (!over || active.id === over.id) {
        return;
      }
  
      const activeContainerId = active.data.current?.sortable.containerId;
      const overContainerId = over.data.current?.sortable.containerId;
  
      if (activeContainerId === overContainerId) {
        const activeIndex = exercisesBySelectedMeso.find(c => c.day === activeContainerId)!.sessions[0]?.exercises.findIndex(item => item.id === active.id);
        const overIndex = exercisesBySelectedMeso.find(c => c.day === overContainerId)!.sessions[0]?.exercises.findIndex(item => item.id === over.id);
  
        const newContainers = exercisesBySelectedMeso.map((container) => {
          if (container.day === activeContainerId) {
            container.sessions[0].exercises = arrayMove(container.sessions[0].exercises, activeIndex, overIndex);
          }
          return container;
        });
        setExercisesBySelectedMeso(newContainers);
      }
    };

    const onSupersetUpdate = () => {};
    return (
      <div className={"flex w-full flex-col"}>
        <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <ul className="flex space-x-2 overflow-x-auto">
            {exercisesBySelectedMeso?.map((each, index) => {
              return (
                <DayLayout
                  key={`${each.day}_${selectedMesocycleIndex}_draggableExercisesObject_${index}`}
                  session={each}
                  >
                  <SortableSessionItemContainer containerId={each.day} container={each.sessions[0]} selectedMicrocycleIndex={selectedMicrocycleIndex} />
                </DayLayout>
              )
            })}
          </ul>
        </DndContext>
      </div>
    );
  }
);

