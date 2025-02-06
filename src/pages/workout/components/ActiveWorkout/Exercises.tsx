import { CheckIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { useCallback, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useActiveWorkoutContext } from "../../hooks/useActiveWorkout";

export default function ExerciseList() {
  const { active_workout } = useActiveWorkoutContext();
  return (
    <ul className="space-y-4">
      {active_workout?.session?.exercises.map((exercise, index) => {
        return (
          <ExerciseItem
            key={`activeWorkoutExerciseItem_${exercise.id}_${index}`}
            exercise={exercise}
            order={index + 1}
          />
        );
      })}
    </ul>
  );
}

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
function ExerciseItem({ exercise, order }: ExerciseItemProps) {
  const { onExerciseNameClick } = useActiveWorkoutContext();
  const sets_array: SetType[] = Array.from(Array(exercise.sets), (_, i) => ({
    ...SET,
    set_num: i + 1,
  }));

  const [sets, setSets] = useState([...sets_array]);

  const onCompleteSet = useCallback(
    (completed_set: SetType) => {
      const updatedSets = sets.map((set) => {
        if (set.set_num === completed_set.set_num) {
          return { ...set, ...completed_set };
        }
        return set;
      });
      setSets(updatedSets);
      console.log("completed set", completed_set, sets);
    },
    [sets]
  );

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
        {sets.map((set, index) => {
          return (
            <SetItem
              key={`exerciseSet_${exercise.id}_${set}_${index}`}
              set={set}
              onCompleteSet={onCompleteSet}
            />
          );
        })}

        <Button variant="ghost" className="text-secondary-400">
          Add Set
        </Button>
      </div>
    </li>
  );
}

type SetItemProps = {
  set: SetType;
  onCompleteSet: (completed_set: SetType) => void;
};

function SetItem({ set, onCompleteSet }: SetItemProps) {
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
    }
    setIsSetCompleted(!isSetCompleted);
  };

  const inputBorder = isSetCompleted ? "border-white" : "border-input";
  const bgColor = isSetCompleted ? "bg-secondary-300 text-white" : "";
  const buttonVariant = isSetCompleted ? "ghost" : "outline";
  const buttonColor = isSetCompleted
    ? "bg-secondary-400 hover:bg-secondary-300"
    : "";
  const iconColor = isSetCompleted ? "white" : "gray";
  return (
    <div className={`flex items-center rounded-md py-1 text-sm ${bgColor}`}>
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
    </div>
  );
}
