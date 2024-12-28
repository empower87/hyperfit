import { CheckIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  ExerciseType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { NewTrainingWeek } from "~/hooks/useTrainingProgram/utils/training_block/trainingBlockHelpers";
import { useActiveWorkoutContext } from "../hooks/useActiveWorkout";

type ActiveWorkoutProps = {
  training_day: NewTrainingWeek | TrainingDayType;
};
export default function ActiveWorkout() {
  const { active_workout } = useActiveWorkoutContext();
  return (
    <div className="flex flex-col overflow-scroll">
      {active_workout?.day}

      <div className="space-y-2 overflow-auto">
        {active_workout?.session?.split}
        {active_workout?.session?.exercises.map((exercise, index) => {
          return (
            <ExerciseItem
              key={`activeWorkoutExerciseItem_${exercise.id}_${index}`}
              exercise={exercise}
              order={index + 1}
            />
          );
        })}
      </div>
    </div>
  );
}

const WIDTHS = ["w-10", "w-24", "w-24", "w-24", "w-10"];
const TITLES = ["SET", "PREVIOUS", "LBS", "REPS", ""];

function ExerciseHeaders() {
  return (
    <div className="flex p-2 pt-0 text-sm">
      {WIDTHS.map((width, index) => {
        return (
          <div
            key={`exerciseHeader_${width}_${index}`}
            className={`flex justify-center ${width}`}
          >
            {TITLES[index]}
          </div>
        );
      })}
    </div>
  );
}

type ExerciseItemProps = {
  exercise: ExerciseType;
  order: number;
};
function ExerciseItem({ exercise, order }: ExerciseItemProps) {
  const sets_array = Array.from(Array(exercise.sets), (_, i) => i + 1);
  const grid_rows = sets_array.length;
  return (
    <div className="flex flex-col space-y-1 rounded-lg border border-input">
      <div className="flex">
        <div className="p-2">{order}</div>
        <div className="p-2">{exercise.name}</div>
      </div>

      <ExerciseHeaders />
      <div className="flex flex-col space-y-2 p-2 pt-0">
        {sets_array.map((set, index) => {
          return (
            <SetItem
              key={`exerciseSet_${exercise.id}_${set}_${index}`}
              set={set}
              previous={[0, 0]}
              lbs={0}
              reps={0}
            />
          );
        })}
      </div>
    </div>
  );
}

type SetItemProps = {
  set: number;
  previous: [number, number];
  lbs: number;
  reps: number;
};

function SetItem({ set, previous, lbs, reps }: SetItemProps) {
  return (
    <div className="flex items-center text-sm">
      <div className={`${WIDTHS[0]} flex justify-center`}>{set}</div>
      <div className={`${WIDTHS[1]} flex justify-center`}>
        {previous[0]}lbs x {previous[1]}
      </div>
      <div className={`${WIDTHS[2]} flex justify-center p-1`}>
        <Input value={lbs} />
      </div>
      <div className={`${WIDTHS[3]} flex justify-center p-1`}>
        <Input value={reps} />
      </div>
      <div className={`${WIDTHS[0]} flex justify-center`}>
        <Button variant="outline" size="icon">
          <CheckIcon fill="white" />
        </Button>
      </div>
    </div>
  );
}
