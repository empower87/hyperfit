/**
 * Redux Toolkit slice for the Training Program state.
 *
 * This slice manages the core training program configuration:
 * - Frequency (training days per week)
 * - Split type (PPL, Upper/Lower, etc.)
 * - Volume breakpoints (MRV/MEV thresholds)
 * - Muscle priority ordering
 *
 * Key design decisions:
 * 1. Reducers only update the direct state changes (e.g., setFrequency just sets frequency)
 * 2. Derived state (split sessions, training blocks) is computed via selectors
 * 3. Heavy calculations are memoized in selectors, not in reducers
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  TrainingProgramState,
  SetFrequencyPayload,
  SetSplitTypePayload,
  SetBreakpointsPayload,
  ReorderMusclePriorityPayload,
  UpdateMuscleExercisesPayload,
  RearrangeTrainingWeekPayload,
  MusclePriority,
  TrainingDay,
} from "./types";

// ============================================================================
// Initial State
// ============================================================================

const INITIAL_MUSCLES: Record<string, MusclePriority> = {
  "back-002": {
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
  "delts_side-008": {
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
  "triceps-014": {
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
  "hamstrings-011": {
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
  "quads-012": {
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
  "delts_rear-007": {
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
  "forearms-009": {
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
  "traps-013": {
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
  "biceps-003": {
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
  "chest-005": {
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
  "calves-004": {
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
  "delts_front-006": {
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
  "abs-001": {
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
  "glutes-010": {
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
};

const INITIAL_MUSCLE_ORDER = [
  "back-002",
  "delts_side-008",
  "triceps-014",
  "hamstrings-011",
  "quads-012",
  "delts_rear-007",
  "forearms-009",
  "traps-013",
  "biceps-003",
  "chest-005",
  "calves-004",
  "delts_front-006",
  "abs-001",
  "glutes-010",
];

const INITIAL_WEEK: TrainingDay[] = [
  { day: "Sunday", isTrainingDay: true, sessions: [] },
  { day: "Monday", isTrainingDay: true, sessions: [] },
  { day: "Tuesday", isTrainingDay: true, sessions: [] },
  { day: "Wednesday", isTrainingDay: true, sessions: [] },
  { day: "Thursday", isTrainingDay: true, sessions: [] },
  { day: "Friday", isTrainingDay: true, sessions: [] },
  { day: "Saturday", isTrainingDay: true, sessions: [] },
];

const initialState: TrainingProgramState = {
  // Core inputs
  frequency: [3, 4], // 3 training days, 4 off days
  splitType: "PPL",
  breakpoints: [4, 9], // First 4 muscles = MRV, next 5 = MEV, rest = MV

  // Muscle data
  musclePriorityOrder: INITIAL_MUSCLE_ORDER,
  muscles: INITIAL_MUSCLES,

  // Program params
  programParams: {
    sessions: 1,
    days: 3,
    microcycles: 4,
    mesocycles: 3,
    blocks: 4,
    macrocycles: 4,
  },

  // Derived state (will be computed by selectors, cached here)
  splitSessions: {
    split: "PPL",
    sessions: { push: 1, pull: 1, legs: 1 },
  },
  trainingBlock: [],

  // UI state
  isInitialized: false,
};

// ============================================================================
// Slice Definition
// ============================================================================

const trainingProgramSlice = createSlice({
  name: "trainingProgram",
  initialState,
  reducers: {
    /**
     * Set the training frequency.
     * This is the number of training days and off days per week.
     */
    setFrequency(state, action: PayloadAction<SetFrequencyPayload>) {
      state.frequency = action.payload.frequency;
      // Update program params to match
      state.programParams.days = action.payload.frequency[0];
    },

    /**
     * Set the split type (PPL, Upper/Lower, etc.)
     */
    setSplitType(state, action: PayloadAction<SetSplitTypePayload>) {
      state.splitType = action.payload.splitType;
      state.splitSessions.split = action.payload.splitType;
    },

    /**
     * Set the volume breakpoints.
     * breakpoints[0] = index where MRV ends and MEV begins
     * breakpoints[1] = index where MEV ends and MV begins
     */
    setBreakpoints(state, action: PayloadAction<SetBreakpointsPayload>) {
      state.breakpoints = action.payload.breakpoints;
    },

    /**
     * Reorder the muscle priority list.
     * This affects which muscles get MRV/MEV/MV treatment.
     */
    reorderMusclePriority(
      state,
      action: PayloadAction<ReorderMusclePriorityPayload>
    ) {
      state.musclePriorityOrder = action.payload.order;
    },

    /**
     * Update exercises for a specific muscle.
     */
    updateMuscleExercises(
      state,
      action: PayloadAction<UpdateMuscleExercisesPayload>
    ) {
      const { muscleId, exercises } = action.payload;
      if (state.muscles[muscleId]) {
        state.muscles[muscleId].exercises = exercises;
      }
    },

    /**
     * Update a muscle's computed values (frequency, volume, etc.)
     * This is called after selectors compute new values.
     */
    updateMuscle(state, action: PayloadAction<{ muscle: MusclePriority }>) {
      const { muscle } = action.payload;
      state.muscles[muscle.id] = muscle;
    },

    /**
     * Batch update multiple muscles at once.
     * More efficient than multiple individual updates.
     */
    updateMuscles(
      state,
      action: PayloadAction<{ muscles: Record<string, MusclePriority> }>
    ) {
      state.muscles = { ...state.muscles, ...action.payload.muscles };
    },

    /**
     * Update the split sessions distribution.
     * Called after computing how sessions are distributed across split types.
     */
    updateSplitSessions(
      state,
      action: PayloadAction<{ splitSessions: TrainingProgramState["splitSessions"] }>
    ) {
      state.splitSessions = action.payload.splitSessions;
    },

    /**
     * Update the training block structure.
     */
    updateTrainingBlock(
      state,
      action: PayloadAction<{ trainingBlock: TrainingDay[][] }>
    ) {
      state.trainingBlock = action.payload.trainingBlock;
    },

    /**
     * Rearrange the training week (drag and drop).
     */
    rearrangeTrainingWeek(
      state,
      action: PayloadAction<RearrangeTrainingWeekPayload>
    ) {
      // Filter out "off" sessions and update isTrainingDay
      const filteredWeek = action.payload.week.map((day) => {
        const sessions = day.sessions.filter((s) => s.split !== "off");
        return {
          ...day,
          isTrainingDay: sessions.length > 0,
          sessions,
        };
      });

      // Update the first mesocycle's week (or create if empty)
      if (state.trainingBlock.length === 0) {
        state.trainingBlock = [filteredWeek];
      } else {
        state.trainingBlock[0] = filteredWeek;
      }
    },

    /**
     * Initialize the state from localStorage or other persistence.
     */
    initializeFromStorage(
      state,
      action: PayloadAction<Partial<TrainingProgramState>>
    ) {
      // Merge the stored state with current state
      Object.assign(state, action.payload);
      state.isInitialized = true;
    },

    /**
     * Reset to initial state.
     */
    resetToDefaults() {
      return initialState;
    },

    /**
     * Full program configuration update.
     * Used when multiple inputs change at once (e.g., initial setup).
     */
    configureProgram(
      state,
      action: PayloadAction<{
        frequency?: [number, number];
        splitType?: TrainingProgramState["splitType"];
        breakpoints?: [number, number];
        musclePriorityOrder?: string[];
      }>
    ) {
      const { frequency, splitType, breakpoints, musclePriorityOrder } =
        action.payload;

      if (frequency !== undefined) {
        state.frequency = frequency;
        state.programParams.days = frequency[0];
      }
      if (splitType !== undefined) {
        state.splitType = splitType;
        state.splitSessions.split = splitType;
      }
      if (breakpoints !== undefined) {
        state.breakpoints = breakpoints;
      }
      if (musclePriorityOrder !== undefined) {
        state.musclePriorityOrder = musclePriorityOrder;
      }
    },
  },
});

// ============================================================================
// Exports
// ============================================================================

export const {
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
} = trainingProgramSlice.actions;

export default trainingProgramSlice.reducer;