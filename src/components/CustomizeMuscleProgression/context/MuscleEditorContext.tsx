import { ReactNode, createContext, useContext } from "react";
import {
  INITIAL_STATE,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import useMuscleEditor from "../hooks/useMuscleEditorWithReducer";

type MuscleEditorType = ReturnType<typeof useMuscleEditor>;

const MuscleEditorContext = createContext<MuscleEditorType>({
  muscleGroup: INITIAL_STATE.muscle_priority_list[0],
  frequencyProgression: [],
  setProgressionMatrix: [],
  exercises: [],
  exercisesInView: [],
  volumes: [],
  selectedMesocycleIndex: 0,
  onSelectMesocycle: () => null,
  mesocyclesArray: [],
  microcyclesArray: [],
  onAddTrainingDay: () => null,
  onRemoveTrainingDay: () => null,
  onAddExercise: () => null,
  onRemoveExercise: () => null,
  onSelectedExerciseSetDecrement: () => null,
  onSelectedExerciseSetIncrement: () => null,
  onSelectedFrequencyProgressionIncrement: () => null,
  onSelectedFrequencyProgressionDecrement: () => null,
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
