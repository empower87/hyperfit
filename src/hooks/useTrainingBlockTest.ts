import { useEffect, useState } from "react";
import { getExercise } from "~/constants/exercises";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { UPPER_MUSCLES } from "~/constants/workoutSplits";
import {
  MusclePriorityType,
  SessionDayType,
  SessionType,
  SplitType,
} from "~/pages";
import { getMuscleData } from "~/utils/getMuscleData";
import { getPushPosition } from "./usePrioritizeMuscles";

type MuscleTypeForTable = {
  name: string;
  sessions: number;
  exercises: ExerciseType[][];
};

export type ExerciseType = {
  exercise: string;
  group: string;
  session: number;
  rank: "MRV" | "MEV" | "MV";
  sets: number;
  reps: number;
  weight: number;
  rir: number;
};

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

const getIt = (
  index: number,
  split: SessionDayType[],
  name: string,
  mesoProgress: number,
  key: VolumeKey
) => {
  const data = getMuscleData(name);
  const volume_matrix = data[key][mesoProgress];
  const volume_landmark =
    index < MRV_RANK
      ? "MRV"
      : index >= MRV_RANK && index < MEV_RANK
      ? "MEV"
      : "MV";

  let muscleExercises: MuscleTypeForTable = {
    name: data.name,
    sessions: 0,
    exercises: [],
  };

  let count = 0;
  for (let i = 0; i < volume_matrix?.length; i++) {
    let exerciseList: ExerciseType[] = [];

    const splitVol = volume_matrix[i].split("-").map((each) => parseInt(each));

    if (splitVol.length > 1) {
      exerciseList.push(
        {
          ...exercise,
          rank: volume_landmark,
          sets: splitVol[0],
          // session: split[i] ? split[i].day : 1,
          group: data.name,
          exercise: getExercise(data.name, count).name,
        },
        {
          ...exercise,
          rank: volume_landmark,
          sets: splitVol[1],
          // session: split[i] ? split[i].day : 1,
          group: data.name,
          exercise: getExercise(data.name, count + 1).name,
        }
      );
      count = count + 2;
    } else {
      exerciseList.push({
        ...exercise,
        rank: volume_landmark,
        sets: splitVol[0],
        // session: split[i] ? split[i].day : 1,
        group: data.name,
        exercise: getExercise(data.name, count).name,
      });
      count = count + 1;
    }
    muscleExercises.exercises.push(exerciseList);
  }

  return muscleExercises;
};

const doIt = (
  split: SessionDayType[],
  prog: number[],
  totalSessions: number,
  obj: MuscleTypeForTable
) => {
  let decrement = prog[totalSessions];
  let iterator = 0;
  let sessions: SplitType = "lower";

  if (UPPER_MUSCLES.includes(obj.name)) {
    sessions = "upper";
  }

  let newSplit = [...split];
  const exercisesForSessions: Array<ExerciseType[] | number> = [];

  for (let i = 0; i < split.length; i++) {
    if (decrement >= 0) {
      for (let j = 0; j < split[i].sessions.length; j++) {
        let currentSession = split[i].sessions[j];
        if (
          (currentSession === "push" || currentSession === "pull") &&
          sessions === "upper"
        ) {
          newSplit[i].sets[j].push(obj.exercises[iterator]);
          iterator++;
          decrement--;
        } else if (currentSession === sessions) {
          newSplit[i].sets[j].push(obj.exercises[iterator]);
          iterator++;
          decrement--;
        }
      }
    }
  }
  console.log(exercisesForSessions, obj, split, "LETS TAKE A LOOK");
  return newSplit;
};

export type VolumeKey =
  | "mrv_progression_matrix"
  | "mev_progression_matrix"
  | "mv_progression_matrix";

const getMesocycle = (
  split: SessionDayType[],
  list: MusclePriorityType[],
  mesoNum: number
) => {
  let meso = [...split];

  for (let i = 0; i < list.length; i++) {
    let key: VolumeKey =
      i < MRV_RANK
        ? "mrv_progression_matrix"
        : i >= MRV_RANK && i < MEV_RANK
        ? "mev_progression_matrix"
        : "mv_progression_matrix";
    let initial_frequency = list[i].mesoProgression[mesoNum];
    let freq_index = initial_frequency > 0 ? initial_frequency - 1 : 0;

    const gotIt = getIt(i, split, list[i].muscle, freq_index, key);

    let newMeso1 = doIt(split, list[i].mesoProgression, mesoNum, gotIt);

    meso = newMeso1;
    // for (let j = 0; j < meso.length; j++) {
    //   let sets = newMeso1[j];
    //   if (typeof sets !== "number" && typeof sets !== "undefined") {
    //     meso[j] = { ...meso[j], sets: [...meso[j].sets, sets] };
    //   }
    // }
  }

  return meso;
};

export default function useTrainingBlock(
  split: SessionType[],
  list: MusclePriorityType[],
  totalSessions: [number, number],
  splitTest: SessionDayType[]
) {
  const [trainingBlock, setTrainingBlock] = useState<SessionDayType[][]>([]);
  const [testSplit, setTestSplit] = useState<[SplitType, SplitType][]>([]);

  useEffect(() => {
    let meso1 = getMesocycle([...splitTest], list, 0);
    let meso2 = getMesocycle([...splitTest], list, 1);
    let meso3 = getMesocycle([...splitTest], list, 2);

    const data = getPushPosition(list, totalSessions, splitTest);
    const testData = data.map((each) => each.sessions);
    setTestSplit(testData);

    setTrainingBlock([meso1, meso2, meso3]);
  }, [split, list, totalSessions]);

  return {
    trainingBlock,
    testSplit,
  };
}
