import { getBroSplit } from "~/constants/workoutSplits";
import {
  BROSessionKeys,
  MusclePriorityType,
  SplitSessionsNameType,
} from "../reducer/trainingProgramReducer";
import {
  attachTargetFrequency,
  onMusclePrioritization,
} from "./prioritized_muscle_list/musclePriorityListHandlers";
import {
  distributeSessionsIntoSplits,
  getFrequencyMaxes,
} from "./split_sessions/distributeSessionsIntoSplits";
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
  const volume_breakpoints: [number, number] = [...breakpoints];
  const update_items = onMusclePrioritization(
    muscle_priority_list,
    volume_breakpoints,
    total
  );

  const getNGroup = getFrequencyMaxes(
    2, // this will be determined via mrv_breakpoint
    update_items,
    volume_breakpoints,
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

  const new_training_week = distributeSplitAcrossWeek(
    total,
    new_split_sessions
  );

  const new_training_block = initializeTrainingBlock(
    new_split_sessions,
    reordered_items,
    new_training_week,
    total,
    mesocycles
  );

  console.log(
    total_sessions,
    getNGroup,
    reordered_items,
    new_training_week,
    new_training_block[new_training_block.length - 1],
    breakpoints,
    volume_breakpoints,
    "WTF IS GOING OON HERE??"
  );

  return {
    frequency: total_sessions,
    split_sessions: new_split_sessions,
    training_block: new_training_block,
    muscle_priority_list: reordered_items,
    mrv_breakpoint: volume_breakpoints[0],
    mev_breakpoint: volume_breakpoints[1],
  };
}
