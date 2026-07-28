/**
 * Session Distribution Utilities (Refactored)
 *
 * This is a refactored version of distributeSessionsIntoSplits.ts that uses
 * the centralized split configuration from ~/constants/splitConfigs.
 *
 * Key improvements:
 * - Uses config-driven approach instead of switch statements
 * - Single generic distribution function instead of 6 separate functions
 * - Cleaner, more maintainable code
 * - Same output format for backward compatibility
 */

import {
  SPLIT_CONFIGS,
  getMuscleCategory,
  type SplitName,
  type SplitSessionType,
} from "~/constants/splitConfigs";
import type { MusclePriority } from "~/store/trainingProgram/types";

// ============================================================================
// Types
// ============================================================================

export type FrequencyMaxes = {
  push: [number, number]; // [rank, maxFrequency]
  pull: [number, number];
  legs: [number, number];
};

export interface SplitSessionsResult {
  split: SplitName;
  sessions: Partial<Record<SplitSessionType, number>>;
}

// ============================================================================
// Main Distribution Function
// ============================================================================

/**
 * Distribute total sessions across split types based on the split configuration.
 *
 * This is the main entry point - it delegates to specific distribution strategies
 * based on the split's distributionStrategy config.
 */
export function distributeSessionsIntoSplits(
  splitType: SplitName,
  totalSessions: number,
  freqLimits: FrequencyMaxes,
  broSessionOrder?: SplitSessionType[]
): SplitSessionsResult {
  const config = SPLIT_CONFIGS[splitType];

  switch (config.distributionStrategy) {
    case "equal":
      return distributeEqual(splitType, totalSessions, config.sessionTypes);

    case "prioritized":
      if (splitType === "BRO") {
        return distributeBro(totalSessions, broSessionOrder);
      }
      return distributePrioritized(splitType, totalSessions, freqLimits);

    case "custom":
      if (splitType === "OPT") {
        return distributeOpt(totalSessions, freqLimits);
      }
      // CUS split - return empty sessions
      return { split: splitType, sessions: {} };

    default:
      return { split: splitType, sessions: {} };
  }
}

// ============================================================================
// Distribution Strategies
// ============================================================================

/**
 * Equal distribution - divide sessions evenly across session types.
 * Used by: FB, UL
 */
function distributeEqual(
  splitType: SplitName,
  totalSessions: number,
  sessionTypes: readonly SplitSessionType[]
): SplitSessionsResult {
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

  // Generic equal distribution for other splits
  const sessionsPerType = Math.floor(totalSessions / sessionTypes.length);
  const remainder = totalSessions % sessionTypes.length;

  const sessions: Partial<Record<SplitSessionType, number>> = {};
  sessionTypes.forEach((type, index) => {
    sessions[type] = sessionsPerType + (index < remainder ? 1 : 0);
  });

  return { split: splitType, sessions };
}

/**
 * Prioritized distribution - distribute based on frequency limits.
 * Used by: PPL, PPLUL
 */
function distributePrioritized(
  splitType: SplitName,
  totalSessions: number,
  freqLimits: FrequencyMaxes
): SplitSessionsResult {
  // Sort by rank (priority) - create mutable copy first
  const prioritized = (["push", "pull", "legs"] as ("push" | "pull" | "legs")[]).sort(
    (a, b) => freqLimits[a][0] - freqLimits[b][0]
  );

  if (splitType === "PPL") {
    return distributePPL(totalSessions, prioritized);
  }

  if (splitType === "PPLUL") {
    return distributePPLUL(totalSessions, prioritized);
  }

  // Fallback for other prioritized splits
  return { split: splitType, sessions: {} };
}

/**
 * PPL distribution: Start with 1 each, add remainder by priority
 */
function distributePPL(
  totalSessions: number,
  prioritized: readonly ("push" | "pull" | "legs")[]
): SplitSessionsResult {
  const sessions = { push: 1, pull: 1, legs: 1 };
  const remainder = totalSessions - 3;

  for (let i = 0; i < remainder; i++) {
    const key = prioritized[i % 3];
    sessions[key]++;
  }

  return { split: "PPL", sessions };
}

/**
 * PPLUL distribution: Start with 1 each (5 total), adjust to match target
 */
function distributePPLUL(
  totalSessions: number,
  prioritized: readonly ("push" | "pull" | "legs")[]
): SplitSessionsResult {
  const sessions = { push: 1, pull: 1, legs: 1, upper: 1, lower: 1 };
  const baseTotal = 5;
  const diff = baseTotal - totalSessions;

  if (diff > 0) {
    // Need to remove sessions - remove from lowest priority
    for (let i = 0; i < diff; i++) {
      const key = prioritized[prioritized.length - 1 - (i % 3)];
      if (sessions[key] > 0) sessions[key]--;
    }
  } else if (diff < 0) {
    // Need to add sessions - add upper/lower based on priority
    const addFirst = prioritized[0] === "legs" ? "lower" : "upper";
    const addSecond = addFirst === "upper" ? "lower" : "upper";

    for (let i = 0; i < Math.abs(diff); i++) {
      sessions[i % 2 === 0 ? addFirst : addSecond]++;
    }
  }

  return { split: "PPLUL", sessions };
}

/**
 * BRO distribution: Start with 1 each, adjust based on muscle priority order
 */
function distributeBro(
  totalSessions: number,
  sessionOrder?: SplitSessionType[]
): SplitSessionsResult {
  const defaultOrder: SplitSessionType[] = [
    "legs",
    "back",
    "chest",
    "arms",
    "shoulders",
  ];
  const order = sessionOrder ?? defaultOrder;

  const sessions: Record<string, number> = {
    back: 1,
    chest: 1,
    legs: 1,
    arms: 1,
    shoulders: 1,
  };

  const baseTotal = 5;
  const diff = totalSessions - baseTotal;

  if (diff === 0) {
    return { split: "BRO", sessions };
  }

  const absVal = Math.abs(diff);
  const operation = diff > 0 ? "add" : "subtract";

  let counter = operation === "add" ? 0 : order.length - 1;
  for (let i = 0; i < absVal; i++) {
    const key = order[counter];
    if (operation === "add") {
      sessions[key]++;
      counter = (counter + 1) % order.length;
    } else {
      if (sessions[key] > 0) sessions[key]--;
      counter = counter - 1 < 0 ? order.length - 1 : counter - 1;
    }
  }

  return { split: "BRO", sessions };
}

/**
 * OPT distribution: Complex basket mutation to combine sessions
 */
function distributeOpt(
  totalSessions: number,
  freqLimits: FrequencyMaxes
): SplitSessionsResult {
  const basket = {
    push: freqLimits.push[1],
    pull: freqLimits.pull[1],
    lower: freqLimits.legs[1],
    upper: 0,
    full: 0,
  };

  const maxIterations = 100;
  let iterations = 0;

  while (getBasketTotal(basket) !== totalSessions && iterations < maxIterations) {
    mutateBasket(basket, totalSessions);
    iterations++;
  }

  return { split: "OPT", sessions: basket };
}

function getBasketTotal(basket: Record<string, number>): number {
  return Object.values(basket).reduce((sum, val) => sum + val, 0);
}

/**
 * Mutate the OPT basket to approach the target total
 */
function mutateBasket(
  basket: Record<string, number>,
  targetTotal: number
): void {
  const currentTotal = getBasketTotal(basket);

  if (currentTotal > targetTotal) {
    // Need to combine/reduce sessions
    if (basket.push > 0 && basket.pull > 0) {
      basket.push--;
      basket.pull--;
      basket.upper++;
    } else if (basket.full < 2 && basket.pull > 0 && basket.lower > 0) {
      basket.pull--;
      basket.lower--;
      basket.full++;
    } else if (basket.full < 2 && basket.push > 0 && basket.lower > 0) {
      basket.push--;
      basket.lower--;
      basket.full++;
    } else if (basket.full < 2 && basket.upper > 0 && basket.lower > 0) {
      basket.upper--;
      basket.lower--;
      basket.full++;
    } else {
      // Remove from largest
      const max = Math.max(basket.push, basket.pull, basket.lower, basket.upper);
      if (basket.lower === max && basket.lower > 0) basket.lower--;
      else if (basket.upper === max && basket.upper > 0) basket.upper--;
      else if (basket.push === max && basket.push > 0) basket.push--;
      else if (basket.pull > 0) basket.pull--;
    }
  } else if (currentTotal < targetTotal) {
    // Need to add sessions
    if (basket.push < 3) basket.push++;
    else if (basket.pull < 3) basket.pull++;
    else if (basket.lower < 3) basket.lower++;
    else basket.upper++;
  }
}

// ============================================================================
// Frequency Calculation
// ============================================================================

/**
 * Calculate frequency limits for push/pull/legs categories based on muscle priorities.
 *
 * This determines how many sessions each category should have based on
 * which muscles are prioritized.
 */
export function calculateFrequencyMaxes(
  musclePriorityList: MusclePriority[],
  breakpoints: [number, number],
  totalSessions: number,
  sampleSize: number = 2
): FrequencyMaxes {
  const tracker: Record<"push" | "pull" | "legs", [number, number, number]> = {
    push: [0, 0, 0], // [rank, totalFreq, count]
    pull: [0, 0, 0],
    legs: [0, 0, 0],
  };

  let rank = 1;

  for (let i = 0; i < musclePriorityList.length; i++) {
    const muscle = musclePriorityList[i];
    const category = getMuscleCategory(muscle.muscle);

    // Assign rank to first muscle in each category
    if (tracker[category][0] === 0) {
      tracker[category][0] = rank++;
    }

    // Accumulate frequency for top muscles in each category
    if (tracker[category][2] < sampleSize) {
      let maxFreq = muscle.frequency.target || muscle.frequency.range[1];

      // For MRV muscles, cap at total sessions
      if (i < breakpoints[0]) {
        const isTopPriority = tracker[category][0] === 1;
        const cappedTotal = isTopPriority ? totalSessions : totalSessions - 1;
        maxFreq = Math.min(
          muscle.frequency.range[1],
          Math.max(muscle.frequency.range[0], cappedTotal)
        );
      }

      if (tracker[category][0] === 1) {
        tracker[category][1] = Math.max(tracker[category][1], maxFreq);
      } else {
        tracker[category][1] += maxFreq;
      }
      tracker[category][2]++;
    }

    // Stop once we have enough samples
    const totalSamples =
      tracker.push[2] + tracker.pull[2] + tracker.legs[2];
    if (totalSamples >= sampleSize * 3) break;
  }

  // Convert to final format
  const freqMaxes: FrequencyMaxes = {
    push: [
      tracker.push[0],
      tracker.push[0] === 1
        ? tracker.push[1]
        : Math.round(tracker.push[1] / sampleSize),
    ],
    pull: [
      tracker.pull[0],
      tracker.pull[0] === 1
        ? tracker.pull[1]
        : Math.round(tracker.pull[1] / sampleSize),
    ],
    legs: [
      tracker.legs[0],
      tracker.legs[0] === 1
        ? tracker.legs[1]
        : Math.round(tracker.legs[1] / sampleSize),
    ],
  };

  // Ensure total doesn't exceed sessions
  const total = freqMaxes.push[1] + freqMaxes.pull[1] + freqMaxes.legs[1];
  if (total < totalSessions) {
    distributeRemainder(freqMaxes, totalSessions - total);
  }

  return freqMaxes;
}

/**
 * Distribute remaining sessions to reach target total
 */
function distributeRemainder(
  freqMaxes: FrequencyMaxes,
  remainder: number
): void {
  const sorted = (["push", "pull", "legs"] as ("push" | "pull" | "legs")[]).sort(
    (a, b) => freqMaxes[a][0] - freqMaxes[b][0]
  );

  for (let i = 0; i < remainder; i++) {
    const key = sorted[i % 3];
    freqMaxes[key][1]++;
  }
}

// ============================================================================
// Legacy Compatibility
// ============================================================================

/**
 * Get potential split types that contain a given session type.
 * Useful for determining valid split transitions.
 */
export function getPotentialSplits(sessionType: SplitSessionType): SplitName[] {
  const result: SplitName[] = [];

  for (const [splitName, config] of Object.entries(SPLIT_CONFIGS)) {
    if (config.sessionTypes.includes(sessionType)) {
      result.push(splitName as SplitName);
    }
  }

  // Always include CUS as it can have any session type
  if (!result.includes("CUS")) {
    result.push("CUS");
  }

  return result;
}