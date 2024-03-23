import { useCallback, useEffect, useState } from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";

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
  const [frequencyProgression, setFrequencyProgression] = useState<number[]>(
    []
  );
  const [mesocyclesArray, setMesocyclesArray] = useState<number[]>([]);

  useEffect(() => {
    const clonedMuscle = structuredClone(muscle);
    setMuscleGroup(clonedMuscle);

    setFrequencyProgression([...muscle.volume.frequencyProgression]);
  }, [muscle]);

  useEffect(() => {
    const mesocyclesArray = Array.from(Array(mesocycles), (e, i) => i);
    setMesocyclesArray(mesocyclesArray);
  }, [mesocycles]);

  // useEffect(() => {
  //   const getMatrix = structuredClone([
  //     ...muscleGroup.volume.setProgressionMatrix,
  //   ]);
  //   setMatrix(getMatrix);
  // }, [muscleGroup]);

  useEffect(() => {
    const matrix = muscleGroup.volume.setProgressionMatrix;
    const currentMesocycleMatrix = matrix[selectedMesocycleIndex];
    if (currentMesocycleMatrix) {
      const microcycleMatrix = currentMesocycleMatrix[microcycles - 1];
      if (microcycleMatrix) {
        const totalVolume = microcycleMatrix
          .flat()
          .reduce((acc, cur) => acc + cur, 0);
        setTotalVolume(totalVolume);
      }
    }
  }, [selectedMesocycleIndex, microcycles, muscleGroup]);

  const onSelectMesocycle = useCallback((index: number) => {
    setSelectedMesocycleIndex(index);
  }, []);

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
      // setMatrix(copyMatrix);
    },
    [muscleGroup]
  );

  const onAddTrainingDay = useCallback(() => {
    const copyMatrix = structuredClone(muscleGroup.volume.setProgressionMatrix);
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
    } else {
    }

    setMuscleGroup((prev) => ({
      ...prev,
      volume: {
        ...prev.volume,
        frequencyProgression: frequencyProgression,
        setProgressionMatrix: copyMatrix,
      },
    }));
  }, [muscleGroup, mesocycles, selectedMesocycleIndex]);

  return {
    muscleGroup,
    setProgressionMatrix: matrix,
    totalVolume,
    selectedMesocycleIndex,
    frequencyProgression,
    onSelectMesocycle,
    mesocyclesArray,
    onOperationHandler,
    onAddTrainingDay,
  };
}
