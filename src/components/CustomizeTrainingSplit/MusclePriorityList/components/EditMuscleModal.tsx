import { ReactNode } from "react";
import ReactDOM from "react-dom";
import { BG_COLOR_M7 } from "~/constants/themes";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";

type EditMuscleModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};
export function EditMuscleModal(props: EditMuscleModalProps) {
  const root = document.getElementById("modal-body")!;
  const { isOpen, onClose, children } = props;

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className="absolute flex h-full w-full items-center justify-center"
      style={{ background: "#000000ad" }}
      onClick={onClose}
    >
      {children}
    </div>,
    root
  );
}

type FrequencyProps = {
  frequency: number;
  totalVolume: number;
};
function Frequency({ frequency, totalVolume }: FrequencyProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="mr-1 text-xs text-xs font-bold text-white">
        {frequency}
      </div>
      <div className="text-xs text-white">{totalVolume}</div>
    </div>
  );
}

type EditMuscleCardProps = {
  muscleGroup: MusclePriorityType;
  totalVolumePerMesocycle: number[];
};
export function Card(props: EditMuscleCardProps) {
  const { muscleGroup, totalVolumePerMesocycle } = props;
  const { frequencyProgression, exercisesPerSessionSchema, landmark } =
    muscleGroup.volume;

  return (
    <div className={cn(`${BG_COLOR_M7} flex h-40 w-3/4 flex-col`)}>
      <div className="text-sm p-1 font-bold text-white">
        {muscleGroup.muscle}
      </div>

      <div className="flex flex-col">
        {frequencyProgression.map((frequency, index) => (
          <Frequency
            key={index}
            frequency={frequency}
            totalVolume={totalVolumePerMesocycle[index]}
          />
        ))}
      </div>
    </div>
  );
}
EditMuscleModal.Card = Card;
