import { MuscleType, getMusclesSplit } from "~/constants/workoutSplits";
import {
  DayType,
  ExerciseMesocycleProgressionType,
  ExerciseType,
  MusclePriorityType,
  OPTSessionsType,
  SessionSplitType,
  SessionType,
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

// TESTING ------------
// disperse into

const getSessionsForTrainingBlock = () => {
  //
};

const splitLimits = (
  split_sessions: SplitSessionsType,
  muscle_priority_list: MusclePriorityType[],
  total_frequency: number
) => {
  const mesocycles = muscle_priority_list[0].frequency.progression;
  const initArray = Array.from(Array(mesocycles.length), (e, i) => 0);
  let pull = [...initArray];
  let push = [...initArray];
  let legs = [...initArray];

  for (let i = 0; i < muscle_priority_list.length; i++) {
    const muscle = muscle_priority_list[i].muscle;
    const progression = muscle_priority_list[i].frequency.progression;

    for (let j = 0; j < progression.length; j++) {
      const split = getMusclesSplit("PPL", muscle)[0];

      switch (split) {
        case "push":
          push[j] = Math.max(push[j], progression[j]);
          break;
        case "pull":
          pull[j] = Math.max(pull[j], progression[j]);
          break;
        case "legs":
          legs[j] = Math.max(legs[j], progression[j]);
          break;
        default:
          break;
      }
    }
  }

  const splits = Object.entries(split_sessions.sessions)
    .map(([key, value]) => [...Array.from(Array(value), (e, i) => key)])
    .flat();

  const totalWeekFrequency = mesocycles
    .map((e, i) => total_frequency - i)
    .reverse();

  console.log(
    "PUSH: ",
    push,
    "PULL: ",
    pull,
    "LOWER: ",
    legs,
    "SPLITS: ",
    splits,
    "TOTAL FREQUENCY LIMITS: ",
    totalWeekFrequency
  );

  return {
    splits: {
      push: push,
      pull: pull,
      legs: legs,
    },
    total: totalWeekFrequency,
  };
};

type NewTrainingWeek = {
  day: DayType;
  isTrainingDay: boolean;
  sessions: {
    id: string;
    split: SessionSplitType;
    exercises: [MuscleType, string][];
  }[];
};

const removeSplitsFromFinalWeek = (
  split_sessions: OPTSessionsType,
  frequency_progression: number,
  split_maxes: { push: number[]; pull: number[]; legs: number[] }
) => {
  let sessions = {
    upper: split_sessions.upper,
    lower: split_sessions.lower,
    push: split_sessions.push,
    pull: split_sessions.pull,
    full: split_sessions.full,
  };
  const priorityRemoval = ["full", "push", "pull", "lower", "upper"];

  let total: number = Object.values(sessions).reduce(
    (acc, cur) => acc + cur,
    0
  );

  let push = split_maxes.push[frequency_progression];
  let pull = split_maxes.pull[frequency_progression];
  let legs = split_maxes.legs[frequency_progression];

  let tracker = 0;
  let removedSplits = [];

  while (total > frequency_progression) {
    total = Object.values(sessions).reduce((acc, cur) => acc + cur, 0);

    const key = priorityRemoval[tracker] as keyof typeof sessions;
    const canSub = sessions[key] - 1 >= 0;

    if (canSub) {
      sessions[key]--;

      if (sessions[key] - 1 === 0) tracker = tracker + 1;

      let pushTotal = sessions.push + sessions.upper + sessions.full;
      let pullTotal = sessions.pull + sessions.upper + sessions.full;
      let legsTotal = sessions.lower + sessions.full;

      let revert = false;
      if (pushTotal <= push) {
        revert = true;
      }
      if (pullTotal <= pull) {
        revert = true;
      }
      if (legsTotal <= legs) {
        revert = true;
      }
      if (revert) sessions[key] = sessions[key] + 1;
      else removedSplits.push(key);
    } else {
      tracker++;
    }
  }

  return removedSplits;
};

const filterOutSplitsFromWeek = (
  toRemove: string[],
  week: TrainingDayType[]
) => {
  if (!toRemove) return week;
  let remove = [...toRemove];
  const clonedWeek = structuredClone(week);

  for (let i = clonedWeek.length - 1; i >= 0; i--) {
    const sessions = clonedWeek[i].sessions;

    for (let j = 0; j < sessions.length; j++) {
      const curr = sessions[j];

      if (remove.includes(curr.split)) {
        const newSessions = sessions.filter((each) => each.id !== curr.id);
        if (!newSessions.length) {
          clonedWeek[i].isTrainingDay = false;
          const OFF_DAY: SessionType = {
            id: `${i}_off_session`,
            split: "off",
            exercises: [],
          };
          newSessions.push(OFF_DAY);
        }
        clonedWeek[i].sessions = newSessions;
        const index = remove.findIndex((each) => each === curr.split);
        remove.splice(index, 1);
      }
    }
  }

  return clonedWeek;
};

export const trainingBlockMain = (
  split_sessions: SplitSessionsType,
  muscle_priority_list: MusclePriorityType[],
  training_week: TrainingDayType[],
  frequency: number
) => {
  const { splits, total } = splitLimits(
    split_sessions,
    muscle_priority_list,
    frequency
  );

  const fullBlock: NewTrainingWeek[][] = [];

  const initialWeek = structuredClone(training_week);

  for (let n = 3 - 1; n >= 0; n--) {
    const toRemove = removeSplitsFromFinalWeek(
      split_sessions.sessions as OPTSessionsType,
      total[n],
      splits
    );
    const filteredWeek = filterOutSplitsFromWeek(toRemove, initialWeek);
    const filledWeek = exerciseDispersion(
      split_sessions,
      muscle_priority_list,
      filteredWeek,
      n
    );
    fullBlock.push(filledWeek);
  }

  const restructuredBlock = fullBlock.map((e, i) => [
    i,
    e.map((ee) => [ee.day, ee.sessions[0]?.id, ee.sessions[0]?.exercises]),
  ]);
  console.log(restructuredBlock, "OMFG COME ON??");
  return fullBlock;
};

const exerciseDispersion = (
  split_sessions: SplitSessionsType,
  muscle_priority_list: MusclePriorityType[],
  training_week: TrainingDayType[],
  targetFrequency: number
) => {
  const finalTrainingWeek: NewTrainingWeek[] = training_week.map((each) => {
    const sessions = each.sessions.map((ea) => ({
      ...ea,
      exercises: [] as [MuscleType, string][],
    }));
    return { ...each, sessions: sessions };
  });

  const weekIds = finalTrainingWeek
    .map((ea) => ea.sessions.map((e) => e.id))
    .flat();

  const finalTrainingWeekMap = new Map<string, [MuscleType, string][]>(
    weekIds.map((ea, i) => [ea, []])
  );

  for (let i = 0; i < muscle_priority_list.length; i++) {
    const muscle = muscle_priority_list[i].muscle;
    const sessionExerciseLimit =
      muscle_priority_list[i].volume.exercisesPerSessionSchema;
    const frequencyProgression = muscle_priority_list[i].frequency.progression;
    const limit = frequencyProgression[targetFrequency];
    const totalExercises = muscle_priority_list[i].exercises.slice(0, limit);
    const possibleSplits = getMusclesSplit(split_sessions.split, muscle);

    for (let j = 0; j < totalExercises.length; j++) {
      const sortedMap = Array.from(finalTrainingWeekMap)
        .filter((each) => {
          if (possibleSplits.includes(each[0].split("_")[1] as SplitType))
            return each;
          else return null;
        })
        .sort((a, b) => a[1].length - b[1].length);

      let total = totalExercises[j].length;

      for (let k = 0; k < sortedMap.length; k++) {
        if (total === 0) continue;
        const key = sortedMap[k][0];
        const values = finalTrainingWeekMap.get(sortedMap[k][0]);

        if (Array.isArray(values)) {
          const findMuscles = values.filter((ea) => ea[0] === muscle);

          if (findMuscles.length + total <= sessionExerciseLimit) {
            totalExercises[j].forEach((ea) => values.push([muscle, ea.id]));
            total = 0;
          }
          finalTrainingWeekMap.set(key, values);
        }
      }
    }
  }

  for (let l = 0; l < finalTrainingWeek.length; l++) {
    const sessions = finalTrainingWeek[l].sessions;

    for (let m = 0; m < sessions.length; m++) {
      const getValues = finalTrainingWeekMap.get(sessions[m].id);
      if (!getValues) continue;
      finalTrainingWeek[l].sessions[m].exercises = getValues;
    }
  }

  return finalTrainingWeek;

  // const fullBlock: NewTrainingWeek[][] = [];
  // let counter = 0;
  // // let updatedWeek = finalTrainingWeek;
  // let initialWeek = structuredClone(finalTrainingWeek);

  // for (let n = 3 - 1; n >= 0; n--) {
  //   const ohboy = removeSplitsFromFinalWeek(
  //     split_sessions.sessions as OPTSessionsType,
  //     test.total[n],
  //     test.splits
  //   );

  //   const ugh = getPrecedingTrainingWeeks(initialWeek, muscle_priority_list, n);
  //   initialWeek = structuredClone(ugh);
  //   fullBlock.push(initialWeek);

  //   counter++;

  //   console.log(n, ohboy, "OMFG COME ON??");
  // }

  // console.log(fullBlock, "OMFG COME ON??");
};

// const exerciseRedistribution = (
//   training_week: NewTrainingWeek[],
//   split_sessions: SplitSessionsType,
//   week_map: Map<string, [MuscleType, string][]>,
//   muscle_priority_list: MusclePriorityType[],
//   frequency_progression: number[],
//   mesocycle_index: number
// ) => {
//   const total_frequency = frequency_progression[mesocycle_index];

//   for (let i = 0; i < muscle_priority_list.length; i++) {
//     const muscle = muscle_priority_list[i];
//     const muscle_frequency = muscle.frequency.progression[mesocycle_index];
//     const possibleSplits = getMusclesSplit(split_sessions.split, muscle.muscle);
//     const sortedMap = Array.from(week_map)
//       .filter((each) => {
//         if (possibleSplits.includes(each[0].split("_")[1] as SplitType))
//           return each;
//         else return null;
//       })
//       .sort((a, b) => a[1].length - b[1].length);
//     const longest = sortedMap[0];
//     const shortest = sortedMap[sortedMap.length - 1];
//   }
// };

const getPrecedingTrainingWeeks = (
  final_training_week: NewTrainingWeek[],
  muscle_priority_list: MusclePriorityType[],
  currentMesoIndex: number
) => {
  const cloned = structuredClone(final_training_week);

  for (let i = 0; i < muscle_priority_list.length; i++) {
    const muscle = muscle_priority_list[i].muscle;
    const exercises = muscle_priority_list[i].exercises;

    const progression =
      muscle_priority_list[i].frequency.progression[currentMesoIndex];
    if (!exercises[progression]) continue;
    const exercisesToRemove = exercises[progression].map(
      (exercise) => exercise.id
    );

    for (let j = 0; j < cloned.length; j++) {
      const sessions = cloned[j].sessions;

      for (let k = 0; k < sessions.length; k++) {
        const exercises = sessions[k].exercises;

        for (let l = 0; l < exercises.length; l++) {
          if (exercisesToRemove.includes(exercises[l][1])) {
            exercises.splice(l, 1);
            cloned[j].sessions[k].exercises = exercises;
          }
        }
      }
    }
  }

  return cloned;
};

// export const exerciseDispersion = (
//   split_sessions: SplitSessionsType,
//   muscle_priority_list: MusclePriorityType[],
//   training_week: TrainingDayType[],
//   targetFrequency: number
// ) => {
//   const test = buildPlaceholderTrainingBlock(
//     split_sessions,
//     muscle_priority_list,
//     training_week,
//     3
//   );
//   const weekIds = training_week
//     .map((ea) => ea.sessions.map((e) => e.id))
//     .flat();
//   const weekMap = new Map<string, MappedMuscleItem[]>(
//     weekIds.map((ea, i) => [ea, []])
//   );
//   const updatedList = structuredClone(muscle_priority_list);

//   for (let i = 0; i < muscle_priority_list.length; i++) {
//     const muscle = muscle_priority_list[i].muscle;
//     const sessionExerciseLimit =
//       muscle_priority_list[i].volume.exercisesPerSessionSchema;
//     const frequencyProgression = muscle_priority_list[i].frequency.progression;
//     const limit = frequencyProgression[targetFrequency];
//     const totalExercises = updatedList[i].exercises.slice(0, limit);
//     const possibleSplits = getMusclesSplit(split_sessions.split, muscle);

//     for (let j = 0; j < totalExercises.length; j++) {
//       const sortedMap = Array.from(weekMap)
//         .filter((each) => {
//           if (possibleSplits.includes(each[0].split("_")[1] as SplitType))
//             return each;
//           else return null;
//         })
//         .sort((a, b) => a[1].length - b[1].length);

//       let ids = totalExercises[j].map((each) => each.id);

//       for (let k = 0; k < sortedMap.length; k++) {
//         if (!ids.length) continue;
//         const key = sortedMap[k][0];
//         let values = weekMap.get(sortedMap[k][0]);

//         if (!Array.isArray(values)) continue;
//         const findMuscle = values.filter((ea) => ea.muscle === muscle)[0];

//         if (!findMuscle) {
//           values.push({ muscle, exercises: ids });
//           updatedList[i] = {
//             ...updatedList[i],
//             exercises: updatedList[i].exercises.map((each) =>
//               each.map((ea) => {
//                 if (ids.includes(ea.id)) {
//                   return { ...ea, sessionIds: [...ea.sessionIds, key] };
//                 } else return ea;
//               })
//             ),
//           };
//           ids = [];
//         } else {
//           if (
//             findMuscle.exercises.length + ids.length <=
//             sessionExerciseLimit
//           ) {
//             const exerciseIds = {
//               ...findMuscle,
//               exercises: [...findMuscle.exercises, ...ids],
//             };
//             values = values.map((each) => {
//               if (each.muscle === muscle) return exerciseIds;
//               return each;
//             });
//             updatedList[i] = {
//               ...updatedList[i],
//               exercises: updatedList[i].exercises.map((each) =>
//                 each.map((ea) => {
//                   if (ids.includes(ea.id)) {
//                     return { ...ea, sessionIds: [...ea.sessionIds, key] };
//                   } else return ea;
//                 })
//               ),
//             };
//             ids = [];
//           }
//         }
//         weekMap.set(key, values);
//       }
//     }
//   }

//   console.log(updatedList, weekMap, "these good??");
// };

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
