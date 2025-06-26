import { getMusclesMaxFrequency } from "~/constants/workoutSplits";
import {
  getExercises,
  getInitialMicrocycleFromVolume,
  getInitialMicrocyclesFromFinalMicrocycle,
  getTotalExercisesFromSetMatrix,
  initializeSetProgression,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { getJSONMuscle, getMuscleData } from "~/utils/getMuscleData";

import {
  SplitSessionsType,
  type MusclePriorityType,
} from "../../reducer/trainingProgramReducer";
import { getPlaceholderExerciseLayout } from "../exercises/exercisePlaceholders";
import {
  accumulateFinalMicrocycleSets,
  ProgressionMethodType,
} from "../exercises/repsAndWeightProgression";
import {
  determineFrequencyByRange,
  getFrequencyRange,
  initFrequencyProgressionAcrossMesocycles,
} from "./maximumFrequencyHandlers";
import { allowable_muscles_per_split, assignExercises, returnSessionSplits } from "../../types/stateNormalization";

export const MUSCLE_PRIORITY_LIST: MusclePriorityType[] = [
  {
    id: "back-002",
    muscle: "back",
    exercises: [],
    volume: {
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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
      range: [12, 20],
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

const DEFAULT_PROGRESSIVE_OVERLOAD_METHOD: ProgressionMethodType = "TRIPLE";
export const onMusclePrioritization = (
  muscle_priority_list: MusclePriorityType[],
  breakpoints: [number, number],
  total_sessions: number
) => {
  const updated_list = muscle_priority_list;
  // const updated_list = structuredClone(muscle_priority_list);

  for (let i = 0; i < updated_list.length; i++) {
    const muscle = updated_list[i].muscle;
    const volume_landmark = getVolumeLandmarkForMuscle(i, breakpoints);
    const muscle_json = getJSONMuscle(muscle);

    const total_volume_range =
      DEFAULT_PROGRESSIVE_OVERLOAD_METHOD === "TRIPLE"
        ? muscle_json.volume[volume_landmark]
        : [12, 20];

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
    updated_list[i].volume.range = total_volume_range;
  }
  return updated_list;
};

export const attachTargetFrequency = (
  muscle_priority_list: MusclePriorityType[],
  mesocycles: number,
  split_sessions: SplitSessionsType
) => {
  const updated_list = muscle_priority_list;
  // const updated_list = structuredClone(muscle_priority_list);

  for (let i = 0; i < updated_list.length; i++) {
    const muscle = updated_list[i];
    const muscle_name = muscle.muscle;
    const exercisesPerSessionSchema = muscle.volume.exercisesPerSessionSchema;
    const volume_landmark = muscle.volume.landmark;
    const volume_range = muscle.volume.range;

    const muscleData = getMuscleData(muscle_name);
    const muscle_data = getJSONMuscle(muscle_name);
    const volume_range_from_json = muscle_data.volume[volume_landmark];
    const ex_per_session_range = muscle_data.exercises.variationPerSessionRange;
    const ex_per_week_range = muscle_data.exercises.variationPerWeekRange;

    const readjusted_target = getMusclesMaxFrequency(
      split_sessions,
      muscle_name
    );

    let target = muscle.frequency.target;
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

    const ideal_sets = getPlaceholderExerciseLayout(
      ex_per_session_range,
      target,
      volume_range,
      muscle_name
    );

    const microcycles = 4;
    const initial_sets = getInitialMicrocycleFromVolume(
      volume_range[1],
      microcycles,
      frequencyProgression[frequencyProgression.length - 1],
      ideal_sets
    );
    const all_sets = getInitialMicrocyclesFromFinalMicrocycle(
      frequencyProgression,
      initial_sets
    );

    const ideal_sets_filtered = ideal_sets.filter((set) => set.length > 0);
    const test_final_week_sets = accumulateFinalMicrocycleSets(
      muscle.volume.range,
      ideal_sets_filtered
    );
    const exursizes = getExercises(
      muscle_name,
      volume_range[1],
      ideal_sets,
      ex_per_week_range[0],
      ex_per_week_range[1]
    );

    console.log(
      muscle_name,
      split_sessions,
      target,
      ex_per_session_range,
      muscle.volume.range,
      volume_range_from_json,
      frequencyProgression,
      ideal_sets,
      ideal_sets_filtered,
      test_final_week_sets,
      initial_sets,
      all_sets,
      "FUNCTION: attachTargetFrequency => musclePriorityListHandlers.ts"
    );

    const exercises = getTotalExercisesFromSetMatrix(
      muscle,
      setProgressionMatrix
    );

    updated_list[i].frequency.progression = frequencyProgression;
    updated_list[i].frequency.setProgressionMatrix = setProgressionMatrix;
    updated_list[i].exercises = exercises;
  }
  
    // ChatGPT code testing
    const split_list = returnSessionSplits(
      split_sessions)

    const sessions_set = assignExercises(
      updated_list,
      split_list,
      allowable_muscles_per_split,
      mesocycles,
    )
    console.log(split_list,split_sessions, sessions_set,  "FUNCTION: attachTargetFrequency TESTS => musclePriorityListHandlers.ts");
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
