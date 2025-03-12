import { ReactNode, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
import ToggleMesocycle from "./components/ActionsCard/ToggleMesocycle";
import { TrainingDays } from "./components/TrainingDayCard/TrainingDays";
import {
  MuscleEditorProvider,
  useMuscleEditorContext,
} from "./context/MuscleEditorContext";

type EditMuscleProgressionProps = {
  toggleMuscle: ReactNode;
};
export function EditMuscleProgression({
  toggleMuscle,
}: EditMuscleProgressionProps) {
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
    <div className="flex flex-col space-y-4">
      {toggleMuscle}

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

export default function EditMuscleProgressionWithProvider() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const [selectedMuscleId, setSelectedMuscleId] = useState<
    MusclePriorityType["id"]
  >(prioritized_muscle_list[0].id);

  const onToggleMuscle = (value: MusclePriorityType["id"]) => {
    setSelectedMuscleId(value);
  };

  const selectedMuscle = prioritized_muscle_list.filter(
    (each) => each.id === selectedMuscleId
  )[0];

  return (
    <MuscleEditorProvider muscle={selectedMuscle}>
      <EditMuscleProgression
        toggleMuscle={
          <div className="w-full overflow-x-auto py-2 pl-14">
            <ToggleGroup type="single">
              {prioritized_muscle_list.map((muscle, index) => {
                const rankColor = getRankColor(muscle.volume.landmark);
                const dataStateOn = `${rankColor.text} data-[state=on]:${rankColor.bg} data-[state=on]:text-white`;
                return (
                  <ToggleGroupItem
                    variant="outline"
                    value={muscle.id}
                    className={`h-7 w-20 ${dataStateOn}`}
                    onClick={() => onToggleMuscle(muscle.id)}
                  >
                    {muscle.muscle}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        }
      />
    </MuscleEditorProvider>
  );
}
