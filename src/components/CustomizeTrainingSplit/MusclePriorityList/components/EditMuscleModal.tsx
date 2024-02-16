import { ReactNode, useState } from "react";
import ReactDOM from "react-dom";
import { BG_COLOR_M5, BG_COLOR_M6, BG_COLOR_M7 } from "~/constants/themes";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getSetProgressionMatrixForMuscle } from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getRankColor";
import useEditMuscle from "../hooks/useEditMuscle";
import { getEndOfMesocycleVolume } from "../utils/getVolumeTotal";
import { Counter } from "./MesocycleFrequency";
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
  onFrequencyChange: (index: number, value: number) => void;
  matrix: number[][][][];
};
function Frequency({
  index,
  frequency,
  minMaxFrequency,
  onFrequencyChange,
  matrix,
}: FrequencyProps) {
  const onFrequencyChangeHandler = (value: number) => {
    onFrequencyChange(index, value);
  };
  const onTotalExercisesChangeHandler = () => {};
  const currentMesocycle = matrix[index];
  const totalExercises = currentMesocycle[0].reduce(
    (acc, cur) => acc + cur.length,
    0
  );
  console.log(matrix, currentMesocycle, totalExercises, "lets see this");
  return (
    <div className="flex">
      <div className="mr-1 flex w-12 items-center justify-center p-0.5 text-xs text-white">
        {index + 1}
      </div>
      <div className="mr-1 flex w-16 items-center justify-center p-0.5 text-xs font-bold text-white">
        <Counter
          value={frequency}
          minMaxValues={minMaxFrequency}
          onIncrement={onFrequencyChangeHandler}
        />
      </div>
      <div className="mr-1 flex w-12 items-center justify-center p-0.5 text-xs text-white">
        <Counter
          value={totalExercises}
          minMaxValues={minMaxFrequency}
          onIncrement={onTotalExercisesChangeHandler}
        />
      </div>

      <div className="flex text-xs text-white">
        {currentMesocycle.map((each, index) => {
          const totalSets = each.flat().reduce((acc, cur) => acc + cur, 0);
          return (
            <div
              key={`${each}_${totalSets}_${index}_volume`}
              className="mr-1 flex w-10 items-center justify-center p-0.5 text-xs text-white"
            >
              {index === 0 ? (
                <Counter
                  value={totalSets}
                  minMaxValues={minMaxFrequency}
                  onIncrement={onTotalExercisesChangeHandler}
                />
              ) : (
                <>{totalSets}</>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// TODO: Note.. I want this card to be horizontal like the list item, should pop up toward
//       the top. Then blur background but highlight selected list item.
//       Also, should be able to get a view of exercises and sets over progression.
type EditMuscleCardProps = {
  rank: number;
  muscleGroup: MusclePriorityType;
  microcycles: number;
  totalVolumePerMesocycle: number[];
};
export function Card({
  rank,
  muscleGroup,
  microcycles,
  totalVolumePerMesocycle,
}: EditMuscleCardProps) {
  const {
    frequencyProgression,
    landmark,
    setProgressionMatrix,
    volumePerMicrocycle,
    updateFrequencyProgression,
    getFrequencyProgressionRanges,
    changeVolumeLandmark,
  } = useEditMuscle(muscleGroup, microcycles);

  // const volumeSets = getVolumeSets(
  //   muscleGroup.muscle,
  //   frequencyProgression[frequencyProgression.length - 1],
  //   landmark
  // );
  const bgColor = getRankColor(landmark);
  const microcycleArray = Array.from(
    { length: microcycles },
    (_, index) => index
  );

  return (
    <div className={cn(`${BG_COLOR_M7} flex h-40 w-3/4 flex-col`)}>
      <div
        className={cn(
          `${BG_COLOR_M6} text-sm mb-2 flex justify-between p-0.5 font-bold text-white`
        )}
      >
        <div className={cn(`indent-1`)}>Edit Muscle</div>
        <div
          className={cn(
            `mr-1 flex h-5 w-5 items-center justify-center hover:${BG_COLOR_M5}`
          )}
        >
          x
        </div>
      </div>

      <div className="flex">
        <div
          className={cn(
            `${bgColor.bg} flex w-24 indent-1 text-xs font-bold text-white`
          )}
        >
          <div className={cn(``)}>{rank}</div>
          <div className={cn(``)}>{muscleGroup.muscle}</div>
        </div>

        <div className="w-22">
          <VolumeLandmark
            landmark={landmark}
            width="100%"
            onSelectHandler={changeVolumeLandmark}
            volume={0}
          />
        </div>

        <div className="flex flex-col p-1">
          <div className="flex">
            <div
              className={`mr-1 w-12 p-0.5 text-xxs text-white ${BG_COLOR_M6}`}
            >
              Mesocycle
            </div>
            <div
              className={`mr-1 w-16 p-0.5 text-xxs text-white ${BG_COLOR_M6}`}
            >
              Frequency
            </div>
            <div
              className={`mr-1 w-12 p-0.5 text-xxs text-white ${BG_COLOR_M6}`}
            >
              Exercises
            </div>

            {microcycleArray.map((e) => {
              return (
                <div
                  className={`mr-1 w-10 p-0.5 text-xxs text-white ${BG_COLOR_M6}`}
                >
                  Week {e + 1}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col">
            {frequencyProgression.map((frequency, index) => {
              const minMaxValues = getFrequencyProgressionRanges(
                index,
                frequencyProgression
              );
              return (
                <Frequency
                  key={index}
                  index={index}
                  frequency={frequency}
                  minMaxFrequency={minMaxValues}
                  onFrequencyChange={updateFrequencyProgression}
                  matrix={setProgressionMatrix}
                />
              );
            })}
          </div>
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
            // totalVolume={totalVolume[index]}
            onFrequencyChange={updateFrequencyHandler}
            matrix={matrix}
          />
        );
      })}
    </div>
  );
}

EditMuscleModal.Card = Card;
