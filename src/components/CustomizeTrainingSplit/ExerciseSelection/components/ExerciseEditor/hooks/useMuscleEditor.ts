import { useCallback, useEffect, useState } from "react";
import { MuscleType } from "~/constants/workoutSplits";
import {
  ExerciseType,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
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
  let totalVolumes = Array.from(Array(mesocycles), (e, i) => 0);
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

  useEffect(() => {
    setMuscleGroup(muscle);
  }, [muscle]);

  useEffect(() => {
    // const matrix = muscleGroup.volume.setProgressionMatrix;
    // const totals: number[] = [];
    // for (let i = 0; i < matrix.length; i++) {
    //   const lastMatrix = matrix[i][microcycles - 1];
    //   const totalVolume = lastMatrix.flat().reduce((acc, cur) => acc + cur, 0);
    //   totals.push(totalVolume);
    // }
    const exercises = muscleGroup.exercises;

    let totalVolumes = calculateTotalVolume(exercises, mesocycles, microcycles);

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
      const exercises = structuredClone(muscleGroup.exercises);
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
      const exercises = [...muscleGroup.exercises];
      const rem_exercises = exercises.map((day) => {
        return day.filter((e) => e.id !== id);
      });
      setMuscleGroup((prev) => ({
        ...prev,
        exercises: rem_exercises.filter((each) => each.length),
      }));
    },
    [muscleGroup]
  );

  const onRemoveTrainingDay = useCallback(
    (dayIndex: number) => {
      const freq = [...muscleGroup.volume.frequencyProgression];
      freq[selectedMesocycleIndex]--;
      const cloned_exercises = structuredClone(muscleGroup.exercises);
      cloned_exercises.splice(dayIndex, 1);
      setMuscleGroup((prev) => ({
        ...prev,
        exercises: cloned_exercises,
        volume: { ...prev.volume, frequencyProgression: freq },
      }));
    },
    [selectedMesocycleIndex, muscleGroup]
  );

  const onSetIncrement = useCallback(
    (operation: "+" | "-", exerciseId: ExerciseType["id"]) => {
      const copiedExercises = structuredClone(muscleGroup.exercises);
      const exercise = copiedExercises.flat().find((e) => e.id === exerciseId);
      if (!exercise) return;
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

      setMuscleGroup((prev) => ({
        ...prev,
        exercises: incrementedExercise,
      }));
    },
    [selectedMesocycleIndex, muscleGroup]
  );

  const onAddTrainingDay = useCallback(
    (firstExercise?: Exercise, dayIndex?: number) => {
      if (!firstExercise || !dayIndex) {
        const freq = [...muscleGroup.volume.frequencyProgression];
        freq[selectedMesocycleIndex]++;

        const nextFreq = freq[selectedMesocycleIndex + 1];
        const sessionIndex = freq[selectedMesocycleIndex] - 1;
        const cloned_exercises = structuredClone(muscleGroup.exercises);
        const sessionExercises = [...cloned_exercises[sessionIndex]];

        const toCopyExercises = cloned_exercises[nextFreq - 1];

        for (let i = 0; i < sessionExercises.length; i++) {
          const nextFreqSets =
            toCopyExercises[i].initialSetsPerMeso[selectedMesocycleIndex + 1];
          const nextAlgoSchema =
            toCopyExercises[i].setProgressionSchema[selectedMesocycleIndex + 1];
          sessionExercises[i].initialSetsPerMeso[selectedMesocycleIndex] =
            nextFreqSets;
          sessionExercises[i].setProgressionSchema[selectedMesocycleIndex] =
            nextAlgoSchema;
        }

        cloned_exercises[sessionIndex] = sessionExercises;
        setMuscleGroup((prev) => ({
          ...prev,
          exercises: cloned_exercises,
          volume: { ...prev.volume, frequencyProgression: freq },
        }));
      } else {
        const cloned_exercises = structuredClone(muscleGroup.exercises);
        const freq = [...muscleGroup.volume.frequencyProgression];
        freq[freq.length - 1]++;

        const initial_exercise = getNewExercise(
          firstExercise,
          freq,
          muscleGroup.volume.landmark,
          dayIndex
        );

        cloned_exercises.push([initial_exercise]);
        setMuscleGroup((prev) => ({
          ...prev,
          exercises: cloned_exercises,
          volume: { ...prev.volume, frequencyProgression: freq },
        }));
      }
    },
    [selectedMesocycleIndex, muscleGroup]
  );

  const onResetMuscleGroup = useCallback(() => {
    setMuscleGroup(muscle);
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
    onSetIncrement,
    onAddTrainingDay,
    onAddExercise,
    onRemoveExercise,
    onRemoveTrainingDay,
    onResetMuscleGroup,
    onSaveMuscleGroupChanges,
    toggleSetProgression,
  };
}
