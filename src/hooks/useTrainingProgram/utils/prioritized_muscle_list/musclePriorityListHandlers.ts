import { getMusclesMaxFrequency } from "~/constants/workoutSplits";
import {
  getTotalExercisesFromSetMatrix,
  initializeSetProgression,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { getMuscleData } from "~/utils/getMuscleData";

import {
  SplitSessionsType,
  type MusclePriorityType,
} from "../../reducer/trainingProgramReducer";
import {
  determineFrequencyByRange,
  getFrequencyRange,
  initFrequencyProgressionAcrossMesocycles,
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
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
      setProgressionMatrix: [],
    },
  },
];

// NOTE: updates only on REORDERING of list or changing MEV/MRV BREAKPOINT
export const getVolumeLandmarkForMuscle = (
  index: number,
  volume_breakpoints: [number, number]
) => {
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

export const onMusclePrioritization = (
  muscle_priority_list: MusclePriorityType[],
  breakpoints: [number, number],
  total_sessions: number
) => {
  const updated_list = structuredClone(muscle_priority_list);

  for (let i = 0; i < updated_list.length; i++) {
    const muscle = updated_list[i].muscle;
    const volume_landmark = getVolumeLandmarkForMuscle(i, breakpoints);

    const frequency_range = getFrequencyRange(
      muscle,
      volume_landmark,
      updated_list[i].frequency.range
    );

    const target = determineFrequencyByRange(
      frequency_range,
      i,
      breakpoints,
      total_sessions
    );
    updated_list[i].volume.landmark = volume_landmark;
    updated_list[i].frequency.target = target;
  }
  return updated_list;
};

export const attachTargetFrequency = (
  muscle_priority_list: MusclePriorityType[],
  mesocycles: number,
  split_sessions: SplitSessionsType
) => {
  const updated_list = structuredClone(muscle_priority_list);

  for (let i = 0; i < updated_list.length; i++) {
    const muscle = updated_list[i].muscle;
    const muscleData = getMuscleData(muscle);
    const exercisesPerSessionSchema =
      updated_list[i].volume.exercisesPerSessionSchema;
    const volume_landmark = updated_list[i].volume.landmark;
    let target = updated_list[i].frequency.target;

    const readjusted_target = getMusclesMaxFrequency(split_sessions, muscle);

    target = Math.min(target, readjusted_target);

    const frequencyProgression = initFrequencyProgressionAcrossMesocycles(
      mesocycles,
      target
    );

    const setProgressionMatrix = initializeSetProgression(
      volume_landmark,
      frequencyProgression,
      volume_landmark !== "MRV"
        ? muscleData[volume_landmark]
        : exercisesPerSessionSchema
    );

    console.log(
      muscle,
      split_sessions,
      target,
      frequencyProgression,
      "THESE KINDA SHOULD BE THE SAME I THINK"
    );

    const exercises = getTotalExercisesFromSetMatrix(
      muscle,
      volume_landmark,
      setProgressionMatrix,
      frequencyProgression
    );

    updated_list[i].frequency.progression = frequencyProgression;
    updated_list[i].frequency.setProgressionMatrix = setProgressionMatrix;
    updated_list[i].exercises = exercises;
  }
  return updated_list;
};

export const reorganizePriorityListByVolumeLandmark = (
  muscle_priority_list: MusclePriorityType[]
) => {
  return muscle_priority_list.sort((a, b) => {
    if (a.volume.landmark === "MRV" && b.volume.landmark === "MEV") {
      return -1;
    } else if (a.volume.landmark === "MEV" && b.volume.landmark === "MRV") {
      return 1;
    } else if (a.volume.landmark === "MEV" && b.volume.landmark === "MV") {
      return -1;
    } else if (a.volume.landmark === "MV" && b.volume.landmark === "MEV") {
      return 1;
    } else if (a.volume.landmark === "MRV" && b.volume.landmark === "MV") {
      return -1;
    } else if (a.volume.landmark === "MV" && b.volume.landmark === "MRV") {
      return 1;
    } else {
      return 0;
    }
  });
};

export const getBreakpointsByMusclePriorityList = (
  muscle_priority_list: MusclePriorityType[]
) => {
  const breakpoints: [number, number] = [0, 0];
  muscle_priority_list.forEach((item) => {
    switch (item.volume.landmark) {
      case "MRV":
        breakpoints[0] = breakpoints[0] + 1;
        breakpoints[1] = breakpoints[0];
        break;
      case "MEV":
        breakpoints[1] = breakpoints[1] + 1;
        break;
      default:
        break;
    }
  });
  return breakpoints;
};
