import { useCallback, useEffect, useState } from "react";
import { getMusclesMaxFrequency, MuscleType } from "~/constants/workoutSplits";
import {
  type ExerciseType,
  type MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import {
  addNewExerciseSetsToSetProgressionMatrix,
  getFinalMicrocycleSets_AddOnePerMicrocycle,
  initNewExercise,
  JSONExercise,
  updateExercisesOnSetProgressionChange,
  updateInitialSetsForExercisesTEST,
  updateSetProgression,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import {
  canTargetFrequencyBeIncreased,
  decrementTargetFrequency,
  incrementTargetFrequency,
} from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/maximumFrequencyHandlers";

const calculateTotalVolume = (
  exercises: ExerciseType[][],
  frequencyProgression: number[],
  setProgressionMatrix: number[][][],
  mesocycles: number,
  microcycles: number,
  muscleGroup: MuscleType
) => {
  const totalVolumes = Array.from(frequencyProgression, (e, i) => 0);
  console.log(
    muscleGroup,
    exercises,
    totalVolumes,
    frequencyProgression,
    "LETS START THE LOGGING?? BEFORE"
  );
  if (exercises.length === 0) return totalVolumes;

  for (let i = 0; i < frequencyProgression.length; i++) {
    const frequency = frequencyProgression[i];
    const matrixIndex = setProgressionMatrix.findIndex(
      (row) => row.length === frequency
    );

    if (matrixIndex < 0) {
      console.log(
        frequency,
        setProgressionMatrix,
        matrixIndex,
        "matrixIndex isn't in matrix"
      );
      continue;
    }

    let totalVolume = 0;
    const row = setProgressionMatrix[matrixIndex];

    for (let j = 0; j < exercises.length; j++) {
      const sessionExercises = exercises[j];
      const sessionSets: number[] = [];

      for (let g = 0; g < sessionExercises.length; g++) {
        const exercise = sessionExercises[g];

        const initialSets = exercise.initialSets
          ? exercise.initialSets[frequency]
            ? exercise.initialSets[frequency]
            : undefined
          : undefined;

        const matrixRowSets = row[j] && row[j][g] ? row[j][g] : 0;
        const sets = initialSets ? initialSets : matrixRowSets;
        sessionSets.push(sets);
      }
      const totalSets = getFinalMicrocycleSets_AddOnePerMicrocycle(
        sessionSets,
        microcycles
      );
      const sessionsSetsTotalVolume = totalSets[totalSets.length - 1].reduce(
        (acc, set) => acc + set,
        0
      );
      totalVolume = totalVolume + sessionsSetsTotalVolume;
      console.log(
        exercises.flat().map((ea) => ea.name),
        totalSets,
        sessionsSetsTotalVolume,
        totalVolume,
        totalVolumes,
        "WHY NaN??"
      );
    }
    totalVolumes[i] = totalVolume;
  }

  return totalVolumes;
};

const updateExercisesOnFrequencyIncrement = (
  exercises: ExerciseType[][],
  frequencyProgression: number[],
  frequencyIndex: number
) => {
  const copiedExercises = structuredClone(exercises);
  const currFreq = frequencyProgression[frequencyIndex];
  const nextFreq = frequencyProgression[frequencyIndex + 1];

  const exerciseIndex = frequencyProgression[frequencyIndex] - 1;
  const sessionExercises = copiedExercises[exerciseIndex];

  console.log(
    frequencyProgression,
    frequencyIndex,
    currFreq,
    nextFreq,
    exerciseIndex,
    sessionExercises,
    "OH MY LOTS OF DATA"
  );

  for (let i = 0; i < sessionExercises.length; i++) {
    const nextFreqSets =
      sessionExercises[i].initialSetsPerMeso[frequencyIndex + 1];
    const nextAlgoSchema =
      sessionExercises[i].setProgressionSchema[frequencyIndex + 1];
    sessionExercises[i].initialSetsPerMeso[frequencyIndex] = nextFreqSets;
    sessionExercises[i].setProgressionSchema[frequencyIndex] = nextAlgoSchema;
  }

  copiedExercises[exerciseIndex] = sessionExercises;
  return copiedExercises;
};

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
    const cloned_muscle = structuredClone(muscle);
    setMuscleGroup(cloned_muscle);
  }, [muscle]);

  useEffect(() => {
    const exercises = muscleGroup.exercises;
    const frequencyProgression = muscleGroup.frequency.progression;
    const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
    const totalVolumes = calculateTotalVolume(
      exercises,
      frequencyProgression,
      setProgressionMatrix,
      mesocycles,
      microcycles,
      muscleGroup.muscle
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

  const onRemoveTrainingDay = useCallback(
    (dayIndex: number) => {
      const frequencyProgression = muscleGroup.frequency.progression;
      frequencyProgression[selectedMesocycleIndex]--;

      const exercises = muscleGroup.exercises;
      exercises.splice(dayIndex, 1);

      setMuscleGroup((prev) => ({
        ...prev,
        exercises: exercises,
        volume: { ...prev.volume, frequencyProgression: frequencyProgression },
      }));
    },
    [selectedMesocycleIndex, muscleGroup]
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

  const onAddTrainingDay = useCallback(
    (firstExercise?: JSONExercise, dayIndex?: number) => {
      const frequencyProgression = muscleGroup.frequency.progression;
      const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
      const cloned_exercises = muscleGroup.exercises;

      if (!firstExercise || !dayIndex) {
        frequencyProgression[selectedMesocycleIndex]++;

        const sessionExercises = updateExercisesOnFrequencyIncrement(
          cloned_exercises,
          frequencyProgression,
          selectedMesocycleIndex
        );

        setMuscleGroup((prev) => ({
          ...prev,
          exercises: sessionExercises,
          volume: {
            ...prev.volume,
            frequencyProgression: frequencyProgression,
          },
        }));
      } else {
        // const added = frequencyProgression[frequencyProgression.length - 1] + 1;
        frequencyProgression[frequencyProgression.length - 1]++;

        const data = addNewExerciseSetsToSetProgressionMatrix(
          frequencyProgression,
          setProgressionMatrix,
          frequencyProgression[frequencyProgression.length - 1]
        );
        console.log(
          data,
          muscleGroup,
          frequencyProgression,
          "OH BOY WHAT DIS?"
        );
        const initial_exercise = initNewExercise(
          firstExercise,
          muscleGroup.volume.landmark,
          data.initialSetsPerMeso
        );

        cloned_exercises.push([initial_exercise]);

        const updated_exercises = updateInitialSetsForExercisesTEST(
          cloned_exercises,
          frequencyProgression.length - 1,
          frequencyProgression[frequencyProgression.length - 1],
          data.setProgressionMatrix
        );

        setMuscleGroup((prev) => ({
          ...prev,
          exercises: updated_exercises,
          frequency: {
            ...prev.frequency,
            progression: frequencyProgression,
            setProgressionMatrix: data.setProgressionMatrix,
          },
        }));
      }
    },
    [selectedMesocycleIndex, muscleGroup, mesocycles, microcycles]
  );

  const onFrequencyProgressionIncrement = useCallback(
    (targetIndex: number, operation: "+" | "-") => {
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
      const realUpdatedExercises = updateExercisesOnSetProgressionChange(
        updatedSetProgression,
        exercises
      );
      const updatedExercises = updateInitialSetsForExercisesTEST(
        exercises,
        targetIndex,
        frequencyProgression[targetIndex],
        updatedSetProgression
      );

      console.log(
        operation,
        targetIndex,
        frequencyProgression,
        updatedSetProgression,
        updatedExercises,
        "OH BOY WHAT DIS?"
      );

      setMuscleGroup((prev) => ({
        ...prev,
        frequency: {
          ...prev.frequency,
          progression: [...frequencyProgression],
          setProgressionMatrix: updatedSetProgression,
        },
        exercises: realUpdatedExercises,
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
