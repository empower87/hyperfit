import { useState } from "react";
import ActiveWorkout from "./components/ActiveWorkout/ActiveWorkout";
import { ExerciseItem, SetList } from "./components/ActiveWorkout/Exercises";
import { ExerciseHistory } from "./components/ExerciseHistory/ExerciseHistory";
import SavedTrainingBlocks from "./components/SavedTrainingBlocks/SavedTrainingBlocks";
import {
  ActiveWorkoutProvider,
  useActiveWorkoutContext,
} from "./hooks/useActiveWorkout";
import useRestTimer from "./hooks/useRestTimer";

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
  const [startRestTimerOnSetComplete, setStartRestTimerOnSetComplete] =
    useState(false);
  const { startRestTimer } = useRestTimer();
  const startRestTimerOnSetCompleteHandler = () => {
    setStartRestTimerOnSetComplete((prev) => !prev);
  };
  return (
    <div className=" ">
      <ActiveWorkout
        restTimerButton={
          <ActiveWorkout.RestTimerButton
            startRestTimerOnSetComplete={startRestTimerOnSetComplete}
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
                  setList={
                    <SetList
                      sets={exercise.sets}
                      startRestTimerOnSetComplete={startRestTimer}
                    />
                  }
                />
              );
            })}
          </ul>
        }
      />
    </div>
  );
}
