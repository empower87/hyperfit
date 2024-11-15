import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
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

type ExerciseItemLayoutProps = {
  index: number;
  exerciseName: string;
  muscle: MuscleType;
  muscleColor: string;
  sets: number;
  reps: number;
  lbs: number;
  supersetModal: ReactNode;
  children: ReactNode;
};
export default function ExerciseItemLayout({
  index,
  exerciseName,
  muscle,
  muscleColor,
  sets,
  reps,
  lbs,
  supersetModal,
  children,
}: ExerciseItemLayoutProps) {
  return (
    <li className="flex">
      <div className="p-2 pl-0 text-sm text-white">{index}</div>
      <div className="flex w-44 rounded-md border border-input bg-background/40">
        {children}
        <div className="flex justify-between">
          <div className="flex w-16 p-2 pr-0">
            <div className="text-semibold flex text-xs">
              {sets} x {reps}
            </div>
          </div>
          <div className="flex w-full cursor-default flex-col overflow-hidden p-2 text-xs leading-tight">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-default" asChild>
                  <div className="truncate text-secondary-300">
                    {exerciseName}
                  </div>
                </TooltipTrigger>

                <TooltipContent className="bg-primary-600">
                  <p>{exerciseName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className={`${muscleColor}`}>{muscle}</div>
          </div>

          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="mt-2" asChild>
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
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>

              {supersetModal}

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </li>
  );
}
