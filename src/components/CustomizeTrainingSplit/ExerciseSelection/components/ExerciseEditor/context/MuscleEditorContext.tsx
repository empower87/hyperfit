import { ReactNode, createContext, useContext } from "react";
import {
  INITIAL_STATE,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import useMuscleEditor from "../hooks/useMuscleEditor";

type MuscleEditorType = ReturnType<typeof useMuscleEditor>;

const MuscleEditorContext = createContext<MuscleEditorType>({
  muscleGroup: { ...INITIAL_STATE }.muscle_priority_list[0],
  setProgressionMatrix: [],
  totalVolume: 0,
  volumes: [],
  selectedMesocycleIndex: 0,
  frequencyProgression: [],
  onSelectMesocycle: () => null,
  mesocyclesArray: [],
  onOperationHandler: () => null,
  onAddTrainingDay: () => null,
  onAddExercise: () => null,
  onDeleteExercise: () => null,
  onDeleteSession: () => null,
  onResetMuscleGroup: () => null,
  onSaveMuscleGroupChanges: () => null,
  toggleSetProgression: () => null,
});

const MuscleEditorProvider = ({
  muscle,
  children,
}: {
  muscle: MusclePriorityType;
  children: ReactNode;
}) => {
  const values = useMuscleEditor(muscle);
  return (
    <MuscleEditorContext.Provider value={values}>
      {children}
    </MuscleEditorContext.Provider>
  );
};

const useMuscleEditorContext = () => {
  return useContext(MuscleEditorContext);
};

export { MuscleEditorProvider, useMuscleEditorContext };
