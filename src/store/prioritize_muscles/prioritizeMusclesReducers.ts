import { getMusclesMaxFrequency } from "~/constants/workoutSplits";
import { MusclePriorityType, SplitSessionsType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getTotalExercisesFromSetMatrix, initializeSetProgression } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { initFrequencyProgressionAcrossMesocycles } from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/maximumFrequencyHandlers";
import { getMuscleData } from "~/utils/getMuscleData";

export const attachTargetFrequency = (
  muscle_priority_list: MusclePriorityType[],
  mesocycles: number,
  split_sessions: SplitSessionsType
) => {

  for (let i = 0; i < muscle_priority_list.length; i++) {
    const muscle = muscle_priority_list[i].muscle;
    const muscleData = getMuscleData(muscle);
    const exercisesPerSessionSchema =
      muscle_priority_list[i].volume.exercisesPerSessionSchema;
    const volume_landmark = muscle_priority_list[i].volume.landmark;

    let target = muscle_priority_list[i].frequency.target;
    const readjusted_target = getMusclesMaxFrequency(split_sessions, muscle);
    target = Math.min(target, readjusted_target);

    const frequencyProgression = initFrequencyProgressionAcrossMesocycles(
      mesocycles,
      target
    );

    const setProgressionMatrix = initializeSetProgression(
      volume_landmark,
      frequencyProgression,
      volume_landmark !== "MRV"
        ? muscleData[volume_landmark]
        : exercisesPerSessionSchema
    );

    const exercises = getTotalExercisesFromSetMatrix(
      muscle,
      volume_landmark,
      setProgressionMatrix,
      frequencyProgression
    );

    muscle_priority_list[i].frequency.progression = frequencyProgression;
    muscle_priority_list[i].frequency.setProgressionMatrix = setProgressionMatrix;
    muscle_priority_list[i].exercises = exercises;
  }
  return muscle_priority_list;
};
