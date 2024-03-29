import { Dispatch, SetStateAction, useEffect, useState } from "react";
// import { MEV_RANK, MRV_RANK } from "src/constants/prioritizeRanks";
// import { determineWorkoutSplit } from "~/components/Macrocycle/TrainingBlock/TrainingBlock";
import { getExercise } from "~/constants/exercises";
import {
  LOWER_MUSCLES,
  PULL_MUSCLES,
  PUSH_AND_PULL_MUSCLES,
  PUSH_MUSCLES,
  UPPER_MUSCLES,
} from "~/constants/workoutSplits";
// import { MusclePriorityType, SessionDayType, SessionType } from "~/pages";
import { getMuscleData } from "../utils/getMuscleData";
import { ExerciseType } from "./useEverythingLol";
import { VolumeKey } from "./useTrainingBlock";

export type SessionSplitType = "upper" | "lower" | "full";

export const pushPullLowerFrequencyMax = (sessions: number) => {
  // KEY
  // [0, 1, 2]
  // [push, pull, lower]
  switch (sessions) {
    case 3:
      return [2, 2, 2];
    case 4:
      return [3, 3, 3];
    case 5:
      return [4, 4, 3];
    case 6:
      return [4, 4, 3];
    case 7:
      return [5, 5, 4];
    case 8:
      return [5, 5, 4];
    case 9:
      return [5, 5, 5];
    case 10:
      return [6, 6, 5];
    case 11:
      return [6, 6, 5];
    case 12:
      return [6, 6, 5];
    case 13:
      return [6, 6, 6];
    case 14:
      return [6, 6, 6];
    default:
      return [2, 2, 2];
  }
};

export const getPushPosition = (
  list: MusclePriorityType[],
  totalSessions: [number, number],
  split: SessionDayType[]
) => {
  let push = 0;
  let pull = 0;
  let lower = 0;

  const SYSTEMIC_FATIGUE_MODIFIER = 2;
  const LOWER_MODIFIER = 1.15;
  const RANK_WEIGHTS = [14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0];

  for (let i = 0; i < list.length; i++) {
    if (PUSH_MUSCLES.includes(list[i].muscle)) {
      push = push + RANK_WEIGHTS[i];
    } else if (PULL_MUSCLES.includes(list[i].muscle)) {
      pull = pull + RANK_WEIGHTS[i];
    } else if (PUSH_AND_PULL_MUSCLES.includes(list[i].muscle)) {
      let split = Math.round(RANK_WEIGHTS[i] / 2);
      push = push + split;
      pull = pull + split;
    } else if (LOWER_MUSCLES.includes(list[i].muscle)) {
      let lowerMod = Math.round(RANK_WEIGHTS[i] * LOWER_MODIFIER);
      if (list[i].muscle === "quads" && i < 3) {
        lowerMod = lowerMod * SYSTEMIC_FATIGUE_MODIFIER;
      }
      lower = lower + lowerMod;
    }
  }

  const _split = determineWorkoutSplit(push, pull, lower, totalSessions, [
    ...split,
  ]);

  return _split;
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

export type SessionSplitTESTType =
  | "upper"
  | "lower"
  | "full"
  | "push"
  | "pull"
  | "none";

const getTrainingSplit = (
  list: MusclePriorityType[],
  sessions: number
): SessionSplitType[] => {
  const lowerRank = getLowerPosition(list);

  switch (sessions) {
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
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            "lower",
            "lower",
            "lower",
            "lower",
            "upper",
            "upper",
            "upper",
            "upper",
          ];
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
    case 9:
    case 10:
    case 11:
      switch (lowerRank) {
        case "MAX_MRV":
          return ["lower", "upper", "lower", "upper", "lower", "lower"];
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

    case 12:
      switch (lowerRank) {
        case "MAX_MRV":
          return ["lower", "upper", "lower", "upper", "lower", "lower"];
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
    default:
      return ["full"];
  }
};

const getFrequencyProgression = (sessions: number) => {
  switch (sessions) {
    case 6:
      return [3, 5, 6];
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
      let prog = getFrequencyProgression(sessions.length);
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
      id: "001",
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
  setWorkoutSplit: Dispatch<SetStateAction<SessionType[]>>,
  split: SessionDayType[],
  setSplit: Dispatch<SetStateAction<SessionDayType[]>>,
  totalSessions: [number, number]
) {
  const [newList, setNewList] = useState<MusclePriorityType[]>([
    ...musclePriorityList,
  ]);

  useEffect(() => {
    const _split = getTrainingSplit(newList, max_workouts);
    const getNewList = updateMuscleListSets(musclePriorityList, _split);
    const updatedWorkoutSplit = updateWorkoutSplit(_split);

    setNewList(getNewList);
    setWorkoutSplit(updatedWorkoutSplit);
    // const getTestSplit = determineWorkoutSplit()

    // const data = getPushPosition(getNewList, totalSessions, split);
    // setSplit(data);
    console.log(getNewList, "OK WHAT IS THIS ACTUALLY??");
  }, [max_workouts, musclePriorityList, newList]);

  return { newList };
}
