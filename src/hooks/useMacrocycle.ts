import { useEffect, useState } from "react";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType } from "~/pages";
import { getMuscleData } from "~/utils/getMuscleData";

type MuscleTypeForTable = {
  name: string;
  sessions: number;
  exercises: ExerciseType[][];
};

export type ExerciseType = {
  exercise: string;
  group: string;
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
  sets: 2,
  reps: 10,
  weight: 100,
  rir: 3,
};

const getIt = (rank: number, name: string, mesoProgress: number) => {
  const data = getMuscleData(name);
  if (!data) return;
  const s = rank < MRV_RANK ? 0 : rank >= MRV_RANK && rank < MEV_RANK ? 1 : 2;
  let mesoProgressIndex = mesoProgress - 1;
  let frequency_progression = [data.MV];
  let frequency_type: "MV" | "MEV" | "MRV" = "MV";
  let split_max = 4;

  let m: MuscleTypeForTable = {
    name: data.name,
    sessions: 0,
    exercises: [],
  };

  switch (s) {
    case 0:
      frequency_progression = data.mevToMrvProgression[mesoProgressIndex];
      frequency_type = "MRV";
      m.sessions = frequency_progression?.length;
      break;
    case 1:
      frequency_progression = data.mvToMevProgression[mesoProgressIndex];
      frequency_type = "MEV";
      m.sessions = frequency_progression?.length;
      break;
    default:
      split_max = 6;
  }

  for (let i = 0; i < frequency_progression?.length; i++) {
    let exerciseList: ExerciseType[] = [];

    if (frequency_progression.length === 1 && frequency_progression[i] === 0)
      break;
    if (frequency_progression[i] >= split_max) {
      let totalSets = frequency_progression[i];
      let setOne = 2;
      let setTwo = 2;

      if (frequency_progression[i] > split_max) {
        setOne = Math.floor(totalSets / 2);
        setTwo = totalSets - setOne;
      }

      exerciseList.push(
        {
          ...exercise,
          rank: frequency_type,
          sets: setOne,
          group: data.name,
          // exercise: `${data.name}_${i + 1}`,
        },
        {
          ...exercise,
          rank: frequency_type,
          sets: setTwo,
          group: data.name,
          // exercise: `${data.name}_${i + 1.5}`,
        }
      );
    } else {
      exerciseList.push({
        ...exercise,
        rank: frequency_type,
        sets: frequency_progression[i],
        group: data.name,
        // exercise: `${data.name}_${i + 1}`,
      });
    }

    m.exercises.push(exerciseList);
  }

  console.log(m, "what does this clusterfuck look like??");
  return m;
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

  return exercisesForSessions;
};

export const ugh = (
  split: SessionType[],
  list: MusclePriorityType[],
  mesoNum: number
) => {
  let meso = [...split];

  for (let i = 0; i < list.length; i++) {
    const gotIt = getIt(i, list[i].muscle, list[i].mesoProgression[mesoNum]);
    if (gotIt) {
      let newMeso1 = doIt(split, list[i].mesoProgression, mesoNum, gotIt);

      for (let j = 0; j < meso.length; j++) {
        let sets = newMeso1[j];
        if (typeof sets !== "number" && typeof sets !== "undefined") {
          meso[j] = { ...meso[j], testSets: [...meso[j].testSets, sets] };
        }
      }
    }
  }

  return meso;
};

export default function useMacrocycle(
  split: SessionType[],
  list: MusclePriorityType[]
) {
  const [macrocycle, setMacrocycle] = useState<SessionType[][]>([]);

  useEffect(() => {
    let meso1 = ugh([...split], list, 0);
    let meso2 = ugh([...split], list, 1);
    let meso3 = ugh([...split], list, 2);

    setMacrocycle([meso1, meso2, meso3]);
  }, [split, list]);

  return {
    macrocycle,
  };
}
