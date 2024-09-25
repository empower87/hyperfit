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
      <div className="flex w-4/6">
        <div>SETS</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>

      <div className="w-1/6">REPS</div>
      <div className="w-1/6">LBS</div>
    </div>
  );
}

function ExerciseDetails() {
  return (
    <div className="flex text-xxs text-primary-300">
      <div className="flex w-1/2 p-1">
        <Counter>
          <Counter.Button>
            <SubtractIcon fill="white" />
          </Counter.Button>
          <Counter.Value value={3} />
          <Counter.Button>
            <AddIcon fill="white" />
          </Counter.Button>
        </Counter>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>

      <div className="flex w-1/2">
        <div className="p-1">
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
        <div className="p-1">
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
