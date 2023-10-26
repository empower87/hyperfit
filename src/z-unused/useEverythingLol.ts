import { useCallback, useEffect, useReducer } from "react";
import { getExercise } from "~/constants/exercises";
// import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import {
  LOWER_MUSCLES,
  PULL_MUSCLES,
  PUSH_AND_PULL_MUSCLES,
  PUSH_MUSCLES,
  UPPER_MUSCLES,
} from "~/constants/workoutSplits";
// import { MusclePriorityType, SessionDayType, SplitType } from "~/pages";
import { getMuscleData } from "~/utils/getMuscleData";
import { getNextSession } from "~/utils/getNextSession";
import { pushPullLowerFrequencyMax } from "./usePrioritizeMuscles";

export type ExerciseType = {
  id: string;
  exercise: string;
  group: string;
  session: number;
  rank: "MRV" | "MEV" | "MV";
  sets: number;
  reps: number;
  weight: number;
  rir: number;
};

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

// NOTE: based on total sessions and prioritized muscle list, get the optimal session splits
const determineOptimalSessionSplits = (
  sessions: [number, number],
  list: MusclePriorityType[]
) => {
  // NOTE: weight coefficients to better determine session split
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

  const total_sessions = sessions[0] + sessions[1];
  const first_sessions = sessions[0];
  const second_sessions = sessions[1];

  const session_maxes_per_week = pushPullLowerFrequencyMax(total_sessions);
  const push_pull_max = session_maxes_per_week[0];
  const total = push + pull + lower;

  let pushDecimal = push / total;
  let pullDecimal = pull / total;
  let lowerDecimal = lower / total;

  let pushRatio = total_sessions * pushDecimal;
  let pullRatio = total_sessions * pullDecimal;
  let lowerRatio = total_sessions * lowerDecimal;

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
  let offSessions =
    second_sessions === 0 ? 0 : first_sessions - second_sessions;

  let totalTenths = Math.round(pushTenths + pullTenths + lowerTenths);

  // NOTE: determine remaining session splits based on fractional remains of push/pull/lower
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
    `push: ${pushRatioFixed} -- pull: ${pullRatioFixed} -- lower: ${lowerRatioFixed} total: ${total_sessions}`
  );
  console.log("push: --------------------------------------");
  // LOGGING FOR TESTING ---------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  return {
    upper: upperSessions,
    lower: lowerSessions,
    full: fullSessions,
    push: pushSessions,
    pull: pullSessions,
    off: offSessions,
  };
};

const updateWeekWithSessionSplits = (
  sessions: [number, number],
  split: SessionDayType[],
  lowerSessions: number,
  upperSessions: number,
  pushSessions: number,
  pullSessions: number,
  fullSessions: number,
  offSessions: number
) => {
  let first_sessions = sessions[0];
  let second_sessions = sessions[1];

  let update_split = initializeOnOffDays(first_sessions, [...split]);
  // let update_week = initTrainingDays(first_sessions, [...week]);

  let counter = {
    lower: lowerSessions,
    upper: upperSessions,
    push: pushSessions,
    pull: pullSessions,
    full: fullSessions,
    off: offSessions,
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
  return update_split;
};

const distributeSessionsAmongWeek = (
  sessions: [number, number],
  split: SessionDayType[],
  lowerSessions: number,
  upperSessions: number,
  pushSessions: number,
  pullSessions: number,
  fullSessions: number,
  offSessions: number
) => {
  let first_sessions = sessions[0];
  let second_sessions = sessions[1];

  let update_split = initializeOnOffDays(first_sessions, [...split]);

  let counter = {
    lower: lowerSessions,
    upper: upperSessions,
    push: pushSessions,
    pull: pullSessions,
    full: fullSessions,
    off: offSessions,
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
  return update_split;
};

const determineWorkoutSplit = (
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
  totalSessions: [number, number]
  // split: SessionDayType[]
) => {
  // let push = 0;
  // let pull = 0;
  // let lower = 0;

  // const SYSTEMIC_FATIGUE_MODIFIER = 2;
  // const LOWER_MODIFIER = 1.15;
  // const RANK_WEIGHTS = [14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0];

  // for (let i = 0; i < list.length; i++) {
  //   if (PUSH_MUSCLES.includes(list[i].muscle)) {
  //     push = push + RANK_WEIGHTS[i];
  //   } else if (PULL_MUSCLES.includes(list[i].muscle)) {
  //     pull = pull + RANK_WEIGHTS[i];
  //   } else if (PUSH_AND_PULL_MUSCLES.includes(list[i].muscle)) {
  //     let split = Math.round(RANK_WEIGHTS[i] / 2);
  //     push = push + split;
  //     pull = pull + split;
  //   } else if (LOWER_MUSCLES.includes(list[i].muscle)) {
  //     let lowerMod = Math.round(RANK_WEIGHTS[i] * LOWER_MODIFIER);
  //     if (list[i].muscle === "quads" && i < 3) {
  //       lowerMod = lowerMod * SYSTEMIC_FATIGUE_MODIFIER;
  //     }
  //     lower = lower + lowerMod;
  //   }
  // }
  const split = [...INITIAL_SPLIT];
  // const split = [...WEEK]
  const { upper, lower, push, pull, full, off } = determineOptimalSessionSplits(
    totalSessions,
    list
  );

  const _split = distributeSessionsAmongWeek(
    totalSessions,
    split,
    lower,
    upper,
    push,
    pull,
    full,
    off
  );

  // const _split = determineWorkoutSplit(push, pull, lower, totalSessions, [
  //   ...split,
  // ]);

  // const _sessions = getSessionTotals(totalSessions, push, pull, lower);

  // const _list = updateMuscleListSets(list, _split);

  // const meso_one = distributeExercisesAmongSplit(_list, _split, 0);
  // const meso_two = distributeExercisesAmongSplit(_list, _split, 1);
  // const meso_three = distributeExercisesAmongSplit(_list, _split, 2);

  // return [meso_one, meso_two, meso_three];

  // return _split;

  // const final_meso = distributeExercisesAmongSplit(_list, _split, 2);
  // return final_meso;
};

const getTrainingBlock = (
  _list: MusclePriorityType[],
  _split: SessionDayType[]
) => {
  const _splitCopied = [..._split];
  const meso_one = distributeExercisesAmongSplit(_list, _splitCopied, 0);
  const meso_two = distributeExercisesAmongSplit(_list, _splitCopied, 1);
  const meso_three = distributeExercisesAmongSplit(_list, _splitCopied, 2);

  return [meso_one, meso_two, meso_three];
};

const distributeExercisesAmongSplit = (
  list: MusclePriorityType[],
  split: SessionDayType[],
  mesoNum: number
) => {
  let meso: SessionDayType[] = [...split].map((each) => {
    let emptySets: [ExerciseType[][], ExerciseType[][]] = [[], []];
    return { ...each, sets: emptySets };
  });

  for (let i = 0; i < list.length; i++) {
    const lastIndex = list[i].mesoProgression[mesoNum];
    let exercises = list[i].exercises.slice(0, lastIndex);
    // let exercises = list[i].exercises;

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
    let initial_frequency = list[i].mesoProgression[mesoNum];
    // let freq_index = initial_frequency > 0 ? initial_frequency - 1 : 0;

    let session: "upper" | "lower" = "lower";

    if (UPPER_MUSCLES.includes(list[i].muscle)) {
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
      if (exercises.length) {
        let sessionOne = meso[j].sessions[0];
        let sessionTwo = meso[j].sessions[1];
        const canAddExercise = handleSession(sessionOne, session);

        if (canAddExercise && exercises.length) {
          meso[j].sets[0].push(exercises[0]);
          exercises.shift();
        }

        const canAddSecondExercise = handleSession(sessionTwo, session);

        if (canAddSecondExercise && exercises.length) {
          meso[j].sets[1].push(exercises[0]);
          exercises.shift();
        }
      }
    }
  }
  return meso;
};

export const updateMuscleListSets = (
  _items: MusclePriorityType[],
  split: SessionDayType[]
) => {
  let upper = [];
  let lower = [];

  let items = [..._items];

  for (let h = 0; h < split.length; h++) {
    let sessionOne = split[h].sessions[0];
    let sessionTwo = split[h].sessions[1];
    let uppers = ["upper", "push", "pull", "full"];
    let lowers = ["lower", "full"];

    if (uppers.includes(sessionOne)) {
      upper.push(sessionOne);
    }
    if (uppers.includes(sessionTwo)) {
      upper.push(sessionTwo);
    }
    if (lowers.includes(sessionOne)) {
      lower.push(sessionOne);
    }
    if (lowers.includes(sessionTwo)) {
      lower.push(sessionTwo);
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
      id: "001_Triceps Extension (cable, single-arm)",
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
      const exercise_one = getExercise(muscleData.name, count).name;
      const exercise_two = getExercise(muscleData.name, count + 1).name;
      const id_one = `${i}${j + 1}_${exercise_one}`;
      const id_two = `${i}${j + 2}_${exercise_two}`;

      if (splitVol.length > 1) {
        exerciseList.push(
          {
            ...exercise,
            id: id_one,
            rank: volume_landmark,
            sets: splitVol[0],
            session: j + 1,
            group: muscleData.name,
            exercise: exercise_one,
          },
          {
            ...exercise,
            id: id_two,
            rank: volume_landmark,
            sets: splitVol[1],
            session: j + 1,
            group: muscleData.name,
            exercise: exercise_two,
          }
        );
        count = count + 2;
      } else {
        exerciseList.push({
          ...exercise,
          id: id_one,
          rank: volume_landmark,
          sets: splitVol[0],
          session: j + 1,
          group: muscleData.name,
          exercise: exercise_one,
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

type State = {
  total_sessions: [number, number];
  list: MusclePriorityType[];
  split: SessionDayType[];
  training_block: SessionDayType[][];
};

export const MUSCLE_PRIORITY_LIST: MusclePriorityType[] = [
  {
    id: "back-002",
    rank: 1,
    muscle: "back",
    sets: [10, 20, 25, 30, 35, 35, 35],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "delts_side-008",
    rank: 2,
    muscle: "delts_side",
    sets: [12, 25, 30, 35, 40, 40, 40],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "triceps-014",
    rank: 3,
    muscle: "triceps",
    sets: [8, 16, 20, 25, 35, 35, 35],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "hamstrings-011",
    rank: 4,
    muscle: "hamstrings",
    sets: [6, 12, 16, 18, 18, 18, 18],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "quads-012",
    rank: 5,
    muscle: "quads",
    sets: [8, 8, 8, 8, 8, 8, 8],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "delts_rear-007",
    rank: 6,
    muscle: "delts_rear",
    sets: [6, 6, 6, 6, 6, 6, 6],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "forearms-009",
    rank: 7,
    muscle: "forearms",
    sets: [2, 2, 2, 2, 2, 2, 2],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "traps-013",
    rank: 8,
    muscle: "traps",
    sets: [4, 4, 4, 4, 4, 4, 4],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "biceps-003",
    rank: 9,
    muscle: "biceps",
    sets: [6, 6, 6, 6, 6, 6, 6],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },

  {
    id: "chest-005",
    rank: 10,
    muscle: "chest",
    sets: [4, 4, 4, 4, 4, 4, 4],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "calves-004",
    rank: 11,
    muscle: "calves",
    sets: [6, 6, 6, 6, 6, 6, 6],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },

  {
    id: "delts_front-006",
    rank: 12,
    muscle: "delts_front",
    sets: [0, 0, 0, 0, 0, 0, 0],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "abs-001",
    rank: 13,
    muscle: "abs",
    sets: [0, 0, 0, 0, 0, 0, 0],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "glutes-010",
    rank: 14,
    muscle: "glutes",
    sets: [0, 0, 0, 0, 0, 0, 0],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
];

const INITIAL_STATE: State = {
  total_sessions: [3, 0],
  list: [...MUSCLE_PRIORITY_LIST],
  split: [...INITIAL_SPLIT],
  training_block: [[...INITIAL_SPLIT], [...INITIAL_SPLIT], [...INITIAL_SPLIT]],
};

type Action = {
  type: "UPDATE_SESSIONS" | "UPDATE_LIST" | "GET_TRAINING_BLOCK";
  payload?: {
    new_sessions?: [number, number];
    new_list?: MusclePriorityType[];
  };
};

function dataReducer(state: State, action: Action) {
  switch (action.type) {
    case "UPDATE_SESSIONS":
      if (!action.payload || !action.payload.new_sessions) return state;
      let new_sessions = action.payload.new_sessions;
      const sessions = determineOptimalSessionSplits(new_sessions, state.list);
      const new_split = updateWeekWithSessionSplits(
        new_sessions,
        state.split,
        sessions.lower,
        sessions.upper,
        sessions.push,
        sessions.pull,
        sessions.full,
        sessions.off
      );
      const updated_list = updateMuscleListSets(state.list, new_split);
      return {
        ...state,
        total_sessions: new_sessions,
        list: updated_list,
        split: new_split,
      };
    case "UPDATE_LIST":
      if (!action.payload || !action.payload.new_list) return state;
      let new_list = action.payload.new_list;
      const sessions_list = determineOptimalSessionSplits(
        state.total_sessions,
        new_list
      );
      const new_split_list = updateWeekWithSessionSplits(
        state.total_sessions,
        state.split,
        sessions_list.lower,
        sessions_list.upper,
        sessions_list.push,
        sessions_list.pull,
        sessions_list.full,
        sessions_list.off
      );
      const updated_list_list = updateMuscleListSets(new_list, new_split_list);
      return { ...state, list: updated_list_list, split: new_split_list };
    case "GET_TRAINING_BLOCK":
      const block: SessionDayType[][] = getTrainingBlock(
        state.list,
        state.split
      );
      return { ...state, training_block: block };
    default:
      return state;
  }
}

export default function useEverythingLol() {
  const [{ total_sessions, list, split, training_block }, dispatch] =
    useReducer(dataReducer, INITIAL_STATE);

  useEffect(() => {
    dispatch({ type: "GET_TRAINING_BLOCK" });
  }, [split]);

  useEffect(() => {
    console.log(
      split,
      list,
      total_sessions,
      training_block,
      "TEST: OMG IF THIS WORKS"
    );
  }, [total_sessions, list, split, training_block]);

  const handleFrequencyChange = (first: number, second: number) => {
    dispatch({
      type: "UPDATE_SESSIONS",
      payload: { new_sessions: [first, second] },
    });
  };

  const handleUpdateMuscleList = useCallback((items: MusclePriorityType[]) => {
    dispatch({ type: "UPDATE_LIST", payload: { new_list: items } });
  }, []);

  return {
    split,
    training_block,
    total_sessions,
    musclePriority: list,
    handleUpdateMuscleList,
    handleFrequencyChange,
  };
}
