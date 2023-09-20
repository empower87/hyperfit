import { useEffect, useState } from "react";
import { getExercise } from "~/constants/exercises";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionDayType, SplitType } from "~/pages";
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
  console.log(muscleExercises, "IS THIS ACCURATE");
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

  let INITIAL_SET = {
    sessionNum: 1,
    exercises: [],
  };
  type BLAH = {
    sessionNum: number;
    sets: [number, ExerciseType[]];
  };
  let sets: BLAH[] = [];

  for (let i = 0; i < newSplit.length; i++) {
    if (decrement <= 0) continue;

    for (let j = 0; j < newSplit[i].sessions.length; j++) {
      let currentSession = newSplit[i].sessions[j];

      if (
        (currentSession === "push" || currentSession === "pull") &&
        sessions === "upper"
      ) {
        sets.push({
          sessionNum: newSplit[i].sessionNum,
          sets: [j, obj.exercises[iterator]],
        });
        iterator++;
        decrement--;
      } else if (currentSession === sessions) {
        sets.push({
          sessionNum: newSplit[i].sessionNum,
          sets: [j, obj.exercises[iterator]],
        });
        iterator++;
        decrement--;
      }

      // if (
      //   (currentSession === "push" || currentSession === "pull") &&
      //   sessions === "upper"
      // ) {
      //   newSplit[i].sets[j].push(obj.exercises[iterator]);
      //   iterator++;
      //   decrement--;
      // } else if (currentSession === sessions) {
      //   newSplit[i].sets[j].push(obj.exercises[iterator]);
      //   iterator++;
      //   decrement--;
      // }
    }
  }

  console.log(obj, split, newSplit, sets, "LETS TAKE A LOOK");
  return sets;
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

    const gotIt = getIt(i, meso, list[i].muscle, freq_index, key);

    let newMeso1 = doIt(meso, list[i].mesoProgression, mesoNum, gotIt);

    for (let j = 0; j < newMeso1.length; j++) {
      for (let k = 0; k < meso.length; k++) {
        if (newMeso1[j].sessionNum === meso[k].sessionNum) {
          let newSets = newMeso1[j].sets[1];
          let newSetsIndex = newMeso1[j].sets[0];
          meso[k].sets[newSetsIndex].push(newSets);
        }
      }
    }
    // meso = newMeso1;
    // for (let j = 0; j < meso.length; j++) {
    //   let sets = newMeso1[j];
    //   if (typeof sets !== "number" && typeof sets !== "undefined") {
    //     meso[j] = { ...meso[j], sets: [...meso[j].sets, sets] };
    //   }
    // }
  }
  console.log(meso, "OH GOD HTIS GONNA");
  return meso;
};

export default function useTrainingBlockTest(
  list: MusclePriorityType[],
  totalSessions: [number, number],
  splitTest: SessionDayType[]
) {
  const [trainingBlock, setTrainingBlock] = useState<SessionDayType[][]>([]);
  const [testSplit, setTestSplit] = useState<[SplitType, SplitType][]>([]);
  const [newSplit, setNewSplit] = useState<SessionDayType[]>([...splitTest]);

  useEffect(() => {
    const data = getPushPosition(list, totalSessions, splitTest);
    const testSplit = data.map((each) => each.sessions);
    setTestSplit(testSplit);
    setNewSplit(data);
  }, [list, totalSessions, splitTest]);

  useEffect(() => {
    console.log(splitTest, newSplit, list, "IS THERE AN ISSUE HERE?");
    let meso1 = getMesocycle([...newSplit], list, 0);
    let meso2 = getMesocycle([...newSplit], list, 1);
    let meso3 = getMesocycle([...newSplit], list, 2);

    setTrainingBlock([meso1, meso2, meso3]);
  }, [newSplit]);

  return {
    trainingBlock,
    testSplit,
  };
}
