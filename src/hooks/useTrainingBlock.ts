import { useEffect, useState } from "react";
import { getExercise } from "~/constants/exercises";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType } from "~/pages";
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
  split: SessionType[],
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
          session: split[i] ? split[i].day : 1,
          group: data.name,
          exercise: getExercise(data.name, count).name,
        },
        {
          ...exercise,
          rank: volume_landmark,
          sets: splitVol[1],
          session: split[i] ? split[i].day : 1,
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
        session: split[i] ? split[i].day : 1,
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
  split: SessionType[],
  prog: number[],
  totalSessions: number,
  obj: MuscleTypeForTable
) => {
  let decrement = prog[totalSessions];
  let iterator = 0;
  let sessions = "lower";

  if (UPPER_MUSCLES.includes(obj.name)) {
    sessions = "upper";
  }

  const exercisesForSessions: Array<ExerciseType[] | number> = [];

  for (let i = 0; i < split.length; i++) {
    if (decrement <= 0) exercisesForSessions.push(0);
    else if (split[i].split === sessions || split[i].split === "full") {
      exercisesForSessions.push(obj.exercises[iterator]);
      iterator++;
      decrement--;
    } else {
      exercisesForSessions.push(0);
    }
  }
  console.log(exercisesForSessions, obj, split, "LETS TAKE A LOOK");
  return exercisesForSessions;
};

export type VolumeKey =
  | "mrv_progression_matrix"
  | "mev_progression_matrix"
  | "mv_progression_matrix";

const getMesocycle = (
  split: SessionType[],
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

    for (let j = 0; j < meso.length; j++) {
      let sets = newMeso1[j];
      if (typeof sets !== "number" && typeof sets !== "undefined") {
        meso[j] = { ...meso[j], sets: [...meso[j].sets, sets] };
      }
    }
  }

  return meso;
};

export default function useTrainingBlock(
  split: SessionType[],
  list: MusclePriorityType[]
) {
  const [trainingBlock, setTrainingBlock] = useState<SessionType[][]>([]);

  useEffect(() => {
    let meso1 = getMesocycle([...split], list, 0);
    let meso2 = getMesocycle([...split], list, 1);
    let meso3 = getMesocycle([...split], list, 2);

    const data = getPushPosition(list, split.length);
    // console.log([meso1, meso2, meso3], list, "ERROR: USE MACRO");
    setTrainingBlock([meso1, meso2, meso3]);
  }, [split, list]);

  return {
    trainingBlock,
  };
}

// const getIt = (
//   index: number,
//   name: string,
//   mesoProgress: number,
//   key: VolumeKey
// ) => {
//   const data = getMuscleData(name);
//   // if (!data) return;
//   const volume_matrix = data[key][mesoProgress];
//   const volume_landmark =
//     index < MRV_RANK
//       ? "MRV"
//       : index >= MRV_RANK && index < MEV_RANK
//       ? "MEV"
//       : "MV";

//   let mesoProgressIndex = mesoProgress - 1;
//   let frequency_progression = [data.MV];
//   let frequency_type: "MV" | "MEV" | "MRV" = "MV";
//   let split_max = 4;

//   let muscleExercises: MuscleTypeForTable = {
//     name: data.name,
//     sessions: 0,
//     exercises: [],
//   };

//   let count = 0;
//   for (let i = 0; i < volume_matrix?.length; i++) {
//     let exerciseList: ExerciseType[] = [];

//     const split = volume_matrix[i].split("-").map((each) => parseInt(each));

//     if (split.length > 1) {
//       exerciseList.push(
//         {
//           ...exercise,
//           rank: frequency_type,
//           sets: split[0],
//           group: data.name,
//           exercise: getExercise(data.name, count).name,
//         },
//         {
//           ...exercise,
//           rank: frequency_type,
//           sets: split[1],
//           group: data.name,
//           exercise: getExercise(data.name, count + 1).name,
//         }
//       );
//       count = count + 2;
//     } else {
//       exerciseList.push({
//         ...exercise,
//         rank: frequency_type,
//         sets: split[0],
//         group: data.name,
//         exercise: getExercise(data.name, count).name,
//       });
//       count = count + 1;
//     }
//     muscleExercises.exercises.push(exerciseList);
//   }

//   // switch (s) {
//   //   case 0:
//   //     frequency_progression = data.mevToMrvProgression[mesoProgressIndex];
//   //     frequency_type = "MRV";
//   //     muscleExercises.sessions = frequency_progression?.length;
//   //     break;
//   //   case 1:
//   //     frequency_progression = data.mvToMevProgression[mesoProgressIndex];
//   //     frequency_type = "MEV";
//   //     muscleExercises.sessions = frequency_progression?.length;
//   //     break;
//   //   default:
//   //     split_max = 6;
//   // }

//   // let indices: number[][] = [];
//   // let counter = 0;

//   // for (let j = 0; j < frequency_progression?.length; j++) {
//   //   if (frequency_progression[j] >= split_max) {
//   //     indices.push([counter, counter + 1]);
//   //     counter = counter + 2;
//   //   } else {
//   //     indices.push([counter]);
//   //     counter = counter + 1;
//   //   }
//   // }

//   // for (let i = 0; i < frequency_progression?.length; i++) {
//   //   let exerciseList: ExerciseType[] = [];

//   //   let indexCounter = i;

//   //   if (frequency_progression.length === 1 && frequency_progression[i] === 0)
//   //     break;
//   //   if (frequency_progression[i] >= split_max) {
//   //     let totalSets = frequency_progression[i];
//   //     let setOne = 2;
//   //     let setTwo = 2;

//   //     if (frequency_progression[i] > split_max) {
//   //       setOne = Math.floor(totalSets / 2);
//   //       setTwo = totalSets - setOne;
//   //     }

//   //     exerciseList.push(
//   //       {
//   //         ...exercise,
//   //         rank: frequency_type,
//   //         sets: setOne,
//   //         group: data.name,
//   //         exercise: getExercise(data.name, indices[i][0]).name,
//   //       },
//   //       {
//   //         ...exercise,
//   //         rank: frequency_type,
//   //         sets: setTwo,
//   //         group: data.name,
//   //         exercise: getExercise(data.name, indices[i][1]).name,
//   //       }
//   //     );
//   //     indexCounter = indexCounter + 2;
//   //   } else {
//   //     exerciseList.push({
//   //       ...exercise,
//   //       rank: frequency_type,
//   //       sets: frequency_progression[i],
//   //       group: data.name,
//   //       exercise: getExercise(data.name, indices[i][0]).name,
//   //     });
//   //     indexCounter = indexCounter + 1;
//   //   }

//   //   muscleExercises.exercises.push(exerciseList);
//   // }

//   return muscleExercises;
// };
