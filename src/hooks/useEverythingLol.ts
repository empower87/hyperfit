import { useEffect, useState } from "react";
import { getExercise } from "~/constants/exercises";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import {
  LOWER_MUSCLES,
  PULL_MUSCLES,
  PUSH_AND_PULL_MUSCLES,
  PUSH_MUSCLES,
  UPPER_MUSCLES,
} from "~/constants/workoutSplits";
import {
  MUSCLE_PRIORITY_LIST,
  MusclePriorityType,
  SessionDayType,
} from "~/pages";
import { getMuscleData } from "~/utils/getMuscleData";
import { getNextSession } from "~/utils/getNextSession";
import { pushPullLowerFrequencyMax } from "./usePrioritizeMuscles";
import { ExerciseType } from "./useTrainingBlock";

const initializeOnOffDays = (sessions: number, split: SessionDayType[]) => {
  switch (sessions) {
    case 3:
      let odd = 0;
      const oddSplit = split.map((each, index) => {
        if (index % 2 !== 0) {
          odd++;
          return { ...each, sessionNum: odd };
        } else return each;
      });
      return oddSplit;
    case 4:
      let four = 0;
      const fourSplit = split.map((each, index) => {
        if (index === 1 || index === 2 || index === 4 || index === 5) {
          four++;
          return { ...each, sessionNum: four };
        } else return each;
      });
      return fourSplit;
    case 5:
      let five = 0;
      const fiveSplit = split.map((each, index) => {
        if (
          index === 1 ||
          index === 2 ||
          index === 4 ||
          index === 5 ||
          index === 6
        ) {
          five++;
          return { ...each, sessionNum: five };
        } else return each;
      });
      return fiveSplit;
    case 6:
      let six = 0;
      const sixSplit = split.map((each, index) => {
        if (index !== 0) {
          six++;
          return { ...each, sessionNum: six };
        } else return each;
      });
      return sixSplit;
    default:
      const sevenSplit = split.map((each, index) => ({
        ...each,
        sessionNum: index + 1,
      }));
      return sevenSplit;
  }
};

export const determineWorkoutSplit = (
  push: number,
  pull: number,
  lower: number,
  sessions: [number, number],
  split: SessionDayType[]
) => {
  const totalSessions = sessions[0] + sessions[1];
  const session_maxes_per_week = pushPullLowerFrequencyMax(totalSessions);
  const push_pull_max = session_maxes_per_week[0];
  const total = push + pull + lower;

  let pushDecimal = push / total;
  let pullDecimal = pull / total;
  let lowerDecimal = lower / total;

  let pushRatio = totalSessions * pushDecimal;
  let pullRatio = totalSessions * pullDecimal;
  let lowerRatio = totalSessions * lowerDecimal;

  let pushInteger = Math.floor(pushRatio);
  let pullInteger = Math.floor(pullRatio);
  let lowerInteger = Math.floor(lowerRatio);

  let pushTenths = pushRatio - pushInteger;
  let pullTenths = pullRatio - pullInteger;
  let lowerTenths = lowerRatio - lowerInteger;

  let pushSessions = pushInteger;
  let pullSessions = pullInteger;
  let lowerSessions = lowerInteger;
  let upperSessions = 0;
  let fullSessions = 0;

  let totalTenths = Math.round(pushTenths + pullTenths + lowerTenths);

  if (totalTenths <= 1) {
    if (lowerTenths >= 0.55) {
      lowerSessions++;
    } else if (lowerTenths >= 0.25 && lowerTenths < 0.55) {
      fullSessions++;
    } else if (Math.round(pullTenths) >= 0.6) {
      pullSessions++;
    } else if (Math.round(pushTenths) >= 0.6) {
      pushSessions++;
    } else if (pushTenths + pullTenths > 0.8) {
      upperSessions++;
    } else {
      fullSessions++;
    }
  } else {
    if (lowerTenths <= 0.33) {
      pushSessions++;
      pullSessions++;
    } else if (lowerTenths >= 0.6) {
      lowerSessions++;
      if (pullTenths > pushTenths) {
        pullSessions++;
      } else {
        pushSessions++;
      }
    } else {
      fullSessions = fullSessions + 1;
      if (pullTenths > pushTenths) {
        pullSessions++;
      } else {
        pushSessions++;
      }
    }
  }

  // -- Maximize frequency by combining push and pulls --
  while (pullSessions + upperSessions < push_pull_max) {
    if (pushSessions > 0) {
      upperSessions++;
      pushSessions--;
    } else {
      break;
    }
  }
  while (pushSessions + upperSessions < push_pull_max) {
    if (pullSessions > 0) {
      upperSessions++;
      pullSessions--;
    } else {
      break;
    }
  }
  // ---------------------------------------------------

  let first_sessions = sessions[0];
  let second_sessions = sessions[1];

  let update_split = initializeOnOffDays(first_sessions, [...split]);

  let off_count = second_sessions === 0 ? 0 : first_sessions - second_sessions;

  let counter = {
    lower: lowerSessions,
    upper: upperSessions,
    push: pushSessions,
    pull: pullSessions,
    full: fullSessions,
    off: off_count,
  };

  const totalLower = lowerSessions + fullSessions;
  const totalPush = pushSessions + upperSessions + fullSessions;
  const totalPull = pullSessions + upperSessions + fullSessions;

  for (let i = 0; i < update_split.length; i++) {
    let isTrainingDay = update_split[i].sessionNum > 0 ? true : false;
    let prevSessionOne = update_split[i - 1]?.sessions[0];

    if (isTrainingDay) {
      const newCurrentSessionOneValue = getNextSession(
        counter.upper,
        counter.lower,
        counter.push,
        counter.pull,
        counter.full,
        0,
        totalLower,
        totalPush,
        totalPull,
        prevSessionOne
      );

      update_split[i] = {
        ...update_split[i],
        sessions: [newCurrentSessionOneValue, update_split[i].sessions[1]],
      };

      counter = {
        ...counter,
        [newCurrentSessionOneValue]: counter[newCurrentSessionOneValue] - 1,
      };
    }
  }

  if (second_sessions === 0) return update_split;

  for (let j = 0; j < update_split.length; j++) {
    let isTrainingDay = update_split[j].sessionNum > 0 ? true : false;
    let sessionOne = update_split[j].sessions[0];

    let prevSessions = update_split[j - 1]?.sessions;
    let nextSessions = update_split[j + 1]?.sessions;

    if (isTrainingDay) {
      const newSession = getNextSession(
        counter.upper,
        counter.lower,
        counter.push,
        counter.pull,
        counter.full,
        counter.off,
        totalLower,
        totalPush,
        totalPull,
        sessionOne,
        prevSessions,
        nextSessions
      );

      update_split[j] = {
        ...update_split[j],
        sessions: [update_split[j].sessions[0], newSession],
      };

      counter = {
        ...counter,
        [newSession]: counter[newSession] - 1,
      };
    }
  }

  // LOGGING FOR TESTING ---------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  const pushRatioFixed = pushRatio.toFixed(2);
  const pullRatioFixed = pullRatio.toFixed(2);
  const lowerRatioFixed = lowerRatio.toFixed(2);

  const pushPercentage = Math.round((push / total) * 100);
  const pullPercentage = Math.round((pull / total) * 100);
  const lowerPercentage = Math.round((lower / total) * 100);

  console.log("push: --------------------------------------");
  console.log(
    `push: ${push} -- pull: ${pull} -- lower: ${lower} total: ${total}`
  );
  console.log(
    `push: ${pushPercentage}% -- pull: ${pullPercentage}% -- lower: ${lowerPercentage}% total: 100%`
  );
  console.log(
    `push: ${pushRatioFixed} -- pull: ${pullRatioFixed} -- lower: ${lowerRatioFixed} total: ${totalSessions}`
  );
  console.log(
    `push: ${update_split.map(
      (each) => `[${each.sessions[0]}, ${each.sessions[1]}] -- `
    )}`
  );
  console.log("push: --------------------------------------");
  // LOGGING FOR TESTING ---------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  return update_split;
};

const initializePrioritizedTrainingWeek = (
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

export const updateMuscleListSets = (
  _items: MusclePriorityType[],
  split: SessionDayType[]
) => {
  let upper = [];
  let lower = [];

  let items = [..._items];
  for (let h = 0; h < split.length; h++) {
    if (split[h].sessions[0] === "lower") {
      lower.push("lower");
    } else if (
      split[h].sessions[0] === "push" ||
      split[h].sessions[0] === "pull"
    ) {
      upper.push("upper");
    } else if (split[h].sessions[0] === "full") {
      upper.push("full");
      lower.push("full");
    }

    if (split[h].sessions[1] === "lower") {
      lower.push("lower");
    } else if (
      split[h].sessions[1] === "push" ||
      split[h].sessions[1] === "pull"
    ) {
      upper.push("upper");
    } else if (split[h].sessions[1] === "full") {
      upper.push("full");
      lower.push("full");
    }
  }

  for (let i = 0; i < items.length; i++) {
    const muscleData = getMuscleData(items[i].muscle);

    type VolumeKey =
      | "mrv_progression_matrix"
      | "mev_progression_matrix"
      | "mv_progression_matrix";
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

export default function useEverythingLol() {
  // musclePriorityList: MusclePriorityType[]
  const [totalSessions, setTotalSessions] = useState<[number, number]>([3, 0]);
  const [newItems, setNewItems] = useState<MusclePriorityType[]>([]);

  const [split, setSplit] = useState<SessionDayType[]>([]);
  const [musclePriority, setMusclePriority] = useState<MusclePriorityType[]>(
    []
  );
  const [isMusclePriorityListUpdated, setIsMusclePriorityListUpdated] =
    useState<boolean>(false);

  useEffect(() => {
    const updated_items = updateMuscleListSets(
      [...MUSCLE_PRIORITY_LIST],
      [...INITIAL_SPLIT]
    );

    const initializeSplit = initializePrioritizedTrainingWeek(
      updated_items,
      totalSessions,
      [...INITIAL_SPLIT]
    );
    setMusclePriority(updated_items);
    setSplit(initializeSplit);
  }, [totalSessions]);

  useEffect(() => {
    const updated_items = updateMuscleListSets(musclePriority, split);
    setMusclePriority(updated_items);
  }, [split]);

  // useEffect(() => {
  //   const updated_items = updateMuscleListSets(musclePriority, split);
  //   setNewItems(updated_items);
  // }, [musclePriority, split]);

  // useEffect(() => {
  //   setMusclePriority(newItems);
  // }, [newItems]);

  const handleFrequencyChange = (first: number, second: number) => {
    setTotalSessions([first, second]);
  };

  const handleUpdateMuscleList = (items: MusclePriorityType[]) => {
    const updated_items = updateMuscleListSets(items, split);
    setMusclePriority(updated_items);
  };

  useEffect(() => {
    console.log(split, musclePriority, "TEST: lets see this massive hook data");
  }, [split, musclePriority]);

  return {
    split,
    totalSessions,
    handleFrequencyChange,
    musclePriority,
    handleUpdateMuscleList,
  };
}

const INITIAL_SPLIT: SessionDayType[] = [
  {
    day: "Sunday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Monday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Tuesday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Wednesday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Thursday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Friday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
  {
    day: "Saturday",
    sessionNum: 0,
    sets: [[], []],
    totalSets: [0, 0],
    maxSets: [0, 0],
    sessions: ["off", "off"],
  },
];
