import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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

function TrainingWeekOverview() {
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

  // const handleDragStart = useCallback((event: DragStartEvent) => {
  //   const activeContainer: string =
  //     event.active.data.current?.sortable.containerId;
  //   setActiveContainer(activeContainer);
  // }, []);

  // const handleDragOver = (event: DragOverEvent) => {
  //   const { active, over } = event;
  //   console.log(over, "BEFORE: there's an over!");
  //   if (!over) {
  //     return;
  //   }
  // };

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over, active } = event;

      if (!over || !activeContainer) return;
      const overContainerId = over.data.current?.sortable.containerId;
      const overSplitId = overContainerId.split("#");
      const overDay = overSplitId[0];
      const overSession = overSplitId[1];
      const overId = over.id as string;

      const activeContainerId = active.data.current?.sortable.containerId;
      const activeSplitId = activeContainerId.split("#");
      const activeDay = activeSplitId[0];
      const activeSession = activeSplitId[1];
      const activeId = active.id as string;

      if (
        !activeContainerId ||
        !overContainerId ||
        overContainerId === activeContainerId
      )
        return;

      const activeIndex = findExerciseIndex(activeDay, activeSession, activeId);
      const overIndex = findExerciseIndex(overDay, overSession, overId);
      const activeItem = exercisesBySelectedMeso
        .find((d) => d.day === activeDay)!
        .sessions.find((s) => s.id === activeSession)!
        .exercises.find((item) => item.id === active.id);

      if (activeIndex === -1 || overIndex === -1 || !activeItem) return;

      const newContainers = exercisesBySelectedMeso.map((container) => {
        if (container.day === activeDay) {
          return {
            ...container,
            sessions: container.sessions.map((session) => {
              if (session.id === activeSession) {
                return {
                  ...session,
                  exercises: session.exercises.filter(
                    (ex) => ex.id !== activeId
                  ),
                };
              }
              return session;
            }),
          };
        } else if (container.day === overDay) {
          return {
            ...container,
            sessions: container.sessions.map((session) => {
              if (session.id === overSession) {
                return {
                  ...session,
                  exercises: [
                    ...session.exercises.slice(0, overIndex),
                    activeItem,
                    ...session.exercises.slice(overIndex),
                  ],
                };
              }
              return session;
            }),
          };
        }
        return container;
      });
      setExercisesBySelectedMeso(newContainers);
      // setActiveContainer(overId);
    },
    [exercisesBySelectedMeso, activeContainer]
  );

  // const handleDragOver = useCallback(
  //   (event: DragOverEvent) => {
  //     const { active, over } = event;

  //     if (!over || !activeContainer) return;

  //     const activeContainerDayIndex = exercisesBySelectedMeso.findIndex(
  //       (c) => c.day === activeContainer.split("#")[0]
  //     );

  //     const activeContainerIndex = exercisesBySelectedMeso[
  //       activeContainerDayIndex
  //     ].sessions.findIndex((c) => c.id === activeContainer.split("#")[1]);

  //     const overContainerDayIndex = exercisesBySelectedMeso.findIndex(
  //       (c) =>
  //         c.day ===
  //         (over.data.current?.sortable.containerId as string).split("#")[0]
  //     );

  //     const overContainerIndex = exercisesBySelectedMeso[
  //       overContainerDayIndex
  //     ].sessions.findIndex(
  //       (c) =>
  //         c.id ===
  //         (over.data.current?.sortable.containerId as string).split("#")[1]
  //     );

  //     const activeItemIndex = exercisesBySelectedMeso[
  //       activeContainerDayIndex
  //     ].sessions[activeContainerIndex]?.exercises.findIndex(
  //       (item) => item.id === active.id
  //     );

  //     console.log(
  //       active,
  //       activeContainer,
  //       activeContainerDayIndex,
  //       activeContainerIndex,
  //       "ACTIVE STUFF",
  //       over,
  //       overContainerDayIndex,
  //       overContainerIndex,
  //       "OVER STUFF"
  //     );
  //     if (activeContainerIndex !== -1 && overContainerIndex !== -1) {
  //       const newContainers = structuredClone(exercisesBySelectedMeso);

  //       if (
  //         active.data.current?.sortable.containerId ===
  //         over.data.current?.sortable.containerId
  //       ) {
  //         const overIndex = newContainers[activeContainerDayIndex].sessions[
  //           activeContainerIndex
  //         ]?.exercises.findIndex((item) => item.id === over.id);
  //         newContainers[activeContainerDayIndex].sessions[
  //           activeContainerIndex
  //         ].exercises = arrayMove(
  //           newContainers[activeContainerDayIndex].sessions[
  //             activeContainerIndex
  //           ]?.exercises,
  //           activeItemIndex,
  //           overIndex
  //         );
  //       } else {
  //         const [movedItem] = newContainers[
  //           activeContainerDayIndex
  //         ].sessions[0]?.exercises.splice(activeItemIndex, 1);
  //         newContainers[overContainerDayIndex].sessions[
  //           overContainerIndex
  //         ]?.exercises.push(movedItem);
  //       }
  //       setExercisesBySelectedMeso(newContainers);
  //     }
  //   },
  //   [exercisesBySelectedMeso, activeContainer]
  // );

  const getContainersIndices = (id: string, split_marker: string) => {
    const splitId = id.split(split_marker);
    const dayId = splitId[0];
    const sessionId = splitId[1];
    let day_index = -1;
    let session_index = -1;

    for (let i = 0; i < exercisesBySelectedMeso.length; i++) {
      const day = exercisesBySelectedMeso[i].day;
      const sessions = exercisesBySelectedMeso[i].sessions;
      if (day === dayId) {
        day_index === i;

        for (let j = 0; j < sessions.length; j++) {
          if (sessions[j].id === sessionId) {
            session_index = j;
          }
        }
      }
    }
    return [day_index, session_index];
  };

  const findContainer = useCallback(
    (id: string, split_marker: string) => {
      const splitId = id.split(split_marker);
      const dayId = splitId[0];
      const sessionId = splitId[1];

      for (let i = 0; i < exercisesBySelectedMeso.length; i++) {
        const day = exercisesBySelectedMeso[i].day;
        const sessions = exercisesBySelectedMeso[i].sessions;
        if (day === dayId) {
          for (let j = 0; j < sessions.length; j++) {
            if (sessions[j].id === sessionId) {
              return sessions[j];
            }
          }
        }
      }
      return null;
    },
    [exercisesBySelectedMeso]
  );

  const findExerciseIndex = (day: string, session: string, item: string) => {
    return exercisesBySelectedMeso
      .find((c) => c.day === day)!
      .sessions.find((s) => s.id === session)!
      .exercises.findIndex((i) => i.id === item);
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveContainer(null);

      if (!over || active.id === over.id) return;

      const activeContainerId = active.data.current?.sortable.containerId;
      const activeSplitId = activeContainerId.split("#");
      const activeDay = activeSplitId[0];
      const activeSession = activeSplitId[1];
      const activeId = active.id as string;

      const overContainerId = over.data.current?.sortable.containerId;
      const overSplitId = overContainerId.split("#");
      const overDay = overSplitId[0];
      const overSession = overSplitId[1];
      const overId = over.id as string;

      if (!activeContainerId || !overContainerId) return;

      const activeIndex = findExerciseIndex(activeDay, activeSession, activeId);
      const overIndex = findExerciseIndex(overDay, overSession, overId);

      if (activeIndex === -1 || overIndex === -1) return;

      const newContainers = exercisesBySelectedMeso.map((container) => {
        if (container.day === activeDay) {
          return {
            ...container,
            sessions: container.sessions.map((session) => {
              if (session.id === activeSession) {
                return {
                  ...session,
                  exercises: arrayMove(
                    session.exercises,
                    activeIndex,
                    overIndex
                  ),
                };
              }
              return session;
            }),
          };
        }
        return container;
      });
      setExercisesBySelectedMeso(newContainers);
    },
    [exercisesBySelectedMeso]
  );

  // const handleDragEnd = useCallback(
  //   (event: DragEndEvent) => {
  //     const { active, over } = event;

  //     if (!over) {
  //       return;
  //     }

  //     const activeContainerId = active.data.current?.sortable.containerId;
  //     const splitActiveContainerId = activeContainerId.split("#");
  //     const activeDayId = splitActiveContainerId[0];
  //     const activeSplitId = splitActiveContainerId[1];

  //     const overContainerId = over.data.current?.sortable.containerId;
  //     const splitOverContainerId = overContainerId.split("#");
  //     const overDayId = splitOverContainerId[0];
  //     const overSplitId = splitOverContainerId[1];

  //     // const activeContainerId = active.data.current?.sortable.containerId;
  //     // const splitActiveContainerId = activeContainerId.split("#");
  //     // const activeDayId = splitActiveContainerId[0];
  //     // const activeSplitId = splitActiveContainerId[1];

  //     // const activeDay = exercisesBySelectedMeso.find(
  //     //   (item) => item.day === activeDayId
  //     // );
  //     // const activeContainer = activeDay?.sessions.find(
  //     //   (item) => item.id === activeSplitId
  //     // );

  //     // const overContainerId = over.data.current?.sortable.containerId;
  //     // const splitOverContainerId = overContainerId.split("#");
  //     // const overDayId = splitOverContainerId[0];
  //     // const overSplitId = splitOverContainerId[1];
  //     // const overDay = exercisesBySelectedMeso.find(
  //     //   (item) => item.day === overDayId
  //     // );
  //     // const overContainer = overDay?.sessions.find(
  //     //   (item) => item.id === overSplitId
  //     // );
  //     const activeContainer = findContainer(activeContainerId, "#");
  //     const overContainer = findContainer(overContainerId, "#");
  //     console.log(activeContainer, overContainer, "ARE THESE THE ISSUES?");
  //     if (!activeContainer || !overContainer) {
  //       return;
  //     }

  //     const activeIndex = activeContainer.exercises.findIndex(
  //       (item) => item.id === active.id
  //     );
  //     if (activeContainer.id === overContainer.id) {
  //       const overIndex = overContainer.exercises.findIndex(
  //         (item) => item.id === over.id
  //       );
  //       if (activeIndex !== overIndex) {
  //         const newItems = arrayMove(
  //           activeContainer.exercises,
  //           activeIndex,
  //           overIndex
  //         );
  //         const newContainers = exercisesBySelectedMeso.map((container) => {
  //           if (container.day === activeDayId) {
  //             return {
  //               ...container,
  //               sessions: container.sessions.map((session) => {
  //                 if (session.id === activeSplitId) {
  //                   return { ...session, exercises: newItems };
  //                 } else return session;
  //               }),
  //             };
  //           } else return container;
  //         });
  //         setExercisesBySelectedMeso(newContainers);
  //       }
  //     } else {
  //       const newActiveItems = [...activeContainer.exercises];
  //       newActiveItems.splice(activeIndex, 1);

  //       const newOverItems = [...overContainer.exercises];
  //       const overIndex =
  //         overContainer.id === over.id
  //           ? overContainer.exercises.length
  //           : overContainer.exercises.findIndex((item) => item.id === over.id);
  //       newOverItems.splice(
  //         overIndex,
  //         0,
  //         activeContainer.exercises[activeIndex]
  //       );

  //       const newContainers = exercisesBySelectedMeso.map((container) => {
  //         if (container.day === activeDayId) {
  //           return {
  //             ...container,
  //             sessions: container.sessions.map((session) => {
  //               if (session.id === activeSplitId) {
  //                 return { ...session, exercises: newActiveItems };
  //               } else return session;
  //             }),
  //           };
  //         } else if (container.day === overDayId) {
  //           return {
  //             ...container,
  //             sessions: container.sessions.map((session) => {
  //               if (session.id === overSplitId) {
  //                 return { ...session, exercises: newOverItems };
  //               } else return session;
  //             }),
  //           };
  //         } else return container;
  //       });
  //       console.log(
  //         newContainers,
  //         newActiveItems,
  //         newOverItems,
  //         active,
  //         over,
  //         "I'M SURE THE PROBLEM OF DRAGGING OVER ANOTHER CONTAINER IS HERE"
  //       );
  //       setExercisesBySelectedMeso(newContainers);
  //     }
  //   },
  //   [exercisesBySelectedMeso]
  // );

  const findExerciseItems = (id: string, split_marker: string) => {
    const splitId = id.split(split_marker);
    const dayId = splitId[0];
    const sessionId = splitId[1];
    const dayIndex = exercisesBySelectedMeso.findIndex(
      (day) => day.day === dayId
    );
    const session = exercisesBySelectedMeso[dayIndex].sessions.find(
      (session) => session.id === sessionId
    );
    return session?.exercises;
  };

  // const handleDragEnd = useCallback((event: DragEndEvent) => {
  //   setActiveContainer(null);
  // }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    setActiveContainer(active.data.current?.sortable.containerId);
  }, []);

  const onSupersetUpdate = () => {};

  const memoizedExercisesBySelectedMeso = useMemo(
    () => exercisesBySelectedMeso,
    [exercisesBySelectedMeso]
  );

  return (
    <div className={"flex w-full flex-col"}>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <ul className="flex space-x-2 overflow-x-auto">
          {memoizedExercisesBySelectedMeso?.map((each, index) => {
            return (
              <DayLayout key={`${each.day}_${index}`} session={each}>
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
export default memo(TrainingWeekOverview);
