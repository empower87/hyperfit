import ActiveWorkout from "./components/ActiveWorkout/ActiveWorkout";
import { ExerciseHistory } from "./components/ExerciseHistory/ExerciseHistory";
import SavedTrainingBlocks from "./components/SavedTrainingBlocks/SavedTrainingBlocks";
import { ActiveWorkoutProvider } from "./hooks/useActiveWorkout";

export default function Workout() {
  return (
    <ActiveWorkoutProvider>
      <div className="flex h-full flex-col">
        <h1 className="mb-5 text-white">Workout</h1>
        <div className="flex">
          <div className="p-4 pt-0">
            <SavedTrainingBlocks />
          </div>

          <div className="p-4 pt-0">
            <ActiveWorkout>
              <ActiveWorkout.Exercises />
            </ActiveWorkout>
          </div>

          <div className="p-4 pt-0">
            <ExerciseHistory />
          </div>
        </div>
      </div>
    </ActiveWorkoutProvider>
  );
}
