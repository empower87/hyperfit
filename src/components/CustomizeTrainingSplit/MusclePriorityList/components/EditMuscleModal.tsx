import { ReactNode } from "react";
import ReactDOM from "react-dom";
import { BG_COLOR_M6, BG_COLOR_M7 } from "~/constants/themes";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { getVolumeSets } from "~/utils/musclePriorityHandlers";
import { CounterCell } from "./MesocycleFrequency";
import VolumeLandmark from "./VolumeLandmark";

type EditMuscleModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};
export function EditMuscleModal(props: EditMuscleModalProps) {
  const root = document.getElementById("modal-body")!;
  const { isOpen, onClose, children } = props;

  const handleOnClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className="absolute flex h-full w-full items-center justify-center"
      style={{ background: "#000000ad" }}
      onClick={handleOnClose}
    >
      {children}
    </div>,
    root
  );
}

type FrequencyProps = {
  index: number;
  frequency: number;
  totalVolume: number;
};
function Frequency({ index, frequency, totalVolume }: FrequencyProps) {
  return (
    <div className="flex">
      <div className="flex w-16 items-center justify-center text-xs text-white">
        {index + 1}
      </div>
      <div className="mr-1 flex w-16 items-center justify-center text-xs font-bold text-white">
        {frequency}
      </div>
      <div className="flex w-16 items-center justify-center text-xs text-white">
        {totalVolume}
      </div>
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
  const volumeSets = getVolumeSets(
    muscleGroup.muscle,
    frequencyProgression[frequencyProgression.length - 1],
    landmark
  );
  const onSelectHandler = () => {};
  return (
    <div className={cn(`${BG_COLOR_M7} flex h-40 w-3/4 flex-col`)}>
      <div className="text-sm p-1 font-bold text-white">
        {muscleGroup.muscle}
      </div>

      <div className="flex">
        <div className="w-20">
          <VolumeLandmark
            landmark={landmark}
            width="100%"
            onSelectHandler={onSelectHandler}
            volume={volumeSets}
          />
        </div>
        <div className="w-20">
          <CounterCell
            value={exercisesPerSessionSchema}
            minMaxValues={[0, 3]}
            frequencyProgression={frequencyProgression}
          />
        </div>

        <div className="flex flex-col p-1">
          <div className="flex">
            <div
              className={`mr-1 w-16 p-0.5 text-xxs text-white ${BG_COLOR_M6}`}
            >
              Mesocycle
            </div>
            <div
              className={`mr-1 w-16 p-0.5 text-xxs text-white ${BG_COLOR_M6}`}
            >
              Frequency
            </div>
            <div
              className={`mr-1 w-16 p-0.5 text-xxs text-white ${BG_COLOR_M6}`}
            >
              Total Volume
            </div>
          </div>
          {frequencyProgression.map((frequency, index) => (
            <Frequency
              key={index}
              index={index}
              frequency={frequency}
              totalVolume={totalVolumePerMesocycle[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

EditMuscleModal.Card = Card;
