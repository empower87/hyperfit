import { useRef } from "react";
import { AddIcon, SubtractIcon } from "~/assets/icons/_icons";
import Counter from "./Counter";

type ExerciseItemProps = {
  index: number;
};
export default function ExerciseItem({ index }: ExerciseItemProps) {
  return (
    <li className="flex flex-col bg-primary-500">
      <div className="flex ">
        <div className="flex w-6 items-center justify-center text-xs text-primary-300">
          {index + 1}
        </div>
        <div className="indent-1 text-sm text-white">Exercise </div>
      </div>
      <div className="flex flex-col space-y-0.5 p-1">
        {/* <ExerciseDetailsHeaders />
        <ExerciseDetails /> */}
        <ExerciseDetailsRow type="SETS" value={3} />
        <ExerciseDetailsRow type="REPS" value={12} />
        <ExerciseDetailsRow type="LBS" value={105} />
      </div>
    </li>
  );
}

function ExerciseDetailsHeaders({}) {
  return (
    <div className="flex text-xxs text-primary-300">
      <div className="flex p-1">
        <div>SETS</div>
        <ul className="flex justify-evenly">
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </div>
      <div className="flex p-1">
        <div className="">REPS</div>
        <div className="">LBS</div>
      </div>
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
      const parsedInt = parseInt(inputRef.current.value);
      const decrementedInt = parsedInt - 1 >= 0 ? parsedInt - 1 : 0;
      inputRef.current.value = decrementedInt.toString();
    }
  };

  const onIncrement = () => {
    if (inputRef.current) {
      const parsedInt = parseInt(inputRef.current.value) + 1;
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

function ExerciseDetails() {
  return (
    <div className="flex text-xxs text-primary-300">
      <div className="flex p-1">
        <ExerciseCounter type="SETS" initialValue={3} />
        <ul className="flex justify-evenly">
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </div>

      <div className="flex p-1">
        <div className="">
          <ExerciseCounter type="REPS" initialValue={12} />
        </div>
        <div className="">
          <ExerciseCounter type="LBS" initialValue={105} />
        </div>
      </div>
    </div>
  );
}

type ExerciseDetailsRowProps = {
  type: "SETS" | "REPS" | "LBS";
  value: number;
};
function ExerciseDetailsRow({ type, value }: ExerciseDetailsRowProps) {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex w-8 items-center rounded-sm bg-primary-600 p-0.5 text-xxs font-semibold text-primary-400">
        {type}
      </div>
      <div className="w-16">
        <ExerciseCounter type={type} initialValue={value} />
      </div>
      <ul className="flex justify-evenly">
        <MicrocycleRow value={value + 1} />
        <MicrocycleRow value={value + 2} />
        <MicrocycleRow value={value + 3} />
      </ul>
    </div>
  );
}

type MicrocycleRowProps = {
  value: number;
};
function MicrocycleRow({ value }: MicrocycleRowProps) {
  return (
    <li className="flex w-6 items-center justify-center text-xs text-primary-700">
      {value}
    </li>
  );
}
