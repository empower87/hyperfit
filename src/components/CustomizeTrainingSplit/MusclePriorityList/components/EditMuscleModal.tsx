import { ReactNode, useState } from "react";
import ReactDOM from "react-dom";
import { BG_COLOR_M6, BG_COLOR_M7 } from "~/constants/themes";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getSetProgressionMatrixForMuscle } from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";
import { cn } from "~/lib/clsx";
import { getVolumeSets } from "~/utils/musclePriorityHandlers";
import { getEndOfMesocycleVolume } from "../utils/getVolumeTotal";
import { Counter, CounterCell } from "./MesocycleFrequency";
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
  minMaxFrequency: [number, number];
  totalVolume: number;
  onFrequencyChange: (index: number, value: number) => void;
  matrix: number[][][][];
};
function Frequency({
  index,
  frequency,
  minMaxFrequency,
  totalVolume,
  onFrequencyChange,
  matrix,
}: FrequencyProps) {
  const onFrequencyChangeHandler = (value: number) => {
    onFrequencyChange(index, value);
  };
  console.log(matrix, "matrix");
  return (
    <div className="flex">
      <div className="flex w-16 items-center justify-center text-xs text-white">
        {index + 1}
      </div>
      <div className="mr-1 flex w-16 items-center justify-center text-xs font-bold text-white">
        <Counter
          value={frequency}
          minMaxValues={minMaxFrequency}
          onIncrement={onFrequencyChangeHandler}
        />
      </div>
      <div className="flex w-16 items-center justify-center text-xs text-white">
        {totalVolume}
      </div>
    </div>
  );
}
// TODO: Note.. I want this card to be horizontal like the list item, should pop up toward
//       the top. Then blur background but highlight selected list item.
//       Also, should be able to get a view of exercises and sets over progression.
type EditMuscleCardProps = {
  muscleGroup: MusclePriorityType;
  microcycles: number;
  getTotalVolumeHandler: (
    _frequencyProgression: number[],
    _muscle: MusclePriorityType
  ) => number[];
  totalVolumePerMesocycle: number[];
};
export function Card(props: EditMuscleCardProps) {
  const {
    muscleGroup,
    microcycles,
    totalVolumePerMesocycle,
    getTotalVolumeHandler,
  } = props;
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

          <EditFrequencyAndVolume
            muscle={muscleGroup}
            microcycles={microcycles}
            frequencyProgression={frequencyProgression}
            getTotalVolumeHandler={getTotalVolumeHandler}
            totalVolumePerMesocycle={totalVolumePerMesocycle}
          />
        </div>
      </div>
    </div>
  );
}

type EditFrequencyAndVolumeProps = {
  muscle: MusclePriorityType;
  microcycles: number;
  frequencyProgression: number[];
  getTotalVolumeHandler: (
    _frequencyProgression: number[],
    _muscle: MusclePriorityType
  ) => number[];
  totalVolumePerMesocycle: number[];
};
function EditFrequencyAndVolume({
  muscle,
  microcycles,
  frequencyProgression,
  getTotalVolumeHandler,
  totalVolumePerMesocycle,
}: EditFrequencyAndVolumeProps) {
  const [freqProgression, setFreqProgression] = useState<number[]>([
    ...frequencyProgression,
  ]);

  const updateFrequencyHandler = (index: number, value: number) => {
    const newFreqProgression = [...freqProgression];
    newFreqProgression[index] = value;
    setFreqProgression(newFreqProgression);
  };

  const getMinMaxValues = (index: number): [number, number] => {
    const maxValue = frequencyProgression[frequencyProgression.length - 1];
    const prevValue = freqProgression[index - 1];
    const nextValue = freqProgression[index + 1];

    let minMaxTuple: [number, number] = [0, maxValue];
    if (prevValue !== undefined) {
      minMaxTuple[0] = prevValue;
    }
    if (nextValue !== undefined) {
      minMaxTuple[1] = nextValue;
    }
    return minMaxTuple;
  };

  const getTotalVolumeHandlerz = (
    _frequencyProgression: number[],
    _matrix: number[][][][],
    _muscle: MusclePriorityType,
    _microcycles: number
  ) => {
    const { muscle, volume } = _muscle;
    const { landmark } = volume;
    // const matrix = getSetProgressionMatrixForMuscle(
    //   _frequencyProgression,
    //   exercisesPerSessionSchema,
    //   _microcycles
    // );
    let newVolume: number[] = [];
    for (let i = 0; i < _frequencyProgression.length; i++) {
      const newTotalVolume = getEndOfMesocycleVolume(
        muscle,
        i + 1,
        landmark,
        _matrix
      );
      newVolume.push(newTotalVolume);
    }
    return newVolume;
  };

  const matrix = getSetProgressionMatrixForMuscle(
    freqProgression,
    muscle.volume.exercisesPerSessionSchema,
    microcycles
  );
  const totalVolume = getTotalVolumeHandlerz(
    freqProgression,
    matrix,
    muscle,
    microcycles
  );
  return (
    <div className="flex flex-col">
      {freqProgression.map((frequency, index) => {
        const minMaxValues = getMinMaxValues(index);
        return (
          <Frequency
            key={index}
            index={index}
            frequency={frequency}
            minMaxFrequency={minMaxValues}
            totalVolume={totalVolume[index]}
            onFrequencyChange={updateFrequencyHandler}
            matrix={matrix}
          />
        );
      })}
    </div>
  );
}

EditMuscleModal.Card = Card;
