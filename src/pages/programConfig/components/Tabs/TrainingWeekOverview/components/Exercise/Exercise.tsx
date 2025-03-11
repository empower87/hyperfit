import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsVerticalIcon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { HTMLAttributes, memo, ReactNode } from "react";
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
import { MuscleType } from "~/constants/workoutSplits";
import { VolumeLandmarkType } from "~/types/muscles/muscleTypes";
import { getRankColor } from "~/utils/getIndicatorColors";

type SortableExerciseItemProps = {
  id: string;
  children: ReactNode;
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

type ExerciseItemProps = {
  index: number;
  exerciseName: string;
  muscle: MuscleType;
  volumeLandmark: VolumeLandmarkType;
  sets: number;
  reps: number;
  lbs: number;
  // supersetModal: ReactNode;
  children?: ReactNode;
};
export const ExerciseItem = ({
  index,
  exerciseName,
  muscle,
  volumeLandmark,
  sets,
  reps,
  lbs,
  children,
}: // supersetModal,
ExerciseItemProps) => {
  const bgColorByRank = getRankColor(volumeLandmark).bg;

  return (
    <li className={`flex`}>
      <div className="pr-2 text-sm text-white">{index}</div>
      <div className="flex overflow-hidden rounded-md border border-input bg-background/40">
        <DraggableExerciseHandle bgColor={bgColorByRank} />

        <div className="flex justify-between">
          <div className="flex p-2 pr-0">
            <div className="text-semibold flex truncate text-xs leading-tight text-secondary-300">
              {sets} x {reps}
            </div>
          </div>

          <div className="flex w-40 cursor-default flex-col overflow-hidden p-2 text-xs leading-tight">
            <ExerciseTitle name={exerciseName} />
            <div>{muscle}</div>
          </div>

          <DotsMenu />
        </div>
      </div>
    </li>
  );
};

interface DraggableExerciseHandleProps extends HTMLAttributes<HTMLDivElement> {
  bgColor: string;
}
export const DraggableExerciseHandle = ({
  bgColor,
}: DraggableExerciseHandleProps) => {
  return (
    <div
      className={`flex items-center justify-start border-r border-input ${bgColor}`}
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

const DotsMenu = memo(() => {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="mt-1" asChild>
          <Button size="icon" variant="ghost">
            <DotsVerticalIcon fill="white" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-44">
          <DialogTrigger asChild>
            <DropdownMenuItem>Create Superset</DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem>Rest Period Per Set</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Superset</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        {/* {supersetModal} */}

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
