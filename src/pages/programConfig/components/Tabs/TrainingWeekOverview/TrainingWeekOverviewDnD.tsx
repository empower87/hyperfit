import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
import MesocycleToggle from "./components/MesocycleToggle";
import { SortableSessionItemContainer } from "./components/Session/SessionItem";
import SessionDurationVariables from "./components/Settings/SessionDuration/SessionDurationVariables";
import { DraggableExercises } from "./hooks/useExerciseSelection";
import { hydrateTrainingWeek } from "./hooks/useTrainingWeek";

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
  const { training_program_params, training_block, prioritized_muscle_list } =
    useTrainingProgramContext();
  const { microcycles, mesocycles } = training_program_params;

  const [selectedMesocycleIndex, setSelectedMesocycleIndex] = useState<number>(
    mesocycles - 1
  );
  const [selectedMicrocycleIndex, setSelectedMicrocycleIndex] =
    useState<number>(microcycles - 1);

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
  training_week: DraggableExercises[];
  // setDraggableExercises: React.Dispatch<SetStateAction<DraggableExercises[][]>>;
};

const WeekSessions = ({
  selectedMesocycleIndex,
  selectedMicrocycleIndex,
  training_week,
}: WeekSessionsProps) => {
  const [exercisesBySelectedMeso, setExercisesBySelectedMeso] =
    useState<DraggableExercises[]>(training_week);

  useEffect(() => {
    setExercisesBySelectedMeso(training_week);
  }, [training_week]);

  const [activeContainer, setActiveContainer] = useState<string | null>(null);

  // const handleDragStart = (event: DragStartEvent) => {
  //   setActiveContainer(event.active.data.current?.sortable.containerId);
  // };

  const handleDragStart = (event: DragStartEvent) => {
    const activeContainer: string =
      event.active.data.current?.sortable.containerId;
    setActiveContainer(activeContainer);
  };
  // const handleDragOver = (event: DragOverEvent) => {
  //   const { over, active } = event;

  //   if (!over || !active || active.id === over.id) {
  //     return;
  //   }

  //   const activeContainerId = active.data.current?.sortable.containerId;
  //   const overContainerId = over.data.current?.sortable.containerId;

  //   if (activeContainerId === overContainerId) {
  //     return; // within the same container, do nothing on drag over, only on drag end
  //   }

  //   let activeExercise: ExerciseType | null = null;

  //   exercisesBySelectedMeso.find((c) => {
  //     if (c.day === activeContainerId) {
  //       const exercise = c.sessions[0]?.exercises.find(
  //         (item) => item.id === active.id
  //       );
  //       if (exercise) {
  //         activeExercise = exercise;
  //       }
  //     }
  //   });

  //   const newContainers = exercisesBySelectedMeso.map((container) => {
  //     if (container.day === activeContainerId) {
  //       const activeIndex = container.sessions[0].exercises.findIndex(
  //         (item) => item.id === active.id
  //       );
  //       container.sessions[0].exercises.splice(activeIndex, 1);
  //     }
  //     if (container.day === overContainerId) {
  //       const overIndex = container.sessions[0].exercises.findIndex(
  //         (item) => item.id === over.id
  //       );
  //       console.log(activeExercise, "OK IS THIS THE PROB?");
  //       container.sessions[0].exercises.splice(overIndex, 0, activeExercise!);
  //     }
  //     return container;
  //   });
  //   setExercisesBySelectedMeso(newContainers);
  // };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !activeContainer) return;

    const activeContainerDayIndex = exercisesBySelectedMeso.findIndex(
      (c) => c.day === activeContainer.split("#")[0]
    );

    const activeContainerIndex = exercisesBySelectedMeso[
      activeContainerDayIndex
    ].sessions.findIndex((c) => c.id === activeContainer.split("#")[1]);

    const overContainerDayIndex = exercisesBySelectedMeso.findIndex(
      (c) =>
        c.day ===
        (over.data.current?.sortable.containerId as string).split("#")[0]
    );

    const overContainerIndex = exercisesBySelectedMeso[
      overContainerDayIndex
    ].sessions.findIndex(
      (c) =>
        c.id ===
        (over.data.current?.sortable.containerId as string).split("#")[1]
    );

    const activeItemIndex = exercisesBySelectedMeso[
      activeContainerDayIndex
    ].sessions[activeContainerIndex]?.exercises.findIndex(
      (item) => item.id === active.id
    );

    console.log(
      active,
      activeContainer,
      activeContainerDayIndex,
      activeContainerIndex,
      "ACTIVE STUFF",
      over,
      overContainerDayIndex,
      overContainerIndex,
      "OVER STUFF"
    );
    if (activeContainerIndex !== -1 && overContainerIndex !== -1) {
      const newContainers = structuredClone(exercisesBySelectedMeso);

      if (
        active.data.current?.sortable.containerId ===
        over.data.current?.sortable.containerId
      ) {
        const overIndex = newContainers[activeContainerDayIndex].sessions[
          activeContainerIndex
        ]?.exercises.findIndex((item) => item.id === over.id);
        newContainers[activeContainerDayIndex].sessions[
          activeContainerIndex
        ].exercises = arrayMove(
          newContainers[activeContainerDayIndex].sessions[activeContainerIndex]
            ?.exercises,
          activeItemIndex,
          overIndex
        );
      } else {
        const [movedItem] = newContainers[
          activeContainerDayIndex
        ].sessions[0]?.exercises.splice(activeItemIndex, 1);
        newContainers[overContainerDayIndex].sessions[
          overContainerIndex
        ]?.exercises.push(movedItem);
      }
      setExercisesBySelectedMeso(newContainers);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveContainer(null);
  };
  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   setActiveContainer(null);

  //   console.log(event, "WTF IS GOING ON WITH THIS NEED TO DO A DEEP DIVE");
  //   if (!over || active.id === over.id) {
  //     return;
  //   }

  //   const activeContainerId = active.data.current?.sortable.containerId;
  //   const overContainerId = over.data.current?.sortable.containerId;

  //   if (activeContainerId === overContainerId) {
  //     const activeIndex = exercisesBySelectedMeso
  //       .find((c) => c.day === activeContainerId)!
  //       .sessions[0]?.exercises.findIndex((item) => item.id === active.id);
  //     const overIndex = exercisesBySelectedMeso
  //       .find((c) => c.day === overContainerId)!
  //       .sessions[0]?.exercises.findIndex((item) => item.id === over.id);

  //     const newContainers = exercisesBySelectedMeso.map((container) => {
  //       if (container.day === activeContainerId) {
  //         container.sessions[0].exercises = arrayMove(
  //           container.sessions[0].exercises,
  //           activeIndex,
  //           overIndex
  //         );
  //       }
  //       return container;
  //     });
  //     setExercisesBySelectedMeso(newContainers);
  //   }
  // };

  const onSupersetUpdate = () => {};
  return (
    <div className={"flex w-full flex-col"}>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ul className="flex space-x-2 overflow-x-auto">
          {exercisesBySelectedMeso?.map((each, index) => {
            return (
              <DayLayout
                key={`${each.day}_${selectedMesocycleIndex}_draggableExercisesObject_${index}`}
                session={each}
              >
                {each.sessions.map((session) => {
                  return (
                    <SortableSessionItemContainer
                      key={`${each.day}_${session.id}`}
                      containerId={`${each.day}#${session.id}`}
                      container={session}
                      selectedMicrocycleIndex={selectedMicrocycleIndex}
                    />
                  );
                })}
              </DayLayout>
            );
          })}
        </ul>
      </DndContext>
    </div>
  );
};
