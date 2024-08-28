import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

export const canAddTrainingDay = () => {};

// 1. remove exercise array from exercises
// 2. adjust frequencyProgression
// 2a.

export const updateFrequencyProgressionOnTrainingDayRemoval = (
  training_day_index: number,
  exercises: ExerciseType[][],
  frequencyProgression: number[]
) => {
  const DAYS_REMOVED = 1;
  let updated_frequency_prog = [...frequencyProgression];
  const exercise_frequency = exercises[training_day_index]?.length;

  for (let i = 0; i < frequencyProgression.length; i++) {
    const curr_frequency = frequencyProgression[i];

    if (!exercise_frequency) {
      updated_frequency_prog[i] = 0;
      continue;
    }
    if (curr_frequency > exercise_frequency) {
      updated_frequency_prog[i] = updated_frequency_prog[i] - DAYS_REMOVED;
    }
    console.log(
      curr_frequency,
      exercise_frequency,
      updated_frequency_prog,
      exercises.map((ea) => ea.map((e) => e.name)),
      "NEED TO CHECK HERE ACTUALLY"
    );
  }
  console.log(
    exercise_frequency,
    updated_frequency_prog,
    frequencyProgression,
    training_day_index,
    "need to get [0, 0, 0,] in updated_frequency_prog kk"
  );
  return updated_frequency_prog;
};

export const updateExercisesOnTrainingDayRemoval = (
  target_tr_index: number,
  exercises: ExerciseType[][]
) => {
  return exercises.filter((ex, trDayIndex) => trDayIndex !== target_tr_index);
};
