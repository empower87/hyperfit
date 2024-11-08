import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
import ToggleMesocycle from "./components/ActionsCard/ToggleMesocycle";
import { TrainingDays } from "./components/TrainingDayCard/TrainingDays";
import {
  MuscleEditorProvider,
  useMuscleEditorContext,
} from "./context/MuscleEditorContext";

export function EditMuscleProgression() {
  const {
    selectedMesocycleIndex,
    muscleGroup,
    onSelectMesocycle,
    volumes,
    mesocyclesArray,
    onResetMuscleGroup,
    onSaveMuscleGroupChanges,
    onSelectedFrequencyProgressionIncrement,
    onSelectedFrequencyProgressionDecrement,
  } = useMuscleEditorContext();

  const muscle_name = muscleGroup?.muscle;
  const presentational_muscle_name =
    muscle_name.charAt(0).toUpperCase() + muscle_name.slice(1);
  const v_landmark = muscleGroup?.volume.landmark;
  const frequency_progression = muscleGroup?.frequency.progression;

  const muscle_rank_color = getRankColor(v_landmark);

  return (
    <div className="flex space-x-1">
      <div className="flex flex-col space-y-3">
        <div className="flex w-full space-x-3 rounded-lg border border-primary-700 p-3">
          <div className={cn(`flex w-24 items-start rounded-md`)}>
            <h2
              className={`w-full rounded-sm px-2 py-1 font-semibold leading-none tracking-tight ${muscle_rank_color.bg}`}
            >
              {presentational_muscle_name}
            </h2>
          </div>
          <ToggleMesocycle />
        </div>

        <TrainingDays muscleGroup={muscleGroup} />
      </div>
    </div>
  );
}

type EditMuscleProgressionWithProviderProps = {
  selectedMuscle: MusclePriorityType;
};
export function EditMuscleProgressionWithProvider({
  selectedMuscle,
}: EditMuscleProgressionWithProviderProps) {
  return (
    <MuscleEditorProvider muscle={selectedMuscle}>
      <EditMuscleProgression />
    </MuscleEditorProvider>
  );
}
