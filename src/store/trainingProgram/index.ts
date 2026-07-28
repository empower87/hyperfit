/**
 * Training Program Redux Store
 *
 * This module provides the complete Redux state management for the training program.
 *
 * Usage:
 * ```typescript
 * import {
 *   // Actions
 *   setFrequency,
 *   setSplitType,
 *   setBreakpoints,
 *   reorderMusclePriority,
 *
 *   // Selectors
 *   selectFrequency,
 *   selectSplitSessions,
 *   selectMusclePriorityList,
 *   selectTrainingWeek,
 * } from '~/store/trainingProgram';
 * ```
 */

// Re-export actions from slice
export {
  setFrequency,
  setSplitType,
  setBreakpoints,
  reorderMusclePriority,
  updateMuscleExercises,
  updateMuscle,
  updateMuscles,
  updateSplitSessions,
  updateTrainingBlock,
  rearrangeTrainingWeek,
  initializeFromStorage,
  resetToDefaults,
  configureProgram,
} from "./trainingProgramSlice";

// Re-export the reducer as default
export { default as trainingProgramReducer } from "./trainingProgramSlice";

// Re-export all selectors
export {
  // Base selectors
  selectTrainingProgramState,
  selectFrequency,
  selectSplitType,
  selectBreakpoints,
  selectMusclePriorityOrder,
  selectMuscles,
  selectProgramParams,
  selectIsInitialized,
  selectCachedSplitSessions,
  selectCachedTrainingBlock,

  // Derived selectors
  selectTotalSessions,
  selectTrainingDays,
  selectMusclePriorityList,
  selectFrequencyMaxes,
  selectSplitSessions,
  selectTrainingWeek,
  selectMuscleById,
  selectMusclesByLandmark,
  selectMesocycles,
  selectLegacyState,

  // Helper functions
  getVolumeLandmark,
} from "./selectors";

// Re-export types
export type {
  TrainingProgramState,
  MusclePriority,
  Exercise,
  VolumeConfig,
  FrequencyConfig,
  TrainingDay,
  Session,
  SplitSessions,
  TrainingProgramParams,
  VolumeLandmarkType,
  DayOfWeek,
  ExerciseTrainingModality,
  SetProgressionType,
} from "./types";