import { useState } from "react";
import ActiveWorkout from "./components/ActiveWorkout/ActiveWorkout";
import { ExerciseHistory } from "./components/ExerciseHistory/ExerciseHistory";
import SavedTrainingBlocks from "./components/SavedTrainingBlocks/SavedTrainingBlocks";
import { ActiveWorkoutProvider } from "./hooks/useActiveWorkout";

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
  const [startRestTimerOnSetComplete, setStartRestTimerOnSetComplete] =
    useState(false);

  const startRestTimerOnSetCompleteHandler = () => {
    setStartRestTimerOnSetComplete(true);
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
          <ActiveWorkout.Exercises
            startRestTimerOnSetComplete={startRestTimerOnSetCompleteHandler}
          />
        }
      />
    </div>
  );
}
