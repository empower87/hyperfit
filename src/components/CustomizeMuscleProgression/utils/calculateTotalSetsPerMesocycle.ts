import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getFinalMicrocycleSets_AddOnePerMicrocycle } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";

export const calculateTotalSetsOverMesocycles = (
  exercises: ExerciseType[][],
  frequencyProgression: number[],
  setProgressionMatrix: number[][][],
  microcycles: number
) => {
  const totalVolumes = Array.from(frequencyProgression, (e, i) => 0);

  if (exercises.length === 0) return totalVolumes;

  for (let i = 0; i < frequencyProgression.length; i++) {
    const frequency = frequencyProgression[i];
    const matrixIndex = setProgressionMatrix.findIndex(
      (row) => row.length === frequency
    );

    if (matrixIndex < 0) continue;

    let totalVolume = 0;
    const row = setProgressionMatrix[matrixIndex];

    for (let j = 0; j < exercises.length; j++) {
      const sessionExercises = exercises[j];
      const sessionSets: number[] = [];

      for (let g = 0; g < sessionExercises.length; g++) {
        const exercise = sessionExercises[g];

        const initialSets = exercise.initialSets
          ? exercise.initialSets[frequency]
            ? exercise.initialSets[frequency]
            : undefined
          : undefined;

        const matrixRowSets = row[j] && row[j][g] ? row[j][g] : 0;
        const sets = initialSets ? initialSets : matrixRowSets;
        sessionSets.push(sets);
      }

      const totalSets = getFinalMicrocycleSets_AddOnePerMicrocycle(
        sessionSets,
        microcycles
      );

      const sessionsSetsTotalVolume = totalSets[totalSets.length - 1].reduce(
        (acc, set) => acc + set,
        0
      );

      totalVolume = totalVolume + sessionsSetsTotalVolume;
    }
    totalVolumes[i] = totalVolume;
  }

  return totalVolumes;
};
