import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
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
import SelectExercise from "~/components/Modals/SelectExercise/SelectExerciseModal";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
import { useToggleCyclesContext } from "../../MesocycleToggle/hooks/useMesocycleToggle";
import { SortableSessionItemContainer } from "./components/Session/SessionItem";
import { ExerciseFilter } from "./components/Settings/ExerciseFilter/ExerciseFilter";
import SessionDurationVariables from "./components/Settings/SessionDuration/SessionDurationVariables";
import { SessionDurationVariablesProvider } from "./components/Settings/SessionDuration/sessionDurationVariablesContext";
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

const DayDropdownMenu = memo(() => {
  return (
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
  );
});

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
          <DayDropdownMenu />
        </CardHeader>

        <CardContent className="p-3 pt-0">{children}</CardContent>
      </Card>
    </li>
  );
};

function TrainingWeekOverview() {
  const { training_block, prioritized_muscle_list } =
    useTrainingProgramContext();
  const { selectedMesocycle, selectedMicrocycle } = useToggleCyclesContext();
  // const { microcycles, mesocycles } = training_program_params;

  // const [selectedMesocycleIndex, setSelectedMesocycleIndex] = useState<number>(
  //   mesocycles - 1
  // );
  // const [selectedMicrocycleIndex, setSelectedMicrocycleIndex] =
  //   useState<number>(microcycles - 1);

  // const mesocycle_titles = Array.from(
  //   Array(mesocycles),
  //   (e, i) => `Mesocycle ${i + 1}`
  // );

  // const microcycle_titles = Array.from(
  //   Array(microcycles),
  //   (e, i) => `Week ${i + 1}`
  // );

  // const onClickHandler = (value: string) => {
  //   const type = value.split(" ");
  //   const valueAsNumber = parseInt(type[1]) - 1;
  //   if (type[0] === "Mesocycle") {
  //     setSelectedMesocycleIndex(valueAsNumber);
  //   } else {
  //     setSelectedMicrocycleIndex(valueAsNumber);
  //   }
  // };

  const [draggableExercises, setDraggableExercises] = useState<
    DraggableExercises[][]
  >([]);
  const [filteredIds, setFilteredIds] = useState<string[]>([]);

  useEffect(() => {
    const hydratedTrainingBlock = training_block.map((each) =>
      hydrateTrainingWeek(each, prioritized_muscle_list)
    );
    setDraggableExercises(hydratedTrainingBlock);
  }, [training_block, prioritized_muscle_list]);

  const memoizedTrainingWeek = useMemo(
    () => draggableExercises[selectedMesocycle],
    [draggableExercises, selectedMesocycle]
  );

  const onFilter = (filteredId: string[]) => {
    console.log(
      filteredId,
      "FUNCTION: onFilter() => TrainingWeekOverviewDnD.tsx"
    );
    setFilteredIds(filteredId);
  };

  return (
    <SessionDurationVariablesProvider>
      <div id="exercise_editor" className={`flex flex-col space-y-5 rounded`}>
        <div className="flex flex-col rounded-md border border-primary-700">
          {/* <MesocycleToggle
          mesocycles={mesocycle_titles}
          microcycles={microcycle_titles}
          selectedMesocycleIndex={selectedMesocycleIndex}
          selectedMicrocycleIndex={selectedMicrocycleIndex}
          onClickHandler={onClickHandler}
          /> */}

          <SessionDurationVariables />
          <ExerciseFilter
            trainingWeek={memoizedTrainingWeek}
            onFilter={onFilter}
          />
        </div>

        <WeekSessions
          training_week={memoizedTrainingWeek}
          filteredIds={filteredIds}
        />
      </div>
    </SessionDurationVariablesProvider>
  );
}

type WeekSessionsProps = {
  training_week: DraggableExercises[];
  filteredIds: string[];
};

const WeekSessions = ({ training_week, filteredIds }: WeekSessionsProps) => {
  const [exercisesBySelectedMeso, setExercisesBySelectedMeso] =
    useState<DraggableExercises[]>(training_week);
  const [activeContainer, setActiveContainer] =
    useState<UniqueIdentifier | null>(null);

  useEffect(() => {
    setExercisesBySelectedMeso(training_week);
  }, [training_week]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveContainer(active.data.current?.sortable.containerId);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over, active } = event;

      if (!over || !activeContainer) return;
      const overContainerId = over.data.current?.sortable.containerId;
      const overSplitId = overContainerId.split("#");
      const overDay = overSplitId[0];
      const overSession = overSplitId[1];
      const overId = over.id;

      const activeContainerId = active.data.current?.sortable.containerId;
      const activeSplitId = activeContainerId.split("#");
      const activeDay = activeSplitId[0];
      const activeSession = activeSplitId[1];
      const activeId = active.id;

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
    },
    [exercisesBySelectedMeso, activeContainer]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveContainer(null);

      if (!over || active.id === over.id) return;

      const activeContainerId = active.data.current?.sortable.containerId;
      const activeSplitId = activeContainerId.split("#");
      const activeDay = activeSplitId[0];
      const activeSession = activeSplitId[1];
      const activeId = active.id;

      const overContainerId = over.data.current?.sortable.containerId;
      const overSplitId = overContainerId.split("#");
      const overDay = overSplitId[0];
      const overSession = overSplitId[1];
      const overId = over.id;

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

  const findExerciseIndex = (
    day: string,
    session: string,
    item: UniqueIdentifier
  ) => {
    return exercisesBySelectedMeso
      .find((c) => c.day === day)!
      .sessions.find((s) => s.id === session)!
      .exercises.findIndex((i) => i.id === item);
  };

  const memoizedTrainingWeek = useMemo(
    () =>
      exercisesBySelectedMeso?.filter((tday) =>
        tday.sessions.some((session) => session.split !== "off")
      ),
    [exercisesBySelectedMeso]
  );

  return (
    <div className={"flex w-full flex-col"}>
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Superset</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <SelectExercise exerciseId={"exercise.id"} onSelect={() => {}} />

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <ul className="flex space-x-2 overflow-x-auto">
            {memoizedTrainingWeek?.map((each, index) => {
              return (
                <DayLayout key={`${each.day}_${index}`} session={each}>
                  {each.sessions.map((session) => {
                    return (
                      <SortableSessionItemContainer
                        key={`${each.day}_${session.id}`}
                        containerId={`${each.day}#${session.id}`}
                        container={session}
                        filteredIds={filteredIds}
                      />
                    );
                  })}
                </DayLayout>
              );
            })}
          </ul>
        </DndContext>
      </Dialog>
    </div>
  );
};
export default memo(TrainingWeekOverview);
