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
  setProgressionMatrix: number[][][],
  total_exercises: ExerciseType[][]
) => {
  let meso_exercises: ExerciseType[][] = [];
  const current_mesocycle = setProgressionMatrix;

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

      console.log(
        microcycle_progression,
        microcycle_sets,
        exercises_index,
        "WHAT"
      );
      mesocycle_progression.push(details);
    }
    updated_exercises[i].mesocycle_progression = mesocycle_progression;
  }
  return updated_exercises;
};

const distributeExercisesAmongSplit = (
  _muscle_priority: MusclePriorityType[],
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
  const muscle_priority = structuredClone(_muscle_priority);
  for (let i = 0; i < muscle_priority.length; i++) {
    const muscle = muscle_priority[i].muscle;
    const muscle_exercises = muscle_priority[i].exercises;
    const { setProgressionMatrix } = muscle_priority[i].volume;
    const mesocycle_progression = [...setProgressionMatrix[mesocycle]];

    const exercises = [...muscle_exercises].splice(
      0,
      mesocycle_progression[0].length
    );

    // const exercises = getMuscleGroupsExercisesForMesocycle(
    //   mesocycle_progression,
    //   muscle_exercises
    // );
    const newExercises = new Map<
      ExerciseType,
      ExerciseMesocycleProgressionType[]
    >();

    for (let j = 0; j < mesocycle_progression.length; j++) {
      const matrix_sets = mesocycle_progression[j];

      for (let k = 0; k < exercises.length; k++) {
        const exercise = [...exercises[k]];

        for (let l = 0; l < exercise?.length; l++) {
          const details: ExerciseMesocycleProgressionType = {
            week: j + 1,
            sets: matrix_sets[k][l],
            reps: 10,
            weight: 100,
            rir: 3,
          };
          // exercise[l].mesocycle_progression.push(details);
          // exercises[k][l].mesocycle_progression.push(details);

          const getted = newExercises.get(exercise[l]);
          if (getted) {
            const newDetails = [...getted, details];
            newExercises.set(exercise[l], newDetails);
          } else {
            newExercises.set(exercise[l], [details]);
          }
          // newExercises.set(exercise[l], details);
        }
      }
    }
    const splits = getMusclesSplit(split_sessions.split, muscle);

    for (let k = 0; k < exercises.length; k++) {
      const indices = findSessionWithLowestVolume(
        training_week,
        muscle,
        splits
      );

      let sessionExercises = [...exercises[k]];
      for (let l = 0; l < sessionExercises.length; l++) {
        let exercise = sessionExercises[l];
        const details = newExercises.get(exercise);
        if (details) {
          sessionExercises[l].mesocycle_progression = details;
        }
      }

      training_week[indices[0]]?.sessions[indices[1]]?.exercises.push([
        ...sessionExercises,
      ]);
    }
    console.log(
      mesocycle,
      muscle,
      setProgressionMatrix,
      newExercises,
      "BIG FOUR"
    );
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

  const muscle_list = [...muscle_priority_list];

  // let week: TrainingDayType[] = training_week.map((each) => {
  //   const emptySessionSets = each.sessions.map((ea) => {
  //     return { ...ea, exercises: [] as ExerciseType[][] };
  //   });
  //   return { ...each, sessions: emptySessionSets };
  // });

  for (let i = 0; i < mesocycles; i++) {
    // const training_week = structuredClone(week);

    const distributed_mesocycle = distributeExercisesAmongSplit(
      muscle_list,
      split_sessions,
      training_week,
      i
    );
    mesocycle_weeks.push(distributed_mesocycle);
  }
  console.log(mesocycle_weeks, "MESOCYCLE WEEKS");
  return mesocycle_weeks;
};
