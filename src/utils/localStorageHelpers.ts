import { State } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

export const STORAGE_KEY = "TRAINING_PROGRAM_STATE";

export const isValidState = (obj: any): obj is State => {
  return (
    "frequency" in obj &&
    "training_program_params" in obj &&
    "muscle_priority_list" in obj &&
    "training_block" in obj &&
    "split_sessions" in obj &&
    "mrv_breakpoint" in obj &&
    "mev_breakpoint" in obj
  );
};

export const parseState = (stateString: string | null): State | null => {
  if (!stateString) {
    return null;
  }

  try {
    const parsedState: unknown = JSON.parse(stateString);

    if (isValidState(parsedState)) {
      return parsedState;
    } else {
      console.error("Invalid state data in localStorage");
      return null;
    }
  } catch (error) {
    console.error("Error parsing state from localStorage:", error);
    return null;
  }
};

export const saveStateToLocalStorage = <T>(state: T): void => {
  try {
    const serializedState = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (e) {
    console.error("Could not save state", e);
  }
};
