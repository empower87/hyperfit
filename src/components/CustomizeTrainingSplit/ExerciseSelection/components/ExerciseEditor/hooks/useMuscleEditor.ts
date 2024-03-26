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
  payload: {};
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
  payload: {};
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
          let frequency = frequencyProgression[i];
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
  const { training_program_params } = useTrainingProgramContext();
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
    // const currentMesocycleMatrix = matrix[selectedMesocycleIndex];

    let totals: number[] = [];
    for (let i = 0; i < matrix.length; i++) {
      const lastMatrix = matrix[i][microcycles - 1];
      const totalVolume = lastMatrix.flat().reduce((acc, cur) => acc + cur, 0);
      totals.push(totalVolume);
    }
    setVolumes(totals);

    // if (currentMesocycleMatrix) {
    //   const microcycleMatrix = currentMesocycleMatrix[microcycles - 1];

    //   if (microcycleMatrix) {
    //     const totalVolume = microcycleMatrix
    //       .flat()
    //       .reduce((acc, cur) => acc + cur, 0);
    //     setTotalVolume(totalVolume);

    //   }
    // }
  }, [selectedMesocycleIndex, microcycles, muscleGroup]);

  const onSelectMesocycle = useCallback((index: number) => {
    setSelectedMesocycleIndex(index);
  }, []);

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
          let frequency = frequencyProgression[i];
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

  // TODO: Adding a set to a current mesocycle exercise that also appears in next mesocycle will have to add
  //       the sets to the preceding mesocycle as well.
  const onOperationHandler = useCallback(
    (operation: "+" | "-", dayIndex: number, index: number) => {
      const copyMatrix = structuredClone(
        muscleGroup.volume.setProgressionMatrix
      );
      const updateAll = copyMatrix[selectedMesocycleIndex].map((e, i) => {
        let session = e[dayIndex - 1];

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
      const currentMatrix = copyMatrix[selectedMesocycleIndex];

      const canAddDay =
        frequencyProgression[selectedMesocycleIndex + 1] &&
        frequencyProgression[selectedMesocycleIndex] <
          frequencyProgression[selectedMesocycleIndex + 1]
          ? true
          : false;
      const nextMatrix = copyMatrix[selectedMesocycleIndex + 1];

      if (canAddDay) {
        for (let i = 0; i < nextMatrix.length; i++) {
          const daysSets = nextMatrix[i][selectedMesocycleIndex];
          copyMatrix[selectedMesocycleIndex][i][selectedMesocycleIndex] =
            daysSets;
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
        if (!firstExercise) return;
        const exercisess = muscleGroup.exercises;
        exercisess.push([firstExercise]);
        const freq = muscleGroup.volume.frequencyProgression;
        freq[freq.length - 1]++;

        const clonedMatrix = structuredClone(
          muscleGroup.volume.setProgressionMatrix
        );
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

        setMuscleGroup((prev) => ({
          ...prev,
          exercises: exercisess,
          volume: {
            ...prev.volume,
            frequencyProgression: freq,
            setProgressionMatrix: clonedMatrix,
          },
        }));
      }
    },
    [muscleGroup, mesocycles, selectedMesocycleIndex]
  );

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
  };
}
