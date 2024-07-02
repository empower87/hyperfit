import { useCallback, useState } from "react";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

type DurationTimeConstants = typeof DURATION_TIME_CONSTRAINTS;
export type DurationTimeConstantsKeys = keyof DurationTimeConstants;
type DurationTimeConstraint = DurationTimeConstants[DurationTimeConstantsKeys];

const MODALITY_TIME_CONSTRAINTS = {
  myoreps: {
    value: 10,
    min: 1,
    max: 15,
    increment: 1,
    rir: "0-2",
    initialReps: 10,
    followingReps: 5,
    followingRepsPercentageConstant: 0.41,
  },
  dropsets: {
    value: 5,
    min: 0,
    max: 10,
    increment: 1,
    rir: "0-4",
  },
};
// NOTE: use seconds
export const DURATION_TIME_CONSTRAINTS = {
  warmup: {
    value: 300,
    min: 0,
    max: 600,
    increment: 30,
  },
  rest: {
    value: 120,
    min: 0,
    max: 300,
    increment: 15,
  },
  superset: {
    value: 90,
    min: 0,
    max: 120,
    increment: 10,
  },
  rep: {
    value: 2,
    min: 1,
    max: 10,
    increment: 1,
  },
};

export default function useSessionDurationVariables() {
  const [durationTimeConstants, setDurationTimeConstants] =
    useState<DurationTimeConstants>({ ...DURATION_TIME_CONSTRAINTS });

  const exerciseModalityRepCalculator = (
    modality: ExerciseType["trainingModality"],
    sets: number,
    reps: number,
    repTime: DurationTimeConstraint
  ) => {
    switch (modality) {
      case "myoreps":
        const followingSets = sets - 1;
        const MYOREP_MULTIPLIER_CONSTANT = 0.41;
        const followingReps = Math.round(reps * MYOREP_MULTIPLIER_CONSTANT);
        const initialRepTotal = reps * repTime.value;
        const followingRepsTotal =
          followingReps * followingSets * repTime.value;
        const totalRepDuration = initialRepTotal + followingRepsTotal;
        return totalRepDuration;
      case "eccentric":
        const ECCENTRIC_MULTIPLIER_CONSTANT = 6;
        return sets * (reps * ECCENTRIC_MULTIPLIER_CONSTANT);
      case "lengthened partials":
        const lengthenedPartialRepTime = Math.round(repTime.value / 2);
        return sets * reps * lengthenedPartialRepTime;
      default:
        return sets * reps * repTime.value;
    }
  };

  const onTimeChange = useCallback(
    (key: DurationTimeConstantsKeys, time: number) => {
      const newDurationTimeConstants = {
        ...durationTimeConstants,
        [key]: { ...durationTimeConstants[key], value: time },
      };
      setDurationTimeConstants(newDurationTimeConstants);
    },
    [durationTimeConstants]
  );

  const sessionDurationCalculator = useCallback(
    (exercises: ExerciseType[], currentMicrocycleIndex: number) => {
      const { warmup, rest, rep, superset } = durationTimeConstants;

      const totalExercises = exercises.length;
      const restTime = totalExercises * rest.value;

      let totalRepTime = 0;
      let totalRestTime = 0;

      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i].mesocycle_progression;
        const modality = exercises[i].trainingModality;
        // const { sets, reps } = exercise[currentMicrocycleIndex];
        const sets = exercises[i].initialSetsPerMeso[currentMicrocycleIndex];
        const reps = 12;
        const repTime = exerciseModalityRepCalculator(
          modality,
          sets,
          reps,
          rep
        );

        let restTime = 0;
        if (exercises[i].trainingModality === "superset") {
          restTime = Math.round(superset.value / 2) * sets;
        } else {
          restTime = sets * rest.value;
        }
        totalRestTime += restTime;
        totalRepTime += repTime;
      }

      const totalTimeInMinutes = Math.round(
        (warmup.value + restTime + totalRepTime + totalRestTime) / 60
      );

      return totalTimeInMinutes;
    },
    [durationTimeConstants]
  );

  return {
    durationTimeConstants,
    sessionDurationCalculator,
    onTimeChange,
  };
}
