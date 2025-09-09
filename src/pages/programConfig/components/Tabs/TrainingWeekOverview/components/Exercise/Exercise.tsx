import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsVerticalIcon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { HTMLAttributes, memo, ReactNode, useState } from "react";
import SelectExercise from "~/components/Modals/SelectExercise/SelectExerciseModal";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useToggleCyclesContext } from "~/pages/programConfig/components/MesocycleToggle/hooks/useMesocycleToggle";
import { getRankColor } from "~/utils/getIndicatorColors";
import { getExerciseHighlightClass } from "../Settings/ExerciseFilter/ExerciseFilter";

type SortableExerciseItemProps = {
  id: string;
  children:
    | ReactNode
    | ((listeners: SyntheticListenerMap | undefined) => ReactNode);
};

export const SortableExerciseItem = ({
  id,
  children,
}: SortableExerciseItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {typeof children === "function" ? children(listeners) : children}
    </div>
  );
};

type ExerciseItemProps = {
  index: number;
  exercise: ExerciseType;
  filteredIds: string[];
};

export const ExerciseItem = ({
  index,
  exercise,
  filteredIds,
}: ExerciseItemProps) => {
  const { selectedMicrocycle, selectedMesocycle } = useToggleCyclesContext();
  const [openSuperset, setOpenSuperset] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const sets = exercise.setProgression
    ? exercise.setProgression[selectedMesocycle][selectedMicrocycle]
    : exercise.sets;
  const reps = exercise.reps;

  const bgColorByRank = getRankColor(exercise.rank).bg;

  const onSelect = () => {};

  return (
    <SortableExerciseItem id={exercise.id}>
      {(listeners: SyntheticListenerMap | undefined) => (
        <li className={`flex`}>
          <div className="pr-2 text-sm text-white">{index}</div>
          <div
            className={`flex w-full rounded-md border border-input bg-background/40 ${getExerciseHighlightClass(
              filteredIds.includes(exercise.id)
            )}`}
          >
            <DraggableExerciseHandle
              bgColor={bgColorByRank}
              listeners={listeners}
            />
            <div className="flex justify-between">
              <div className="flex w-10 p-2 pr-0">
                <div className="text-semibold flex truncate text-xs leading-tight text-secondary-300">
                  {sets} x {reps}
                </div>
              </div>

              <div className="flex w-40 cursor-default flex-col overflow-hidden p-2 text-xs leading-tight">
                <ExerciseTitle name={exercise.name} />
                <div className="flex flex-col justify-between">
                  <div className="w-16">{exercise.muscle}</div>
                  <div className="flex space-x-2">
                    {exercise.data.requirements.map((req) => {
                      return (
                        <div
                          key={req}
                          className="text-xxs font-semibold text-secondary-300"
                        >
                          {req}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="mt-1">
                  <Button size="icon" variant="ghost" className="">
                    <DotsVerticalIcon fill="white" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-44">
                  <DropdownMenuItem>Rest Period Per Set</DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenSuperset(true);
                    }}
                  >
                    Create Superset
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenDelete(true);
                    }}
                  >
                    Delete Exercise
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={openSuperset} onOpenChange={setOpenSuperset}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Superset</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>

                  <SelectExercise
                    exerciseId={exercise.id}
                    onSelect={onSelect}
                  />

                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Exercise</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </li>
      )}
    </SortableExerciseItem>
  );
};

interface DraggableExerciseHandleProps extends HTMLAttributes<HTMLDivElement> {
  bgColor: string;
  listeners?: SyntheticListenerMap;
}
export const DraggableExerciseHandle = ({
  bgColor,
  listeners = {},
  ...props
}: DraggableExerciseHandleProps) => {
  return (
    <div
      className={`flex h-full items-center justify-start rounded-l-sm border-r border-input ${bgColor}`}
      {...listeners}
      {...props}
      data-drag-handle
    >
      <DragHandleDots2Icon fill="white" />
    </div>
  );
};

type ExerciseTitleProps = {
  name: string;
};
const ExerciseTitle = memo(({ name }: ExerciseTitleProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-default" asChild>
          <div className="truncate text-secondary-300">{name}</div>
        </TooltipTrigger>

        <TooltipContent className="bg-primary-600">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

type DotsMenuProps = {
  children?: ReactNode;
};

const DotsMenu = memo(({ children }: DotsMenuProps) => {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="mt-1 w-8">
          <Button size="icon" variant="ghost" className="w-8">
            <DotsVerticalIcon fill="white" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-44">
          <DropdownMenuItem>Rest Period Per Set</DropdownMenuItem>

          <DialogTrigger asChild>
            <DropdownMenuItem>Create Superset</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Superset</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {children}

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
