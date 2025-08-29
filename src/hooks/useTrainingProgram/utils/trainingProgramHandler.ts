import { getBroSplit } from "~/constants/workoutSplits";
import {
  BROSessionKeys,
  MusclePriorityType,
  SplitSessionsNameType,
} from "../reducer/trainingProgramReducer";
import {
  distributeSplitsAcrossWeek,
  REST_PERIOD_BY_SPLIT_IN_DAYS,
} from "../types/stateNormalization";
import { setProgressionForExercises } from "./exercises/getExercises";
import {
  attachTargetFrequency,
  onMusclePrioritization,
} from "./prioritized_muscle_list/musclePriorityListHandlers";
import {
  distributeSessionsIntoSplits,
  getFrequencyMaxes,
} from "./split_sessions/distributeSessionsIntoSplits";
import {
  createTrainingBlock,
  getSplitList,
} from "./training_block/createTrainingBlock";
import { distributeSplitAcrossWeek } from "./training_block/distributeSplitAcrossTrainingWeek";
import { initializeTrainingBlock } from "./training_block/trainingBlockHelpers";

export function trainingProgramHandler(
  total_sessions: [number, number],
  split: SplitSessionsNameType,
  muscle_priority_list: MusclePriorityType[],
  mesocycles: number,
  breakpoints: [number, number]
) {
  const total = total_sessions[0] + total_sessions[1];
  const update_items = onMusclePrioritization(
    muscle_priority_list,
    breakpoints,
    total
  );

  const getNGroup = getFrequencyMaxes(
    2, // this will be determined via mrv_breakpoint
    update_items,
    breakpoints,
    total
  );

  const broSplitSorted =
    split === "BRO"
      ? update_items.reduce((acc: BROSessionKeys[], curr) => {
          const split = getBroSplit(curr.muscle);
          if (!acc.includes(split)) return [...acc, split];
          return acc;
        }, [])
      : undefined;

  const new_split_sessions = distributeSessionsIntoSplits(
    split,
    total,
    getNGroup,
    broSplitSorted
  );

  const reordered_items = attachTargetFrequency(
    update_items,
    mesocycles,
    new_split_sessions
  );

  const microcycles = 4;

  const exercisedUp = reordered_items.map((each) => {
    const updated = setProgressionForExercises(each, microcycles);
    return { ...each, exercises: updated };
  });

  const new_training_week = distributeSplitAcrossWeek(
    total,
    new_split_sessions
  );

  const new_training_block = initializeTrainingBlock(
    new_split_sessions,
    exercisedUp,
    new_training_week,
    total,
    mesocycles
  );

  // 07/22/2025 - New code for creating a training block that doesn't incorporate where to put each
  //              split on which day. May need to do that next.
  const split_list = getSplitList(new_split_sessions);
  const create_training_block = createTrainingBlock(
    exercisedUp,
    split_list,
    mesocycles
  );

  const testSplitWeek = distributeSplitsAcrossWeek(
    split_list,
    REST_PERIOD_BY_SPLIT_IN_DAYS
  );

  console.log(
    total_sessions,
    split_list,
    getNGroup,
    reordered_items,
    new_training_week,
    testSplitWeek,
    new_training_block[new_training_block.length - 1],
    create_training_block,
    breakpoints,
    "trainingProgramHandler.ts"
  );

  return {
    frequency: total_sessions,
    split_sessions: new_split_sessions,
    training_block: new_training_block,
    muscle_priority_list: exercisedUp,
    mrv_breakpoint: breakpoints[0],
    mev_breakpoint: breakpoints[1],
  };
}
