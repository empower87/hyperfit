import ActiveWorkout from "~/components/workout/ActiveWorkout/ActiveWorkout";
import { ExerciseItem } from "~/components/workout/ActiveWorkout/Exercises";
import { ExerciseHistory } from "~/components/workout/ExerciseHistory/ExerciseHistory";
import SavedTrainingBlocks from "~/components/workout/SavedTrainingBlocks/SavedTrainingBlocks";
import {
  ActiveWorkoutProvider,
  useActiveWorkoutContext,
} from "~/hooks/workout/useActiveWorkoutContext";
import { RestTimerControlsProvider } from "~/hooks/workout/useRestTimerControlsContext";

export default function Workout() {
  return (
    <ActiveWorkoutProvider>
      <div className="flex h-full flex-col overflow-auto">
        <h1 className="mb-5 text-white">Workout</h1>

        <div className="flex space-x-6">
          <div className="">
            <SavedTrainingBlocks />
          </div>

          <ActiveWorkoutPanel />

          <div className="">
            <ExerciseHistory />
          </div>
        </div>
      </div>
    </ActiveWorkoutProvider>
  );
}

function ActiveWorkoutPanel() {
  const { active_workout } = useActiveWorkoutContext();

  const onAddExercise = () => {};

  return (
    <RestTimerControlsProvider>
      <ActiveWorkout
        restTimerButton={<ActiveWorkout.RestTimer />}
        exercises={
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
        }
        selectExercise={
          <ActiveWorkout.AddExercise onAddExercise={onAddExercise} />
        }
      />
    </RestTimerControlsProvider>
  );
}
