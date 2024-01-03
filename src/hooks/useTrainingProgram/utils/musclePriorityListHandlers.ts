import {
  MRV_PROGRESSION_MATRIX_ONE,
  MRV_PROGRESSION_MATRIX_TWO,
} from "~/constants/volumeProgressionMatrices";
import {
  MuscleType,
  UPPER_MUSCLES,
  getBroSplit,
  getOptimizedSplit,
  getPushPullLegsSplit,
} from "~/constants/workoutSplits";
import { getTotalExercisesForMuscleGroup } from "~/utils/getExercises";
import { includes } from "~/utils/readOnlyArrayIncludes";
import {
  MusclePriorityType,
  SplitSessionsType,
} from "../reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "../reducer/trainingProgramUtils";

const SYSTEMIC_FATIGUE_MODIFIER = 2;
const LOWER_MODIFIER = 1.15;
const RANK_WEIGHTS = [14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0];
export const MUSCLE_PRIORITY_LIST: MusclePriorityType[] = [
  {
    id: "back-002",
    rank: RANK_WEIGHTS[0],
    muscle: "back",
    volume_landmark: "MRV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MRV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 2,
      setProgressionMatrix: [],
    },
  },
  {
    id: "delts_side-008",
    rank: RANK_WEIGHTS[1],
    muscle: "delts_side",
    volume_landmark: "MRV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MRV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 2,
      setProgressionMatrix: [],
    },
  },
  {
    id: "triceps-014",
    rank: RANK_WEIGHTS[2],
    muscle: "triceps",
    volume_landmark: "MRV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MRV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },
  {
    id: "hamstrings-011",
    rank: RANK_WEIGHTS[3],
    muscle: "hamstrings",
    volume_landmark: "MRV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MRV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },
  {
    id: "quads-012",
    rank: RANK_WEIGHTS[4],
    muscle: "quads",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 2,
      setProgressionMatrix: [],
    },
  },
  {
    id: "delts_rear-007",
    rank: RANK_WEIGHTS[5],
    muscle: "delts_rear",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },
  {
    id: "forearms-009",
    rank: RANK_WEIGHTS[6],
    muscle: "forearms",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },
  {
    id: "traps-013",
    rank: RANK_WEIGHTS[7],
    muscle: "traps",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },
  {
    id: "biceps-003",
    rank: RANK_WEIGHTS[8],
    muscle: "biceps",
    volume_landmark: "MEV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },

  {
    id: "chest-005",
    rank: RANK_WEIGHTS[9],
    muscle: "chest",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },
  {
    id: "calves-004",
    rank: RANK_WEIGHTS[10],
    muscle: "calves",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },

  {
    id: "delts_front-006",
    rank: RANK_WEIGHTS[11],
    muscle: "delts_front",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },
  {
    id: "abs-001",
    rank: RANK_WEIGHTS[12],
    muscle: "abs",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },
  {
    id: "glutes-010",
    rank: RANK_WEIGHTS[13],
    muscle: "glutes",
    volume_landmark: "MV",
    mesoProgression: [0, 0, 0],
    exercises: [],
    volume: {
      landmark: "MV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
  },
];

// NOTE: updates only on REORDERING of list or changing MEV/MRV BREAKPOINT
const getVolumeLandmarkForMuscle = (
  index: number,
  volume_landmark: VolumeLandmarkType,
  volume_breakpoints?: [number, number]
) => {
  if (!volume_breakpoints) return volume_landmark;
  const mrv_bp = volume_breakpoints[0];
  const mev_bp = volume_breakpoints[1];

  if (index < mrv_bp) {
    return "MRV";
  } else if (index >= mrv_bp && index < mev_bp) {
    return "MEV";
  } else {
    return "MV";
  }
};
const getRankWeightForMuscle = (index: number, muscle: MuscleType) => {
  let muscle_rank = 0;
  switch (muscle) {
    case "hamstrings":
    case "glutes":
    case "calves":
    case "quads":
      let lowerMod = Math.round(RANK_WEIGHTS[index] * LOWER_MODIFIER);
      if (index < 3 && muscle === "quads") {
        lowerMod = lowerMod * SYSTEMIC_FATIGUE_MODIFIER;
      }
      muscle_rank = lowerMod;
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
      muscle_rank = RANK_WEIGHTS[index];
  }
  return muscle_rank;
};
export const onReorderUpdateMusclePriorityList = (
  muscle_priority_list: MusclePriorityType[],
  volume_breakpoints?: [number, number]
) => {
  let updated_list = [...muscle_priority_list];
  for (let i = 0; i < updated_list.length; i++) {
    const muscle = updated_list[i].muscle;
    const current_volume_landmark = muscle_priority_list[i].volume.landmark;

    const muscle_rank = getRankWeightForMuscle(i, muscle);
    const volume_landmark = getVolumeLandmarkForMuscle(
      i,
      current_volume_landmark,
      volume_breakpoints
    );

    updated_list[i].rank = muscle_rank;
    updated_list[i].volume.landmark = volume_landmark;
    updated_list[i].volume_landmark = volume_landmark;
  }
  return updated_list;
};

// NOTE: updates on SPLIT_SESSIONS change or MUSCLE_PRIORITY_LIST change
const getSetsForCurrentMicrocycle = (
  prev_microcycle: number[][],
  set_add_indices: number[]
) => {
  let microcycle: number[][] = [];

  for (let j = 0; j < prev_microcycle.length; j++) {
    let session_sets: number[] = [...prev_microcycle[j]];

    for (let k = 0; k < session_sets.length; k++) {
      let sets_to_add = set_add_indices[k];
      session_sets[k] = session_sets[k] + sets_to_add;
    }

    microcycle.push(session_sets);
  }
  return microcycle;
};
const getSetProgressionMatrixForMesocycle = (
  currentMesocycleIndex: number,
  exercisesPerSessionSchema: number,
  microcycles: number
): number[][][] => {
  const matrix =
    exercisesPerSessionSchema === 2
      ? MRV_PROGRESSION_MATRIX_TWO
      : MRV_PROGRESSION_MATRIX_ONE;
  let prog: number[] = exercisesPerSessionSchema === 2 ? [1, 0] : [1];

  const initialMesocycleLayout = matrix[currentMesocycleIndex];

  let mesocycle_sets: number[][][] = [];

  let prev_microcycle: number[][] = initialMesocycleLayout.map((each) => [
    ...each,
  ]);
  for (let i = 0; i < microcycles; i++) {
    if (i === 0) {
      mesocycle_sets.push(prev_microcycle);
      continue;
    }
    const current_microcycle = getSetsForCurrentMicrocycle(
      prev_microcycle,
      prog
    );
    mesocycle_sets.push(current_microcycle);
    prev_microcycle = current_microcycle;

    if (prog.length === 2) {
      if (prog[0] === 1) {
        prog = [0, 1];
      } else {
        prog = [1, 0];
      }
    } else {
      if (prog[0] === 1) {
        prog = [0];
      } else {
        prog = [1];
      }
    }
  }
  return mesocycle_sets;
};
const getSetProgressionMatrixForMuscle = (
  frequencyProgression: number[],
  exercisesPerSessionSchema: number,
  microcycles: number
) => {
  let set_progression_matrix: number[][][][] = [];
  for (let j = 0; j < frequencyProgression.length; j++) {
    const mesocycle_index =
      frequencyProgression[j] - 1 >= 0 ? frequencyProgression[j] - 1 : 0;
    let set_progression = getSetProgressionMatrixForMesocycle(
      mesocycle_index,
      exercisesPerSessionSchema,
      microcycles
    );
    set_progression_matrix.push(set_progression);
  }
  return set_progression_matrix;
};
export const onSplitChangeUpdateMusclePriorityList = (
  muscle_priority_list: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  mesocycles: number,
  microcycles: number
) => {
  let updated_list = [...muscle_priority_list];

  for (let i = 0; i < updated_list.length; i++) {
    const muscle = updated_list[i].muscle;
    const { exercisesPerSessionSchema, landmark } = updated_list[i].volume;
    const frequencyProgression = attachMesocycleFrequencyProgression(
      muscle,
      landmark,
      split_sessions,
      mesocycles
    );
    const exercises = getTotalExercisesForMuscleGroup(
      muscle,
      landmark,
      frequencyProgression,
      exercisesPerSessionSchema
    );
    const matrix = getSetProgressionMatrixForMuscle(
      frequencyProgression,
      exercisesPerSessionSchema,
      microcycles
    );

    updated_list[i].exercises = exercises;
    updated_list[i].volume.frequencyProgression = frequencyProgression;
    updated_list[i].volume.setProgressionMatrix = matrix;
  }
  return updated_list;
};

const getFrequencyProgression = (sessions: number, mesocycles: number) => {
  let frequencyProgression: number[] = [];

  for (let i = 0; i < mesocycles; i++) {
    let frequency = sessions - i;
    if (frequency < 0) {
      frequency = 0;
    }
    frequencyProgression.unshift(frequency);
  }

  return frequencyProgression;
};
const attachMesocycleFrequencyProgression = (
  muscle: MuscleType,
  volume_landmark: VolumeLandmarkType,
  split_sessions: SplitSessionsType,
  mesocycles: number
) => {
  let key = volume_landmark;
  let sessions = 0;

  switch (split_sessions.split) {
    case "OPT":
      const keys = getOptimizedSplit(muscle);

      for (let i = 0; i < keys.length; i++) {
        sessions = sessions + split_sessions.sessions[keys[i]];
      }

      break;
    case "PPL":
      const pplSplit = getPushPullLegsSplit(muscle);
      sessions = split_sessions.sessions[pplSplit];
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
      if (includes(UPPER_MUSCLES, muscle)) {
        sessions = split_sessions.sessions.upper;
      } else {
        sessions = split_sessions.sessions.lower;
      }
      break;
    case "FB":
      sessions = split_sessions.sessions.full;
      break;
    default:
      break;
  }

  let mesoProgression: number[] = [];

  switch (key) {
    case "MRV":
      const mrv = getFrequencyProgression(sessions, mesocycles);
      mesoProgression = mrv;
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
      const mev = getFrequencyProgression(sessions_capped, mesocycles);
      mesoProgression = mev;
      break;
    case "MV":
      let sessions_capped_mv = 1;
      if (sessions === 0) {
        sessions_capped_mv = 0;
      } else if (sessions >= 2) {
        if (["back", "quads", "calves"].includes(muscle)) {
          sessions_capped_mv = 2;
        }
      }
      const mv = getFrequencyProgression(sessions_capped_mv, mesocycles);
      mesoProgression = mv;
      break;
    default:
      // mesoProgression = getFrequencyProgression(sessions, mesocycles);
      break;
  }
  return mesoProgression;
};
