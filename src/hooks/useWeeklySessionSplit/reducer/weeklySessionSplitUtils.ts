import { getExercise } from "~/constants/exercises";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import {
  LOWER_MUSCLES,
  PULL_MUSCLES,
  PUSH_AND_PULL_MUSCLES,
  PUSH_MUSCLES,
  UPPER_MUSCLES,
} from "~/constants/workoutSplits";
import { getMuscleData } from "~/utils/getMuscleData";
import { getNextSession } from "~/utils/getNextSession";
import {
  ExerciseType,
  MusclePriorityType,
  SessionDayType,
  SplitType,
} from "./weeklySessionSplitReducer";

function initializeOnOffDays(sessions: number, split: SessionDayType[]) {
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
}

function updateWeekWithSessionSplits(
  sessions: [number, number],
  split: SessionDayType[],
  lowerSessions: number,
  upperSessions: number,
  pushSessions: number,
  pullSessions: number,
  fullSessions: number,
  offSessions: number
) {
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
}

function updateMuscleListSets(
  _items: MusclePriorityType[],
  split: SessionDayType[]
) {
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

    let matrix =
      muscleData[key][matrixIndex] ??
      muscleData[key][muscleData[key].length - 1];
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
      const id_one = `${i}-${count + 1}_${exercise_one}`;
      const id_two = `${i}-${count + 2}_${exercise_two}`;

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
}

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

function updateReducerStateHandler(
  total_sessions: [number, number],
  list: MusclePriorityType[],
  split: SessionDayType[]
) {
  const sessions_list = determineOptimalSessionSplits(total_sessions, list);

  const new_split = updateWeekWithSessionSplits(
    total_sessions,
    split,
    sessions_list.lower,
    sessions_list.upper,
    sessions_list.push,
    sessions_list.pull,
    sessions_list.full,
    sessions_list.off
  );

  const updated_list = updateMuscleListSets(list, new_split);

  const new_split_with_exercises = distributeExercisesAmongSplit(
    updated_list,
    new_split,
    2
  );

  return {
    list: updated_list,
    split: new_split_with_exercises,
  };
}

export { getTrainingBlock, updateReducerStateHandler };