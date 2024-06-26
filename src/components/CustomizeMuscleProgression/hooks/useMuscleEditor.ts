import { useCallback, useEffect, useState } from "react";
import { MuscleType } from "~/constants/workoutSplits";
import {
  type ExerciseType,
  type MusclePriorityType,
  type VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import {
  Exercise,
  initializeNewExerciseSetsPerMeso,
} from "~/utils/getExercises";
import { getSetProgressionForExercise } from "../utils/setProgressionHandlers";

const getNewExercise = (
  newExercise: Exercise,
  frequencyProgression: number[],
  landmark: VolumeLandmarkType,
  dayIndex: number
) => {
  const setProgression = initializeNewExerciseSetsPerMeso(
    frequencyProgression,
    dayIndex
  );
  const new_exercise: ExerciseType = {
    id: newExercise.id,
    exercise: newExercise.name,
    muscle: newExercise.group as MuscleType,
    session: dayIndex,
    rank: landmark,
    sets: 2,
    reps: 10,
    weight: 100,
    rir: 3,
    weightIncrement: 2,
    trainingModality: "straight",
    mesocycle_progression: [],
    supersetWith: null,
    initialSetsPerMeso: setProgression.sets,
    setProgressionSchema: setProgression.schemas,
  };
  return new_exercise;
};

const calculateTotalVolume = (
  exercises: ExerciseType[][],
  mesocycles: number,
  microcycles: number
) => {
  const totalVolumes = Array.from(Array(mesocycles), (e, i) => 0);
  for (let i = 0; i < exercises.length; i++) {
    for (let g = 0; g < exercises[i].length; g++) {
      for (let j = 0; j < mesocycles; j++) {
        const sets = getSetProgressionForExercise(
          exercises[i][g].setProgressionSchema[j],
          j,
          exercises[i][g],
          microcycles,
          exercises[i].length,
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
  const nextFreq = frequencyProgression[frequencyIndex + 1];
  const sessionIndex = frequencyProgression[frequencyIndex] - 1;
  const sessionExercises = exercises[sessionIndex];

  const toCopyExercises = exercises[nextFreq - 1];

  for (let i = 0; i < sessionExercises.length; i++) {
    const nextFreqSets =
      toCopyExercises[i].initialSetsPerMeso[frequencyIndex + 1];
    const nextAlgoSchema =
      toCopyExercises[i].setProgressionSchema[frequencyIndex + 1];
    sessionExercises[i].initialSetsPerMeso[frequencyIndex] = nextFreqSets;
    sessionExercises[i].setProgressionSchema[frequencyIndex] = nextAlgoSchema;
  }

  exercises[sessionIndex] = sessionExercises;
  return exercises;
};

export default function useMuscleEditor(muscle: MusclePriorityType) {
  const { training_program_params, handleUpdateMuscle } =
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
    setVolumes(totalVolumes);
  }, [selectedMesocycleIndex, microcycles, mesocycles, muscleGroup]);

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
    (newExercise: Exercise, dayIndex: number) => {
      const exercises = muscleGroup.exercises;
      const new_exercise = getNewExercise(
        newExercise,
        muscleGroup.volume.frequencyProgression,
        muscleGroup.volume.landmark,
        dayIndex
      );

      exercises[dayIndex]?.push(new_exercise);
      setMuscleGroup((prev) => ({
        ...prev,
        exercises: exercises,
      }));
    },
    [muscleGroup]
  );

  const onRemoveExercise = useCallback(
    (id: ExerciseType["id"]) => {
      const exercises = muscleGroup.exercises;
      const frequencyProgression = muscleGroup.volume.frequencyProgression;
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
      const frequencyProgression = muscleGroup.volume.frequencyProgression;
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
      const frequencyProgression = muscleGroup.volume.frequencyProgression;
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
        frequencyProgression[frequencyProgression.length - 1]++;
        const initial_exercise = getNewExercise(
          firstExercise,
          frequencyProgression,
          muscleGroup.volume.landmark,
          dayIndex
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
    [selectedMesocycleIndex, muscleGroup]
  );

  const onFrequencyProgressionIncrement = useCallback(
    (targetIndex: number, operation: "+" | "-") => {
      const exercises = muscleGroup.exercises;
      const frequencyProgression = muscleGroup.volume.frequencyProgression;
      let curr = frequencyProgression[targetIndex];

      if (operation === "+") {
        const next = frequencyProgression[targetIndex + 1];
        if (next) {
          if (curr < next) {
            curr++;
            frequencyProgression[targetIndex] = curr;
            const updatedExercises = updateExercisesOnFrequencyIncrement(
              exercises,
              frequencyProgression,
              targetIndex
            );
            setMuscleGroup((prev) => ({
              ...prev,
              exercises: updatedExercises,
              volume: {
                ...prev.volume,
                frequencyProgression: frequencyProgression,
              },
            }));
          }
        } else {
          const prevFreq = muscle.volume.frequencyProgression[targetIndex];
          if (curr < prevFreq) {
            curr++;
            frequencyProgression[targetIndex] = curr;
            setMuscleGroup((prev) => ({
              ...prev,
              volume: {
                ...prev.volume,
                frequencyProgression: frequencyProgression,
              },
            }));
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
        frequencyProgression[targetIndex] = curr;
        setMuscleGroup((prev) => ({
          ...prev,
          volume: {
            ...prev.volume,
            frequencyProgression: frequencyProgression,
          },
        }));
      }
    },
    [muscleGroup]
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
