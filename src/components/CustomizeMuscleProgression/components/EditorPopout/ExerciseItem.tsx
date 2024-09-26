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
      <div className="flex flex-col">
        <ExerciseDetailsHeaders />
        <ExerciseDetails />
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

function ExerciseDetails() {
  const setRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex text-xxs text-primary-300">
      <div className="flex p-1">
        <Counter>
          <Counter.Button>
            <SubtractIcon fill="white" />
          </Counter.Button>
          <Counter.Value value={3} ref={setRef} />
          <Counter.Button>
            <AddIcon fill="white" />
          </Counter.Button>
        </Counter>
        <ul className="flex justify-evenly">
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </div>

      <div className="flex p-1">
        <div className="">
          <Counter>
            <Counter.Button>
              <SubtractIcon fill="white" />
            </Counter.Button>
            <Counter.Value value={12} />
            <Counter.Button>
              <AddIcon fill="white" />
            </Counter.Button>
          </Counter>
        </div>
        <div className="">
          <Counter>
            <Counter.Button>
              <SubtractIcon fill="white" />
            </Counter.Button>
            <Counter.Value value={105} />
            <Counter.Button>
              <AddIcon fill="white" />
            </Counter.Button>
          </Counter>
        </div>
      </div>
    </div>
  );
}

type ExerciseDetailsRowProps = {
  title: string;
  value: number;
};
function ExerciseDetailsRow({ title, value }: ExerciseDetailsRowProps) {
  return (
    <div className="flex">
      <div className="w-1/6 text-xs text-primary-400">{title}</div>
      <div className="w-2/6">
        <Counter>
          <Counter.Button>
            <SubtractIcon fill="white" />
          </Counter.Button>
          <Counter.Value value={value} />
          <Counter.Button>
            <AddIcon fill="white" />
          </Counter.Button>
        </Counter>
      </div>
      <div className="flex w-3/6 justify-evenly">
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
    </div>
  );
}
