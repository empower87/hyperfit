import { Dispatch, useCallback, useReducer } from "react";
import { useLocalStorage } from "./useLocalStorage";

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};
const IS_SERVER = typeof window === "undefined";

const STORAGE_KEY = "TRAINING_PROGRAM_STATE";
export function usePersistedReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S
): [S, Dispatch<A>] {
  const [savedState, saveState] = useLocalStorage(STORAGE_KEY, initialState);

  const reducerLocalStorage = useCallback(
    (state: S, action: A) => {
      const newState = reducer(state, action);

      saveState(newState);

      return newState;
    },
    [saveState]
  );

  return useReducer(reducerLocalStorage, savedState);
}
