/**
 * Memoized selectors for the Training Program state.
 *
 * These selectors compute derived state from the core inputs:
 * - Split sessions distribution
 * - Muscle priority list with computed frequencies
 * - Training block structure
 *
 * Using createSelector from RTK ensures these only recompute
 * when their input selectors return new values.
 */

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type {
  MusclePriority,
  TrainingProgramState,
  VolumeLandmarkType,
  SplitSessions,
  TrainingDay,
  Session,
} from "./types";
import {
  SPLIT_CONFIGS,
  getMuscleCategory,
  getNextSessionOrder,
  getOffDayIndices,
  type SplitName,
  type SplitSessionType,
} from "~/constants/splitConfigs";

// ============================================================================
// Base Selectors (direct state access)
// ============================================================================

export const selectTrainingProgramState = (state: RootState) =>
  state.trainingProgram;

export const selectFrequency = (state: RootState) =>
  state.trainingProgram.frequency;

export const selectSplitType = (state: RootState) =>
  state.trainingProgram.splitType;

export const selectBreakpoints = (state: RootState) =>
  state.trainingProgram.breakpoints;

export const selectMusclePriorityOrder = (state: RootState) =>
  state.trainingProgram.musclePriorityOrder;

export const selectMuscles = (state: RootState) =>
  state.trainingProgram.muscles;

export const selectProgramParams = (state: RootState) =>
  state.trainingProgram.programParams;

export const selectIsInitialized = (state: RootState) =>
  state.trainingProgram.isInitialized;

// Cached derived state (when we don't want to recompute)
export const selectCachedSplitSessions = (state: RootState) =>
  state.trainingProgram.splitSessions;

export const selectCachedTrainingBlock = (state: RootState) =>
  state.trainingProgram.trainingBlock;

// ============================================================================
// Derived Selectors (computed values)
// ============================================================================

/**
 * Total training sessions per week
 */
export const selectTotalSessions = createSelector(
  [selectFrequency],
  (frequency) => frequency[0] + frequency[1]
);

/**
 * Number of training days per week
 */
export const selectTrainingDays = createSelector(
  [selectFrequency],
  (frequency) => frequency[0]
);

/**
 * Get volume landmark for a muscle based on its index in the priority list
 */
export function getVolumeLandmark(
  index: number,
  breakpoints: [number, number]
): VolumeLandmarkType {
  if (index < breakpoints[0]) return "MRV";
  if (index < breakpoints[1]) return "MEV";
  return "MV";
}

/**
 * Muscle priority list in order with computed volume landmarks.
 * This is the "enhanced" list that includes computed properties.
 */
export const selectMusclePriorityList = createSelector(
  [selectMusclePriorityOrder, selectMuscles, selectBreakpoints],
  (order, muscles, breakpoints): MusclePriority[] => {
    return order.map((id, index) => {
      const muscle = muscles[id];
      if (!muscle) {
        throw new Error(`Muscle with id ${id} not found`);
      }

      // Compute volume landmark based on position
      const landmark = getVolumeLandmark(index, breakpoints);

      return {
        ...muscle,
        volume: {
          ...muscle.volume,
          landmark,
        },
      };
    });
  }
);

/**
 * Calculate frequency limits for each PPL category.
 * Returns the maximum frequency for push, pull, and legs based on muscle priorities.
 */
export const selectFrequencyMaxes = createSelector(
  [selectMusclePriorityList, selectBreakpoints, selectTrainingDays],
  (musclePriorityList, breakpoints, totalSessions) => {
    const tracker: Record<"push" | "pull" | "legs", [number, number, number]> =
      {
        push: [0, 0, 0], // [rank, total, count]
        pull: [0, 0, 0],
        legs: [0, 0, 0],
      };

    const many = 2; // Number of top muscles to consider per category
    let rank = 1;

    for (let i = 0; i < musclePriorityList.length; i++) {
      const muscle = musclePriorityList[i];
      const category = getMuscleCategory(muscle.muscle);

      // Assign rank (first muscle in each category gets priority)
      if (tracker[category][0] === 0) {
        tracker[category][0] = rank++;
      }

      // Accumulate frequency targets for top muscles
      if (tracker[category][2] < many) {
        let maxFreq = muscle.frequency.target || muscle.frequency.range[1];

        // For MRV muscles, cap at total sessions
        if (i < breakpoints[0]) {
          const isTopPriority = tracker[category][0] === 1;
          const cappedFreq = isTopPriority ? totalSessions : totalSessions - 1;
          maxFreq = Math.min(
            muscle.frequency.range[1],
            Math.max(muscle.frequency.range[0], cappedFreq)
          );
        }

        if (tracker[category][0] === 1) {
          tracker[category][1] = Math.max(tracker[category][1], maxFreq);
        } else {
          tracker[category][1] += maxFreq;
        }
        tracker[category][2]++;
      }

      // Stop once we have enough data
      if (tracker.push[2] + tracker.pull[2] + tracker.legs[2] >= many * 3) {
        break;
      }
    }

    // Convert to final format: [rank, maxFrequency]
    return {
      push: [
        tracker.push[0],
        tracker.push[0] === 1
          ? tracker.push[1]
          : Math.round(tracker.push[1] / many),
      ] as [number, number],
      pull: [
        tracker.pull[0],
        tracker.pull[0] === 1
          ? tracker.pull[1]
          : Math.round(tracker.pull[1] / many),
      ] as [number, number],
      legs: [
        tracker.legs[0],
        tracker.legs[0] === 1
          ? tracker.legs[1]
          : Math.round(tracker.legs[1] / many),
      ] as [number, number],
    };
  }
);

/**
 * Distribute sessions across split types based on frequency limits.
 */
export const selectSplitSessions = createSelector(
  [selectSplitType, selectTrainingDays, selectFrequencyMaxes],
  (splitType, totalSessions, freqLimits): SplitSessions => {
    const config = SPLIT_CONFIGS[splitType];

    if (splitType === "FB") {
      return {
        split: splitType,
        sessions: { full: totalSessions },
      };
    }

    if (splitType === "UL") {
      return {
        split: splitType,
        sessions: {
          upper: Math.floor(totalSessions / 2),
          lower: Math.ceil(totalSessions / 2),
        },
      };
    }

    if (splitType === "PPL") {
      return distributePPL(totalSessions, freqLimits);
    }

    if (splitType === "PPLUL") {
      return distributePPLUL(totalSessions, freqLimits);
    }

    if (splitType === "OPT") {
      return distributeOPT(totalSessions, freqLimits);
    }

    if (splitType === "BRO") {
      return distributeBRO(totalSessions);
    }

    // CUS or fallback
    return {
      split: splitType,
      sessions: {},
    };
  }
);

/**
 * Distribute PPL sessions
 */
function distributePPL(
  totalSessions: number,
  freqLimits: Record<"push" | "pull" | "legs", [number, number]>
): SplitSessions {
  const prioritized = (
    Object.keys(freqLimits) as ("push" | "pull" | "legs")[]
  ).sort((a, b) => freqLimits[a][0] - freqLimits[b][0]);

  const sessions: Record<"push" | "pull" | "legs", number> = {
    push: 1,
    pull: 1,
    legs: 1,
  };

  const remainder = totalSessions - 3;
  for (let i = 0; i < remainder; i++) {
    const key = prioritized[i % 3];
    sessions[key]++;
  }

  return { split: "PPL", sessions };
}

/**
 * Distribute PPLUL sessions
 */
function distributePPLUL(
  totalSessions: number,
  freqLimits: Record<"push" | "pull" | "legs", [number, number]>
): SplitSessions {
  const prioritized = (
    Object.keys(freqLimits) as ("push" | "pull" | "legs")[]
  ).sort((a, b) => freqLimits[a][0] - freqLimits[b][0]);

  const sessions = { push: 1, pull: 1, legs: 1, upper: 1, lower: 1 };
  const total = 5;
  const diff = total - totalSessions;

  if (diff > 0) {
    // Remove sessions from lowest priority
    for (let i = 0; i < diff; i++) {
      const key = prioritized[prioritized.length - 1 - i];
      if (sessions[key] > 0) sessions[key]--;
    }
  } else if (diff < 0) {
    // Add upper/lower sessions
    const addTracker = prioritized[0] === "legs" ? "lower" : "upper";
    for (let i = 0; i < Math.abs(diff); i++) {
      sessions[i % 2 === 0 ? addTracker : addTracker === "upper" ? "lower" : "upper"]++;
    }
  }

  return { split: "PPLUL", sessions };
}

/**
 * Distribute OPT sessions (complex basket mutation)
 */
function distributeOPT(
  totalSessions: number,
  freqLimits: Record<"push" | "pull" | "legs", [number, number]>
): SplitSessions {
  const basket = {
    push: freqLimits.push[1],
    pull: freqLimits.pull[1],
    lower: freqLimits.legs[1],
    upper: 0,
    full: 0,
  };

  // Mutate basket to match total sessions
  let iterations = 0;
  const maxIterations = 100;

  while (
    basket.full + basket.lower + basket.upper + basket.push + basket.pull !==
      totalSessions &&
    iterations < maxIterations
  ) {
    const total =
      basket.full + basket.lower + basket.upper + basket.push + basket.pull;

    if (total > totalSessions) {
      // Need to combine sessions
      if (basket.push > 0 && basket.pull > 0) {
        basket.push--;
        basket.pull--;
        basket.upper++;
      } else if (basket.full < 2 && basket.upper > 0 && basket.lower > 0) {
        basket.upper--;
        basket.lower--;
        basket.full++;
      } else {
        // Remove from largest
        const max = Math.max(
          basket.push,
          basket.pull,
          basket.lower,
          basket.upper
        );
        if (basket.lower === max) basket.lower--;
        else if (basket.upper === max) basket.upper--;
        else if (basket.push === max) basket.push--;
        else basket.pull--;
      }
    } else {
      // Need to add sessions - add to priority order
      if (basket.push < freqLimits.push[1]) basket.push++;
      else if (basket.pull < freqLimits.pull[1]) basket.pull++;
      else if (basket.lower < freqLimits.legs[1]) basket.lower++;
      else basket.upper++;
    }
    iterations++;
  }

  return { split: "OPT", sessions: basket };
}

/**
 * Distribute BRO split sessions
 */
function distributeBRO(totalSessions: number): SplitSessions {
  const sessions = { back: 1, chest: 1, legs: 1, arms: 1, shoulders: 1 };
  const keys = ["legs", "back", "chest", "arms", "shoulders"] as const;
  const diff = totalSessions - 5;

  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      sessions[keys[i % 5]]++;
    }
  } else if (diff < 0) {
    for (let i = 0; i < Math.abs(diff); i++) {
      const key = keys[keys.length - 1 - (i % 5)];
      if (sessions[key] > 0) sessions[key]--;
    }
  }

  return { split: "BRO", sessions };
}

/**
 * Create the training week structure with sessions distributed across days.
 */
export const selectTrainingWeek = createSelector(
  [selectTrainingDays, selectSplitSessions, selectSplitType],
  (trainingDays, splitSessions, splitType): TrainingDay[] => {
    const offDays = 7 - trainingDays;
    const offDayIndices = getOffDayIndices(offDays);

    const days: TrainingDay[] = [
      { day: "Sunday", isTrainingDay: true, sessions: [] },
      { day: "Monday", isTrainingDay: true, sessions: [] },
      { day: "Tuesday", isTrainingDay: true, sessions: [] },
      { day: "Wednesday", isTrainingDay: true, sessions: [] },
      { day: "Thursday", isTrainingDay: true, sessions: [] },
      { day: "Friday", isTrainingDay: true, sessions: [] },
      { day: "Saturday", isTrainingDay: true, sessions: [] },
    ];

    // Mark off days
    offDayIndices.forEach((idx) => {
      days[idx].isTrainingDay = false;
    });

    // Track remaining sessions for each type
    const remaining = new Map<string, number>(
      Object.entries(splitSessions.sessions)
    );

    let lastSplit = "";

    for (let i = 0; i < days.length; i++) {
      if (days[i].isTrainingDay) {
        const order = getNextSessionOrder(splitType, lastSplit);

        // Find next available session type
        let nextSplit: string | null = null;
        for (const split of order) {
          if ((remaining.get(split) ?? 0) > 0) {
            nextSplit = split;
            break;
          }
        }

        if (nextSplit) {
          const session: Session = {
            id: `${i}_${nextSplit}_session`,
            split: nextSplit as SplitSessionType,
            exercises: [],
          };

          days[i].sessions.push(session);
          remaining.set(nextSplit, (remaining.get(nextSplit) ?? 1) - 1);
          lastSplit = nextSplit;
        }
      } else {
        const session: Session = {
          id: `${i}_off_session`,
          split: "off",
          exercises: [],
        };
        days[i].sessions.push(session);
        lastSplit = "off";
      }
    }

    return days;
  }
);

/**
 * Select muscle by ID
 */
export const selectMuscleById = (muscleId: string) =>
  createSelector([selectMuscles], (muscles) => muscles[muscleId]);

/**
 * Select muscles grouped by volume landmark
 */
export const selectMusclesByLandmark = createSelector(
  [selectMusclePriorityList],
  (muscles) => {
    const grouped: Record<VolumeLandmarkType, MusclePriority[]> = {
      MRV: [],
      MEV: [],
      MV: [],
    };

    muscles.forEach((muscle) => {
      grouped[muscle.volume.landmark].push(muscle);
    });

    return grouped;
  }
);

/**
 * Get the number of mesocycles
 */
export const selectMesocycles = createSelector(
  [selectProgramParams],
  (params) => params.mesocycles
);

/**
 * Create a complete state snapshot for compatibility with existing code
 */
export const selectLegacyState = createSelector(
  [
    selectFrequency,
    selectProgramParams,
    selectMusclePriorityList,
    selectCachedTrainingBlock,
    selectCachedSplitSessions,
    selectBreakpoints,
  ],
  (
    frequency,
    programParams,
    musclePriorityList,
    trainingBlock,
    splitSessions,
    breakpoints
  ) => ({
    frequency,
    training_program_params: programParams,
    muscle_priority_list: musclePriorityList,
    training_block: trainingBlock,
    split_sessions: {
      split: splitSessions.split,
      sessions: splitSessions.sessions,
    },
    mrv_breakpoint: breakpoints[0],
    mev_breakpoint: breakpoints[1],
  })
);