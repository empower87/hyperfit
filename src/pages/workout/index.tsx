import ActiveWorkout from "./components/ActiveWorkout/ActiveWorkout";
import { ExerciseItem } from "./components/ActiveWorkout/Exercises";
import { ExerciseHistory } from "./components/ExerciseHistory/ExerciseHistory";
import SavedTrainingBlocks from "./components/SavedTrainingBlocks/SavedTrainingBlocks";
import { RestTimerProvider } from "./contexts/restTimerContext";
import {
  ActiveWorkoutProvider,
  useActiveWorkoutContext,
} from "./hooks/useActiveWorkout";

export default function Workout() {
  return (
    <ActiveWorkoutProvider>
      <div className="flex h-full flex-col overflow-auto">
        <h1 className="mb-5 text-white">Workout</h1>
        <div className="flex space-x-6">
          <div className="">
            <SavedTrainingBlocks />
          </div>

          <RestTimerProvider>
            <ActiveWorkoutPanel />
          </RestTimerProvider>

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

  return (
    <div className="">
      <ActiveWorkout
        restTimerButton={<ActiveWorkout.RestTimerButton />}
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
      />
    </div>
  );
}
