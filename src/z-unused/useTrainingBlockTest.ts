import { useEffect, useState } from "react";
import { getExercise } from "~/constants/exercises";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionDayType, SplitType } from "~/pages";
import { getMuscleData } from "~/utils/getMuscleData";

type MuscleTypeForTable = {
  name: string;
  sessions: number;
  exercises: ExerciseType[][];
};

type ExerciseType = {
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
  let meso: SessionDayType[] = [...split].map((each) => {
    let emptySets: [ExerciseType[][], ExerciseType[][]] = [[], []];
    return { ...each, sets: emptySets };
  });

  for (let i = 0; i < list.length; i++) {
    const lastIndex = list[i].mesoProgression[mesoNum];
    const exercises = list[i].exercises.slice(0, lastIndex);

    let key: VolumeKey =
      i < MRV_RANK
        ? "mrv_progression_matrix"
        : i >= MRV_RANK && i < MEV_RANK
        ? "mev_progression_matrix"
        : "mv_progression_matrix";

    let initial_frequency = list[i].mesoProgression[mesoNum];
    let freq_index = initial_frequency > 0 ? initial_frequency - 1 : 0;

    let session: "upper" | "lower" = "lower";

    if (!exercises[0]) continue;
    else if (UPPER_MUSCLES.includes(exercises[0][0]?.group)) {
      session = "upper";
    }

    const handleSession = (session: SplitType, group: "lower" | "upper") => {
      switch (session) {
        case "push":
          if (group === "upper") {
            return true;
          } else {
            return false;
          }
        case "pull":
          if (group === "upper") {
            return true;
          } else {
            return false;
          }
        case "upper":
          if (group === "upper") {
            return true;
          } else {
            return false;
          }
        case "lower":
          if (group === "lower") {
            return true;
          } else {
            return false;
          }
        case "full":
          return true;
        default:
          return false;
      }
    };

    for (let j = 0; j < meso.length; j++) {
      let sessionOne = meso[j].sessions[0];
      let sessionTwo = meso[j].sessions[1];
      const canAddExercise = handleSession(sessionOne, session);

      if (canAddExercise && exercises.length) {
        meso[j].sets[0].push(exercises[0]);
        exercises.unshift();
      }

      const canAddSecondExercise = handleSession(sessionTwo, session);

      if (canAddSecondExercise && exercises.length) {
        meso[j].sets[1].push(exercises[0]);
        exercises.unshift();
      }
    }
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
  const [newSplit, setNewSplit] = useState<SessionDayType[]>([]);

  useEffect(() => {
    // const data = getPushPosition(list, totalSessions, [...splitTest]);
    // const testSplit = data.map((each) => each.sessions);
    // setTestSplit(testSplit);
    setNewSplit([...splitTest]);
  }, [splitTest]);

  useEffect(() => {
    const newSplitList = [...newSplit];
    let meso1 = getMesocycle([...newSplitList], list, 0);
    let meso2 = getMesocycle([...newSplitList], list, 1);
    let meso3 = getMesocycle([...newSplitList], list, 2);

    console.log(list, meso1, meso2, meso3, "IS THERE AN ISSUE HERE?");
    setTrainingBlock([meso3, meso3, meso3]);
  }, [newSplit, list]);

  return {
    trainingBlock,
    testSplit,
  };
}
