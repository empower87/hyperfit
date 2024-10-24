import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { HTMLAttributes, ReactNode, useRef } from "react";
import { AddIcon, SubtractIcon } from "~/assets/icons/_icons";
import { Button } from "~/components/ui/button";
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
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/utils";
import Counter from "./Counter";

type ExerciseItemProps = {
  index: number;
  exercise: ExerciseType;
};
export default function ExerciseItem({ index, exercise }: ExerciseItemProps) {
  return (
    <li className="flex">
      <div className="flex pr-2 text-xs text-primary-300">{index + 1}</div>

      <div className="flex flex-col rounded-md border border-input">
        <div className="flex justify-between">
          <h3 className="p-2 text-sm font-semibold leading-none tracking-tight text-secondary-400">
            {exercise.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
                    <DropdownMenuItem>
                      <span className="w-4">S</span>
                      Straight Set
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="w-4">D</span>
                      Drop Set
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="w-4">G</span>
                      Giant Set
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="w-4">M</span>
                      Myrorep Set
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="w-4">E</span>
                      Eccentric Set
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="w-4">LP</span>
                      Lengthened Partials
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span className="w-4">SS</span>
                      Superset
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuItem>
                <div className="text-red-500">Delete</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex space-x-2 p-2 pt-0">
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
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="text-xxs text-primary-400">SETS</div>
              <InputCell placeholder={"3"} width="w-10" />
            </div>

            <div className="flex space-x-1 text-primary-400">
              <div className="flex w-8 flex-col space-y-1">
                <WeekCell value={"WK 2"} className="text-xxs" />
                <WeekCell value={4} />
              </div>
              <div className="flex w-8 flex-col space-y-1">
                <WeekCell value={"WK 3"} className="text-xxs" />
                <WeekCell value={5} />
              </div>
              <div className="flex w-8 flex-col space-y-1">
                <WeekCell value={"WK 4"} className="text-xxs" />
                <WeekCell value={6} />
              </div>
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
  placeholder: string;
  width: string;
};
function InputCell({ placeholder, width }: CellProps) {
  // console.log(placeholder, "WTF PLACEHOLDER");
  return (
    <div className={cn("flex w-10", width)}>
      <Input
        type="text"
        placeholder={placeholder}
        className="placeholder:text-secondary-300"
      />
    </div>
  );
}

type ExerciseCounterProps = {
  type: "SETS" | "REPS" | "LBS";
  initialValue: number;
};
function ExerciseCounter({ type, initialValue }: ExerciseCounterProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onDecrement = () => {
    if (inputRef.current) {
      const parsedInt = parseFloat(inputRef.current.value);
      const decrementedInt = parsedInt - 1 >= 0 ? parsedInt - 1 : 0;
      inputRef.current.value = decrementedInt.toString();
    }
  };

  const onIncrement = () => {
    if (inputRef.current) {
      const parsedInt = parseFloat(inputRef.current.value) + 1;
      inputRef.current.value = parsedInt.toString();
    }
  };

  return (
    <Counter>
      <Counter.Button onClick={onDecrement}>
        <SubtractIcon fill="white" />
      </Counter.Button>
      <Counter.Input value={initialValue} ref={inputRef} />
      <Counter.Button onClick={onIncrement}>
        <AddIcon fill="white" />
      </Counter.Button>
    </Counter>
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
