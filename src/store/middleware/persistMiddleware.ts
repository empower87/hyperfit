/**
 * Redux Persistence Middleware
 *
 * This middleware automatically persists the training program state
 * to localStorage whenever it changes.
 *
 * Benefits over manual persistence:
 * - Automatic - no need to call save functions manually
 * - Debounced - prevents excessive writes on rapid changes
 * - Selective - only persists specific slices
 */

import type { Middleware } from "@reduxjs/toolkit";
import type { TrainingProgramState } from "../trainingProgram/types";

const STORAGE_KEY = "hyperfit_training_program";
const DEBOUNCE_MS = 500;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Type for the state shape we expect
interface AppState {
  trainingProgram: TrainingProgramState;
}

/**
 * Selects the state to persist from the full Redux state.
 * Only includes necessary data, not derived/computed values.
 */
function selectStateToPersist(state: AppState) {
  const tp = state.trainingProgram;

  return {
    frequency: tp.frequency,
    splitType: tp.splitType,
    breakpoints: tp.breakpoints,
    musclePriorityOrder: tp.musclePriorityOrder,
    muscles: tp.muscles,
    programParams: tp.programParams,
    splitSessions: tp.splitSessions,
    trainingBlock: tp.trainingBlock,
  };
}

/**
 * Save state to localStorage with error handling.
 */
function saveToStorage(state: AppState): void {
  try {
    const stateToPersist = selectStateToPersist(state);
    const serialized = JSON.stringify(stateToPersist);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to persist state to localStorage:", error);
  }
}

/**
 * Load state from localStorage.
 * Returns null if no state exists or if parsing fails.
 */
export function loadFromStorage(): Partial<TrainingProgramState> | null {
  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const parsed = JSON.parse(serialized);
    return parsed;
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return null;
  }
}

/**
 * Clear persisted state from localStorage.
 */
export function clearPersistedState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear persisted state:", error);
  }
}

/**
 * Redux middleware that persists trainingProgram state changes to localStorage.
 *
 * Features:
 * - Debounced writes (waits 500ms after last change before saving)
 * - Only triggers on trainingProgram actions
 * - Handles errors gracefully
 */
export const persistMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);

    // Only persist for trainingProgram actions
    if (
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      typeof action.type === "string" &&
      action.type.startsWith("trainingProgram/")
    ) {
      // Skip persistence for initialization action to avoid circular saving
      if (action.type === "trainingProgram/initializeFromStorage") {
        return result;
      }

      // Debounce the save operation
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        const state = store.getState();
        saveToStorage(state);
        debounceTimer = null;
      }, DEBOUNCE_MS);
    }

    return result;
  };

/**
 * Get the storage key used for persistence.
 * Useful for debugging or external access.
 */
export function getStorageKey(): string {
  return STORAGE_KEY;
}