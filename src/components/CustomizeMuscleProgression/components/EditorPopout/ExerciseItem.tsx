import { ReactNode, useRef } from "react";
import { AddIcon, SubtractIcon } from "~/assets/icons/_icons";
import Counter from "./Counter";

type ExerciseItemProps = {
  index: number;
};
export default function ExerciseItem({ index }: ExerciseItemProps) {
  return (
    <li className="flex flex-col rounded bg-primary-500">
      <div className="flex ">
        <div className="flex w-6 items-center justify-center text-xs text-primary-300">
          {index + 1}
        </div>
        <div className="indent-1 text-sm text-white">Long Exercise Name</div>
      </div>

      <div className="flex p-1">
        <RowLayout
          type={<></>}
          firstCell={<MicrocycleRow value={"Week 1"} />}
          remainingCells={
            <>
              <MicrocycleRow value={"Week 2"} />
              <MicrocycleRow value={"Week 3"} />
              <MicrocycleRow value={"Week 4"} />
            </>
          }
        />
      </div>

      <div className="flex flex-col space-y-0.5 p-1">
        <RowLayout
          type={<>SETS</>}
          firstCell={<ExerciseCounter type={"SETS"} initialValue={3} />}
          remainingCells={
            <>
              <MicrocycleRow value={3 + 1} />
              <MicrocycleRow value={3 + 2} />
              <MicrocycleRow value={3 + 3} />
            </>
          }
        />
        <RowLayout
          type={<>REPS</>}
          firstCell={<ExerciseCounter type={"REPS"} initialValue={12} />}
          remainingCells={
            <>
              <MicrocycleRow value={12 + 1} />
              <MicrocycleRow value={12 + 2} />
              <MicrocycleRow value={12 + 3} />
            </>
          }
        />
        <RowLayout
          type={<>LBS</>}
          firstCell={<ExerciseCounter type={"LBS"} initialValue={105} />}
          remainingCells={
            <>
              <MicrocycleRow value={105 + 1} />
              <MicrocycleRow value={105 + 2} />
              <MicrocycleRow value={105 + 3} />
            </>
          }
        />
      </div>
    </li>
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
      <Counter.Value value={initialValue} ref={inputRef} />
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
