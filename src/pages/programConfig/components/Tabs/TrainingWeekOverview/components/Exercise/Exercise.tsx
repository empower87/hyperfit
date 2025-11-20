import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsVerticalIcon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  Dispatch,
  HTMLAttributes,
  memo,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
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
import { useSupersetsContext } from "../../hooks/useSupersets";
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
  onDeleteExercise: (exerciseId: string) => void;
  supersetDialog: ReactNode;
  setOpenSuperset: Dispatch<SetStateAction<boolean>>;
};

export const ExerciseItem = ({
  index,
  exercise,
  filteredIds,
  onDeleteExercise,
  supersetDialog,
  setOpenSuperset,
}: ExerciseItemProps) => {
  const { selectedMicrocycle, selectedMesocycle } = useToggleCyclesContext();
  const { supersets } = useSupersetsContext();

  const [openDelete, setOpenDelete] = useState(false);
  const sets = exercise.setProgression
    ? exercise.setProgression[selectedMesocycle][selectedMicrocycle]
    : exercise.sets;
  const reps = exercise.reps;
  const weight = exercise.weight;

  const bgColorByRank = getRankColor(exercise.rank).bg;

  // Superset color palette (same as SupersetDialog)
  const supersetColors = [
    "border-red-500",
    "border-yellow-500",
    "border-green-500",
    "border-blue-500",
    "border-purple-500",
    "border-pink-500",
    "border-orange-50`0",
    "border-teal-500",
    "border-cyan-500",
    "border-lime-500",
  ];
  // Map superset key to color
  const supersetKeyList = Object.keys(supersets);
  const supersetColorMap: Record<string, string> = {};
  supersetKeyList.forEach((key, idx) => {
    supersetColorMap[key] = supersetColors[idx % supersetColors.length];
  });

  // Find superset key for this exercise
  let supersetKey: string | undefined = undefined;
  let isSupersetted = false;
  Object.entries(supersets).forEach(([key, arr]) => {
    if (arr.includes(exercise.id)) {
      supersetKey = key;
      isSupersetted = true;
    }
  });
  const supersetBorderColor = supersetKey
    ? supersetColorMap[supersetKey]
    : "border-input";

  const onSelect = () => {};

  return (
    <SortableExerciseItem id={exercise.id}>
      {(listeners: SyntheticListenerMap | undefined) => (
        <li className={`flex`}>
          <div
            className={`flex w-full rounded-md border bg-background/40 ${
              isSupersetted ? supersetBorderColor : "border-input"
            } ${getExerciseHighlightClass(filteredIds.includes(exercise.id))}`}
          >
            {/* <DraggableExerciseHandle
              bgColor={bgColorByRank}
              listeners={listeners}
            /> */}
            <div className="p-2 pr-1 text-xs text-white">{index}</div>
            <div className="flex justify-between">
              {/* <div className="flex w-10 p-2 pr-0">
                <div className="text-semibold flex truncate text-xs leading-tight text-secondary-300">
                  {sets} x {reps}
                </div>
              </div> */}

              <div className="flex w-40 cursor-default flex-col overflow-hidden p-2 pr-0 text-xs leading-tight">
                <div className="flex items-center justify-between">
                  <ExerciseTitle
                    tooltipTrigger={
                      <p className="overflow-hidden text-ellipsis text-white">
                        {sets} x {reps} {exercise.name}
                      </p>
                    }
                    tooltipContent={
                      <div className="truncate text-secondary-300">
                        {exercise.name}
                      </div>
                    }
                  />
                  <div>{weight} lb</div>
                </div>

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

                  <DropdownMenuItem onSelect={() => setOpenSuperset(true)}>
                    Create Superset
                  </DropdownMenuItem>

                  <DropdownMenuItem onSelect={() => setOpenDelete(true)}>
                    Delete Exercise
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {supersetDialog}
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
                    <Button
                      type="submit"
                      variant="destructive"
                      onClick={() => {
                        onDeleteExercise(exercise.id);
                      }}
                    >
                      Delete
                    </Button>
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
  tooltipTrigger: ReactNode;
  tooltipContent: ReactNode;
};
const ExerciseTitle = memo(
  ({ tooltipTrigger, tooltipContent }: ExerciseTitleProps) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="cursor-default" asChild>
            {tooltipTrigger}
          </TooltipTrigger>

          <TooltipContent className="bg-primary-600">
            {tooltipContent}
            {/* <p>{name}</p> */}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

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
