import {
  UPPER_MUSCLES,
  getBroSplit,
  getMusclesSplit,
  getOptimizedSplit,
  getPushPullLegsSplit,
} from "~/constants/workoutSplits";
import { getTopExercises } from "~/utils/getExercises";
import {
  ExerciseType,
  MusclePriorityType,
  SplitSessionsType,
  TrainingDayType,
} from "./trainingProgramReducer";

export type VolumeLandmarkType = "MRV" | "MEV" | "MV";
export type VolumeKey =
  | "mrv_progression_matrix"
  | "mev_progression_matrix"
  | "mv_progression_matrix";

function addRankWeightsToMusclePriority(muscle_priority: MusclePriorityType[]) {
  const SYSTEMIC_FATIGUE_MODIFIER = 2;
  const LOWER_MODIFIER = 1.15;
  const RANK_WEIGHTS = [14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0];

  for (let i = 0; i < muscle_priority.length; i++) {
    let muscle = muscle_priority[i].muscle;

    switch (muscle) {
      case "hamstrings":
      case "glutes":
      case "calves":
      case "quads":
        let lowerMod = Math.round(RANK_WEIGHTS[i] * LOWER_MODIFIER);
        if (i < 3 && muscle === "quads") {
          lowerMod = lowerMod * SYSTEMIC_FATIGUE_MODIFIER;
        }
        console.log(muscle, i, RANK_WEIGHTS[i], lowerMod, "CHECK THIS OUT ");
        muscle_priority[i].rank = lowerMod;
        break;
      case "back":
      case "chest":
      case "biceps":
      case "triceps":
      case "traps":
      case "forearms":
      case "delts_rear":
      case "delts_side":
      case "delts_front":
      case "abs":
      default:
        muscle_priority[i].rank = RANK_WEIGHTS[i];
    }
  }
  return muscle_priority;
}

function addMesoProgression(
  _items: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  mrv_breakpoint: number,
  mev_breakpoint: number
) {
  let items = [..._items];
  for (let i = 0; i < items.length; i++) {
    let key: VolumeLandmarkType =
      i < mrv_breakpoint
        ? "MRV"
        : i >= mrv_breakpoint && i < mev_breakpoint
        ? "MEV"
        : "MV";

    let sessions = 0;
    let muscle = items[i].muscle;

    switch (split_sessions.split) {
      case "OPT":
        const keys = getOptimizedSplit(muscle);

        for (let i = 0; i < keys.length; i++) {
          sessions = sessions + split_sessions.sessions[keys[i]];
        }

        break;
      case "PPL":
        const pplSplit = getPushPullLegsSplit(muscle);
        sessions = sessions + split_sessions.sessions[pplSplit];
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
        if (sessions === 0) {
          mesoProgression = [0, 0, 0];
        } else if (sessions <= 1) {
          mesoProgression = [1, 1, 1];
        } else if (sessions <= 2) {
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
        if (sessions === 0) {
          mesoProgression = [0, 0, 0];
        } else if (sessions <= 1) {
          mesoProgression = [1, 1, 1];
        } else if (
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

function attachMesocycleFrequencyProgression(
  _items: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  mesocycles: number
) {
  let items = [..._items];

  for (let i = 0; i < items.length; i++) {
    let key = items[i].volume_landmark;
    let sessions = 0;
    let muscle = items[i].muscle;

    switch (split_sessions.split) {
      case "OPT":
        const keys = getOptimizedSplit(muscle);

        for (let i = 0; i < keys.length; i++) {
          sessions = sessions + split_sessions.sessions[keys[i]];
        }

        break;
      case "PPL":
        const pplSplit = getPushPullLegsSplit(muscle);
        sessions = sessions + split_sessions.sessions[pplSplit];
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

    let mesoProgression: number[] = [];

    const getFrequencyProgression = (sessions: number, mesocycles: number) => {
      let frequencyProgression: number[] = [];

      for (let i = 0; i < mesocycles; i++) {
        let frequency = sessions - i;
        if (frequency < 0) {
          frequency = 0;
        }
        frequencyProgression.unshift(frequency);
      }
      console.log(
        muscle,
        frequencyProgression,
        sessions,
        mesocycles,
        "LOOK AT DEEZ"
      );
      return frequencyProgression;
    };

    switch (key) {
      case "MRV":
        let prog = getFrequencyProgression(sessions, mesocycles);

        mesoProgression = prog;
        break;
      case "MEV":
        let sessions_capped = 2;
        if (sessions === 0) {
          sessions_capped = 0;
        } else if (sessions <= 1) {
          sessions_capped = 1;
        } else if (sessions >= 3) {
          if (["back", "quads", "calves"].includes(muscle)) {
            sessions_capped = 3;
          }
        }
        mesoProgression = getFrequencyProgression(sessions_capped, mesocycles);
        break;
      default:
        let sessions_capped_mv = 1;
        if (sessions === 0) {
          sessions_capped_mv = 0;
        } else if (sessions >= 2) {
          if (["back", "quads", "calves"].includes(muscle)) {
            sessions_capped_mv = 2;
          }
        }
        mesoProgression = getFrequencyProgression(
          sessions_capped_mv,
          mesocycles
        );
        break;
    }

    items[i].volume.frequencyProgression = mesoProgression;
    items[i].volume_landmark = key;
  }

  return items;
}

const distributeExercisesAmongSplit = (
  muscle_priority: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  _training_week: TrainingDayType[],
  mrv_breakpoint: number,
  mev_breakpoint: number
) => {
  let training_week: TrainingDayType[] = [..._training_week].map((each) => {
    const emptySessionSets = each.sessions.map((ea) => {
      return { ...ea, exercises: [] as ExerciseType[][] };
    });
    return { ...each, sessions: emptySessionSets };
  });

  for (let i = 0; i < muscle_priority.length; i++) {
    const key: VolumeKey =
      i < mrv_breakpoint
        ? "mrv_progression_matrix"
        : i >= mrv_breakpoint && i < mev_breakpoint
        ? "mev_progression_matrix"
        : "mv_progression_matrix";

    let exercises = getTopExercises(
      muscle_priority[i].muscle,
      key,
      muscle_priority[i].mesoProgression
    );

    const splits = getMusclesSplit(
      split_sessions.split,
      muscle_priority[i].muscle
    );

    for (let j = 0; j < training_week.length; j++) {
      if (exercises.length) {
        const sessions = training_week[j].sessions;

        for (let k = 0; k < sessions.length; k++) {
          if (splits.includes(sessions[k].split)) {
            let add_exercises = exercises[0];

            for (let l = 0; l < add_exercises.length; l++) {
              add_exercises[l] = {
                ...add_exercises[l],
                session: j,
              };
            }
            training_week[j].sessions[k].exercises.push(add_exercises);
            exercises.shift();
          }
        }
      }
    }
  }
  return training_week;
};

function getSplitOverview(split_sessions: SplitSessionsType) {
  let newObj = Object.entries(split_sessions).filter(
    (each) => typeof each[1] === "number" && each[1] > 0
  );

  return newObj;
}

export {
  addMesoProgression,
  addRankWeightsToMusclePriority,
  attachMesocycleFrequencyProgression,
  distributeExercisesAmongSplit,
  getSplitOverview,
};
