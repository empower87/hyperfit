import {
  MRV_PROGRESSION_MATRIX_ONE,
  MRV_PROGRESSION_MATRIX_TWO,
  getMatrixWithAdjustedInitialSets,
} from "~/constants/volumeProgressionMatrices";
import { MUSCLE_WEIGHTS } from "~/constants/weighting/muscles";
import {
  MuscleType,
  UPPER_MUSCLES,
  getBroSplit,
  getOPTSplit,
  getPushPullLegsSplit,
} from "~/constants/workoutSplits";
import {
  getTotalExercisesForMuscleGroup,
  initializeSetProgression,
} from "~/utils/getExercises";
import { getMuscleData } from "~/utils/getMuscleData";
import { includes } from "~/utils/readOnlyArrayIncludes";
import { getSplitFromWeights } from "../reducer/getSplitFromPriorityWeighting";
import {
  type MusclePriorityType,
  type SplitSessionsType,
  type VolumeLandmarkType,
} from "../reducer/trainingProgramReducer";
import {
  determineFrequencyByRange,
  determineFrequencyProgression,
} from "./maximumFrequencyHandlers";

const SYSTEMIC_FATIGUE_MODIFIER = 2;
const LOWER_MODIFIER = 1.15;
const RANK_WEIGHTS = [14, 12, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0];

export const MUSCLE_PRIORITY_LIST: MusclePriorityType[] = [
  {
    id: "back-002",
    rank: MUSCLE_WEIGHTS.back,
    muscle: "back",
    exercises: [],
    volume: {
      landmark: "MRV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 2,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [3, 4],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "delts_side-008",
    rank: MUSCLE_WEIGHTS.delts_side,
    muscle: "delts_side",
    exercises: [],
    volume: {
      landmark: "MRV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 2,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [3, 6],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "triceps-014",
    rank: MUSCLE_WEIGHTS.triceps,
    muscle: "triceps",
    exercises: [],
    volume: {
      landmark: "MRV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [2, 4],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "hamstrings-011",
    rank: MUSCLE_WEIGHTS.hamstrings,
    muscle: "hamstrings",
    exercises: [],
    volume: {
      landmark: "MRV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [2, 3],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "quads-012",
    rank: MUSCLE_WEIGHTS.quads,
    muscle: "quads",
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 2,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [2, 5],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "delts_rear-007",
    rank: MUSCLE_WEIGHTS.delts_rear,
    muscle: "delts_rear",
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [3, 6],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "forearms-009",
    rank: MUSCLE_WEIGHTS.forearms,
    muscle: "forearms",
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [3, 6],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "traps-013",
    rank: MUSCLE_WEIGHTS.traps,
    muscle: "traps",
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [2, 4],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "biceps-003",
    rank: MUSCLE_WEIGHTS.biceps,
    muscle: "biceps",
    exercises: [],
    volume: {
      landmark: "MEV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [3, 6],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },

  {
    id: "chest-005",
    rank: MUSCLE_WEIGHTS.chest,
    muscle: "chest",
    exercises: [],
    volume: {
      landmark: "MV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 2,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [2, 4],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "calves-004",
    rank: MUSCLE_WEIGHTS.calves,
    muscle: "calves",
    exercises: [],
    volume: {
      landmark: "MV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [3, 6],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "delts_front-006",
    rank: MUSCLE_WEIGHTS.delts_front,
    muscle: "delts_front",
    exercises: [],
    volume: {
      landmark: "MV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [2, 3],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "abs-001",
    rank: MUSCLE_WEIGHTS.abs,
    muscle: "abs",
    exercises: [],
    volume: {
      landmark: "MV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [3, 6],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
  {
    id: "glutes-010",
    rank: MUSCLE_WEIGHTS.glutes,
    muscle: "glutes",
    exercises: [],
    volume: {
      landmark: "MV",
      frequencyProgression: [],
      exercisesPerSessionSchema: 1,
      setProgressionMatrix: [],
    },
    frequency: {
      range: [2, 5],
      target: 0,
      progression: [],
      setProgression: [],
    },
  },
];

// NOTE: updates only on REORDERING of list or changing MEV/MRV BREAKPOINT
export const getVolumeLandmarkForMuscle = (
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
export const getRankWeightForMuscle = (index: number, muscle: MuscleType) => {
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

export const attachTargetFrequency = (
  muscle_priority_list: MusclePriorityType[],
  total_sessions: number,
  breakpoints: [number, number]
) => {
  const updated_list = structuredClone(muscle_priority_list);
  for (let i = 0; i < updated_list.length; i++) {
    const target = determineFrequencyByRange(
      updated_list[i].frequency.range,
      i,
      breakpoints,
      total_sessions
    );
    updated_list[i].frequency.target = target;
    const frequencyProgression = determineFrequencyProgression(3, target);
    updated_list[i].frequency.progression = frequencyProgression;
    const setProgressionTEST = initializeSetProgression(
      frequencyProgression,
      32,
      updated_list[i].muscle
    );
    const muscle = updated_list[i].muscle;
    const landmark = updated_list[i].volume.landmark;
    const exercisesPerSessionSchema =
      updated_list[i].volume.exercisesPerSessionSchema;
    const exercises = getTotalExercisesForMuscleGroup(
      muscle,
      landmark,
      frequencyProgression,
      exercisesPerSessionSchema
    );
    updated_list[i].exercises = exercises;
    updated_list[i].frequency.setProgression = setProgressionTEST;
  }
  return updated_list;
};

export const onReorderUpdateMusclePriorityList = (
  muscle_priority_list: MusclePriorityType[],
  volume_breakpoints?: [number, number]
) => {
  const updated_list = structuredClone(muscle_priority_list);
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
  }
  return updated_list;
};

// NOTE: updates on SPLIT_SESSIONS change or MUSCLE_PRIORITY_LIST change
const getSetsForCurrentMicrocycle = (
  prev_microcycle: number[][],
  set_add_indices: number[]
) => {
  const microcycle: number[][] = [];

  for (let j = 0; j < prev_microcycle.length; j++) {
    const session_sets: number[] = [...prev_microcycle[j]];

    for (let k = 0; k < session_sets.length; k++) {
      const sets_to_add = set_add_indices[k];
      session_sets[k] = session_sets[k] + sets_to_add;
    }

    microcycle.push(session_sets);
  }
  return microcycle;
};

const getSetProgressionMatrixForMesocycle = (
  currentMesocycleIndex: number,
  exercisesPerSessionSchema: number,
  microcycles: number,
  adjustMatrix?: {
    keySchema: [VolumeLandmarkType, number];
    frequencyIndex: number;
    adjust: "add" | "subtract";
  }
): number[][][] => {
  const defaultMatrix =
    exercisesPerSessionSchema === 2
      ? MRV_PROGRESSION_MATRIX_TWO
      : MRV_PROGRESSION_MATRIX_ONE;

  const matrix = adjustMatrix
    ? getMatrixWithAdjustedInitialSets(
        adjustMatrix.keySchema,
        adjustMatrix.frequencyIndex,
        adjustMatrix.adjust
      )
    : defaultMatrix;
  let prog: number[] = exercisesPerSessionSchema === 2 ? [1, 0] : [1];

  const initialMesocycleLayout = matrix[currentMesocycleIndex];

  const mesocycle_sets: number[][][] = [];

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
export const getSetProgressionMatrixForMuscle = (
  frequencyProgression: number[],
  exercisesPerSessionSchema: number,
  microcycles: number,
  adjustMatrix?: {
    keySchema: [VolumeLandmarkType, number];
    frequencyIndex: number;
    adjust: "add" | "subtract";
  }
) => {
  const set_progression_matrix: number[][][][] = [];
  for (let j = 0; j < frequencyProgression.length; j++) {
    const mesocycle_index =
      frequencyProgression[j] - 1 >= 0 ? frequencyProgression[j] - 1 : 0;
    const set_progression = getSetProgressionMatrixForMesocycle(
      mesocycle_index,
      exercisesPerSessionSchema,
      microcycles,
      adjustMatrix
    );
    set_progression_matrix.push(set_progression);
  }
  return set_progression_matrix;
};
export const onSplitChangeUpdateMusclePriorityList = (
  muscle_priority_list: MusclePriorityType[],
  split_sessions: SplitSessionsType,
  mesocycles: number,
  microcycles: number,
  update_frequency?: [MusclePriorityType["id"], "add" | "subtract"]
) => {
  const updated_list = structuredClone(muscle_priority_list);

  for (let i = 0; i < updated_list.length; i++) {
    const muscle = updated_list[i].muscle;
    const muscleId = updated_list[i].id;
    const { exercisesPerSessionSchema, landmark } = updated_list[i].volume;
    const frequencyProgression = attachMesocycleFrequencyProgression(
      muscle,
      landmark,
      split_sessions,
      mesocycles,
      update_frequency && update_frequency[0] === muscleId
        ? update_frequency[1]
        : undefined
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

const doesMuscleHaveVolume = (muscle: MuscleType, key: VolumeLandmarkType) => {
  const data = getMuscleData(muscle);
  if (key === "MRV") return true;
  if (data[key] > 0) return true;
  return false;
};
const getMaxFrequencyForMEVMV = (
  muscle: MuscleType,
  volume_landmark: VolumeLandmarkType
) => {
  const data = getMuscleData(muscle);
  if (volume_landmark === "MRV") return 0;
  const volume = data[volume_landmark];

  // if (volume > 8) return 3;
  if (volume > 4 && volume <= 10) return 2;
  else if (volume > 0 && volume <= 4) return 1;
  else return 0;
};
export const getFrequencyProgression = (
  sessions: number,
  mesocycles: number
) => {
  const frequencyProgression: number[] = [];

  for (let i = 0; i < mesocycles; i++) {
    let frequency = sessions - i;
    if (sessions === 0) {
      frequency = 0;
    } else if (frequency <= 0) {
      frequency = 1;
    }
    frequencyProgression.unshift(frequency);
  }
  return frequencyProgression;
};
const attachMesocycleFrequencyProgression = (
  muscle: MuscleType,
  volume_landmark: VolumeLandmarkType,
  split_sessions: SplitSessionsType,
  mesocycles: number,
  changeFrequency?: "add" | "subtract"
) => {
  const key = volume_landmark;
  let sessions = 0;

  switch (split_sessions.split) {
    case "OPT":
      const keys = getOPTSplit(muscle);

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

  if (changeFrequency && changeFrequency === "add") {
    sessions = sessions + 1;
  } else if (changeFrequency && changeFrequency === "subtract") {
    sessions = sessions - 1;
  }

  mesoProgression = getFrequencyByVolumeLandmark(
    sessions,
    muscle,
    key,
    mesocycles
  );
  return mesoProgression;
};
export const getFrequencyByVolumeLandmark = (
  sessions: number,
  muscle: MuscleType,
  volume_landmark: VolumeLandmarkType,
  mesocycles: number
) => {
  switch (volume_landmark) {
    case "MRV":
      const mrv = getFrequencyProgression(sessions, mesocycles);
      return mrv;
    case "MEV":
      const sessions_capped = Math.min(
        getMaxFrequencyForMEVMV(muscle, "MEV"),
        sessions
      );
      const mev = getFrequencyProgression(sessions_capped, mesocycles);
      return mev;
    case "MV":
      const sessions_capped_mv = Math.min(
        getMaxFrequencyForMEVMV(muscle, "MV"),
        sessions
      );
      const mv = getFrequencyProgression(sessions_capped_mv, mesocycles);
      return mv;
    default:
      return [];
  }
};

export const onMuscleListReprioritize = (
  reprioritized_muscles: MusclePriorityType[],
  frequency: [number, number],
  breakpoints: [number, number],
  split_sessions: SplitSessionsType,
  mesocycles: number,
  microcycles: number
) => {
  const reordered_list = onReorderUpdateMusclePriorityList(
    reprioritized_muscles,
    breakpoints
  );
  const update_split_sessions = getSplitFromWeights(
    frequency,
    reordered_list,
    split_sessions.split
  );
  const updated_list = onSplitChangeUpdateMusclePriorityList(
    reordered_list,
    update_split_sessions,
    mesocycles,
    microcycles
  );
  return updated_list;
};

export const onVolumeLandmarkChangeHandler = (
  id: MusclePriorityType["id"],
  new_volume_landmark: VolumeLandmarkType,
  muscle_priority_list: MusclePriorityType[],
  volume_breakpoints: [number, number]
) => {
  const list = structuredClone(muscle_priority_list);
  const index = list.findIndex((item) => item.id === id);
  const prev_volume_landmark = list[index].volume.landmark;

  const [removed] = list.splice(index, 1);
  removed.volume.landmark = new_volume_landmark;
  const new_volume_breakpoints = volume_breakpoints;
  switch (new_volume_landmark) {
    case "MRV":
      list.splice(volume_breakpoints[0], 0, removed);
      new_volume_breakpoints[0] = volume_breakpoints[0] + 1;
      return { newList: list, newVolumeBreakpoints: new_volume_breakpoints };
    case "MEV":
      list.splice(volume_breakpoints[1], 0, removed);
      new_volume_breakpoints[1] = volume_breakpoints[1] + 1;
      return { newList: list, newVolumeBreakpoints: new_volume_breakpoints };
    case "MV":
      if (prev_volume_landmark === "MRV") {
        new_volume_breakpoints[0] = new_volume_breakpoints[0] - 1;
      } else {
        new_volume_breakpoints[1] = new_volume_breakpoints[1] - 1;
      }
      list.push(removed);
      return { newList: list, newVolumeBreakpoints: new_volume_breakpoints };
    default:
      return { newList: list, newVolumeBreakpoints: new_volume_breakpoints };
  }
};

export const reorderListByVolumeBreakpoints = (
  muscle_priority_list: MusclePriorityType[]
) => {
  const list = [...muscle_priority_list];
  const mrv = [];
  const mev = [];
  const mv = [];

  for (let i = 0; i < list.length; i++) {
    if (list[i].volume.landmark === "MRV") {
      mrv.push(list[i]);
    } else if (list[i].volume.landmark === "MEV") {
      mev.push(list[i]);
    } else {
      mv.push(list[i]);
    }
  }
  const mrv_breakpoint = mrv.length;
  const mev_breakpoint = mev.length + mrv_breakpoint;
  const newVolumeBreakpoints: [number, number] = [
    mrv_breakpoint,
    mev_breakpoint,
  ];
  const newList = [...mrv, ...mev, ...mv];
  return {
    newList: newList,
    newVolumeBreakpoints: newVolumeBreakpoints,
  };
};
