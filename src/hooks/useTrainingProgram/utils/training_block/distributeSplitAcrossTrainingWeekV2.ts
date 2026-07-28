/**
 * Training Week Distribution Utilities (Refactored)
 *
 * This is a refactored version of distributeSplitAcrossTrainingWeek.ts that uses
 * the centralized split configuration from ~/constants/splitConfigs.
 *
 * Key improvements:
 * - Uses config-driven session ordering instead of switch statements
 * - Single generic function instead of 6 separate getNextSplit functions
 * - Cleaner, more maintainable code
 * - Same output format for backward compatibility
 */

import {
  getNextSessionOrder,
  getOffDayIndices,
  type SplitName,
  type SplitSessionType,
} from "~/constants/splitConfigs";
import type { TrainingDay, Session, DayOfWeek, SplitSessions } from "~/store/trainingProgram/types";

// ============================================================================
// Constants
// ============================================================================

const DAYS_OF_WEEK: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ============================================================================
// Main Function
// ============================================================================

/**
 * Distribute split sessions across a training week.
 *
 * Takes the split session counts and creates a weekly schedule with:
 * - Off days placed optimally for recovery
 * - Sessions distributed to avoid consecutive same-split days when possible
 *
 * @param totalTrainingDays Number of training days (not total sessions)
 * @param splitSessions Object containing split type and session counts
 * @returns Array of 7 TrainingDay objects representing the week
 */
export function distributeSplitAcrossWeek(
  totalTrainingDays: number,
  splitSessions: SplitSessions
): TrainingDay[] {
  // Calculate off days and get their optimal placement
  const offDays = 7 - totalTrainingDays;
  const offDayIndices = getOffDayIndices(offDays);

  // Initialize the week structure
  const week: TrainingDay[] = DAYS_OF_WEEK.map((day, index) => ({
    day,
    isTrainingDay: !offDayIndices.includes(index),
    sessions: [],
  }));

  // Track remaining sessions for each type
  const remaining = new Map<string, number>(
    Object.entries(splitSessions.sessions).filter(
      ([_, count]) => count !== undefined && count > 0
    ) as [string, number][]
  );

  // Distribute sessions across training days
  let lastSplit = "";

  for (let dayIndex = 0; dayIndex < week.length; dayIndex++) {
    const day = week[dayIndex];

    if (day.isTrainingDay) {
      const nextSplit = findNextSession(
        splitSessions.split,
        lastSplit,
        remaining
      );

      if (nextSplit) {
        const session: Session = {
          id: `${dayIndex}_${nextSplit}_session`,
          split: nextSplit as SplitSessionType,
          exercises: [],
        };

        day.sessions.push(session);
        remaining.set(nextSplit, (remaining.get(nextSplit) ?? 1) - 1);
        lastSplit = nextSplit;
      }
    } else {
      // Off day - add placeholder session
      const session: Session = {
        id: `${dayIndex}_off_session`,
        split: "off",
        exercises: [],
      };

      day.sessions.push(session);
      lastSplit = "off";
    }
  }

  return week;
}

/**
 * Find the next session type to schedule based on ordering preferences.
 *
 * Uses the split configuration's sessionOrdering to determine the best
 * next session given what was scheduled last.
 */
function findNextSession(
  splitType: SplitName,
  lastSplit: string,
  remaining: Map<string, number>
): string | null {
  // Get the preferred ordering for this split type
  const preferredOrder = getNextSessionOrder(splitType, lastSplit);

  // Find the first session type that still has remaining sessions
  for (const sessionType of preferredOrder) {
    const count = remaining.get(sessionType);
    if (count !== undefined && count > 0) {
      return sessionType;
    }
  }

  // Fallback: return any remaining session type
  for (const [sessionType, count] of remaining) {
    if (count > 0) {
      return sessionType;
    }
  }

  return null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create an empty week structure (all training days, no sessions).
 */
export function createEmptyWeek(): TrainingDay[] {
  return DAYS_OF_WEEK.map((day) => ({
    day,
    isTrainingDay: true,
    sessions: [],
  }));
}

/**
 * Get the total number of sessions in a week.
 */
export function getWeekSessionCount(week: TrainingDay[]): number {
  return week.reduce((total, day) => {
    const trainingSessions = day.sessions.filter((s) => s.split !== "off");
    return total + trainingSessions.length;
  }, 0);
}

/**
 * Check if a week has balanced session distribution.
 * Returns true if no split type is over-represented.
 */
export function isWeekBalanced(
  week: TrainingDay[],
  splitSessions: SplitSessions
): boolean {
  const counts: Record<string, number> = {};

  // Count sessions in the week
  for (const day of week) {
    for (const session of day.sessions) {
      if (session.split !== "off") {
        counts[session.split] = (counts[session.split] ?? 0) + 1;
      }
    }
  }

  // Compare to expected counts
  for (const [type, expected] of Object.entries(splitSessions.sessions)) {
    if (expected === undefined) continue;
    const actual = counts[type] ?? 0;
    if (actual !== expected) {
      return false;
    }
  }

  return true;
}

/**
 * Rearrange a week while maintaining session validity.
 * Filters out off sessions and updates isTrainingDay flags.
 */
export function normalizeWeek(week: TrainingDay[]): TrainingDay[] {
  return week.map((day) => {
    const trainingSessions = day.sessions.filter((s) => s.split !== "off");
    return {
      ...day,
      isTrainingDay: trainingSessions.length > 0,
      sessions: trainingSessions,
    };
  });
}

/**
 * Get a summary of session distribution for a week.
 */
export function getWeekSummary(
  week: TrainingDay[]
): Record<string, number> {
  const summary: Record<string, number> = {};

  for (const day of week) {
    for (const session of day.sessions) {
      if (session.split !== "off") {
        summary[session.split] = (summary[session.split] ?? 0) + 1;
      }
    }
  }

  return summary;
}