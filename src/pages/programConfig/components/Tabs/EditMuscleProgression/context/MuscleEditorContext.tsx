import { ReactNode, createContext, useContext } from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import useMuscleEditor from "../hooks/useMuscleEditorWithReducer";

type MuscleEditorType = ReturnType<typeof useMuscleEditor>;

const MuscleEditorContext = createContext<MuscleEditorType | null>(null);

type MuscleEditorProviderProps = {
  muscle: MusclePriorityType;
  selectedMesocycleIndex: number;
  children: ReactNode;
};
export const MuscleEditorProvider = ({
  muscle,
  selectedMesocycleIndex,
  children,
}: MuscleEditorProviderProps) => {
  const values = useMuscleEditor({ muscle, selectedMesocycleIndex });
  return (
    <MuscleEditorContext.Provider value={values}>
      {children}
    </MuscleEditorContext.Provider>
  );
};

export const useMuscleEditorContext = () => {
  const context = useContext(MuscleEditorContext);

  if (!context) {
    throw new Error(
      "useMuscleEditorContext must be used within a MuscleEditorProvider"
    );
  }
  return context;
};
