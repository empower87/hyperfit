import { getMusclesSplit } from "~/constants/workoutSplits";
import {
  ExerciseType,
  MusclePriorityType,
  SplitSessionsType,
  TrainingDayType,
} from "../reducer/trainingProgramReducer";

const getMuscleGroupsExercisesForMesocycle = (
  setProgressionMatrix: number[][][][],
  mesocycle: number,
  total_exercises: ExerciseType[][]
) => {
  let meso_exercises: ExerciseType[][] = [];
  const current_mesocycle = setProgressionMatrix[mesocycle];

  for (let i = 0; i < total_exercises.length; i++) {
    const session_exercises = [...total_exercises[i]];
    if (!current_mesocycle[0]) break;
    if (!current_mesocycle[0][i]) break;
    meso_exercises.push(session_exercises);
  }

  return meso_exercises;
};

const hasSessionReachedMaxExercises = (
  group: string,
  exercises: ExerciseType[][]
) => {
  let hasReachedMax = false;
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i][0];
    if (exercise.group === group) {
      hasReachedMax = true;
      break;
    }
  }
  console.log(hasReachedMax, group, exercises, "WHY IS THIS ALWAYS FALSE");
  return hasReachedMax;
};

const findSessionWithLowestVolume = (
  training_week: TrainingDayType[],
  group: string,
  split: string[],
  exercises: ExerciseType[]
) => {
  let minVolume = 1000;
  let currentPosition = [0, 0];
  for (let i = 0; i < training_week.length; i++) {
    if (!training_week[i].isTrainingDay) continue;
    const sessions = training_week[i].sessions;

    for (let j = 0; j < sessions.length; j++) {
      const session = sessions[j];

      if (!split.includes(session.split)) continue;
      const hasMaxed = hasSessionReachedMaxExercises(
        exercises[0].group,
        session.exercises
      );

      console.log(hasMaxed, session.exercises, group, "WTF");
      // if (!canAddExercises) continue;
      const total_exercises = session.exercises.flat();
      if (total_exercises.length < minVolume && !hasMaxed) {
        minVolume = total_exercises.length;
        currentPosition = [i, j];
      }
    }
  }
  return currentPosition;
};

const distributeExercisesAmongSplit = (
  muscle_priority: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  _training_week: TrainingDayType[],
  mesocycle: number
) => {
  let training_week: TrainingDayType[] = [..._training_week].map((each) => {
    const emptySessionSets = each.sessions.map((ea) => {
      return { ...ea, exercises: [] as ExerciseType[][] };
    });
    return { ...each, sessions: emptySessionSets };
  });

  for (let i = 0; i < muscle_priority.length; i++) {
    const muscle = muscle_priority[i].muscle;
    const muscle_exercises = muscle_priority[i].exercises;
    const { setProgressionMatrix } = muscle_priority[i].volume;

    const exercises = getMuscleGroupsExercisesForMesocycle(
      setProgressionMatrix,
      mesocycle,
      muscle_exercises
    );

    const splits = getMusclesSplit(split_sessions.split, muscle);

    for (let k = 0; k < exercises.length; k++) {
      const indices = findSessionWithLowestVolume(
        training_week,
        muscle,
        splits,
        exercises[k]
      );
      training_week[indices[0]]?.sessions[indices[1]]?.exercises.push(
        exercises[k]
      );
    }

    // for (let j = 0; j < training_week.length; j++) {
    //   if (exercises.length) {
    //     const sessions = training_week[j].sessions;

    //     for (let k = 0; k < sessions.length; k++) {
    //       if (splits.includes(sessions[k].split)) {
    //         let add_exercises = exercises[0].map((each) => ({
    //           ...each,
    //           session: j,
    //         }));

    //         training_week[j].sessions[k].exercises.push(add_exercises);
    //         exercises.shift();
    //       }
    //     }
    //   }
    // }
  }
  return training_week;
};

export const buildMesocyclesTEST = (
  muscle_priority_list: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  training_week: TrainingDayType[],
  mesocycles: number
) => {
  let mesocycle_weeks: TrainingDayType[][] = [];

  for (let i = 0; i < mesocycles; i++) {
    const distributed_mesocycle = distributeExercisesAmongSplit(
      muscle_priority_list,
      split_sessions,
      training_week,
      i
    );
    mesocycle_weeks.push(distributed_mesocycle);
  }

  return mesocycle_weeks;
};
