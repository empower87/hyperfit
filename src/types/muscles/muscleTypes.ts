import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { initializeSetProgression } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";

export type MuscleGroupType =
  | "abs"
  | "back"
  | "biceps"
  | "calves"
  | "chest"
  | "delts_front"
  | "delts_rear"
  | "delts_side"
  | "forearms"
  | "glutes"
  | "hamstrings"
  | "quads"
  | "traps"
  | "triceps";

export type VolumeLandmarkType = "MRV" | "MEV" | "MV";
type VolumeLandmarkExtendedType =
  | "MRV"
  | "MEV"
  | "MV"
  | "MAV"
  | "MAV-P"
  | "MRV-P";

export type MusclePriorityVolumeType = {
  landmark: VolumeLandmarkType;
};
export type MusclePriorityFrequencyType = {
  range: [number, number];
  target: number;
  mesocycleProgression: number[];
};

type MusclePriorityType = {
  id: string;
  name: MuscleGroupType;
  exercises: {
    maxExercisesPerSession: 2;
    setProgressionMatrix: number[][][];
    list: ExerciseType[][];
  };
  volume: MusclePriorityVolumeType;
  frequency: MusclePriorityFrequencyType;
  getSetProgressionMatrix: () => void;
};

export const INITIAL_MUSCLE: MusclePriorityType = {
  id: "back-002",
  name: "back",
  volume: {
    landmark: "MRV",
  },
  frequency: {
    range: [3, 4],
    target: 0,
    mesocycleProgression: [],
  },
  exercises: {
    maxExercisesPerSession: 2,
    setProgressionMatrix: [],
    list: [],
  },
  getSetProgressionMatrix: function () {
    const setProgression = initializeSetProgression(
      this.volume.landmark,
      this.frequency.mesocycleProgression,
      this.exercises.maxExercisesPerSession
    );
    this.exercises.setProgressionMatrix = setProgression;
  },
};
