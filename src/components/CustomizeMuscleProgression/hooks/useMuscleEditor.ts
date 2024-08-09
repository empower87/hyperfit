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
  updateInitialSetsForExercisesTEST,
} from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import {
  canTargetFrequencyBeIncreased,
  incrementTargetFrequency,
} from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/maximumFrequencyHandlers";
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
      const frequencyProgression = muscleGroup.frequency.progression;
      const setProgressionMatrix = muscleGroup.frequency.setProgressionMatrix;
      let target_freq = frequencyProgression[targetIndex];

      if (operation === "+") {
        const total_possible_freq = getMusclesMaxFrequency(
          split_sessions,
          muscleGroup.muscle
        );
        const canAdd = canTargetFrequencyBeIncreased(total_possible_freq);
        const incrementedFrequency = incrementTargetFrequency(
          targetIndex,
          frequencyProgression,
          canAdd
        );
        console.log(
          targetIndex,
          frequencyProgression,
          total_possible_freq,
          canAdd,
          incrementedFrequency,
          "WHAT WE WORKING WITH??"
        );

        // const next = frequencyProgression[targetIndex + 1];
        // if (next) {
        //   if (target_freq < next) {
        //     target_freq++;
        //   }
        // } else {
        //   // const prevFreq = muscle.frequency.progression[targetIndex];
        //   // if (target_freq < prevFreq) {
        //   //   target_freq++;
        //   // }

        //   const total_possible_freq = getMusclesMaxFrequency(
        //     split_sessions,
        //     muscleGroup.muscle
        //   );
        //   const canAdd = canTargetFrequencyBeIncreased(total_possible_freq);
        //   const incrementedFrequency = incrementTargetFrequency(
        //     targetIndex,
        //     frequencyProgression,
        //     canAdd
        //   );
        //   if (canAddFrequencyToMuscleGroup(target_freq, total_possible_freq)) {
        //     target_freq++;
        //   } else {
        //     const prevFreq = muscle.frequency.progression[targetIndex];
        //     if (target_freq < prevFreq) {
        //       target_freq++;
        //     }
        //   }
        // }
      } else {
        const prev = frequencyProgression[targetIndex - 1];
        if (prev) {
          if (target_freq > prev) {
            target_freq--;
          }
        } else {
          if (target_freq > 0) {
            target_freq--;
          }
        }
      }

      let newExercises: ExerciseType[][] = muscleGroup.exercises;
      const updatedExercises = updateInitialSetsForExercisesTEST(
        exercises,
        targetIndex,
        target_freq,
        setProgressionMatrix
      );
      if (updatedExercises) {
        newExercises = updatedExercises;
        frequencyProgression[targetIndex] = target_freq;
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
