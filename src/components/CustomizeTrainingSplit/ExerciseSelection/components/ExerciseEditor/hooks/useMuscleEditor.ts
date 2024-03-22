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
  const [mesocyclesArray, setMesocyclesArray] = useState<number[]>([]);

  useEffect(() => {
    setMuscleGroup({ ...muscle });
  }, [muscle]);

  useEffect(() => {
    const mesocyclesArray = Array.from(Array(mesocycles), (e, i) => i);
    setMesocyclesArray(mesocyclesArray);
  }, [mesocycles]);

  useEffect(() => {
    const getMatrix = structuredClone([
      ...muscleGroup.volume.setProgressionMatrix,
    ]);
    setMatrix(getMatrix);
  }, [muscleGroup]);

  useEffect(() => {
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
  }, [selectedMesocycleIndex, microcycles, matrix]);

  const onSelectMesocycle = useCallback((index: number) => {
    setSelectedMesocycleIndex(index);
  }, []);

  const onOperationHandler = useCallback(
    (operation: "+" | "-", dayIndex: number, index: number) => {
      const copyMatrix = structuredClone(matrix);
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
      setMatrix(copyMatrix);
    },
    [matrix]
  );

  return {
    setProgressionMatrix: matrix,
    totalVolume,
    selectedMesocycleIndex,
    onSelectMesocycle,
    mesocyclesArray,
    onOperationHandler,
  };
}
