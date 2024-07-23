import { useCallback, useEffect, useState } from "react";
import {
  type ExerciseType,
  type MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import {
  addNewExerciseSetsToSetProgressionMatrix,
  Exercise,
  initNewExercise,
  updateInitialSetsForExercisesTEST,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { getSetProgressionForExercise } from "../../../hooks/useTrainingProgram/utils/exercises/setProgressionOverMicrocycles";

const calculateTotalVolume = (
  exercises: ExerciseType[][],
  mesocycles: number,
  microcycles: number
) => {
  const totalVolumes = Array.from(Array(mesocycles), (e, i) => 0);
  for (let i = 0; i < exercises.length; i++) {
    const sessionExercises = exercises[i];
    for (let g = 0; g < sessionExercises.length; g++) {
      const exercise = sessionExercises[g];
      for (let j = 0; j < mesocycles; j++) {
        const sets = getSetProgressionForExercise(
          sessionExercises[g].setProgressionSchema[j],
          j,
          sessionExercises[g],
          microcycles,
          sessionExercises.length,
          g
        );

        totalVolumes[j] = totalVolumes[j] + sets[sets.length - 1];
      }
    }
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
  const { training_program_params, handleUpdateMuscle } =
    useTrainingProgramContext();
  const { microcycles, mesocycles } = training_program_params;

  const [muscleGroup, setMuscleGroup] = useState<MusclePriorityType>(muscle);
  const [frequencyProgression, setFrequencyProgression] = useState<number[]>(
    muscle.frequency.progression
  );
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
    const totalVolumes = calculateTotalVolume(
      exercises,
      mesocycles,
      microcycles
    );
    const forLoggingExercises = exercises.map((each) =>
      each.map((ea) => [ea.muscle, ea.name, ea.initialSetsPerMeso])
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
    (newExercise: Exercise, sessionIndex: number) => {
      const exercises = muscleGroup.exercises;
      const data = addNewExerciseSetsToSetProgressionMatrix(
        muscleGroup.frequency.setProgressionMatrix,
        sessionIndex
      );
      const new_exercise = initNewExercise(
        newExercise,
        muscleGroup.volume.landmark,
        sessionIndex,
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
      const exercise = exercises.flat().find((e) => e.id === exerciseId);
      if (!exercise) return;

      const sets = exercise.initialSetsPerMeso[selectedMesocycleIndex];
      if (operation === "-" && sets - 1 < 1) return;

      exercise.initialSetsPerMeso[selectedMesocycleIndex] =
        sets + (operation === "+" ? 1 : -1);

      const incrementedExercise = exercises.map((day) => {
        return day.map((e) => {
          if (e.id === exerciseId) {
            return exercise;
          }
          return e;
        });
      });

      setMuscleGroup((prev) => ({
        ...prev,
        exercises: incrementedExercise,
      }));
    },
    [selectedMesocycleIndex, muscleGroup]
  );

  const onAddTrainingDay = useCallback(
    (firstExercise?: Exercise, dayIndex?: number) => {
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
        const added = frequencyProgression[frequencyProgression.length - 1] + 1;
        frequencyProgression[frequencyProgression.length - 1]++;

        const data = addNewExerciseSetsToSetProgressionMatrix(
          setProgressionMatrix,
          added
        );
        const initial_exercise = initNewExercise(
          firstExercise,
          muscleGroup.volume.landmark,
          added,
          data.initialSetsPerMeso
        );

        cloned_exercises.push([initial_exercise]);
        setMuscleGroup((prev) => ({
          ...prev,
          exercises: cloned_exercises,
          volume: {
            ...prev.volume,
            frequencyProgression: frequencyProgression,
          },
        }));
      }
    },
    [selectedMesocycleIndex, muscleGroup, mesocycles, microcycles]
  );

  const canAddOrSubtractFrequency = (
    freqProgression: number[],
    targetIndex: number,
    operation: "+" | "-"
  ) => {
    if (operation === "+") {
      const next = freqProgression[targetIndex + 1];
      if (next && freqProgression[targetIndex] < next) {
        return next;
      }
    } else {
      const prev = freqProgression[targetIndex - 1];
      if (prev && freqProgression[targetIndex] > prev) {
        return prev;
      }
    }
    return false;
  };

  const onFrequencyProgressionIncrement = useCallback(
    (targetIndex: number, operation: "+" | "-") => {
      const exercises = muscleGroup.exercises;
      const rank = muscleGroup.volume.landmark;
      const exercisesPerSessionSchema =
        muscleGroup.volume.exercisesPerSessionSchema;
      const frequencyProgression = muscleGroup.frequency.progression;
      const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
      let curr = frequencyProgression[targetIndex];

      if (operation === "+") {
        const next = frequencyProgression[targetIndex + 1];
        if (next) {
          if (curr < next) {
            curr++;
          }
        } else {
          const prevFreq = muscle.frequency.progression[targetIndex];
          if (curr < prevFreq) {
            curr++;
          }
        }
      } else {
        const prev = frequencyProgression[targetIndex - 1];
        if (prev) {
          if (curr > prev) {
            curr--;
          }
        } else {
          if (curr > 0) {
            curr--;
          }
        }
      }

      let newExercises: ExerciseType[][] = muscleGroup.exercises;
      const updatedExercises = updateInitialSetsForExercisesTEST(
        exercises,
        targetIndex,
        curr,
        setProgressionMatrix
      );
      if (updatedExercises) {
        newExercises = updatedExercises;
        frequencyProgression[targetIndex] = curr;
      }

      setMuscleGroup((prev) => ({
        ...prev,
        exercises: newExercises,
        volume: {
          ...prev.volume,
          frequencyProgression: frequencyProgression,
        },
      }));
    },
    [muscleGroup, microcycles, mesocycles]
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
