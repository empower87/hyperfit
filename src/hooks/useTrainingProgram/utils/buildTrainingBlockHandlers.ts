import {
  LOWER_MUSCLES,
  MuscleType,
  PULL_MUSCLES,
  PUSH_MUSCLES,
  getMusclesSplit,
} from "~/constants/workoutSplits";
import { includes } from "~/utils/readOnlyArrayIncludes";
import {
  ExerciseMesocycleProgressionType,
  ExerciseType,
  MusclePriorityType,
  SessionSplitType,
  SplitSessionsType,
  SplitType,
  TrainingDayType,
} from "../reducer/trainingProgramReducer";

const getMuscleGroupsExercisesForMesocycle = (
  setProgressionMatrix: number[][][],
  total_exercises: ExerciseType[][]
) => {
  const meso_exercises: ExerciseType[][] = [];
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
  split: SessionSplitType[]
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
  const updated_exercises = [...exercises];
  for (let i = 0; i < updated_exercises.length; i++) {
    const mesocycle_progression: ExerciseMesocycleProgressionType[] = [];
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

const getTotalExercisesByMeso = (
  exercises: ExerciseType[][],
  mesoFrequency: number
) => {
  return [...exercises].slice(0, mesoFrequency);
};

const reduceFrequency = () => {};

//
type MappedMuscleItem = {
  muscle: MuscleType;
  exercises: ExerciseType["id"][];
};

// TESTING
const buildPlaceholderTrainingBlock = (
  split_sessions: SplitSessionsType,
  muscle_priority_list: MusclePriorityType[],
  training_week: TrainingDayType[],
  mesocycles: number
) => {
  for (let i = 0; i < mesocycles; i++) {
    const pushMin = muscle_priority_list.reduce(
      (acc, cur) =>
        includes(PUSH_MUSCLES, cur.muscle) || cur.muscle === "delts_side"
          ? Math.max(acc, cur.frequency.progression[i])
          : acc,
      0
    );
    const pullMin = muscle_priority_list.reduce(
      (acc, cur) =>
        includes(PULL_MUSCLES, cur.muscle) || cur.muscle === "traps"
          ? Math.max(acc, cur.frequency.progression[i])
          : acc,
      0
    );
    const lowerMin = muscle_priority_list.reduce(
      (acc, cur) =>
        includes(LOWER_MUSCLES, cur.muscle) || cur.muscle === "abs"
          ? Math.max(acc, cur.frequency.progression[i])
          : acc,
      0
    );
    console.log(
      "PUSH: ",
      pushMin,
      "PULL: ",
      pullMin,
      "LOWER: ",
      lowerMin,
      "MESO: ",
      i
    );
  }
};

export const exerciseDispersion = (
  split_sessions: SplitSessionsType,
  muscle_priority_list: MusclePriorityType[],
  training_week: TrainingDayType[],
  targetFrequency: number
) => {
  const test = buildPlaceholderTrainingBlock(
    split_sessions,
    muscle_priority_list,
    training_week,
    3
  );
  const weekIds = training_week
    .map((ea) => ea.sessions.map((e) => e.id))
    .flat();
  const weekMap = new Map<string, MappedMuscleItem[]>(
    weekIds.map((ea, i) => [ea, []])
  );
  const updatedList = structuredClone(muscle_priority_list);

  for (let i = 0; i < muscle_priority_list.length; i++) {
    const muscle = muscle_priority_list[i].muscle;
    const sessionExerciseLimit =
      muscle_priority_list[i].volume.exercisesPerSessionSchema;
    const frequencyProgression = muscle_priority_list[i].frequency.progression;
    const limit = frequencyProgression[targetFrequency];
    const totalExercises = updatedList[i].exercises.slice(0, limit);
    const possibleSplits = getMusclesSplit(split_sessions.split, muscle);

    for (let j = 0; j < totalExercises.length; j++) {
      const sortedMap = Array.from(weekMap)
        .filter((each) => {
          if (possibleSplits.includes(each[0].split("_")[1] as SplitType))
            return each;
          else return null;
        })
        .sort((a, b) => a[1].length - b[1].length);

      let ids = totalExercises[j].map((each) => each.id);

      for (let k = 0; k < sortedMap.length; k++) {
        if (!ids.length) continue;
        const key = sortedMap[k][0];
        let values = weekMap.get(sortedMap[k][0]);

        if (!Array.isArray(values)) continue;
        const findMuscle = values.filter((ea) => ea.muscle === muscle)[0];

        if (!findMuscle) {
          values.push({ muscle, exercises: ids });
          updatedList[i] = {
            ...updatedList[i],
            exercises: updatedList[i].exercises.map((each) =>
              each.map((ea) => {
                if (ids.includes(ea.id)) {
                  return { ...ea, sessionIds: [...ea.sessionIds, key] };
                } else return ea;
              })
            ),
          };
          ids = [];
        } else {
          if (
            findMuscle.exercises.length + ids.length <=
            sessionExerciseLimit
          ) {
            const exerciseIds = {
              ...findMuscle,
              exercises: [...findMuscle.exercises, ...ids],
            };
            values = values.map((each) => {
              if (each.muscle === muscle) return exerciseIds;
              return each;
            });
            updatedList[i] = {
              ...updatedList[i],
              exercises: updatedList[i].exercises.map((each) =>
                each.map((ea) => {
                  if (ids.includes(ea.id)) {
                    return { ...ea, sessionIds: [...ea.sessionIds, key] };
                  } else return ea;
                })
              ),
            };
            ids = [];
          }
        }
        weekMap.set(key, values);
      }
    }
  }

  console.log(updatedList, weekMap, "these good??");
};

const distributeExercisesAmongSplit = (
  _muscle_priority: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  _training_week: TrainingDayType[],
  mesocycle: number
) => {
  const training_week: TrainingDayType[] = [..._training_week].map((each) => {
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

          const exersiseDetails = newExercises.get(exercise[l]);

          if (exersiseDetails) {
            const newDetails = [...exersiseDetails, details];
            newExercises.set(exercise[l], newDetails);
          } else {
            newExercises.set(exercise[l], [details]);
          }
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
      const sessionExercises = [...exercises[k]];
      for (let l = 0; l < sessionExercises.length; l++) {
        const exercise = sessionExercises[l];
        const details = newExercises.get(exercise);
        if (details) {
          sessionExercises[l].mesocycle_progression = details;
        }
      }
      training_week[indices[0]]?.sessions[indices[1]]?.exercises.push([
        ...sessionExercises,
      ]);
    }
  }
  return training_week;
};

export const buildTrainingBlockHandler = (
  muscle_priority_list: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  training_week: TrainingDayType[],
  mesocycles: number
) => {
  const mesocycle_weeks: TrainingDayType[][] = [];

  for (let i = 0; i < mesocycles; i++) {
    const distributed_mesocycle = distributeExercisesAmongSplit(
      muscle_priority_list,
      split_sessions,
      training_week,
      i
    );
    mesocycle_weeks.push(distributed_mesocycle);
  }
  console.log(mesocycle_weeks, "MESOCYCLE WEEKS");
  return mesocycle_weeks;
};
