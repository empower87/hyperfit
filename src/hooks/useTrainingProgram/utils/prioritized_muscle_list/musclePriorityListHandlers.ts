import { MuscleType } from "~/constants/workoutSplits";
import {
  getTotalExercisesForMuscleGroup,
  initializeSetProgression,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { getMuscleData } from "~/utils/getMuscleData";

import {
  type MusclePriorityType,
  type VolumeLandmarkType,
} from "../../reducer/trainingProgramReducer";
import {
  determineFrequencyByRange,
  determineFrequencyProgression,
} from "./maximumFrequencyHandlers";

export const MUSCLE_PRIORITY_LIST: MusclePriorityType[] = [
  {
    id: "back-002",
    muscle: "back",
    exercises: [],
    volume: {
      landmark: "MRV",
      exercisesPerSessionSchema: 2,
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
    muscle: "delts_side",
    exercises: [],
    volume: {
      landmark: "MRV",
      exercisesPerSessionSchema: 2,
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
    muscle: "triceps",
    exercises: [],
    volume: {
      landmark: "MRV",
      exercisesPerSessionSchema: 1,
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
    muscle: "hamstrings",
    exercises: [],
    volume: {
      landmark: "MRV",
      exercisesPerSessionSchema: 1,
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
    muscle: "quads",
    exercises: [],
    volume: {
      landmark: "MEV",
      exercisesPerSessionSchema: 2,
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
    muscle: "delts_rear",
    exercises: [],
    volume: {
      landmark: "MEV",
      exercisesPerSessionSchema: 1,
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
    muscle: "forearms",
    exercises: [],
    volume: {
      landmark: "MEV",
      exercisesPerSessionSchema: 1,
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
    muscle: "traps",
    exercises: [],
    volume: {
      landmark: "MEV",
      exercisesPerSessionSchema: 1,
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
    muscle: "biceps",
    exercises: [],
    volume: {
      landmark: "MEV",
      exercisesPerSessionSchema: 1,
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
    muscle: "chest",
    exercises: [],
    volume: {
      landmark: "MV",
      exercisesPerSessionSchema: 2,
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
    muscle: "calves",
    exercises: [],
    volume: {
      landmark: "MV",
      exercisesPerSessionSchema: 1,
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
    muscle: "delts_front",
    exercises: [],
    volume: {
      landmark: "MV",
      exercisesPerSessionSchema: 1,
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
    muscle: "abs",
    exercises: [],
    volume: {
      landmark: "MV",
      exercisesPerSessionSchema: 1,
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
    muscle: "glutes",
    exercises: [],
    volume: {
      landmark: "MV",
      exercisesPerSessionSchema: 1,
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

export const attachTargetFrequency = (
  muscle_priority_list: MusclePriorityType[],
  total_sessions: number,
  breakpoints: [number, number]
) => {
  const updated_list = structuredClone(muscle_priority_list);
  for (let i = 0; i < updated_list.length; i++) {
    const muscle = updated_list[i].muscle;
    const landmark = updated_list[i].volume.landmark;
    const exercisesPerSessionSchema =
      updated_list[i].volume.exercisesPerSessionSchema;
    const current_volume_landmark = muscle_priority_list[i].volume.landmark;

    const volume_landmark = getVolumeLandmarkForMuscle(
      i,
      current_volume_landmark,
      breakpoints
    );
    const target = determineFrequencyByRange(
      updated_list[i].frequency.range,
      i,
      breakpoints,
      total_sessions
    );
    const frequencyProgression = determineFrequencyProgression(3, target);
    const setProgressionTEST = initializeSetProgression(
      frequencyProgression,
      32,
      updated_list[i].muscle
    );
    const exercises = getTotalExercisesForMuscleGroup(
      muscle,
      landmark,
      frequencyProgression,
      exercisesPerSessionSchema
    );

    updated_list[i].volume.landmark = volume_landmark;
    updated_list[i].frequency.target = target;
    updated_list[i].frequency.progression = frequencyProgression;
    updated_list[i].frequency.setProgression = setProgressionTEST;
    updated_list[i].exercises = exercises;
  }
  return updated_list;
};

// NOTE: updates on SPLIT_SESSIONS change or MUSCLE_PRIORITY_LIST change

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

const getFrequencyByVolumeLandmark = (
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

const onVolumeLandmarkChangeHandler = (
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