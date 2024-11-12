import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { HTMLAttributes, ReactNode, useState } from "react";
import SelectExercise from "~/components/Modals/ChangeExerciseModal/ChangeExerciseModal";
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
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  ExerciseType,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/utils";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";

type ExerciseProps = {
  index: number;
  exercise: ExerciseType;
  muscle: MusclePriorityType;
};
export default function Exercise({ index, exercise, muscle }: ExerciseProps) {
  const { onRemoveExercise, getSetsByExerciseId } = useMuscleEditorContext();
  const [selectedModality, setSelectedModality] = useState("S");

  const onSelectModality = (selected: string) => {
    setSelectedModality(selected);
  };

  const setsPerWeek = getSetsByExerciseId(exercise.id);

  return (
    <li className="flex">
      <div className="flex pr-2 text-xs text-primary-300">{index + 1}</div>

      <div className="flex flex-col rounded-md border border-input bg-background/30">
        <div className="flex justify-between">
          <h3 className="p-2 text-sm font-semibold leading-none tracking-tight text-secondary-400">
            {exercise.name}
          </h3>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button size="icon" variant="ghost">
                  <DotsVerticalIcon fill="white" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-44">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Training Modality
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => onSelectModality("S")}>
                        <span className="w-4">S</span>
                        Straight Set
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("D")}>
                        <span className="w-4">D</span>
                        Drop Set
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("G")}>
                        <span className="w-4">G</span>
                        Giant Set
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("M")}>
                        <span className="w-4">M</span>
                        Myrorep Set
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("E")}>
                        <span className="w-4">E</span>
                        Eccentric Set
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("LP")}>
                        <span className="w-4">LP</span>
                        Lengthened Partials
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("SS")}>
                        <span className="w-4">SS</span>
                        Superset
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Set Progression
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => onSelectModality("S")}>
                        Add One Per Exercise
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("D")}>
                        Add One - Per Week
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("G")}>
                        Add One - Flat
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("M")}>
                        Add One - Odd Weeks
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("E")}>
                        Add One - Even Weeks
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSelectModality("LP")}>
                        No Add
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DialogTrigger asChild>
                  <DropdownMenuItem>Replace Exercise</DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem>
                  <div
                    className="text-red-500"
                    onClick={() => onRemoveExercise(exercise.id)}
                  >
                    Delete
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent className="sm:max-w-[960px]">
              <DialogHeader>
                <DialogTitle>Replace Exercise</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>

              <SelectExercise
                muscle={muscle}
                exerciseId={exercise.id}
                onSelect={() => {}}
                onClose={() => {}}
              />

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex space-x-2 p-2 ">
          {exercise.data.requirements.map((each) => {
            return (
              <div className="rounded-md border border-input px-1.5 py-0.5 text-xs text-white">
                {each}
              </div>
            );
          })}
          <div className="rounded-md border border-input px-1.5 py-0.5 text-xs text-white">
            {exercise.data.movement_type}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex space-x-1 p-2 pt-0 text-xs">
            <div className="flex items-end px-1.5 py-1 text-xs text-secondary-300">
              {selectedModality}
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="text-xxs text-primary-400">SETS</div>
              <InputCell placeholder={setsPerWeek[0]} width="w-8" />
            </div>

            <div className="flex space-x-1 text-primary-400">
              {setsPerWeek.slice(1).map((set, index) => {
                return (
                  <div className="flex w-8 flex-col space-y-1">
                    <WeekCell value={`WK ${index + 2}`} className="text-xxs" />
                    <WeekCell
                      value={set}
                      className="rounded-md bg-background/50 p-1"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="text-xxs text-primary-400">LBS</div>
              <InputCell placeholder={"105"} width="w-12" />
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="text-xxs text-primary-400">REPS</div>
              <InputCell placeholder={"12"} width="w-10" />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

interface WeekCellProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
}
function WeekCell({ value, className, ...props }: WeekCellProps) {
  return (
    <div
      {...props}
      className={cn("flex items-center justify-center", className)}
    >
      {value}
    </div>
  );
}

// export default function ExerciseItem({ index, exercise }: ExerciseItemProps) {
//   return (
//     <li className="flex flex-col rounded bg-primary-500">
//       <div className="flex ">
//         <div className="flex w-6 items-center justify-center text-xs text-primary-300">
//           {index + 1}
//         </div>
//         <div className="indent-1 text-sm text-white">{exercise.name}</div>
//       </div>

//       <div className="flex p-1">
//         <RowLayout
//           type={<></>}
//           firstCell={<MicrocycleRow value={"Week 1"} />}
//           remainingCells={
//             <>
//               <MicrocycleRow value={"Week 2"} />
//               <MicrocycleRow value={"Week 3"} />
//               <MicrocycleRow value={"Week 4"} />
//             </>
//           }
//         />
//       </div>

//       <div className="flex flex-col space-y-0.5 p-1">
//         <RowLayout
//           type={<>SETS</>}
//           firstCell={<ExerciseCounter type={"SETS"} initialValue={3} />}
//           remainingCells={
//             <>
//               <MicrocycleRow value={3 + 1} />
//               <MicrocycleRow value={3 + 2} />
//               <MicrocycleRow value={3 + 3} />
//             </>
//           }
//         />
//         <RowLayout
//           type={<>REPS</>}
//           firstCell={<ExerciseCounter type={"REPS"} initialValue={12} />}
//           remainingCells={
//             <>
//               <MicrocycleRow value={12 + 1} />
//               <MicrocycleRow value={12 + 2} />
//               <MicrocycleRow value={12 + 3} />
//             </>
//           }
//         />
//         <RowLayout
//           type={<>LBS</>}
//           firstCell={<ExerciseCounter type={"LBS"} initialValue={105} />}
//           remainingCells={
//             <>
//               <MicrocycleRow value={105 + 1} />
//               <MicrocycleRow value={105 + 2} />
//               <MicrocycleRow value={105 + 3} />
//             </>
//           }
//         />
//       </div>
//     </li>
//   );
// }

type CellProps = {
  placeholder: string | number;
  width: string;
};
function InputCell({ placeholder, width }: CellProps) {
  // console.log(placeholder, "WTF PLACEHOLDER");
  const placeholderString =
    typeof placeholder === "number" ? placeholder.toString() : placeholder;
  return (
    <div className={cn("flex w-10", width)}>
      <Input
        type="text"
        placeholder={placeholderString}
        className="placeholder:text-primary-400"
      />
    </div>
  );
}

type RowLayoutProps = {
  type: ReactNode;
  firstCell: ReactNode;
  remainingCells: ReactNode;
};
function RowLayout({ type, firstCell, remainingCells }: RowLayoutProps) {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex w-8 items-center justify-center rounded-sm bg-primary-600 text-xs font-semibold text-primary-400">
        {type}
      </div>

      <ul className="flex w-20 justify-center">{firstCell}</ul>

      <ul className="flex justify-evenly">{remainingCells}</ul>
    </div>
  );
}

type MicrocycleRowProps = {
  value: number | string;
};
function MicrocycleRow({ value }: MicrocycleRowProps) {
  return (
    <li className="flex w-12 items-center justify-center text-xs text-primary-700">
      {value}
    </li>
  );
}
