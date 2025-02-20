import ActiveWorkout from "./components/ActiveWorkout/ActiveWorkout";
import { ExerciseItem } from "./components/ActiveWorkout/Exercises";
import { ExerciseHistory } from "./components/ExerciseHistory/ExerciseHistory";
import SavedTrainingBlocks from "./components/SavedTrainingBlocks/SavedTrainingBlocks";
import { RestTimerControlsProvider } from "./contexts/restTimerControlsContext";
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

          <ActiveWorkoutPanel />

          <div className="">
            <ExerciseHistory />
          </div>
        </div>
      </div>
    </ActiveWorkoutProvider>
  );
}

// function RestTimerWrapper() {
//   return (
//     <RestTimerProvider>

//     </RestTimerProvider>
//   )
// }

function ActiveWorkoutPanel() {
  const { active_workout } = useActiveWorkoutContext();
  // const {
  //   restTimerStatus,
  //   updateRestTimerStatus,
  //   restPeriods,
  //   currentRestPeriod,
  //   initializeRestDuration,
  // } = useRestTimerControls();

  const onAddExercise = () => {};
  return (
    <RestTimerControlsProvider>
      <ActiveWorkout
        restTimerButton={
          <ActiveWorkout.RestTimerButton
          // status={restTimerStatus}
          // updateRestTimerStatus={updateRestTimerStatus}
          // currentRestPeriod={currentRestPeriod}
          // restPeriods={restPeriods}
          // initializeRestDuration={initializeRestDuration}
          />
        }
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
