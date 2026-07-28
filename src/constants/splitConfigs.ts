/**
 * Centralized configuration for all workout split types.
 *
 * This file consolidates split-specific logic that was previously scattered across:
 * - workoutSplits.ts (muscle mappings)
 * - distributeSessionsIntoSplits.ts (session distribution)
 * - distributeSplitAcrossTrainingWeek.ts (weekly ordering)
 *
 * Each split type is fully defined by its configuration, enabling
 * generic functions to handle all splits without switch statements.
 */

import type { MuscleType } from "./workoutSplits";

// ============================================================================
// Types
// ============================================================================

export type SplitSessionType =
  | "push"
  | "pull"
  | "legs"
  | "upper"
  | "lower"
  | "full"
  | "chest"
  | "back"
  | "arms"
  | "shoulders";

export type SplitName = "PPL" | "PPLUL" | "UL" | "FB" | "OPT" | "BRO" | "CUS";

export interface SplitConfig {
  /** Display name for the split */
  name: string;

  /** Session types used by this split (e.g., ['push', 'pull', 'legs']) */
  sessionTypes: SplitSessionType[];

  /** Minimum number of sessions required for this split */
  minSessions: number;

  /** Maximum recommended sessions for this split */
  maxSessions: number;

  /** Maps each session type to the muscles trained in that session */
  muscleMapping: Partial<Record<SplitSessionType, readonly MuscleType[]>>;

  /**
   * Defines the preferred next session given the previous session.
   * Used for distributing sessions across the week.
   * Key: previous session type (or "default" for first session)
   * Value: array of session types in priority order
   */
  sessionOrdering: Record<string, SplitSessionType[]>;

  /**
   * How to distribute total sessions across session types.
   * - "equal": Distribute as evenly as possible
   * - "prioritized": Use frequency limits from muscle priority
   * - "custom": Split-specific distribution logic
   */
  distributionStrategy: "equal" | "prioritized" | "custom";
}

// ============================================================================
// Muscle Group Constants
// ============================================================================

export const MUSCLE_GROUPS = {
  UPPER: [
    "traps",
    "delts_front",
    "delts_side",
    "delts_rear",
    "biceps",
    "triceps",
    "chest",
    "back",
    "forearms",
  ] as const,

  LOWER: ["glutes", "quads", "hamstrings", "calves"] as const,

  PUSH: ["chest", "triceps", "delts_front"] as const,

  PULL: ["back", "biceps", "delts_rear", "forearms"] as const,

  LEGS: ["glutes", "quads", "hamstrings", "calves"] as const,

  FULL: [
    "abs",
    "back",
    "biceps",
    "calves",
    "chest",
    "delts_front",
    "delts_rear",
    "delts_side",
    "forearms",
    "glutes",
    "hamstrings",
    "quads",
    "traps",
    "triceps",
  ] as const,

  // BRO split specific
  CHEST: ["chest"] as const,
  BACK: ["back"] as const,
  ARMS: ["biceps", "triceps", "forearms"] as const,
  SHOULDERS: ["delts_side", "delts_rear", "delts_front", "traps"] as const,

  // Muscles that can go in multiple splits
  FLEXIBLE: ["delts_side", "traps", "abs", "forearms"] as const,
} as const;

// ============================================================================
// Split Configurations
// ============================================================================

export const SPLIT_CONFIGS: Record<SplitName, SplitConfig> = {
  PPL: {
    name: "Push/Pull/Legs",
    sessionTypes: ["push", "pull", "legs"],
    minSessions: 3,
    maxSessions: 6,
    muscleMapping: {
      push: [...MUSCLE_GROUPS.PUSH, "delts_side"],
      pull: [...MUSCLE_GROUPS.PULL, "traps"],
      legs: [...MUSCLE_GROUPS.LEGS, "abs"],
    },
    sessionOrdering: {
      default: ["push", "legs", "pull"],
      push: ["legs", "pull", "push"],
      pull: ["legs", "push", "pull"],
      legs: ["pull", "push", "legs"],
    },
    distributionStrategy: "prioritized",
  },

  UL: {
    name: "Upper/Lower",
    sessionTypes: ["upper", "lower"],
    minSessions: 2,
    maxSessions: 6,
    muscleMapping: {
      upper: [...MUSCLE_GROUPS.UPPER],
      lower: [...MUSCLE_GROUPS.LOWER, "abs"],
    },
    sessionOrdering: {
      default: ["lower", "upper"],
      upper: ["lower", "upper"],
      lower: ["upper", "lower"],
    },
    distributionStrategy: "equal",
  },

  PPLUL: {
    name: "Push/Pull/Legs + Upper/Lower",
    sessionTypes: ["push", "pull", "legs", "upper", "lower"],
    minSessions: 5,
    maxSessions: 7,
    muscleMapping: {
      push: [...MUSCLE_GROUPS.PUSH],
      pull: [...MUSCLE_GROUPS.PULL],
      legs: [...MUSCLE_GROUPS.LEGS],
      upper: [...MUSCLE_GROUPS.UPPER],
      lower: [...MUSCLE_GROUPS.LOWER, "abs"],
    },
    sessionOrdering: {
      default: ["push", "lower", "upper", "legs", "pull"],
      push: ["legs", "lower", "pull", "upper", "push"],
      pull: ["lower", "upper", "legs", "push", "pull"],
      legs: ["pull", "upper", "push", "lower", "legs"],
      upper: ["lower", "legs", "push", "pull", "upper"],
      lower: ["upper", "push", "pull", "legs", "lower"],
    },
    distributionStrategy: "prioritized",
  },

  FB: {
    name: "Full Body",
    sessionTypes: ["full"],
    minSessions: 2,
    maxSessions: 5,
    muscleMapping: {
      full: [...MUSCLE_GROUPS.FULL],
    },
    sessionOrdering: {
      default: ["full"],
      full: ["full"],
    },
    distributionStrategy: "equal",
  },

  OPT: {
    name: "Optimized",
    sessionTypes: ["push", "pull", "upper", "lower", "full"],
    minSessions: 3,
    maxSessions: 7,
    muscleMapping: {
      push: [...MUSCLE_GROUPS.PUSH, "delts_side", "traps"],
      pull: [...MUSCLE_GROUPS.PULL, "delts_side", "traps"],
      upper: [...MUSCLE_GROUPS.UPPER],
      lower: [...MUSCLE_GROUPS.LOWER, "abs"],
      full: [...MUSCLE_GROUPS.FULL],
    },
    sessionOrdering: {
      default: ["lower", "upper", "push", "pull", "full"],
      upper: ["push", "pull", "full", "lower", "upper"],
      lower: ["push", "pull", "full", "upper", "lower"],
      full: ["push", "pull", "full", "upper", "lower"],
      push: ["lower", "pull", "full", "upper", "push"],
      pull: ["lower", "push", "full", "upper", "pull"],
    },
    distributionStrategy: "custom",
  },

  BRO: {
    name: "Bro Split",
    sessionTypes: ["chest", "back", "legs", "arms", "shoulders"],
    minSessions: 5,
    maxSessions: 7,
    muscleMapping: {
      chest: [...MUSCLE_GROUPS.CHEST],
      back: [...MUSCLE_GROUPS.BACK],
      legs: [...MUSCLE_GROUPS.LEGS, "abs"],
      arms: [...MUSCLE_GROUPS.ARMS],
      shoulders: [...MUSCLE_GROUPS.SHOULDERS],
    },
    sessionOrdering: {
      default: ["legs", "back", "chest", "arms", "shoulders"],
      legs: ["shoulders", "arms", "chest", "back", "legs"],
      back: ["shoulders", "arms", "chest", "legs", "back"],
      chest: ["shoulders", "arms", "back", "legs", "chest"],
      arms: ["shoulders", "legs", "back", "chest", "arms"],
      shoulders: ["legs", "back", "chest", "arms", "shoulders"],
    },
    distributionStrategy: "prioritized",
  },

  CUS: {
    name: "Custom",
    sessionTypes: [],
    minSessions: 1,
    maxSessions: 7,
    muscleMapping: {},
    sessionOrdering: {
      default: [],
    },
    distributionStrategy: "custom",
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the split configuration for a given split name
 */
export function getSplitConfig(splitName: SplitName): SplitConfig {
  return SPLIT_CONFIGS[splitName];
}

/**
 * Get all muscles that can be trained in a given session type
 */
export function getMusclesForSession(
  splitName: SplitName,
  sessionType: SplitSessionType
): readonly MuscleType[] {
  const config = SPLIT_CONFIGS[splitName];
  return config.muscleMapping[sessionType] ?? [];
}

/**
 * Get all session types that can train a given muscle in a specific split
 */
export function getSessionsForMuscle(
  splitName: SplitName,
  muscle: MuscleType
): SplitSessionType[] {
  const config = SPLIT_CONFIGS[splitName];
  const sessions: SplitSessionType[] = [];

  for (const [sessionType, muscles] of Object.entries(config.muscleMapping)) {
    if (muscles && muscles.includes(muscle)) {
      sessions.push(sessionType as SplitSessionType);
    }
  }

  return sessions;
}

/**
 * Get the next session type based on the previous session
 */
export function getNextSessionOrder(
  splitName: SplitName,
  previousSession: string
): SplitSessionType[] {
  const config = SPLIT_CONFIGS[splitName];
  return (
    config.sessionOrdering[previousSession] ??
    config.sessionOrdering["default"] ??
    []
  );
}

/**
 * Get the primary session type for a muscle in a given split.
 * Returns the first matching session type based on priority.
 */
export function getPrimarySessionForMuscle(
  splitName: SplitName,
  muscle: MuscleType
): SplitSessionType | null {
  const sessions = getSessionsForMuscle(splitName, muscle);
  return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Check if a split supports a given number of sessions
 */
export function isValidSessionCount(
  splitName: SplitName,
  sessionCount: number
): boolean {
  const config = SPLIT_CONFIGS[splitName];
  return (
    sessionCount >= config.minSessions && sessionCount <= config.maxSessions
  );
}

/**
 * Get off-day indices for a given number of off days.
 * Distributes off days evenly throughout the week.
 */
export function getOffDayIndices(offDays: number): number[] {
  // Predefined patterns for optimal recovery distribution
  const patterns: Record<number, number[]> = {
    0: [],
    1: [0], // Sunday
    2: [0, 4], // Sunday, Thursday
    3: [0, 3, 5], // Sunday, Wednesday, Friday
    4: [0, 2, 4, 6], // Sunday, Tuesday, Thursday, Saturday
    5: [0, 1, 3, 4, 6], // Most days off
    6: [0, 1, 2, 3, 4, 5], // Only one training day
    7: [0, 1, 2, 3, 4, 5, 6], // All off
  };

  return patterns[offDays] ?? [];
}

/**
 * Maps a muscle to its "primary" PPL category.
 * Used for frequency calculations that need push/pull/legs grouping.
 */
export function getMuscleCategory(
  muscle: MuscleType
): "push" | "pull" | "legs" {
  if (
    MUSCLE_GROUPS.PUSH.includes(muscle as (typeof MUSCLE_GROUPS.PUSH)[number])
  ) {
    return "push";
  }
  if (muscle === "delts_side") {
    return "push"; // Side delts go with push by default
  }
  if (
    MUSCLE_GROUPS.PULL.includes(muscle as (typeof MUSCLE_GROUPS.PULL)[number])
  ) {
    return "pull";
  }
  if (muscle === "traps") {
    return "pull"; // Traps go with pull by default
  }
  return "legs"; // Everything else (lower body + abs)
}

/**
 * Get the BRO split session type for a muscle
 */
export function getBroSessionForMuscle(
  muscle: MuscleType
): "chest" | "back" | "legs" | "arms" | "shoulders" {
  if (
    MUSCLE_GROUPS.SHOULDERS.includes(
      muscle as (typeof MUSCLE_GROUPS.SHOULDERS)[number]
    )
  ) {
    return "shoulders";
  }
  if (
    MUSCLE_GROUPS.ARMS.includes(muscle as (typeof MUSCLE_GROUPS.ARMS)[number])
  ) {
    return "arms";
  }
  if (
    MUSCLE_GROUPS.CHEST.includes(muscle as (typeof MUSCLE_GROUPS.CHEST)[number])
  ) {
    return "chest";
  }
  if (
    MUSCLE_GROUPS.BACK.includes(muscle as (typeof MUSCLE_GROUPS.BACK)[number])
  ) {
    return "back";
  }
  return "legs";
}
