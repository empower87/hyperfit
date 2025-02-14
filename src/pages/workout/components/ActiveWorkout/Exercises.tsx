import { CheckIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { useCallback, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useRestTimerContext } from "../../contexts/restTimerContext";
import { useActiveWorkoutContext } from "../../hooks/useActiveWorkout";

const WIDTHS = ["w-10", "w-24", "w-24", "w-24", "w-10"];
const TITLES = ["SET", "PREVIOUS", "LBS", "REPS", ""];

const SET = {
  set_num: 1,
  lbs: 105,
  reps: 12,
  rir: 3,
  prev_lbs: 105,
  prev_reps: 12,
};
type SetType = typeof SET;

type ExerciseItemProps = {
  exercise: ExerciseType;
  order: number;
};
export function ExerciseItem({ exercise, order }: ExerciseItemProps) {
  const { onExerciseNameClick } = useActiveWorkoutContext();

  const ExerciseHeaders = () => {
    return (
      <div className="flex p-2 pt-0 text-sm">
        {WIDTHS.map((width, index) => {
          return (
            <div
              key={`exerciseHeader_${width}_${index}`}
              className={`flex justify-center ${width} text-muted-foreground`}
            >
              {TITLES[index]}
            </div>
          );
        })}
      </div>
    );
  };
  console.log(
    exercise,
    "EXERCISE RERENDER OH NO",
    "WHAT ARE THESE VALUES AND WHEN ARE THEY CALLED?"
  );
  return (
    <li className="flex flex-col rounded-lg border border-input text-muted-foreground">
      <div className="flex items-center justify-between p-3 pb-4">
        <div
          className="flex cursor-pointer text-secondary-400"
          onClick={() => onExerciseNameClick(exercise.id)}
        >
          <div className="pr-3">{order}</div>
          <div className="">{exercise.name}</div>
        </div>

        <Button variant="ghost" size="sm">
          <DotsVerticalIcon fill="white" />
        </Button>
      </div>

      <ExerciseHeaders />

      <div className="flex flex-col p-2 pt-0">
        <SetList sets={exercise.sets} />
        <Button variant="ghost" className="text-secondary-400">
          Add Set
        </Button>
      </div>
    </li>
  );
}

type SetListProps = {
  sets: number;
};
export function SetList({ sets }: SetListProps) {
  const { initRestTimer, totalRestTimeInSeconds } = useRestTimerContext();
  const sets_array: SetType[] = Array.from(Array(sets), (_, i) => ({
    ...SET,
    set_num: i + 1,
  }));

  const [setItems, setSetItems] = useState([...sets_array]);

  const onCompleteSet = useCallback(
    (completed_set: SetType | null) => {
      if (completed_set === null) {
        initRestTimer(null);
      } else {
        const updatedSets = setItems.map((set) => {
          if (set.set_num === completed_set.set_num) {
            return { ...set, ...completed_set };
          }
          return set;
        });
        setSetItems(updatedSets);
        initRestTimer();
        console.log("completed set", completed_set, setItems);
      }
    },
    [setItems, initRestTimer, totalRestTimeInSeconds]
  );
  return (
    <ul>
      {setItems.map((set, index) => {
        return (
          <SetItem
            key={`exerciseSet_${set}_${index}`}
            set={set}
            onCompleteSet={() => onCompleteSet(set)}
          />
        );
      })}
    </ul>
  );
}
type SetItemProps = {
  set: SetType;
  onCompleteSet: (completed_set: SetType | null) => void;
};

export function SetItem({ set, onCompleteSet }: SetItemProps) {
  const [isSetCompleted, setIsSetCompleted] = useState(false);
  const lbsRef = useRef<HTMLInputElement>(null);
  const repsRef = useRef<HTMLInputElement>(null);

  const onCompleteSetHandler = () => {
    if (!isSetCompleted) {
      onCompleteSet({
        ...set,
        lbs: Number(lbsRef.current?.value),
        reps: Number(repsRef.current?.value),
      });
      setIsSetCompleted(true);
    } else {
      onCompleteSet(null);
      setIsSetCompleted(false);
    }
  };

  const inputBorder = isSetCompleted ? "border-white" : "border-input";
  const bgColor = isSetCompleted ? "bg-secondary-300 text-white" : "";
  const buttonVariant = isSetCompleted ? "ghost" : "outline";
  const buttonColor = isSetCompleted
    ? "bg-secondary-400 hover:bg-secondary-300"
    : "";
  const iconColor = isSetCompleted ? "white" : "gray";
  return (
    <li className={`flex items-center rounded-md py-1 text-sm ${bgColor}`}>
      <div className={`${WIDTHS[0]} flex justify-center`}>{set.set_num}</div>
      <div className={`${WIDTHS[1]} flex justify-center`}>
        {set.prev_lbs}lbs x {set.prev_reps}
      </div>

      <div className={`${WIDTHS[2]} flex justify-center p-1`}>
        <Input
          ref={lbsRef}
          className={`${inputBorder}`}
          defaultValue={set.lbs}
        />
      </div>

      <div className={`${WIDTHS[3]} flex justify-center p-1`}>
        <Input
          ref={repsRef}
          className={`${inputBorder}`}
          defaultValue={set.reps}
        />
      </div>

      <div className={`${WIDTHS[0]} flex justify-center`}>
        <Button
          variant={buttonVariant}
          size="icon"
          className={`${buttonColor}`}
          onClick={onCompleteSetHandler}
        >
          <CheckIcon color={iconColor} />
        </Button>
      </div>
    </li>
  );
}
