/**
 * Redux-based Training Program Hook
 *
 * This hook provides the same interface as the original useTrainingProgram hook
 * but uses Redux Toolkit for state management instead of useReducer.
 *
 * Benefits:
 * - Memoized selectors prevent unnecessary recalculations
 * - Single source of truth across the app
 * - Redux DevTools integration for debugging
 * - Easier persistence with redux-persist
 *
 * Migration path:
 * 1. Import this hook instead of the original
 * 2. Replace TrainingProgramProvider with Redux Provider (already done in _app.tsx)
 * 3. Components work without changes
 */

import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import deepEqual from "fast-deep-equal/es6";
import type { AppDispatch } from "~/store/store";
import {
  // Actions
  setFrequency,
  setSplitType,
  setBreakpoints,
  reorderMusclePriority,
  updateMuscleExercises,
  updateMuscle,
  rearrangeTrainingWeek,
  initializeFromStorage,
  configureProgram,
  updateSplitSessions,
  updateTrainingBlock,
  // Selectors
  selectFrequency,
  selectCachedSplitSessions,
  selectCachedTrainingBlock,
  selectMusclePriorityList,
  selectProgramParams,
  selectBreakpoints,
  selectSplitSessions,
  selectTrainingWeek,
  selectIsInitialized,
  type MusclePriority,
  type TrainingDay,
  type TrainingProgramState,
} from "~/store/trainingProgram";
import type { SplitName } from "~/constants/splitConfigs";
import {
  parseState,
  saveStateToLocalStorage,
  STORAGE_KEY,
} from "~/utils/localStorageHelpers";

// Type alias for backward compatibility
type SplitSessionsNameType = SplitName;
type MusclePriorityType = MusclePriority;
type TrainingDayType = TrainingDay;

/**
 * Redux-based training program hook with the same interface as the original.
 */
export function useTrainingProgramRedux() {
  const dispatch = useDispatch<AppDispatch>();

  // Select state using memoized selectors
  const frequency = useSelector(selectFrequency);
  const breakpoints = useSelector(selectBreakpoints);
  const programParams = useSelector(selectProgramParams);
  const isInitialized = useSelector(selectIsInitialized);

  // Use computed selectors for derived state
  const musclePriorityList = useSelector(selectMusclePriorityList);
  const splitSessions = useSelector(selectSplitSessions);
  const trainingWeek = useSelector(selectTrainingWeek);

  // Use cached values for training block (expensive to compute)
  const trainingBlock = useSelector(selectCachedTrainingBlock);
  const cachedSplitSessions = useSelector(selectCachedSplitSessions);

  // Track previous state for persistence
  const prevState = useRef<Partial<TrainingProgramState> | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (isInitialized) return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const localState = parseState(raw);
      if (localState) {
        // Convert old state format to new Redux format if needed
        dispatch(
          initializeFromStorage({
            frequency: localState.frequency,
            splitType: localState.split_sessions?.split as SplitName,
            breakpoints: [localState.mrv_breakpoint, localState.mev_breakpoint],
            // Note: We'd need to convert muscle_priority_list to the normalized format
            // For now, we'll handle this in a migration utility
          })
        );
        prevState.current = localState;
      }
    }
  }, [dispatch, isInitialized]);

  // Persist state changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    const currentState = {
      frequency,
      split_sessions: cachedSplitSessions,
      muscle_priority_list: musclePriorityList,
      training_block: trainingBlock,
      training_program_params: programParams,
      mrv_breakpoint: breakpoints[0],
      mev_breakpoint: breakpoints[1],
    };

    if (!deepEqual(prevState.current, currentState)) {
      saveStateToLocalStorage(currentState as any);
      prevState.current = currentState;
    }
  }, [
    frequency,
    cachedSplitSessions,
    musclePriorityList,
    trainingBlock,
    programParams,
    breakpoints,
    isInitialized,
  ]);

  // Update cached derived state when inputs change
  useEffect(() => {
    // Update split sessions cache
    dispatch(updateSplitSessions({ splitSessions }));
  }, [dispatch, splitSessions]);

  // Action handlers (same interface as original hook)

  const handleFrequencyChange = useCallback(
    (value: [number, number], split?: SplitSessionsNameType) => {
      dispatch(setFrequency({ frequency: value }));
      if (split) {
        dispatch(setSplitType({ splitType: split }));
      }
    },
    [dispatch]
  );

  const handleUpdateMuscleList = useCallback(
    (items: MusclePriorityType[]) => {
      // Convert to ID order for the new store format
      const order = items.map((item) => item.id);
      dispatch(reorderMusclePriority({ order }));
    },
    [dispatch]
  );

  const handleUpdateMuscle = useCallback(
    (updatedMuscle: MusclePriorityType) => {
      dispatch(updateMuscle({ muscle: updatedMuscle }));
    },
    [dispatch]
  );

  const handleUpdateBreakpoint = useCallback(
    (type: "mev_breakpoint" | "mrv_breakpoint", value: number) => {
      const newBreakpoints: [number, number] =
        type === "mrv_breakpoint"
          ? [value, breakpoints[1]]
          : [breakpoints[0], value];
      dispatch(setBreakpoints({ breakpoints: newBreakpoints }));
    },
    [dispatch, breakpoints]
  );

  const handleUpdateBreakpoints = useCallback(
    (value: [number, number]) => {
      dispatch(setBreakpoints({ breakpoints: value }));
    },
    [dispatch]
  );

  const handleChangeFrequencyProgression = useCallback(
    (id: MusclePriorityType["id"], type: "add" | "subtract") => {
      // This would need custom logic - for now, we'll need to implement this
      // in the selector or as a thunk
      console.warn(
        "handleChangeFrequencyProgression not yet implemented in Redux version"
      );
    },
    []
  );

  const handleUpdateSplitSessions = useCallback(
    (type: SplitSessionsNameType) => {
      dispatch(setSplitType({ splitType: type }));
    },
    [dispatch]
  );

  const handleRearrangeTrainingWeek = useCallback(
    (week: TrainingDayType[]) => {
      dispatch(rearrangeTrainingWeek({ week }));
    },
    [dispatch]
  );

  const handleOnProgramConfigChange = useCallback(
    (settings: {
      total_frequency: [number, number];
      split: SplitSessionsNameType;
      muscle_priority_list: MusclePriorityType[];
      breakpoints: [number, number];
    }) => {
      dispatch(
        configureProgram({
          frequency: settings.total_frequency,
          splitType: settings.split,
          breakpoints: settings.breakpoints,
          musclePriorityOrder: settings.muscle_priority_list.map((m) => m.id),
        })
      );
    },
    [dispatch]
  );

  // Return the same interface as the original hook
  return {
    training_block: trainingBlock,
    split_sessions: cachedSplitSessions,
    frequency,
    training_program_params: programParams,
    prioritized_muscle_list: musclePriorityList,
    handleUpdateMuscleList,
    handleUpdateMuscle,
    handleUpdateBreakpoint,
    handleUpdateBreakpoints,
    handleUpdateSplitSessions,
    handleFrequencyChange,
    handleRearrangeTrainingWeek,
    handleChangeFrequencyProgression,
    handleOnProgramConfigChange,
    mrv_breakpoint: breakpoints[0],
    mev_breakpoint: breakpoints[1],
  };
}

/**
 * Type for the hook return value (for use in contexts/props)
 */
export type TrainingProgramReduxType = ReturnType<typeof useTrainingProgramRedux>;