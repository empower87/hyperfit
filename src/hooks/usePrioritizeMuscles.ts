import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MEV_RANK, MRV_RANK } from "src/constants/prioritizeRanks";
import { getExercise } from "~/constants/exercises";
import { LOWER_MUSCLES, UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType } from "~/pages";
import { getMuscleData } from "../utils/getMuscleData";
import { ExerciseType, VolumeKey } from "./useTrainingBlock";

export type SessionSplitType = "upper" | "lower" | "full";

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

  // 4 = MAX_MRV
  // 3 = FULL_MRV
  // 2, 2 = FULL_MRV
  // 1, 2 = MRV
  // 0, 2 = LOW_MRV
  // 1, 1 = LOW_MRV
  // 0, 1 = MEV
  // 0 = MV

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
    case 2:
      return ["full", "full"];
    case 3:
      return ["full", "full", "full"];
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
    let index = mesoProgression[mesoProgression.length - 1];
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
            session: j,
            group: muscleData.name,
            exercise: getExercise(muscleData.name, count).name,
          },
          {
            ...exercise,
            rank: volume_landmark,
            sets: splitVol[1],
            session: j,
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
          session: j,
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
