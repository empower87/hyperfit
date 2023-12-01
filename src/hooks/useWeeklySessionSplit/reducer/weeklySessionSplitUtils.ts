import {
  LOWER_MUSCLES,
  PULL_MUSCLES,
  PUSH_AND_PULL_MUSCLES,
  PUSH_MUSCLES,
  UPPER_MUSCLES,
  getBroSplit,
  getOptimizedSplit,
  getPushPullLegsSplit,
} from "~/constants/workoutSplits";
import { getTopExercises } from "~/utils/getExercises";
import { getNextSession } from "~/utils/getNextSession";
import {
  ExerciseType,
  MusclePriorityType,
  SplitSessionsNameType,
  SplitSessionsType,
  SplitType,
  TrainingDayType,
} from "./weeklySessionSplitReducer";

export type VolumeLandmarkType = "MRV" | "MEV" | "MV";
export type VolumeKey =
  | "mrv_progression_matrix"
  | "mev_progression_matrix"
  | "mv_progression_matrix";

function initializeOnOffDays(sessions: number, split: TrainingDayType[]) {
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
}

// NOTE: based on total sessions and prioritized muscle list, get the optimal session splits
function determineOptimalSessionSplits(
  sessions: [number, number],
  list: MusclePriorityType[]
) {
  // NOTE: weight coefficients to better determine session split
  let push = 0;
  let pull = 0;
  let lower = 0;

  const SYSTEMIC_FATIGUE_MODIFIER = 2;
  const LOWER_MODIFIER = 1.15;
  const RANK_WEIGHTS = [14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0];

  for (let i = 0; i < list.length; i++) {
    if (PUSH_AND_PULL_MUSCLES.includes(list[i].muscle)) {
      let split = Math.round(RANK_WEIGHTS[i] / 2);
      push = push + split;
      pull = pull + split;
    } else if (PUSH_MUSCLES.includes(list[i].muscle)) {
      push = push + RANK_WEIGHTS[i];
    } else if (PULL_MUSCLES.includes(list[i].muscle)) {
      pull = pull + RANK_WEIGHTS[i];
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

  let session_maxes_per_week = [0, 0, 0];

  switch (total_sessions) {
    // KEY
    // [0, 1, 2]
    // [push, pull, lower]
    case 3:
      session_maxes_per_week = [2, 2, 2];
      break;
    case 4:
      session_maxes_per_week = [3, 3, 3];
      break;
    case 5:
      session_maxes_per_week = [4, 4, 3];
      break;
    case 6:
      session_maxes_per_week = [4, 4, 3];
      break;
    case 7:
      session_maxes_per_week = [5, 5, 4];
      break;
    case 8:
      session_maxes_per_week = [5, 5, 4];
      break;
    case 9:
      session_maxes_per_week = [5, 5, 5];
      break;
    case 10:
      session_maxes_per_week = [6, 6, 5];
      break;
    case 11:
      session_maxes_per_week = [6, 6, 5];
      break;
    case 12:
      session_maxes_per_week = [6, 6, 5];
      break;
    case 13:
      session_maxes_per_week = [6, 6, 6];
      break;
    case 14:
      session_maxes_per_week = [6, 6, 6];
      break;
    default:
      session_maxes_per_week = [2, 2, 2];
      break;
  }

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
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // LOGGING FOR TESTING ---------------------------------------------------

  return {
    upper: upperSessions,
    lower: lowerSessions,
    full: fullSessions,
    push: pushSessions,
    pull: pullSessions,
    off: offSessions,
  };
}

function updateWeekWithSessionSplits(
  sessions: [number, number],
  training_week: TrainingDayType[],
  splitSessions: SplitSessionsType
) {
  const { lower, upper, push, pull, full, off } = splitSessions.sessions;
  const first_sessions = sessions[0];
  const second_sessions = sessions[1];

  const reset_sessionNums = training_week.map((each) => {
    return { ...each, sessionNum: 0 };
  });
  const update_split = initializeOnOffDays(first_sessions, [
    ...reset_sessionNums,
  ]);

  let counter = {
    lower: lower,
    upper: upper,
    push: push,
    pull: pull,
    full: full,
    off: off,
  };

  const totalLower = lower + full;
  const totalPush = push + upper + full;
  const totalPull = pull + upper + full;

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
}

// NOTE: going to have to add a split parameter to this
//       this would allow for frequency to be updated based on split.
function addMesoProgression(
  _items: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  mrv_breakpoint: number,
  mev_breakpoint: number
) {
  // let upper = split_sessions.upper + split_sessions.pull + split_sessions.push + split_sessions.full;
  // let lower = split_sessions.lower + split_sessions.full + split_sessions.legs;

  let items = [..._items];

  for (let i = 0; i < items.length; i++) {
    let key: VolumeLandmarkType =
      i < mrv_breakpoint
        ? "MRV"
        : i >= mrv_breakpoint && i < mev_breakpoint
        ? "MEV"
        : "MV";
    let split_key = split_sessions.name;
    let sessions = 0;
    let muscle = items[i].muscle;

    switch (split_key) {
      case "OPT":
        const keys = getOptimizedSplit(muscle);
        for (let i = 0; i < keys.length; i++) {
          sessions = sessions + split_sessions.sessions[keys[i]];
        }
        break;
      case "PPL":
        const pplSplit = getPushPullLegsSplit(muscle);
        if (pplSplit === "legs") {
          sessions =
            split_sessions.sessions[pplSplit] + split_sessions.sessions.lower;
        } else {
          sessions = split_sessions.sessions[pplSplit];
        }
        break;
      case "BRO":
        const broSplit = getBroSplit(muscle);
        sessions = split_sessions.sessions[broSplit];
        break;
      case "PPLUL":
        const pplulSplit = getPushPullLegsSplit(muscle);
        if (pplulSplit === "legs") {
          sessions =
            split_sessions.sessions[pplulSplit] + split_sessions.sessions.lower;
        } else {
          sessions =
            split_sessions.sessions[pplulSplit] + split_sessions.sessions.upper;
        }
        break;
      case "UL":
        if (UPPER_MUSCLES.includes(muscle)) {
          sessions = split_sessions.sessions.upper;
        } else {
          sessions = split_sessions.sessions.lower;
        }
        break;
      case "FB":
        sessions = split_sessions.sessions.full;
        break;
      default:
    }

    // if (UPPER_MUSCLES.includes(items[i].muscle)) {
    //   sessions = upper;
    // }

    let mesoProgression = [1, 1, 1];

    switch (key) {
      case "MRV":
        const getFrequencyProgression = (sessions: number) => {
          switch (sessions) {
            case 6:
              return [4, 5, 6];
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

        let prog = getFrequencyProgression(sessions);

        mesoProgression = prog;
        break;
      case "MEV":
        if (sessions <= 2) {
          mesoProgression = [1, 2, 2];
        } else if (
          items[i].muscle === "back" ||
          items[i].muscle === "quads" ||
          items[i].muscle === "calves"
        ) {
          mesoProgression = [2, 3, 3];
        }
        break;
      default:
        if (
          items[i].muscle === "back" ||
          items[i].muscle === "quads" ||
          items[i].muscle === "calves"
        ) {
          mesoProgression = [1, 2, 2];
        }
        break;
    }

    items[i].mesoProgression = mesoProgression;
    items[i].volume_landmark = key;
  }

  return items;
}

const distributeExercisesAmongSplit = (
  list: MusclePriorityType[],
  split: TrainingDayType[],
  mrv_breakpoint: number,
  mev_breakpoint: number
) => {
  let meso: TrainingDayType[] = [...split].map((each) => {
    const emptySets: [ExerciseType[][], ExerciseType[][]] = [[], []];
    return { ...each, sets: emptySets };
  });

  for (let i = 0; i < list.length; i++) {
    let key: VolumeKey =
      i < mrv_breakpoint
        ? "mrv_progression_matrix"
        : i >= mrv_breakpoint && i < mev_breakpoint
        ? "mev_progression_matrix"
        : "mv_progression_matrix";

    let exercises = getTopExercises(
      list[i].muscle,
      key,
      list[i].mesoProgression
    );

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
          let add_exercises = exercises[0];

          for (let k = 0; k < add_exercises.length; k++) {
            add_exercises[k] = {
              ...add_exercises[k],
              session: meso[j].sessionNum,
            };
          }

          meso[j].sets[0].push(add_exercises);
          exercises.shift();
        }

        const canAddSecondExercise = handleSession(sessionTwo, session);

        if (canAddSecondExercise && exercises.length) {
          let add_exercises = exercises[0];

          for (let k = 0; k < add_exercises.length; k++) {
            add_exercises[k] = {
              ...add_exercises[k],
              session: meso[j].sessionNum,
            };
          }

          meso[j].sets[1].push(add_exercises);
          exercises.shift();
        }
      }
    }
  }
  return meso;
};

const PPLUL = ["push", "pull", "legs", "upper", "lower"];
const PPL = ["push", "pull", "legs"];
const BRO = ["chest", "back", "legs", "arms", "shoulders"];
const UL = ["upper", "lower", "upper", "lower"];
const FB = ["full", "full", "full"];

function getSplitOverview(split_sessions: SplitSessionsType) {
  let newObj = Object.entries(split_sessions).filter(
    (each) => typeof each[1] === "number" && each[1] > 0
  );

  return newObj;
}

function selectSplitHandler(
  type: SplitSessionsNameType,
  total_sessions: [number, number]
) {
  const total = total_sessions[0] + total_sessions[1];
  let splitList = [...PPL];

  switch (type) {
    case "PPL":
      splitList = [...PPL];
      break;
    case "UL":
      splitList = [...UL];
      break;
    case "BRO":
      splitList = [...BRO];
      break;
    case "PPLUL":
      splitList = [...PPLUL];
      break;
    case "FB":
      splitList = [...FB];
      break;
    default:
      splitList = [...PPL];
  }

  let index = 0;
  let totalCount = total;
  while (totalCount > 0) {
    splitList.push(splitList[index]);
    index++;
    totalCount--;
    if (index >= splitList.length) {
      index = 0;
    }
  }

  const upper = splitList.filter((each) => each === "upper");
  const lower = splitList.filter((each) => each === "lower");
  const push = splitList.filter((each) => each === "push");
  const pull = splitList.filter((each) => each === "pull");
  const full = splitList.filter((each) => each === "full");
  const chest = splitList.filter((each) => each === "chest");
  const back = splitList.filter((each) => each === "back");
  const arms = splitList.filter((each) => each === "arms");
  const shoulders = splitList.filter((each) => each === "shoulders");
  const legs = splitList.filter((each) => each === "legs");

  const off =
    total_sessions[1] === 0 ? 0 : total_sessions[0] - total_sessions[1];

  let counter = {
    lower: lower.length,
    upper: upper.length,
    push: push.length,
    pull: pull.length,
    full: full.length,
    chest: chest.length,
    back: back.length,
    arms: arms.length,
    shoulders: shoulders.length,
    legs: legs.length,
    off: off,
  };

  return counter;
}

function getSplitSessions(
  type: SplitSessionsNameType,
  total_sessions: [number, number],
  list: MusclePriorityType[]
) {
  let splitSession: SplitSessionsType = {
    name: type,
    sessions: {
      chest: 0,
      back: 0,
      arms: 0,
      shoulders: 0,
      legs: 0,
      upper: 0,
      lower: 0,
      push: 0,
      pull: 0,
      full: 0,
      off: 0,
    },
  };

  if (type === "OPT") {
    let { upper, lower, push, pull, full, off } = determineOptimalSessionSplits(
      total_sessions,
      list
    );
    return {
      ...splitSession,
      sessions: {
        ...splitSession.sessions,
        upper: upper,
        lower: lower,
        push: push,
        pull: pull,
        full: full,
        off: off,
      },
    };
  } else {
    let splits = selectSplitHandler(type, total_sessions);
    const newSessionSplit = {
      name: type,
      sessions: { ...splits },
    };
    return newSessionSplit;
  }
}

function updateTrainingWeek(
  total_sessions: [number, number],
  training_week: TrainingDayType[],
  split_sessions: SplitSessionsType,
  muscle_priority_List: MusclePriorityType[],
  breakpoints: [number, number]
) {
  const new_split = updateWeekWithSessionSplits(
    total_sessions,
    training_week,
    split_sessions
  );
  const new_split_with_exercises = distributeExercisesAmongSplit(
    muscle_priority_List,
    new_split,
    breakpoints[0],
    breakpoints[1]
  );
  return new_split_with_exercises;
}

function updateReducerStateHandler(
  total_sessions: [number, number],
  list: MusclePriorityType[],
  split: TrainingDayType[],
  mrv_breakpoint: number,
  mev_breakpoint: number,
  split_sessions: SplitSessionsType
) {
  // const sessions_list = determineOptimalSessionSplits(total_sessions, list);

  const new_split = updateWeekWithSessionSplits(
    total_sessions,
    split,
    split_sessions
  );

  const updated_list = addMesoProgression(
    list,
    split_sessions,
    mrv_breakpoint,
    mev_breakpoint
  );

  const new_split_with_exercises = distributeExercisesAmongSplit(
    updated_list,
    new_split,
    mrv_breakpoint,
    mev_breakpoint
  );

  return {
    list: updated_list,
    split: new_split_with_exercises,
  };
}

export {
  getSplitOverview,
  getSplitSessions,
  selectSplitHandler,
  updateReducerStateHandler,
  updateTrainingWeek,
};
