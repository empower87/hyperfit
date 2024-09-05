import { getMusclesMaxFrequency } from "~/constants/workoutSplits";
import {
  ExerciseType,
  MusclePriorityType,
  SplitSessionsType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import {
  addNewExerciseSetsToSetProgressionMatrix,
  initNewExercise,
  JSONExercise,
  updateExercisesOnSetProgressionChange,
  updateSetProgression,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import {
  canTargetFrequencyBeIncreased,
  decrementTargetFrequency,
  incrementTargetFrequency,
} from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/maximumFrequencyHandlers";
import { getUID } from "~/utils/generateUID";
import {
  updateExercisesOnTrainingDayRemoval,
  updateFrequencyProgressionOnTrainingDayRemoval,
} from "./trainingDayHelpers";

type IncrementSelectedExerciseSetsType = {
  type: "INCREMENT_SELECTED_EXERCISE_SETS";
  payload: {
    exerciseId: ExerciseType["id"];
    selected_mesocycle_index: number;
  };
};
type DecrementSelectedExerciseSetsType = {
  type: "DECREMENT_SELECTED_EXERCISE_SETS";
  payload: {
    exerciseId: ExerciseType["id"];
    selected_mesocycle_index: number;
  };
};
type AddTrainingDayType = {
  type: "ADD_TRAINING_DAY";
  payload: {
    split_sessions: SplitSessionsType;
    target_frequency_index: number;
  };
};
type RemoveTrainingDayType = {
  type: "REMOVE_TRAINING_DAY";
  payload: {
    removed_index: number;
  };
};
type IncrementFrequencyProgressionType = {
  type: "INCREMENT_SELECTED_FREQUENCY_PROGRESSION";
  payload: {
    target_index: number;
    split_sessions: SplitSessionsType;
  };
};
type DecrementFrequencyProgressionType = {
  type: "DECREMENT_SELECTED_FREQUENCY_PROGRESSION";
  payload: {
    target_index: number;
  };
};
type AddExerciseType = {
  type: "ADD_EXERCISE";
  payload: {
    exercise: JSONExercise;
    session_index: number;
  };
};
type RemoveExerciseType = {
  type: "REMOVE_EXERCISE";
  payload: {
    id: ExerciseType["id"];
  };
};
type ChangeExerciseType = {
  type: "CHANGE_EXERCISE";
  payload: {
    old_exerciseId: ExerciseType["id"];
    new_exercise: JSONExercise;
  };
};
type InitializeStateType = {
  type: "INITIALIZE_STATE";
  payload: {
    state: MusclePriorityType;
  };
};
type Action =
  | AddTrainingDayType
  | RemoveTrainingDayType
  | AddExerciseType
  | RemoveExerciseType
  | ChangeExerciseType
  | IncrementSelectedExerciseSetsType
  | DecrementSelectedExerciseSetsType
  | InitializeStateType
  | IncrementFrequencyProgressionType
  | DecrementFrequencyProgressionType;

export function muscleEditorReducer(state: MusclePriorityType, action: Action) {
  const muscle = state.muscle;
  const exercises = state.exercises;
  const volume_landmark = state.volume.landmark;
  const frequency_progression = state.frequency.progression;
  const setProgressionMatrix = state.frequency.setProgressionMatrix;

  switch (action.type) {
    case "ADD_TRAINING_DAY":
      const split_sessions_for_max_frequency = action.payload.split_sessions;
      const targetFrequencyIndex = action.payload.target_frequency_index;
      let adjustableFrequencyProgression = [...frequency_progression];
      const total_possible_freq = getMusclesMaxFrequency(
        split_sessions_for_max_frequency,
        muscle
      );
      const canAdd = canTargetFrequencyBeIncreased(total_possible_freq);
      const isIncremented = incrementTargetFrequency(
        targetFrequencyIndex,
        adjustableFrequencyProgression,
        canAdd
      );

      if (!isIncremented) return state;
      adjustableFrequencyProgression = [...isIncremented];

      const updatedSetProgressionOnFrequencyChange = updateSetProgression(
        adjustableFrequencyProgression,
        setProgressionMatrix
      );

      const exercisesOnAddedTrainingDay = updateExercisesOnSetProgressionChange(
        muscle,
        volume_landmark,
        updatedSetProgressionOnFrequencyChange,
        exercises
      );
      return {
        ...state,
        exercises: exercisesOnAddedTrainingDay,
        frequency: {
          ...state.frequency,
          progression: adjustableFrequencyProgression,
          setProgressionMatrix: updatedSetProgressionOnFrequencyChange,
        },
      };
    case "REMOVE_TRAINING_DAY":
      const removed_index = action.payload.removed_index;

      const exercisesAfterRemovedTrainingDay =
        updateExercisesOnTrainingDayRemoval(removed_index, exercises);
      const frequencyProgressionUponRemovedExercises =
        updateFrequencyProgressionOnTrainingDayRemoval(
          removed_index,
          exercisesAfterRemovedTrainingDay,
          frequency_progression
        );
      const adjustedSetProgressionOnFrequencyProgressionChange =
        updateSetProgression(
          frequencyProgressionUponRemovedExercises,
          setProgressionMatrix
        );
      return {
        ...state,
        exercises: exercisesAfterRemovedTrainingDay,
        frequency: {
          ...state.frequency,
          progression: frequencyProgressionUponRemovedExercises,
          setProgressionMatrix:
            adjustedSetProgressionOnFrequencyProgressionChange,
        },
      };
    case "ADD_EXERCISE":
      const raw_exercise = action.payload.exercise;
      const sessionIndex = action.payload.session_index;
      const cloned_exercises = structuredClone(exercises);

      const data = addNewExerciseSetsToSetProgressionMatrix(
        frequency_progression,
        setProgressionMatrix,
        sessionIndex
      );
      const new_exercise = initNewExercise(
        raw_exercise,
        volume_landmark,
        data.initialSetsPerMeso
      );
      // TODO: update setProgressionMatrix on exercise addition in a better less coupled way
      const cloned_matrix = structuredClone(setProgressionMatrix);
      cloned_matrix[cloned_matrix.length - 1][sessionIndex].push(2);

      cloned_exercises[sessionIndex]?.push(new_exercise);
      return {
        ...state,
        exercises: cloned_exercises,
        frequency: {
          ...state.frequency,
          setProgressionMatrix: cloned_matrix,
        },
      };
    case "REMOVE_EXERCISE":
      const remove_exerciseId = action.payload.id;

      const remove_exercises = exercises.map((day) => {
        return day.filter((e) => e.id !== remove_exerciseId);
      });

      let empty_index = 0;
      const filtered_exercises = remove_exercises.filter((each, index) => {
        if (!each.length) {
          empty_index = index;
        } else return each;
      });

      const totalExercises = filtered_exercises.length;
      for (let i = 0; i < frequency_progression.length; i++) {
        const limit = empty_index + 1;
        const curr = frequency_progression[i];
        if (curr >= limit) {
          if (curr > totalExercises) {
            frequency_progression[i]--;
          }
        }
      }

      return {
        ...state,
        exercises: filtered_exercises,
        frequency: {
          ...state.frequency,
          progression: frequency_progression,
        },
      };
    case "CHANGE_EXERCISE":
      const old_exerciseId = action.payload.old_exerciseId;
      const new_exercise_raw = action.payload.new_exercise;

      const changed_exercises = exercises.map((sessionExercises) => {
        return sessionExercises.map((exercise) => {
          const uid = getUID();
          if (exercise.id === old_exerciseId) {
            return {
              ...exercise,
              id: `${exercise.id}_${uid}`,
              name: new_exercise_raw.name,
            };
          } else return exercise;
        });
      });

      return {
        ...state,
        exercises: changed_exercises,
      };
    case "INCREMENT_SELECTED_EXERCISE_SETS":
      const increment_mesocycle_index = action.payload.selected_mesocycle_index;
      const increment_exerciseId = action.payload.exerciseId;
      let increment_exercise_index = [0, 0];

      for (let i = 0; i < exercises.length; i++) {
        const session = exercises[i];
        for (let j = 0; j < session.length; j++) {
          const exercise = session[j];
          if (exercise.id === increment_exerciseId) {
            increment_exercise_index = [i, j];
          }
        }
      }
      // const increment_exercise_index = exercises.map((session, s_index) => session.map((ex, ex_index) => ex.id === increment_exerciseId ? [s_index, ex_index] : null)).filter(ea => ea !== null)[0]

      const inc_session_index = increment_exercise_index[0];
      const inc_exercise_index = increment_exercise_index[1];
      const increment_selected_frequency =
        frequency_progression[increment_mesocycle_index];
      const increment_exercise_sets =
        setProgressionMatrix[increment_mesocycle_index][inc_session_index][
          inc_exercise_index
        ];
      const incremented_sets = increment_exercise_sets + 1;
      const incremented_exercise = structuredClone(exercises)
        .flat()
        .find((e) => e.id === increment_exerciseId);
      if (!incremented_exercise) return state;

      const key_value_incremented = {
        [increment_selected_frequency]: incremented_sets,
      };

      if (
        incremented_exercise.initialSets &&
        incremented_exercise.initialSets[increment_selected_frequency]
      ) {
        incremented_exercise.initialSets[increment_selected_frequency] =
          incremented_exercise.initialSets[increment_selected_frequency] + 1;
        console.log(
          incremented_exercise,
          key_value_incremented,
          increment_selected_frequency,
          "IM EXIST INCREMENT"
        );
      } else {
        incremented_exercise.initialSets = key_value_incremented;
        console.log(
          incremented_exercise,
          key_value_incremented,
          increment_selected_frequency,
          "IM NO EXIST INCREMENT"
        );
      }

      const exercisesAfterIncrementedSets = exercises.map((day) => {
        return day.map((e) => {
          if (e.id === increment_exerciseId) {
            return incremented_exercise;
          }
          return e;
        });
      });
      return {
        ...state,
        exercises: exercisesAfterIncrementedSets,
      };
    case "DECREMENT_SELECTED_EXERCISE_SETS":
      const decrement_mesocycle_index = action.payload.selected_mesocycle_index;
      const decrement_exerciseId = action.payload.exerciseId;
      let decrement_exercise_index = [0, 0];

      for (let i = 0; i < exercises.length; i++) {
        const session = exercises[i];
        for (let j = 0; j < session.length; j++) {
          const exercise = session[j];
          if (exercise.id === decrement_exerciseId) {
            decrement_exercise_index = [i, j];
          }
        }
      }

      const dec_session_index = decrement_exercise_index[0];
      const dec_exercise_index = decrement_exercise_index[1];
      const decrement_selected_frequency =
        frequency_progression[decrement_mesocycle_index];

      const decrement_matrix_sets =
        setProgressionMatrix[decrement_mesocycle_index][dec_session_index][
          dec_exercise_index
        ];

      const decremented_matrix_sets = decrement_matrix_sets - 1;
      const decremented_exercise = structuredClone(exercises)
        .flat()
        .find((e) => e.id === decrement_exerciseId);

      // TODO: note on decrement sets below zero. Should probably prompt user if they'd like to
      //       remove that exercise.
      if (!decremented_exercise || decremented_matrix_sets < 0) {
        return state;
      }

      const key_value_decremented = {
        [decrement_selected_frequency]: decremented_matrix_sets,
      };

      if (
        decremented_exercise.initialSets &&
        decremented_exercise.initialSets[decrement_selected_frequency]
      ) {
        decremented_exercise.initialSets[decrement_selected_frequency] =
          decremented_exercise.initialSets[decrement_selected_frequency] - 1;
        console.log(
          decremented_exercise,
          key_value_decremented,
          decrement_selected_frequency,
          "IM EXIST DECREMENT"
        );
      } else {
        decremented_exercise.initialSets = key_value_decremented;
        console.log(
          decremented_exercise,
          key_value_decremented,
          decrement_selected_frequency,
          "IM NO EXIST DECREMENT"
        );
      }

      const exercisesAfterDecrementedSets = exercises.map((day) => {
        return day.map((e) => {
          if (e.id === decremented_exercise.id) {
            return decremented_exercise;
          }
          return e;
        });
      });
      console.log(
        decremented_matrix_sets,
        key_value_decremented,
        decremented_exercise,
        // exercisesAfterDecrementedSets,
        "WHAT???"
      );

      return {
        ...state,
        exercises: exercisesAfterDecrementedSets,
      };
    case "INCREMENT_SELECTED_FREQUENCY_PROGRESSION":
      const increment_index = action.payload.target_index;
      const split_sessions_for_incrementable_max_frequency =
        action.payload.split_sessions;
      let incremented_frequency_progression = [...frequency_progression];

      const incrementable_frequency = getMusclesMaxFrequency(
        split_sessions_for_incrementable_max_frequency,
        muscle
      );
      const canAddToSelectFrequency = canTargetFrequencyBeIncreased(
        incrementable_frequency
      );
      const isIncrementedFrequency = incrementTargetFrequency(
        increment_index,
        incremented_frequency_progression,
        canAddToSelectFrequency
      );

      if (!isIncrementedFrequency) return state;
      incremented_frequency_progression = [...isIncrementedFrequency];

      const updatedSetProgressionOnIncrementedFrequencyProgression =
        updateSetProgression(
          incremented_frequency_progression,
          setProgressionMatrix
        );
      const exercisesOnIncrementedFrequencyProgression =
        updateExercisesOnSetProgressionChange(
          muscle,
          volume_landmark,
          updatedSetProgressionOnIncrementedFrequencyProgression,
          exercises
        );
      return {
        ...state,
        exercises: exercisesOnIncrementedFrequencyProgression,
        frequency: {
          ...state.frequency,
          progression: incremented_frequency_progression,
          setProgressionMatrix:
            updatedSetProgressionOnIncrementedFrequencyProgression,
        },
      };
    case "DECREMENT_SELECTED_FREQUENCY_PROGRESSION":
      const decrement_index = action.payload.target_index;
      let decremented_frequency_progression = [...frequency_progression];
      decremented_frequency_progression = decrementTargetFrequency(
        decrement_index,
        decremented_frequency_progression
      );
      const updatedSetProgressionOnDecrementedFrequencyProgression =
        updateSetProgression(
          decremented_frequency_progression,
          setProgressionMatrix
        );
      const exercisesOnDecrementedFrequencyProgression =
        updateExercisesOnSetProgressionChange(
          muscle,
          volume_landmark,
          updatedSetProgressionOnDecrementedFrequencyProgression,
          exercises
        );
      return {
        ...state,
        exercises: exercisesOnDecrementedFrequencyProgression,
        frequency: {
          ...state.frequency,
          progression: decremented_frequency_progression,
          setProgressionMatrix:
            updatedSetProgressionOnDecrementedFrequencyProgression,
        },
      };
    case "INITIALIZE_STATE":
      const init_muscle = action.payload.state;
      return init_muscle;
    default:
      return state;
  }
}
