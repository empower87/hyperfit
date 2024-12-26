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

      <div>
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

function ExerciseItem({ exercise }: ExerciseItemProps) {
  const sets_array = Array.from(Array(exercise.sets), (_, i) => i + 1);
  return (
    <div className="flex flex-col space-y-1">
      <div>{exercise.name}</div>

      <div>
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
    <div className="flex space-x-2">
      <div>{set}</div>
      <div>
        {previous[0]}lbs x {previous[1]}
      </div>
      <div>{lbs}</div>
      <div>{reps}</div>
    </div>
  );
}
