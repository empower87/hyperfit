import { useCallback, useEffect, useState } from "react";
import { MRV_PROGRESSION_MATRIX_ONE } from "~/constants/volumeProgressionMatrices";
import {
  ExerciseType,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";

type AddSubtractSetsType = {
  type: "ADD_SUBTRACT_SETS";
  payload: {
    operation: "+" | "-";
    dayIndex: number;
    index: number;
  };
};
type AddTrainingDayType = {
  type: "ADD_TRAINING_DAY";
  payload: {
    firstExercise: ExerciseType;
  };
};
type RemoveTrainingDayType = {
  type: "REMOVE_TRAINING_DAY";
};
type AddExerciseType = {
  type: "ADD_EXERCISE";
  payload: {
    newExercise: ExerciseType;
    dayIndex: number;
  };
};
type RemoveExerciseType = {
  type: "REMOVE_EXERCISE";
};
type Action =
  | AddSubtractSetsType
  | AddTrainingDayType
  | RemoveTrainingDayType
  | AddExerciseType
  | RemoveExerciseType;

// setProgressionMatrix
// array of mesocycles --
// [
//  mesocycle 1 - [
//                  microcycle 1 - [ day 1 - [exercise 1, exercise 2, etc..], day 2 - [exercise 3, exercise 4, etc... ]]
//                  microcycle 2 -
//                  microcycle 3 -
//                  microcycle 4 -
//                  etc...
//                ]
//  mesocycle 2 -
//  mesocycle 3 -
//  etc...
// ]

function muscleEditorReducer(state: MusclePriorityType, action: Action) {
  switch (action.type) {
    case "ADD_TRAINING_DAY":
      const { firstExercise } = action.payload;
      const exercisess = state.exercises;
      exercisess.push([firstExercise]);
      const freq = state.volume.frequencyProgression;
      freq[freq.length - 1]++;

      const clonedMatrix = structuredClone(state.volume.setProgressionMatrix);
      const lastMesoMatrix = clonedMatrix[clonedMatrix.length - 1];
      const setProgh = [...MRV_PROGRESSION_MATRIX_ONE];

      let currCount = setProgh[freq[freq.length - 1] - 1][0][0];
      for (let i = 0; i < lastMesoMatrix.length; i++) {
        if (i > 0) {
          currCount++;
        }
        lastMesoMatrix[i].push([currCount]);
      }

      clonedMatrix[clonedMatrix.length - 1] = lastMesoMatrix;

      return {
        ...state,
        exercises: exercisess,
        volume: {
          ...state,
          frequencyProgression: freq,
          setProgressionMatrix: clonedMatrix,
        },
      };
    case "REMOVE_TRAINING_DAY":
      return { ...state };
    case "ADD_EXERCISE":
      const { newExercise, dayIndex } = action.payload;

      // add exercise
      const exercises = state.exercises;
      exercises[dayIndex]?.push(newExercise);

      // update setProgressionMatrix
      const matrix = structuredClone(state.volume.setProgressionMatrix);
      const setProg = [...MRV_PROGRESSION_MATRIX_ONE];
      for (let i = 0; i < matrix.length; i++) {
        const meso = matrix[i];

        if (meso[0][dayIndex]) {
          const frequencyProgression = state.volume.frequencyProgression;
          const frequency = frequencyProgression[i];
          let curCount = setProg[frequency - 1][0][0];

          for (let j = 0; j < meso.length; j++) {
            if (j > 0) {
              curCount++;
            }
            meso[j][dayIndex].push(curCount);
          }
        }
        matrix[i] = meso;
      }

      return {
        ...state,
        exercises: exercises,
        volume: { ...state.volume, setProgressionMatrix: matrix },
      };
    case "REMOVE_EXERCISE":
      return { ...state };

    case "ADD_SUBTRACT_SETS":

    default:
      return state;
  }
}

export default function useMuscleEditor(muscle: MusclePriorityType) {
  const { training_program_params, handleUpdateMuscle } =
    useTrainingProgramContext();
  const { microcycles, mesocycles } = training_program_params;
  const [muscleGroup, setMuscleGroup] = useState<MusclePriorityType>({
    ...muscle,
  });

  const [matrix, setMatrix] = useState<number[][][][]>([]);
  const [selectedMesocycleIndex, setSelectedMesocycleIndex] = useState(
    mesocycles - 1
  );
  const [totalVolume, setTotalVolume] = useState(0);
  const [volumes, setVolumes] = useState<number[]>([]);

  const [frequencyProgression, setFrequencyProgression] = useState<number[]>(
    []
  );
  const [mesocyclesArray, setMesocyclesArray] = useState<number[]>([]);

  useEffect(() => {
    const clonedMuscle = structuredClone(muscle);
    setMuscleGroup(clonedMuscle);
  }, [muscle]);

  useEffect(() => {
    const mesocyclesArray = Array.from(Array(mesocycles), (e, i) => i);
    setMesocyclesArray(mesocyclesArray);
  }, [mesocycles]);

  useEffect(() => {
    const matrix = muscleGroup.volume.setProgressionMatrix;
    const totals: number[] = [];
    for (let i = 0; i < matrix.length; i++) {
      const lastMatrix = matrix[i][microcycles - 1];
      const totalVolume = lastMatrix.flat().reduce((acc, cur) => acc + cur, 0);
      totals.push(totalVolume);
    }
    setVolumes(totals);
  }, [selectedMesocycleIndex, microcycles, muscleGroup]);

  useEffect(() => {
    const allExercises = structuredClone(muscleGroup.exercises);

    for (let i = 0; i < allExercises.length; i++) {
      const exercises = allExercises[i];
      for (let j = 0; j < exercises.length; j++) {
        const exercise = exercises[j];
        exercise.setsTest = [];
        exercise.setProgressionAlgo = [];

        for (let k = 0; k < mesocycles; k++) {
          exercise.setsTest.push(2 + k);
          exercise.setProgressionAlgo.push("ADD_ONE_PER_MICROCYCLE");
        }
        exercises[j] = exercise;
      }
      allExercises[i] = exercises;
    }
    setMuscleGroup((prev) => ({ ...prev, exercises: allExercises }));
    console.log(allExercises, "CHECK CH CH CHECK IT OUT ");
  }, [muscle]);

  const toggleSetProgression = useCallback(() => {}, []);

  const onSelectMesocycle = useCallback(
    (index: number) => {
      setSelectedMesocycleIndex(index);
    },
    [selectedMesocycleIndex]
  );

  const onAddExercise = useCallback(
    (newExercise: ExerciseType, dayIndex: number) => {
      const exercises = muscleGroup.exercises;

      exercises[dayIndex]?.push(newExercise);
      const matrix = structuredClone(muscleGroup.volume.setProgressionMatrix);

      const setProg = [...MRV_PROGRESSION_MATRIX_ONE];

      for (let i = 0; i < matrix.length; i++) {
        const meso = matrix[i];

        if (meso[0][dayIndex]) {
          const frequencyProgression = muscleGroup.volume.frequencyProgression;
          const frequency = frequencyProgression[i];
          let curCount = setProg[frequency - 1][0][0];

          for (let j = 0; j < meso.length; j++) {
            if (j > 0) {
              curCount++;
            }
            meso[j][dayIndex].push(curCount);
          }
        }
        matrix[i] = meso;
      }

      setMuscleGroup((prev) => ({
        ...prev,
        exercises: exercises,
        volume: { ...prev.volume, setProgressionMatrix: matrix },
      }));
    },
    [muscleGroup]
  );

  const updateSetProgressionMatrix = (
    operation: "add" | "delete",
    index: number,
    dayIndex: number,
    exerciseIndex: number
  ) => {
    const matrix = structuredClone(muscleGroup.volume.setProgressionMatrix);
    const setProg = [...MRV_PROGRESSION_MATRIX_ONE];
    const frequencyProgression = muscleGroup.volume.frequencyProgression;
    const frequency = frequencyProgression[index];
    let curCount = setProg[frequency - 1][0][0];

    for (let i = 0; i < matrix.length; i++) {
      const meso = matrix[i];

      if (meso[0][dayIndex]) {
        const frequencyProgression = muscleGroup.volume.frequencyProgression;
        const frequency = frequencyProgression[i];
        let curCount = setProg[frequency - 1][0][0];

        for (let j = 0; j < meso.length; j++) {
          if (j > 0) {
            curCount++;
          }
          meso[j][dayIndex].push(curCount);
        }
      }
      matrix[i] = meso;
    }
  };

  const onDeleteSession = useCallback(
    (dayIndex: number) => {
      const matrix = structuredClone(muscleGroup.volume.setProgressionMatrix);
      const frequencyProgression = muscleGroup.volume.frequencyProgression;
      const exercises = structuredClone(muscleGroup.exercises);

      frequencyProgression[selectedMesocycleIndex]--;
      exercises.splice(dayIndex, 1);

      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][0][dayIndex]) {
          for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j].splice(dayIndex, 1);
          }
        }
      }

      setMuscleGroup((prev) => ({
        ...prev,
        exercises: exercises,
        volume: {
          ...prev.volume,
          setProgressionMatrix: matrix,
          frequencyProgression: frequencyProgression,
        },
      }));
    },
    [selectedMesocycleIndex, muscleGroup]
  );

  const onDeleteExercise = useCallback(
    (id: ExerciseType["id"]) => {
      let dayIndex = 0;
      let exerciseIndex = 0;

      const exercises = muscleGroup.exercises;
      const matrix = structuredClone(muscleGroup.volume.setProgressionMatrix);
      const newExercises = exercises.map((day, index) => {
        return day.filter((e, i) => {
          if (e.id !== id) {
            return e;
          } else {
            dayIndex = index;
            exerciseIndex = i;
            return null;
          }
        });
      });

      for (let i = 0; i < matrix.length; i++) {
        if (!matrix[i][0][dayIndex]) continue;
        if (!matrix[i][0][dayIndex][exerciseIndex]) continue;
        for (let j = 0; j < matrix[i].length; j++) {
          matrix[i][j][dayIndex].splice(exerciseIndex, 1);
        }
      }

      setMuscleGroup((prev) => ({
        ...prev,
        exercises: newExercises.filter((each) => each.length),
        volume: { ...prev.volume, setProgressionMatrix: matrix },
      }));
    },
    [muscleGroup]
  );

  // TODO: Adding a set to a current mesocycle exercise that also appears in next mesocycle will have to add
  //       the sets to the preceding mesocycle as well.
  const onOperationHandler = useCallback(
    (operation: "+" | "-", dayIndex: number, index: number) => {
      const copyMatrix = structuredClone(
        muscleGroup.volume.setProgressionMatrix
      );
      const updateAll = copyMatrix[selectedMesocycleIndex].map((e, i) => {
        const session = e[dayIndex - 1];

        if (session) {
          if (operation === "+") {
            session[index - 1]++;
          } else {
            session[index - 1]--;
          }
        }

        e[dayIndex - 1] = session;
        return e;
      });
      copyMatrix[selectedMesocycleIndex] = updateAll;
      setMuscleGroup((prev) => ({
        ...prev,
        volume: { ...prev.volume, setProgressionMatrix: copyMatrix },
      }));
    },
    [muscleGroup]
  );

  const onAddTrainingDay = useCallback(
    (firstExercise?: ExerciseType) => {
      const copyMatrix = structuredClone(
        muscleGroup.volume.setProgressionMatrix
      );
      const frequencyProgression = muscleGroup.volume.frequencyProgression;

      const nextMatrix = copyMatrix[selectedMesocycleIndex + 1];

      if (!firstExercise) {
        for (let i = 0; i < nextMatrix.length; i++) {
          const frequency = frequencyProgression[selectedMesocycleIndex + 1];
          const daysSets = nextMatrix[i][frequency - 1];
          copyMatrix[selectedMesocycleIndex][i][frequency - 1] = daysSets;
        }
        frequencyProgression[selectedMesocycleIndex]++;
        setMuscleGroup((prev) => ({
          ...prev,
          volume: {
            ...prev.volume,
            frequencyProgression: frequencyProgression,
            setProgressionMatrix: copyMatrix,
          },
        }));
      } else {
        // if (!firstExercise) return;

        const exercises = muscleGroup.exercises;
        exercises.push([firstExercise]);
        const freq = muscleGroup.volume.frequencyProgression;
        freq[freq.length - 1]++;

        const lastMesoMatrix = copyMatrix[copyMatrix.length - 1];
        const setProgh = [...MRV_PROGRESSION_MATRIX_ONE];

        let currCount = setProgh[freq[freq.length - 1] - 1][0][0];
        for (let i = 0; i < lastMesoMatrix.length; i++) {
          if (i > 0) {
            currCount++;
          }
          lastMesoMatrix[i].push([currCount]);
        }

        copyMatrix[copyMatrix.length - 1] = lastMesoMatrix;

        setMuscleGroup((prev) => ({
          ...prev,
          exercises: exercises,
          volume: {
            ...prev.volume,
            frequencyProgression: freq,
            setProgressionMatrix: copyMatrix,
          },
        }));
      }
    },
    [muscleGroup, mesocycles, selectedMesocycleIndex]
  );

  const onResetMuscleGroup = useCallback(() => {
    setMuscleGroup(muscle);
  }, [muscle]);

  const onSaveMuscleGroupChanges = useCallback(() => {
    handleUpdateMuscle(muscleGroup);
  }, [muscleGroup]);

  return {
    muscleGroup,
    setProgressionMatrix: matrix,
    totalVolume,
    volumes,
    selectedMesocycleIndex,
    frequencyProgression,
    onSelectMesocycle,
    mesocyclesArray,
    onOperationHandler,
    onAddTrainingDay,
    onAddExercise,
    onDeleteExercise,
    onDeleteSession,
    onResetMuscleGroup,
    onSaveMuscleGroupChanges,
    toggleSetProgression,
  };
}

// FULL 1:
// SETS | REPS | EXERCISE
//  4x    4-7    Smith-Machine Squat
//  3x    8-12   Smith-Machine Row
//  3x    8-12   Seated DB Overhead Press
//  3x    7-10   Dip or Dip Machine
//  3x    8-12   Preacher Curl
//  3x   12-15   Leg Raises

// FULL 2:
// SETS | REPS | EXERCISE
// 3x     3-5    Deadlifts
// 3x     7-10   Barbell Bench Press
// 3x     8-12   Lat Pulldown
// 3x     8-12   Overhead Cable Triceps Extension
// 3x     8-12   Cable Lateral Raise
// 3x     8-12   Cable Reverse Fly

// FULL 3:
// SETS | REPS | EXERCISE
// 3x     7-10   Leg Press
// 3x    12-15   Calf Raises on Leg Press
// 3x     7-10   T-Bar Row
// 3x     8-12   Incline DB Bench Press
// 3x     7-10   Incline DB Curl
// 3x     7-10   DB Lateral Raise
