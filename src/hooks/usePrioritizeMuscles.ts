import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MEV_RANK, MRV_RANK } from "src/constants/prioritizeRanks";
import { determineWorkoutSplit } from "~/components/Macrocycle/TrainingBlock";
import { getExercise } from "~/constants/exercises";
import {
  LOWER_MUSCLES,
  PULL_MUSCLES,
  PUSH_AND_PULL_MUSCLES,
  PUSH_MUSCLES,
  UPPER_MUSCLES,
} from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType } from "~/pages";
import { getMuscleData } from "../utils/getMuscleData";
import { ExerciseType, VolumeKey } from "./useTrainingBlock";

export type SessionSplitType = "upper" | "lower" | "full";

// const getSessionType = (name: string) => {
//   if (PUSH_MUSCLES.includes(name)) {
//     return "push"
//   } else if (PULL_MUSCLES.includes(name)) {
//     return "pull"
//   } else if (LOWER_MUSCLES.includes(name)) {
//     return "lower"
//   } else {
//     return "any"
//   }
// }
const initializeSessions = (sessions: number) => {
  switch (sessions) {
    case 3:
      return [2, 2, 2];
    case 4:
      // lower full full upper

      return [3, 3, 3];
    case 5:
      return [4, 4, 3];
    case 6:
      // max - 4 - 1 - 1

      return [4, 4, 3];

    case 7:
      return [1, 1, 1];
    case 8:
      return [1, 1, 1];
    case 9:
      return [1, 1, 1];
    case 10:
      return [1, 1, 1];
    case 11:
      return [6, 6, 5];
    case 12:
      return [6, 6, 5];
    case 13:
      return [6, 6, 6];
    case 14:
      // max_lower = 6 - 4 - 4
      // max_push = 6
      return [6, 6, 6];
    default:
  }
};

export const getPushPosition = (
  list: MusclePriorityType[],
  totalSessions: number
) => {
  let push = 0;
  let pull = 0;
  let lower = 0;

  // 00 14
  // 01 12
  // 02 10
  // 03 8
  // 04 7
  // 05 6
  // 06 5
  // 07 4
  // 08 3
  // 09 2
  // 10 1
  // 11 0
  // 12 0
  // 13 0
  const WEIGHTS = [14, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0];

  for (let i = 0; i < list.length; i++) {
    if (PUSH_MUSCLES.includes(list[i].muscle)) {
      // push = push + (1 * list.length - i);
      push = push + WEIGHTS[i];
    } else if (PULL_MUSCLES.includes(list[i].muscle)) {
      // pull = pull + (1 * list.length - i);
      pull = pull + WEIGHTS[i];
    } else if (PUSH_AND_PULL_MUSCLES.includes(list[i].muscle)) {
      let split = Math.round(WEIGHTS[i] / 2);
      push = push + split;
      pull = pull + split;
    } else if (LOWER_MUSCLES.includes(list[i].muscle)) {
      lower = lower + WEIGHTS[i];
    }
  }
  // maths
  const total = push + pull + lower;

  const pushDecimal = push / total;
  const pullDecimal = pull / total;
  const lowerDecimal = lower / total;

  const pushPercent = Math.round(pushDecimal * 100);
  const pullPercent = Math.round(pullDecimal * 100);
  const lowerPercent = Math.round(lowerDecimal * 100);

  const pushRatio = (totalSessions * pushDecimal).toFixed(1);
  const pullRatio = (totalSessions * pullDecimal).toFixed(1);
  const lowerRatio = (totalSessions * lowerDecimal).toFixed(1);

  let upperSessions = 0;
  let lowerSessions = 0;
  let fullSessions = 0;

  const getPush = (totalSessions * pushDecimal)
    .toFixed(2)
    .split(".")
    .map((each) => parseInt(each));
  const getPull = (totalSessions * pullDecimal)
    .toFixed(2)
    .split(".")
    .map((each) => parseInt(each));
  const getLower = (totalSessions * lowerDecimal)
    .toFixed(2)
    .split(".")
    .map((each) => parseInt(each));

  upperSessions = getPush[0] + getPull[0];
  lowerSessions = getLower[0];

  let totalPushAndPull = getPush[1] + getPush[1];
  let totalLower = getLower[1];

  let roundPushAndPull = Math.round(totalPushAndPull / 5) * 5;
  let roundLower = Math.round(totalLower / 5) * 5;

  if (roundPushAndPull >= 0 && roundPushAndPull <= 0.5) {
    if (roundLower > 1) {
      lowerSessions = lowerSessions + 2;
    } else if (roundLower === 1) {
      lowerSessions = lowerSessions + 1;
    }
  } else if (roundPushAndPull > 0.5 && roundPushAndPull <= 1) {
    if (roundLower > 1) {
      lowerSessions = lowerSessions + 1;
      fullSessions = fullSessions + 1;
    } else {
      fullSessions = fullSessions + 1;
    }
  } else if (roundPushAndPull > 1 && roundPushAndPull <= 1.5) {
    upperSessions = upperSessions + 1;
    if (roundLower >= 1) {
      lowerSessions = lowerSessions + 1;
    }
  } else {
    upperSessions = upperSessions + 1;
    fullSessions = fullSessions + 1;
  }

  const det = determineWorkoutSplit(push, pull, lower, totalSessions);
  // switch (roundPushAndPull) {
  //   case 0:
  //     if (roundLower > 1) {
  //       lowerSessions = lowerSessions + 2;
  //     } else if (roundLower === 1) {
  //       lowerSessions = lowerSessions + 1;
  //     }
  //   case 0.5:
  //     if (roundLower > 1) {
  //       lowerSessions = lowerSessions + 1;
  //       fullSessions = fullSessions + 1;
  //     } else {
  //       fullSessions = fullSessions + 1;
  //     }
  //   case 1:
  //     upperSessions = upperSessions + 1;
  //     if (roundLower >= 1) {
  //       lowerSessions = lowerSessions + 1;
  //     }
  //   case 1.5:
  //     upperSessions = upperSessions + 1;
  //     fullSessions = fullSessions + 1;
  //   case 2:
  //     upperSessions = upperSessions + 2;
  // }

  console.log(
    `push: ${push} -- pull: ${pull} -- lower: ${lower} total: ${total}`
  );
  console.log(
    `push: ${pushPercent}% -- pull: ${pullPercent}% -- lower: ${lowerPercent}% total: 100%`
  );
  console.log(
    `push: ${pushRatio} -- pull: ${pullRatio} -- lower: ${lowerRatio} total: ${totalSessions}`
  );

  let split: ("upper" | "lower" | "full")[] = [];

  for (let i = 0; i < upperSessions; i++) {
    split.push("upper");
  }
  for (let i = 0; i < lowerSessions; i++) {
    split.push("lower");
  }
  for (let i = 0; i < fullSessions; i++) {
    split.push("full");
  }

  return det;
};

const getLowerPosition = (list: MusclePriorityType[]) => {
  let priority = [0, 0];

  for (let i = 0; i < list.length; i++) {
    if (i < MRV_RANK) {
      let muscle = list[i].muscle;

      if (LOWER_MUSCLES.includes(muscle)) {
        if (i === 0 && muscle !== "calves") {
          priority[0] = 1;
          priority[1]++;
        } else if (i === 1 && muscle !== "calves") {
          if (priority[0] > 0) {
            priority[0]++;
          }
          priority[1]++;
        } else {
          priority[1]++;
        }
      }
    } else {
      break;
    }
  }

  // 4 = MAX_MRV       5
  // 3 = FULL_MRV      4
  // 2, 2 = FULL_MRV   4
  // 1, 2 = MRV        3
  // 0, 2 = LOW_MRV    2
  // 1, 1 = LOW_MRV    2
  // 0, 1 = MEV        2
  // 0 = MV            1

  switch (priority[1]) {
    case 4:
      return "MAX_MRV";
    case 3:
      return "FULL_MRV";
    case 2:
      if (priority[0] === 2) {
        return "FULL_MRV";
      } else if (priority[0] === 1) {
        return "MRV";
      } else {
        return "LOW_MRV";
      }
    case 1:
      if (priority[0] === 1) {
        return "LOW_MRV";
      } else {
        return "MEV";
      }
    default:
      return "MV";
  }
};

const getTrainingSplit = (
  list: MusclePriorityType[],
  sessions: number
): SessionSplitType[] => {
  const lowerRank = getLowerPosition(list);

  switch (sessions) {
    // case 2:
    //   return ["full", "full"];
    // case 3:
    //   return ["full", "full", "full"];
    case 3:
      return ["upper", "lower", "upper"];
    case 4:
      return ["upper", "upper", "lower", "lower"];
    case 5:
      switch (lowerRank) {
        case "MAX_MRV":
          return ["lower", "upper", "lower", "full", "lower"];
        case "FULL_MRV":
          return ["lower", "upper", "lower", "full", "full"];
        case "MRV":
          return ["lower", "upper", "lower", "upper", "full"];
        case "LOW_MRV":
          return ["upper", "lower", "upper", "full", "full"];
        case "MEV":
          return ["upper", "lower", "upper", "full", "upper"];
        default:
          return ["upper", "lower", "upper", "full", "upper"];
      }
    case 6:
      switch (lowerRank) {
        case "MAX_MRV":
          return ["lower", "lower", "lower", "lower", "full", "upper"];
        case "FULL_MRV":
          return ["upper", "lower", "full", "lower", "full", "upper"];
        case "MRV":
          return ["upper", "lower", "upper", "full", "full", "upper"];
        case "LOW_MRV":
          return ["upper", "lower", "upper", "full", "full", "upper"];
        case "MEV":
          return ["upper", "lower", "upper", "full", "upper", "upper"];
        default:
          return ["upper", "lower", "upper", "upper", "upper", "upper"];
      }
    case 7:
      return ["upper", "upper", "upper", "lower", "lower", "lower", "full"];

    case 8:

    case 9:
    case 10:
    case 11:
      const f121 = ["lower", "push", "lower", "pull", "lower", "lower"];
      const s121 = ["push", "pull", "none", "lower", "push", "pull"];
    case 12:
      // push pull legs push pull legs
      // legs push pull legs push pull

      // push upper upper upper upper upper upper
      // lower lower lower lower lower lower lower
      switch (lowerRank) {
        case "MAX_MRV":
          const f121 = ["lower", "push", "lower", "pull", "lower", "lower"];
          const s121 = ["push", "pull", "upper", "lower", "push", "pull"];

          return ["lower", "upper", "lower", "upper", "lower", "upper"];
        case "FULL_MRV":
          const f122 = ["lower", "push", "lower", "pull", "lower", "lower"];
          const s122 = ["push", "pull", "upper", "lower", "push", "pull"];

          return ["upper", "lower", "full", "lower", "full", "upper"];
        case "MRV":
          return ["upper", "lower", "upper", "full", "full", "upper"];
        case "LOW_MRV":
          return ["upper", "lower", "upper", "full", "full", "upper"];
        case "MEV":
          return ["upper", "lower", "upper", "full", "upper", "upper"];
        default:
          return ["upper", "lower", "upper", "upper", "upper", "upper"];
      }
    default:
      return ["full"];
  }
};

const getMesoProgression = (sessions: number) => {
  switch (sessions) {
    case 5:
      return [3, 4, 5];
    case 4:
      return [2, 3, 4];
    case 3:
      return [2, 3, 3];
    case 2:
      return [1, 2, 2];
    case 1:
      return [1, 1, 1];
    default:
      return [0, 0, 0];
  }
};

const updateMuscleListSets = (
  items: MusclePriorityType[],
  split: SessionSplitType[]
) => {
  let upper = split.filter((each) => each !== "lower");
  let lower = split.filter((each) => each !== "upper");

  for (let i = 0; i < items.length; i++) {
    const muscleData = getMuscleData(items[i].muscle);

    let key: VolumeKey =
      i < MRV_RANK
        ? "mrv_progression_matrix"
        : i >= MRV_RANK && i < MEV_RANK
        ? "mev_progression_matrix"
        : "mv_progression_matrix";

    let sessions = lower;

    const volume_landmark =
      i < MRV_RANK ? "MRV" : i >= MRV_RANK && i < MEV_RANK ? "MEV" : "MV";

    if (UPPER_MUSCLES.includes(items[i].muscle)) {
      sessions = upper;
    }

    let mesoProgression = [1, 1, 1];
    let matrixIndex = 0;

    if (key === "mrv_progression_matrix") {
      let prog = getMesoProgression(sessions.length);
      mesoProgression = prog;
      matrixIndex = prog[prog.length - 1] - 1;
    } else if (key === "mev_progression_matrix") {
      if (sessions.length <= 2) {
        mesoProgression = [1, 2, 2];
        matrixIndex = 1;
      } else if (
        items[i].muscle === "back" ||
        items[i].muscle === "quads" ||
        items[i].muscle === "calves"
      ) {
        mesoProgression = [2, 3, 3];
        matrixIndex = 2;
      }
    } else {
      if (
        items[i].muscle === "back" ||
        items[i].muscle === "quads" ||
        items[i].muscle === "calves"
      ) {
        mesoProgression = [1, 2, 2];
        matrixIndex = 1;
      }
    }

    let matrix = muscleData[key][matrixIndex];
    let exercises: ExerciseType[][] = [];

    const exercise: ExerciseType = {
      exercise: "Triceps Extension (cable, single-arm)",
      group: "back",
      rank: "MRV",
      session: 1,
      sets: 2,
      reps: 10,
      weight: 100,
      rir: 3,
    };

    let count = 0;

    for (let j = 0; j < matrix?.length; j++) {
      let exerciseList: ExerciseType[] = [];

      const splitVol = matrix[j].split("-").map((each) => parseInt(each));

      console.log(matrix, splitVol, "WHAT IS GOING ON???");
      if (splitVol.length > 1) {
        exerciseList.push(
          {
            ...exercise,
            rank: volume_landmark,
            sets: splitVol[0],
            session: j + 1,
            group: muscleData.name,
            exercise: getExercise(muscleData.name, count).name,
          },
          {
            ...exercise,
            rank: volume_landmark,
            sets: splitVol[1],
            session: j + 1,
            group: muscleData.name,
            exercise: getExercise(muscleData.name, count + 1).name,
          }
        );
        count = count + 2;
      } else {
        exerciseList.push({
          ...exercise,
          rank: volume_landmark,
          sets: splitVol[0],
          session: j + 1,
          group: muscleData.name,
          exercise: getExercise(muscleData.name, count).name,
        });
        count = count + 1;
      }
      exercises.push(exerciseList);
    }

    items[i] = {
      ...items[i],
      mesoProgression: mesoProgression,
      exercises: exercises,
    };
  }
  console.log(items, "HAS THIS CHANGED???");
  return items;
};

const updateWorkoutSplit = (split: ("upper" | "lower" | "full")[]) => {
  let newSplit: SessionType[] = [];

  const INITIAL_SESSION: SessionType = {
    day: 1,
    sets: [],
    totalSets: 0,
    maxSets: 30,
    split: "full",
  };

  for (let i = 0; i < split.length; i++) {
    newSplit.push({ ...INITIAL_SESSION, day: i + 1, split: split[i] });
  }
  return newSplit;
};

export default function usePrioritizeMuscles(
  musclePriorityList: MusclePriorityType[],
  max_workouts: number,
  setWorkoutSplit: Dispatch<SetStateAction<SessionType[]>>
) {
  const [newList, setNewList] = useState<MusclePriorityType[]>([
    ...musclePriorityList,
  ]);

  useEffect(() => {
    const split = getTrainingSplit(newList, max_workouts);
    const getNewList = updateMuscleListSets(musclePriorityList, split);
    const updatedWorkoutSplit = updateWorkoutSplit(split);

    setNewList(getNewList);
    setWorkoutSplit(updatedWorkoutSplit);
  }, [max_workouts, musclePriorityList, newList]);

  return { newList };
}
