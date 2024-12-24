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
  return <div className="flex flex-col">{active_workout?.day}</div>;
}

type ExerciseItemProps = {
  exercise: ExerciseType;
};

function ExerciseItem({ exercise }: ExerciseItemProps) {
  return <div></div>;
}
