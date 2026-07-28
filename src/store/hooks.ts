/**
 * Typed Redux Hooks
 *
 * These hooks provide proper TypeScript inference for the app's
 * Redux store. Use these instead of the plain react-redux hooks.
 *
 * Usage:
 * ```typescript
 * import { useAppDispatch, useAppSelector } from '~/store/hooks';
 *
 * // In component:
 * const dispatch = useAppDispatch();
 * const frequency = useAppSelector(selectFrequency);
 * ```
 */

import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Typed version of useDispatch that knows about our store's dispatch type.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed version of useSelector that knows about our store's state type.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;