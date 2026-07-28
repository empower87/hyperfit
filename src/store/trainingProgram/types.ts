/**
 * Type definitions for the Training Program Redux slice.
 *
 * These types define the normalized state structure for the training program.
 * Key principles:
 * - Store only the minimal "source of truth" data
 * - Derive computed values via selectors
 * - Use IDs for relationships between entities
 */

import type { MuscleType } from "~/constants/workoutSplits";
import type { SplitName, SplitSessionType } from "~/constants/splitConfigs";

// ============================================================================
// Volume & Frequency Types
// ============================================================================

export type VolumeLandmarkType = "MRV" | "MEV" | "MV";

export interface VolumeConfig {
  /** Volume landmark based on muscle priority position */
  landmark: VolumeLandmarkType;
  /** Target volume range [min, max] sets per week */
  range: [number, number];
  /** Number of exercises per session for this muscle */
  exercisesPerSessionSchema: number;
}

export interface FrequencyConfig {
  /** Frequency range [min, max] sessions per week */
  range: [number, number];
  /** Target frequency (calculated based on priority and total sessions) */
  target: number;
  /** Frequency progression across mesocycles (e.g., [4, 3, 3, 2] for deload) */
  progression: number[];
  /** Set progression matrix for exercises across mesocycles */
  setProgressionMatrix: number[][][];
}

// ============================================================================
// Exercise Types
// ============================================================================

export type ExerciseTrainingModality =
  | "straight"
  | "down"
  | "eccentric"
  | "giant"
  | "myoreps"
  | "myorep match"
  | "drop"
  | "superset"
  | "pre-exhaust superset"
  | "lengthened partials";

export type SetProgressionType =
  | "ADD_ONE"
  | "ADD_ONE_ODD"
  | "FLAT_ADD"
  | "NO_ADD"
  | "ADD_ONE_PER_MICROCYCLE"
  | "ADD_MANY_PER_MICROCYCLE";

export interface ExerciseMesocycleProgression {
  week: number;
  sets: number;
  reps: number;
  weight: number;
  rir: number;
}

export interface ExerciseData {
  movement_type: string;
  requirements: string[];
  region: {
    primary: string;
    secondary: string[];
  };
}

export interface Exercise {
  id: string;
  name: string;
  muscle: MuscleType;
  session: number;
  rank: VolumeLandmarkType;
  sets: number;
  reps: number;
  weight: number;
  rir: number;
  weightIncrement: number;
  trainingModality: ExerciseTrainingModality;
  mesocycle_progression: ExerciseMesocycleProgression[];
  supersetWith: string | null;
  initialSetsPerMeso: number[];
  setProgressionSchema: SetProgressionType[];
  data: ExerciseData;
}

// ============================================================================
// Muscle Priority Types
// ============================================================================

export interface MusclePriority {
  id: string;
  muscle: MuscleType;
  /** Exercises grouped by session index */
  exercises: Exercise[][];
  volume: VolumeConfig;
  frequency: FrequencyConfig;
}

// ============================================================================
// Session & Training Day Types
// ============================================================================

export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface Session {
  id: string;
  split: SplitSessionType | "off";
  /** Array of [muscleType, exerciseId] tuples */
  exercises: [MuscleType, string][];
}

export interface TrainingDay {
  day: DayOfWeek;
  isTrainingDay: boolean;
  sessions: Session[];
}

// ============================================================================
// Split Sessions Types
// ============================================================================

/** Maps session types to their counts */
export type SessionCounts = Partial<Record<SplitSessionType, number>>;

export interface SplitSessions {
  split: SplitName;
  sessions: SessionCounts;
}

// ============================================================================
// Training Program Parameters
// ============================================================================

export interface TrainingProgramParams {
  /** Number of sessions per day (typically 1) */
  sessions: number;
  /** Training days per week */
  days: number;
  /** Weeks per mesocycle */
  microcycles: number;
  /** Number of mesocycles */
  mesocycles: number;
  /** Number of training blocks */
  blocks: number;
  /** Number of macrocycles */
  macrocycles: number;
}

// ============================================================================
// Redux State Shape
// ============================================================================

/**
 * The normalized Redux state for the training program.
 *
 * Design principles:
 * 1. Store only "source of truth" data that can't be derived
 * 2. Use IDs for muscle priority ordering (not the full objects)
 * 3. Derive split sessions, training blocks, etc. via selectors
 */
export interface TrainingProgramState {
  // === Core User Inputs ===

  /** Training frequency as [trainingDays, offDays] */
  frequency: [number, number];

  /** Selected split type */
  splitType: SplitName;

  /** Volume breakpoints: [MRV cutoff index, MEV cutoff index] */
  breakpoints: [number, number];

  /** Ordered list of muscle IDs (determines priority) */
  musclePriorityOrder: string[];

  // === Entities (Normalized) ===

  /** Muscle data indexed by ID */
  muscles: Record<string, MusclePriority>;

  // === Program Configuration ===

  /** Training program parameters */
  programParams: TrainingProgramParams;

  // === Derived State (Cached for Performance) ===
  // Note: These could be computed by selectors, but we cache them
  // in state for performance when the computation is expensive

  /** Split session distribution (derived from frequency + splitType + muscle priorities) */
  splitSessions: SplitSessions;

  /** Training block structure (derived from all inputs) */
  trainingBlock: TrainingDay[][];

  // === UI State ===

  /** Whether the state has been initialized from storage */
  isInitialized: boolean;
}

// ============================================================================
// Action Payload Types
// ============================================================================

export interface SetFrequencyPayload {
  frequency: [number, number];
}

export interface SetSplitTypePayload {
  splitType: SplitName;
}

export interface SetBreakpointsPayload {
  breakpoints: [number, number];
}

export interface ReorderMusclePriorityPayload {
  /** New order of muscle IDs */
  order: string[];
}

export interface UpdateMuscleExercisesPayload {
  muscleId: string;
  exercises: Exercise[][];
}

export interface RearrangeTrainingWeekPayload {
  week: TrainingDay[];
}

export interface InitializeFromStoragePayload {
  state: TrainingProgramState;
}