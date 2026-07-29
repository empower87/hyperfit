import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";


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
  }

  return updated_frequency_prog;
};

export const updateExercisesOnTrainingDayRemoval = (
  target_tr_index: number,
  exercises: ExerciseType[][]
) => {
  return exercises.filter((ex, trDayIndex) => trDayIndex !== target_tr_index);
};
