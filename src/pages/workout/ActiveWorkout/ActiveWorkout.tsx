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
    <div className="flex flex-col">
      {active_workout?.day}

      <div className="space-y-2 overflow-auto">
        {active_workout?.session?.split}
        {active_workout?.session?.exercises.map((exercise, index) => {
          return (
            <ExerciseItem
              key={`activeWorkoutExerciseItem_${exercise.id}_${index}`}
              exercise={exercise}
            />
          );
        })}
      </div>
    </div>
  );
}

type ExerciseItemProps = {
  exercise: ExerciseType;
};

const WIDTHS = ["w-10", "w-24", "w-24", "w-24", "w-10"];
const TITLES = ["SET", "PREVIOUS", "LBS", "REPS", ""];
function ExerciseHeaders() {
  return (
    <div className="flex">
      {WIDTHS.map((width, index) => {
        return (
          <div key={`exerciseHeader_${width}_${index}`} className={width}>
            {TITLES[index]}
          </div>
        );
      })}
    </div>
  );
}
function ExerciseItem({ exercise }: ExerciseItemProps) {
  const sets_array = Array.from(Array(exercise.sets), (_, i) => i + 1);
  const grid_rows = sets_array.length;
  return (
    <div className="flex flex-col space-y-1 rounded-lg border border-input">
      <div className="p-2">{exercise.name}</div>

      <ExerciseHeaders />
      <div className="flex flex-col space-y-2 p-2">
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

      {/* <div className={`grid grid-cols-8 grid-rows-${grid_rows} text-sm`}>
        <div className="">SETS</div>
        <div className="col-span-2">PREVIOUS</div>
        <div className="col-span-2">LBS</div>
        <div className="col-span-2">Reps</div>
        <div className=""></div>
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
      </div> */}
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
    <div className="flex">
      <div className={`${WIDTHS[0]}`}>{set}</div>
      <div className={`${WIDTHS[1]}`}>
        {previous[0]}lbs x {previous[1]}
      </div>
      <div className={`${WIDTHS[2]}`}>
        <Input value={lbs} />
      </div>
      <div className={`${WIDTHS[3]}`}>{reps}</div>
      <div className="">x</div>
    </div>
  );
}
