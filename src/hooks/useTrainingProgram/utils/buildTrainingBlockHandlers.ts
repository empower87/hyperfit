import { MuscleType, getMusclesSplit } from "~/constants/workoutSplits";
import {
  ExerciseMesocycleProgressionType,
  ExerciseType,
  MusclePriorityType,
  SplitSessionsType,
  SplitType,
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
  group: MuscleType,
  exercises: ExerciseType[][]
) => {
  let hasReachedMax = false;
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i][0];
    if (exercise.muscle === group) {
      hasReachedMax = true;
      break;
    }
  }
  return hasReachedMax;
};

const findSessionWithLowestVolume = (
  training_week: TrainingDayType[],
  muscle: MuscleType,
  split: SplitType[]
) => {
  let minVolume = 1000;
  let currentPosition = [0, 0];
  for (let i = 0; i < training_week.length; i++) {
    if (!training_week[i].isTrainingDay) continue;
    const sessions = training_week[i].sessions;

    for (let j = 0; j < sessions.length; j++) {
      const session = sessions[j];
      const hasMaxed = hasSessionReachedMaxExercises(muscle, session.exercises);

      if (!split.includes(session.split) || hasMaxed) continue;

      const total_exercises = session.exercises.flat();
      if (total_exercises.length < minVolume) {
        minVolume = total_exercises.length;
        currentPosition = [i, j];
      }
    }
  }
  return currentPosition;
};

const attachMesocycleProgressionToExercise = (
  exercises: ExerciseType[],
  exercises_index: number,
  matrix: number[][][]
) => {
  let updated_exercises = [...exercises];
  for (let i = 0; i < updated_exercises.length; i++) {
    let mesocycle_progression: ExerciseMesocycleProgressionType[] = [];
    for (let j = 0; j < matrix.length; j++) {
      const microcycle_progression = matrix[j];
      const microcycle_sets = microcycle_progression[exercises_index][i];
      const details: ExerciseMesocycleProgressionType = {
        week: j + 1,
        sets: microcycle_sets,
        reps: 10,
        weight: 100,
        rir: 3,
      };
      mesocycle_progression.push(details);
    }
    updated_exercises[i].mesocycle_progression = mesocycle_progression;
  }
  return updated_exercises;
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
  // const muscle_priority = [..._muscle_priority] as const;

  for (let i = 0; i < muscle_priority.length; i++) {
    const muscle = muscle_priority[i].muscle;
    const muscle_exercises = [...muscle_priority[i].exercises];
    const { setProgressionMatrix } = muscle_priority[i].volume;

    const exercises = getMuscleGroupsExercisesForMesocycle(
      setProgressionMatrix,
      mesocycle,
      muscle_exercises
    );

    const splits = getMusclesSplit(split_sessions.split, muscle);
    for (let k = 0; k < exercises.length; k++) {
      // const muscle = exercises[k][0].muscle
      const indices = findSessionWithLowestVolume(
        training_week,
        muscle,
        splits
      );
      const mesocycle_progression = setProgressionMatrix[mesocycle];
      const exercise_position = k;
      console.log(
        muscle,
        exercises,
        exercise_position,
        mesocycle_progression[exercise_position],
        mesocycle,
        "SO CONFUSING"
      );
      const exercises_w_progression = attachMesocycleProgressionToExercise(
        [...exercises[k]],
        exercise_position,
        mesocycle_progression
      );

      training_week[indices[0]]?.sessions[indices[1]]?.exercises.push(
        exercises_w_progression
      );
    }
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
    const muscle_list = [...muscle_priority_list];
    const distributed_mesocycle = distributeExercisesAmongSplit(
      muscle_list,
      split_sessions,
      training_week,
      i
    );
    mesocycle_weeks.push(distributed_mesocycle);
  }

  return mesocycle_weeks;
};
