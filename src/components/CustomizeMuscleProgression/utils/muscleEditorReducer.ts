import {
  ExerciseType,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { JSONExercise } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";

type AddSubtractSetsType = {
  type: "INCREMENT_SETS";
  payload: {
    operation: "+" | "-";
    exerciseId: ExerciseType["id"];
    selectedMesocycleIndex: number;
  };
};
type AddTrainingDayType = {
  type: "ADD_TRAINING_DAY";
  payload: {
    exercise: JSONExercise;
    dayIndex: number;
  };
};
type CopyNextTrainingDayType = {
  type: "COPY_NEXT_TRAINING_DAY";
  payload: {
    selectedMesocycleIndex: number;
  };
};
type RemoveTrainingDayType = {
  type: "REMOVE_TRAINING_DAY";
  payload: {
    dayIndex: number;
    selectedMesocycleIndex: number;
  };
};
type AddExerciseType = {
  type: "ADD_EXERCISE";
  payload: {
    exercise: JSONExercise;
    dayIndex: number;
  };
};
type RemoveExerciseType = {
  type: "REMOVE_EXERCISE";
  payload: {
    id: ExerciseType["id"];
  };
};
type ResetStateType = {
  type: "RESET_STATE";
  payload: {
    reset_muscle: MusclePriorityType;
  };
};
type Action =
  | AddSubtractSetsType
  | AddTrainingDayType
  | CopyNextTrainingDayType
  | RemoveTrainingDayType
  | AddExerciseType
  | RemoveExerciseType
  | ResetStateType;

export function muscleEditorReducer(state: MusclePriorityType, action: Action) {
  const exercises = state.exercises;
  const volume = state.volume;
  const frequency = state.frequency;
  const { progression } = frequency;
  const { landmark } = volume;

  switch (action.type) {
    case "COPY_NEXT_TRAINING_DAY":
      const payload1 = action.payload;
      const copiedFrequencyProgression = [...progression];
      copiedFrequencyProgression[payload1.selectedMesocycleIndex]++;

      const nextFreq =
        copiedFrequencyProgression[payload1.selectedMesocycleIndex + 1];
      const sessionIndex =
        copiedFrequencyProgression[payload1.selectedMesocycleIndex] - 1;
      const cloned_exercises = structuredClone(exercises);
      const sessionExercises = structuredClone(cloned_exercises[sessionIndex]);
      const toCopyExercises = exercises[nextFreq - 1];

      for (let i = 0; i < sessionExercises.length; i++) {
        const nextFreqSets =
          toCopyExercises[i].initialSetsPerMeso[
            payload1.selectedMesocycleIndex + 1
          ];
        const nextAlgoSchema =
          toCopyExercises[i].setProgressionSchema[
            payload1.selectedMesocycleIndex + 1
          ];
        sessionExercises[i].initialSetsPerMeso[
          payload1.selectedMesocycleIndex
        ] = nextFreqSets;
        sessionExercises[i].setProgressionSchema[
          payload1.selectedMesocycleIndex
        ] = nextAlgoSchema;
      }

      cloned_exercises[sessionIndex] = sessionExercises;
      return {
        ...state,
        exercises: cloned_exercises,
        volume: {
          ...state.volume,
          frequencyProgression: copiedFrequencyProgression,
        },
      };
    case "ADD_TRAINING_DAY":
      const payload2 = action.payload;
      const cloned_exercises2 = structuredClone(exercises);
      const freq = [...progression];
      freq[freq.length - 1]++;

      cloned_exercises2.push([]);

      return {
        ...state,
        exercises: cloned_exercises2,
        volume: {
          ...state.volume,
          frequencyProgression: freq,
        },
      };
    case "REMOVE_TRAINING_DAY":
      const payload3 = action.payload;
      const freq2 = [...progression];
      freq2[payload3.selectedMesocycleIndex]--;
      const cloned_exercises3 = structuredClone(exercises);
      cloned_exercises3.splice(payload3.dayIndex, 1);

      return {
        ...state,
        exercises: cloned_exercises3,
        volume: { ...state.volume, frequencyProgression: freq2 },
      };
    case "ADD_EXERCISE":
      const payload = action.payload;
      const copyExercises = structuredClone(exercises);

      return {
        ...state,
        exercises: copyExercises,
      };
    case "REMOVE_EXERCISE":
      const remove_ex_payload = action.payload;

      const rem_exercises = exercises.map((day) => {
        return day.filter((e) => e.id !== remove_ex_payload.id);
      });

      // check if no remaining exercises in session
      return {
        ...state,
        exercises: rem_exercises.filter((each) => each.length),
      };
    case "INCREMENT_SETS":
      const { exerciseId, selectedMesocycleIndex, operation } = action.payload;
      const copiedExercises = structuredClone(exercises);
      const exercise = copiedExercises.flat().find((e) => e.id === exerciseId);
      if (!exercise) return state;
      const sets = exercise.initialSetsPerMeso[selectedMesocycleIndex];
      exercise.initialSetsPerMeso[selectedMesocycleIndex] =
        sets + (operation === "+" ? 1 : -1);

      const incrementedExercise = copiedExercises.map((day) => {
        return day.map((e) => {
          if (e.id === exerciseId) {
            return exercise;
          }
          return e;
        });
      });
      return { ...state, exercises: incrementedExercise };
    case "RESET_STATE":
      const { reset_muscle } = action.payload;
      return reset_muscle;
    default:
      return state;
  }
}
