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
  selectedMesocycleIndex: 0,
  frequencyProgression: [],
  onSelectMesocycle: () => {},
  mesocyclesArray: [],
  onOperationHandler: () => {},
  onAddTrainingDay: () => {},
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
