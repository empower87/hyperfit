import ActiveWorkout from "./ActiveWorkout/ActiveWorkout";
import SavedTrainingBlocks from "./SavedTrainingBlocks/SavedTrainingBlocks";
import { ActiveWorkoutProvider } from "./hooks/useActiveWorkout";

export default function Workout() {
  return (
    <ActiveWorkoutProvider>
      <div className="flex h-full flex-col pt-10">
        <h1 className="mb-5 text-white">Workout</h1>
        <div className="flex h-full space-x-5 space-y-5">
          <SavedTrainingBlocks />
          <div className="flex h-full flex-col">
            <ActiveWorkout />
          </div>
        </div>
      </div>
    </ActiveWorkoutProvider>
  );
}
