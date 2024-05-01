import deepEqual from "fast-deep-equal/es6";
import { Dispatch, useCallback, useEffect, useReducer, useRef } from "react";
import { usePrevious } from "./usePrevious";

type UseLocalStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

export function usePersistedReducer<State, Action>(
  reducer: (state: State, action: Action) => State,
  initialState: State,
  storageKey: string
): [State, Dispatch<Action>] {
  const isMounted = useRef(false);

  const init = useCallback((): State => {
    try {
      const stringState = window.localStorage.getItem(storageKey);
      if (stringState) {
        try {
          return JSON.parse(stringState);
        } catch (error) {
          return initialState;
        }
      } else {
        return initialState;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${storageKey}”:`, error);
      return initialState;
    }
  }, [initialState, storageKey]);

  const [state, dispatch] = useReducer(reducer, initialState, init);
  const prevState = usePrevious(state);

  useEffect(() => {
    if (isMounted.current) {
      const stateEqual = deepEqual(prevState, state);
      if (!stateEqual) {
        const stringifiedState = JSON.stringify(state);
        localStorage.setItem(storageKey, stringifiedState);
      }
    } else {
      isMounted.current = true;
    }
  }, [state]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [storageKey]);

  return [state, dispatch];
}
