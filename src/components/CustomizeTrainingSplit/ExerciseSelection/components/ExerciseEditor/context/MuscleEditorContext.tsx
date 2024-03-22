import { ReactNode, createContext, useContext } from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import useMuscleEditor from "../hooks/useMuscleEditor";

type MuscleEditorType = ReturnType<typeof useMuscleEditor>;

const MuscleEditorContext = createContext<MuscleEditorType>({
  setProgressionMatrix: [],
  totalVolume: 0,
  selectedMesocycleIndex: 0,
  onSelectMesocycle: () => {},
  mesocyclesArray: [],
  onOperationHandler: () => {},
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
