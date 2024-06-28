import { MuscleType, getMusclesSplit } from "~/constants/workoutSplits";
import {
  DayType,
  MusclePriorityType,
  OPTSessionsType,
  SessionSplitType,
  SessionType,
  SplitSessionsType,
  SplitType,
  TrainingDayType,
} from "../reducer/trainingProgramReducer";

type NewTrainingWeek = {
  day: DayType;
  isTrainingDay: boolean;
  sessions: {
    id: string;
    split: SessionSplitType;
    exercises: [MuscleType, string][];
  }[];
};

export const initializeTrainingBlock = (
  split_sessions: SplitSessionsType,
  muscle_priority_list: MusclePriorityType[],
  training_week: TrainingDayType[],
  frequency: number,
  mesocycles: number
) => {
  const totalWeekFrequency = Array.from(
    Array(mesocycles),
    (e, i) => frequency - i
  ).reverse();

  const splits = splitLimits(muscle_priority_list);

  const training_block: NewTrainingWeek[][] = [];

  for (let n = 3 - 1; n >= 0; n--) {
    let toRemove: string[] = [];
    if (n !== mesocycles - 1) {
      toRemove = removeSplitsFromFinalWeek(
        split_sessions.sessions as OPTSessionsType,
        totalWeekFrequency,
        n,
        splits
      );
    }

    const filteredWeek = filterOutSplitsFromWeek(toRemove, training_week);
    const filledWeek = exerciseDispersion(
      split_sessions,
      muscle_priority_list,
      filteredWeek,
      n
    );
    training_block.unshift(filledWeek);
  }

  const restructuredBlock = training_block.map((e, i) => [
    i,
    e.map((ee) => [ee.day, ee.sessions[0]?.id, ee.sessions[0]?.exercises]),
  ]);

  console.log(restructuredBlock, totalWeekFrequency, "OMFG COME ON??");
  return training_block;
};

const splitLimits = (muscle_priority_list: MusclePriorityType[]) => {
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

  console.log("PUSH: ", push, "PULL: ", pull, "LOWER: ", legs);

  return {
    push: push,
    pull: pull,
    legs: legs,
  };
};

const removeSplitsFromFinalWeek = (
  split_sessions: OPTSessionsType,
  frequency_progression: number[],
  mesocycleIndex: number,
  split_maxes: { push: number[]; pull: number[]; legs: number[] }
) => {
  let sessions = {
    upper: split_sessions.upper,
    lower: split_sessions.lower,
    push: split_sessions.push,
    pull: split_sessions.pull,
    full: split_sessions.full,
  };
  const priorityRemoval = ["full", "lower", "upper", "push", "pull"];

  let total: number = Object.values(sessions).reduce(
    (acc, cur) => acc + cur,
    0
  );
  const selectedFrequency = frequency_progression[mesocycleIndex];

  let push = split_maxes.push[mesocycleIndex];
  let pull = split_maxes.pull[mesocycleIndex];
  let legs = split_maxes.legs[mesocycleIndex];

  let tracker = 0;
  let removedSplits = [];

  while (
    Object.values(sessions).reduce((acc, cur) => acc + cur, 0) >=
    selectedFrequency
  ) {
    const key = priorityRemoval[tracker] as keyof typeof sessions;
    const canSub = sessions[key] - 1 >= 0;

    if (canSub) {
      sessions[key]--;

      if (sessions[key] - 1 === 0) tracker = tracker + 1;

      let pushTotal = sessions.push + sessions.upper + sessions.full;
      let pullTotal = sessions.pull + sessions.upper + sessions.full;
      let legsTotal = sessions.lower + sessions.full;

      let revert = false;
      if (pushTotal < push) {
        revert = true;
      }
      if (pullTotal < pull) {
        revert = true;
      }
      if (legsTotal < legs) {
        revert = true;
      }
      console.log(
        "frequencyProgression",
        frequency_progression,
        "mesocycleIndex: ",
        mesocycleIndex,
        "sessions: ",
        sessions,
        "pushMax: ",
        push,
        "pullMax: ",
        pull,
        "legsMax: ",
        legs,
        "push: ",
        pushTotal,
        "pull: ",
        pullTotal,
        "legs: ",
        legsTotal,
        "revert: ",
        revert
      );
      if (revert) {
        sessions[key] = sessions[key] + 1;
      } else removedSplits.push(key);
    } else {
      if (tracker === priorityRemoval.length) tracker = 0;
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
};
