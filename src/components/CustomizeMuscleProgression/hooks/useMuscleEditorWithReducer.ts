import { useCallback, useEffect, useReducer, useState } from "react";
import {
  type ExerciseType,
  type MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { getExerciseSetsOverMicrocycles, JSONExercise } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { setProgression_addOnePerMicrocycle_TEST } from "~/hooks/useTrainingProgram/utils/exercises/setProgressionOverMicrocycles";
import { calculateTotalSetsOverMesocycles } from "../utils/calculateTotalSetsPerMesocycle";
import { muscleEditorReducer } from "../utils/muscleEditorReducer";

export default function useMuscleEditor(muscle: MusclePriorityType) {
  const { training_program_params, handleUpdateMuscle, split_sessions } =
    useTrainingProgramContext();
  const { microcycles, mesocycles } = training_program_params;
  const [muscleGroup, dispatch] = useReducer(muscleEditorReducer, muscle);
  const [selectedMesocycleIndex, setSelectedMesocycleIndex] = useState(
    mesocycles - 1
  );

  const [volumes, setVolumes] = useState<number[]>([]);
  const mesocyclesArray = Array.from(Array(mesocycles), (e, i) => i);
  const microcyclesArray = Array.from(Array(microcycles), (e, i) => i);

  useEffect(() => {
    const cloned_muscle_params = structuredClone(muscle);
    dispatch({
      type: "INITIALIZE_STATE",
      payload: { state: cloned_muscle_params },
    });
  }, [muscle]);

  useEffect(() => {
    const exercises = muscleGroup.exercises;
    const frequencyProgression = muscleGroup.frequency.progression;
    const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
    const totalVolumes = calculateTotalSetsOverMesocycles(
      exercises,
      frequencyProgression,
      setProgressionMatrix,
      microcycles
    );

    const forLoggingExercises = exercises.map((each) =>
      each.map((ea) => [
        ea.muscle,
        ea.name,
        ea.initialSetsPerMeso,
        ea.setProgressionSchema,
      ])
    );
    console.log(forLoggingExercises, totalVolumes, "OH MY LETS LOOK AT THIS");
    setVolumes(totalVolumes);
  }, [microcycles, mesocycles, muscleGroup]);

  const onSelectMesocycle = useCallback(
    (index: number) => {
      setSelectedMesocycleIndex(index);
    },
    [selectedMesocycleIndex]
  );

  const toggleSetProgression = () => {
    console.log("toggled");
  };

  const onAddExercise = useCallback(
    (exercise: JSONExercise, session_index: number) => {
      dispatch({
        type: "ADD_EXERCISE",
        payload: { exercise, session_index },
      });
    },
    []
  );

  const onRemoveExercise = useCallback((id: ExerciseType["id"]) => {
    dispatch({
      type: "REMOVE_EXERCISE",
      payload: { id },
    });
  }, []);

  const onChangeExercise = useCallback(
    (old_exerciseId: ExerciseType["id"], new_exercise: JSONExercise) => {
      dispatch({
        type: "CHANGE_EXERCISE",
        payload: { old_exerciseId, new_exercise },
      });
    },
    []
  );

  const getSetsByExerciseId = useCallback(
    (exerciseId: ExerciseType["id"]) => {
      
      // const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
      // const setProgressionLengths = Array.from(
      //   setProgressionMatrix,
      //   (e, i) => e.length
      // );
      // const frequency =
      //   muscleGroup.frequency.progression[selectedMesocycleIndex];
      // const setProgressionIndex = setProgressionLengths.indexOf(frequency);

      // let dayIndex = 0;
      // let exerciseIndex = 0;
      // let totalExercisesInSession = 0;
      // let foundExercise: ExerciseType | null = null;

      // for (let i = 0; i < muscleGroup.exercises.length; i++) {
      //   const sessionExercises = muscleGroup.exercises[i];
      //   for (let j = 0; j < sessionExercises.length; j++) {
      //     const exercise = sessionExercises[j];
      //     if (exercise.id === exerciseId) {
      //       dayIndex = i;
      //       exerciseIndex = j;
      //       totalExercisesInSession = sessionExercises.length;
      //       foundExercise = exercise;
      //       continue;
      //     }
      //   }
      // }

      // const setsByMatrix =
      //   setProgressionMatrix[setProgressionIndex][dayIndex][exerciseIndex];

      // const initialSets =
      //   foundExercise &&
      //   foundExercise.initialSets &&
      //   foundExercise.initialSets[frequency]
      //     ? foundExercise.initialSets[frequency]
      //     : setsByMatrix;

      // const sets = setProgression_addOnePerMicrocycle_TEST(
      //   microcycles,
      //   totalExercisesInSession,
      //   exerciseIndex,
      //   initialSets
      // );
      // console.log(foundExercise, sets, initialSets, "GOT SETS");
      // return sets;
      return getExerciseSetsOverMicrocycles(exerciseId, muscleGroup, selectedMesocycleIndex, microcycles)
    },
    [muscleGroup, selectedMesocycleIndex]
  );

  const onSelectedExerciseSetIncrement = useCallback(
    (exerciseId: ExerciseType["id"]) => {
      dispatch({
        type: "INCREMENT_SELECTED_EXERCISE_SETS",
        payload: {
          exerciseId,
          selected_mesocycle_index: selectedMesocycleIndex,
        },
      });
    },
    [selectedMesocycleIndex]
  );

  const onSelectedExerciseSetDecrement = useCallback(
    (exerciseId: ExerciseType["id"]) => {
      dispatch({
        type: "DECREMENT_SELECTED_EXERCISE_SETS",
        payload: {
          exerciseId,
          selected_mesocycle_index: selectedMesocycleIndex,
        },
      });
    },
    [selectedMesocycleIndex]
  );

  const onAddTrainingDay = useCallback(() => {
    dispatch({
      type: "ADD_TRAINING_DAY",
      payload: {
        split_sessions: split_sessions,
        target_frequency_index: selectedMesocycleIndex,
      },
    });
  }, [selectedMesocycleIndex, split_sessions]);

  const onRemoveTrainingDay = useCallback(
    (dayIndex: number) => {
      dispatch({
        type: "REMOVE_TRAINING_DAY",
        payload: {
          removed_index: dayIndex,
        },
      });
    },
    [selectedMesocycleIndex, muscleGroup]
  );

  const onSelectedFrequencyProgressionIncrement = useCallback(
    (target_index: number) => {
      dispatch({
        type: "INCREMENT_SELECTED_FREQUENCY_PROGRESSION",
        payload: {
          target_index,
          split_sessions,
        },
      });
    },
    [split_sessions]
  );

  const onSelectedFrequencyProgressionDecrement = useCallback(
    (target_index: number) => {
      dispatch({
        type: "DECREMENT_SELECTED_FREQUENCY_PROGRESSION",
        payload: {
          target_index,
        },
      });
    },
    []
  );

  const onResetMuscleGroup = useCallback(() => {
    const muscleCloned = structuredClone(muscle);
    dispatch({
      type: "INITIALIZE_STATE",
      payload: {
        state: muscleCloned,
      },
    });
  }, [muscle]);

  const onSaveMuscleGroupChanges = useCallback(() => {
    handleUpdateMuscle(muscleGroup);
  }, [muscleGroup, handleUpdateMuscle]);

  const totalExercisesByMeso =
    muscleGroup.frequency.progression[selectedMesocycleIndex];

  return {
    muscleGroup,
    frequencyProgression: muscleGroup.frequency.progression,
    setProgressionMatrix: muscleGroup.frequency.setProgressionMatrix,
    exercises: muscleGroup.exercises,
    exercisesInView: muscleGroup.exercises.slice(0, totalExercisesByMeso),
    volumes,
    selectedMesocycleIndex,
    onSelectMesocycle,
    mesocyclesArray,
    microcyclesArray,
    onAddTrainingDay,
    onRemoveTrainingDay,
    onAddExercise,
    onRemoveExercise,
    onChangeExercise,
    getSetsByExerciseId,
    onSelectedExerciseSetIncrement,
    onSelectedExerciseSetDecrement,
    onSelectedFrequencyProgressionIncrement,
    onSelectedFrequencyProgressionDecrement,
    onResetMuscleGroup,
    onSaveMuscleGroupChanges,
    toggleSetProgression,
  };
}
