import { useCallback, useEffect, useState } from "react";
import { getMusclesMaxFrequency } from "~/constants/workoutSplits";
import {
  type ExerciseType,
  type MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
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
import { calculateTotalSetsOverMesocycles } from "../utils/calculateTotalSetsPerMesocycle";
import {
  updateExercisesOnTrainingDayRemoval,
  updateFrequencyProgressionOnTrainingDayRemoval,
} from "../utils/trainingDayHelpers";

export default function useMuscleEditor(muscle: MusclePriorityType) {
  const { training_program_params, handleUpdateMuscle, split_sessions } =
    useTrainingProgramContext();
  const { microcycles, mesocycles } = training_program_params;

  const [muscleGroup, setMuscleGroup] = useState<MusclePriorityType>(muscle);

  const [selectedMesocycleIndex, setSelectedMesocycleIndex] = useState(
    mesocycles - 1
  );

  const [volumes, setVolumes] = useState<number[]>([]);
  const mesocyclesArray = Array.from(Array(mesocycles), (e, i) => i);
  const microcyclesArray = Array.from(Array(microcycles), (e, i) => i);

  useEffect(() => {
    const init_muscle_group = structuredClone(muscle);
    setMuscleGroup(init_muscle_group);
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
    (newExercise: JSONExercise, sessionIndex: number) => {
      const exercises = muscleGroup.exercises;
      const volumeLandmark = muscleGroup.volume.landmark;
      const frequencyProgression = muscleGroup.frequency.progression;
      const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;

      const data = addNewExerciseSetsToSetProgressionMatrix(
        frequencyProgression,
        setProgressionMatrix,
        sessionIndex
      );
      const new_exercise = initNewExercise(
        newExercise,
        volumeLandmark,
        data.initialSetsPerMeso
      );

      exercises[sessionIndex]?.push(new_exercise);
      setMuscleGroup((prev) => ({
        ...prev,
        frequency: {
          ...prev.frequency,
          setProgressionMatrix: data.setProgressionMatrix,
        },
        exercises: exercises,
      }));
    },
    [muscleGroup]
  );

  const onRemoveExercise = useCallback(
    (id: ExerciseType["id"]) => {
      const exercises = muscleGroup.exercises;
      const frequencyProgression = muscleGroup.frequency.progression;
      const rem_exercises = exercises.map((day) => {
        return day.filter((e) => e.id !== id);
      });

      let empty_index = 0;
      const filtered_exercises = rem_exercises.filter((each, index) => {
        if (!each.length) {
          empty_index = index;
        } else return each;
      });

      const totalExercises = filtered_exercises.length;
      for (let i = 0; i < frequencyProgression.length; i++) {
        const limit = empty_index + 1;
        const curr = frequencyProgression[i];
        if (curr >= limit) {
          if (curr > totalExercises) {
            frequencyProgression[i]--;
          }
        }
      }

      setMuscleGroup((prev) => ({
        ...prev,
        exercises: filtered_exercises,
        volume: { ...prev.volume, frequencyProgression: frequencyProgression },
      }));
    },
    [muscleGroup]
  );

  const onSetIncrement = useCallback(
    (operation: "+" | "-", exerciseId: ExerciseType["id"]) => {
      const exercises = muscleGroup.exercises;
      const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
      const frequency =
        muscleGroup.frequency.progression[selectedMesocycleIndex];
      const exercise = exercises.flat().find((e) => e.id === exerciseId);
      if (!exercise) return;

      const sets = exercise.initialSetsPerMeso[selectedMesocycleIndex];
      if (operation === "-" && sets - 1 < 1) return;

      exercise.initialSetsPerMeso[selectedMesocycleIndex] =
        sets + (operation === "+" ? 1 : -1);

      const newKeyValue = {
        [frequency]: exercise.initialSetsPerMeso[selectedMesocycleIndex],
      };

      exercise.initialSets = exercise.initialSets
        ? {
            ...exercise.initialSets,
            [frequency]: exercise.initialSetsPerMeso[selectedMesocycleIndex],
          }
        : newKeyValue;
      const incrementedExercises = exercises.map((day) => {
        return day.map((e) => {
          if (e.id === exerciseId) {
            return exercise;
          }
          return e;
        });
      });

      console.log(setProgressionMatrix, incrementedExercises, "OH BOY?");
      setMuscleGroup((prev) => ({
        ...prev,
        exercises: incrementedExercises,
      }));
    },
    [selectedMesocycleIndex, muscleGroup]
  );

  const onAddTrainingDay = useCallback(() => {
    const muscle = muscleGroup.muscle;
    const volume_landmark = muscleGroup.volume.landmark;
    const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
    const cloned_exercises = muscleGroup.exercises;
    let frequencyProgression = muscleGroup.frequency.progression;

    const total_possible_freq = getMusclesMaxFrequency(
      split_sessions,
      muscleGroup.muscle
    );

    const targetFrequencyIndex = selectedMesocycleIndex;
    const canAdd = canTargetFrequencyBeIncreased(total_possible_freq);
    const isIncremented = incrementTargetFrequency(
      targetFrequencyIndex,
      frequencyProgression,
      canAdd
    );

    if (isIncremented) {
      frequencyProgression = [...isIncremented];
    } else {
      console.log(
        "Unable to add training day since split doesn't contain another viable session for muscle.."
      );
      return;
    }

    const updatedSetProgression = updateSetProgression(
      frequencyProgression,
      setProgressionMatrix
    );

    const updatedExercises = updateExercisesOnSetProgressionChange(
      muscle,
      volume_landmark,
      updatedSetProgression,
      cloned_exercises
    );

    console.log(
      frequencyProgression,
      updatedExercises,
      updatedSetProgression,
      "-------------------------",
      "ADDED TRAINING DAY",
      "-------------------------"
    );
    setMuscleGroup((prev) => ({
      ...prev,
      exercises: updatedExercises,
      frequency: {
        ...prev.frequency,
        progression: frequencyProgression,
        setProgressionMatrix: updatedSetProgression,
      },
    }));
  }, [selectedMesocycleIndex, muscleGroup, mesocycles, microcycles]);

  const onRemoveTrainingDay = useCallback(
    (dayIndex: number) => {
      const frequencyProgression = muscleGroup.frequency.progression;
      const exercises = muscleGroup.exercises;
      const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;

      const updatedExercises = updateExercisesOnTrainingDayRemoval(
        dayIndex,
        exercises
      );
      const updatedFrequencyProgression =
        updateFrequencyProgressionOnTrainingDayRemoval(
          dayIndex,
          updatedExercises,
          frequencyProgression
        );
      const updatedSetProgression = updateSetProgression(
        updatedFrequencyProgression,
        setProgressionMatrix
      );

      console.log(
        updatedExercises,
        updatedFrequencyProgression,
        updatedSetProgression,
        "-------------------------",
        "REMOVED TRAINING DAY",
        "-------------------------"
      );
      setMuscleGroup((prev) => ({
        ...prev,
        exercises: updatedExercises,
        frequency: {
          ...prev.frequency,
          progression: updatedFrequencyProgression,
          setProgressionMatrix: updatedSetProgression,
        },
      }));
    },
    [selectedMesocycleIndex, muscleGroup]
  );

  const onFrequencyProgressionIncrement = useCallback(
    (targetIndex: number, operation: "+" | "-") => {
      const muscle = muscleGroup.muscle;
      const volume_landmark = muscleGroup.volume.landmark;
      const exercises = muscleGroup.exercises;
      const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
      let frequencyProgression = muscleGroup.frequency.progression;

      if (operation === "+") {
        const total_possible_freq = getMusclesMaxFrequency(
          split_sessions,
          muscleGroup.muscle
        );
        const canAdd = canTargetFrequencyBeIncreased(total_possible_freq);
        const isIncremented = incrementTargetFrequency(
          targetIndex,
          frequencyProgression,
          canAdd
        );

        if (isIncremented) {
          frequencyProgression = [...isIncremented];
        }
      } else {
        frequencyProgression = decrementTargetFrequency(
          targetIndex,
          frequencyProgression
        );
      }

      const updatedSetProgression = updateSetProgression(
        frequencyProgression,
        setProgressionMatrix
      );
      const updatedExercises = updateExercisesOnSetProgressionChange(
        muscle,
        volume_landmark,
        updatedSetProgression,
        exercises
      );

      console.log(
        operation,
        targetIndex,
        frequencyProgression,
        updatedSetProgression,
        "OH BOY WHAT DIS?"
      );

      setMuscleGroup((prev) => ({
        ...prev,
        frequency: {
          ...prev.frequency,
          progression: [...frequencyProgression],
          setProgressionMatrix: updatedSetProgression,
        },
        exercises: updatedExercises,
      }));
    },
    [muscleGroup, microcycles, mesocycles, split_sessions]
  );

  const onResetMuscleGroup = useCallback(() => {
    const muscleCloned = structuredClone(muscle);
    setMuscleGroup(muscleCloned);
  }, [muscle]);

  const onSaveMuscleGroupChanges = useCallback(() => {
    handleUpdateMuscle(muscleGroup);
  }, [muscleGroup]);

  return {
    muscleGroup,
    volumes,
    selectedMesocycleIndex,
    onSelectMesocycle,
    mesocyclesArray,
    microcyclesArray,
    onSetIncrement,
    onAddTrainingDay,
    onAddExercise,
    onRemoveExercise,
    onRemoveTrainingDay,
    onResetMuscleGroup,
    onSaveMuscleGroupChanges,
    toggleSetProgression,
    onFrequencyProgressionIncrement,
  };
}
