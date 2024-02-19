import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { BG_COLOR_M5, BG_COLOR_M6, BG_COLOR_M7 } from "~/constants/themes";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getRankColor";
import { Button } from "../MusclePriorityList";
import useEditMuscle from "../hooks/useEditMuscle";
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

// TODO: Note.. I want this card to be horizontal like the list item, should pop up toward
//       the top. Then blur background but highlight selected list item.
//       Also, should be able to get a view of exercises and sets over progression.
type EditMuscleCardProps = {
  rank: number;
  muscleGroup: MusclePriorityType;
  microcycles: number;
  onClose: () => void;
};
export function Card({
  rank,
  muscleGroup,
  microcycles,
  onClose,
}: EditMuscleCardProps) {
  const {
    frequencyProgression,
    landmark,
    setProgressionMatrix,
    volumePerMicrocycle,
    updateFrequencyProgression,
    getFrequencyProgressionRanges,
    changeVolumeLandmark,
    adjustVolumeSets,
    onResetHandler,
  } = useEditMuscle(muscleGroup, microcycles);

  const bgColor = getRankColor(landmark);
  const microcycleArray = Array.from(
    { length: microcycles },
    (_, index) => index
  );

  const onSaveHandler = () => {};
  return (
    <div className={cn(`${BG_COLOR_M7} flex w-3/4 flex-col`)}>
      <div
        className={cn(
          `${BG_COLOR_M6} text-sm flex items-center justify-between p-0.5 font-bold text-white`
        )}
      >
        <div className={cn(`indent-1`)}>Edit Muscle</div>
        <button
          onClick={onClose}
          className={cn(
            `mr-1 flex h-5 w-5 items-center justify-center hover:${BG_COLOR_M5}`
          )}
        >
          x
        </button>
      </div>

      <div className="flex p-2">
        <div className={cn(`mr-2 flex w-48 flex-col justify-between`)}>
          <div className={cn(`flex flex-col`)}>
            <div
              className={cn(
                `${bgColor.bg} flex indent-1 text-xs font-bold text-white`
              )}
            >
              <div className={cn(``)}>{rank}</div>
              <div className={cn(``)}>{muscleGroup.muscle}</div>
            </div>

            <div className="w-20 p-1">
              <VolumeLandmark
                landmark={landmark}
                width="100%"
                onSelectHandler={changeVolumeLandmark}
                volume={0}
              />
            </div>
          </div>

          <div className={cn(`mb-1 flex`)}>
            <Button
              className={`text-white ${BG_COLOR_M6} mr-1`}
              onClick={onResetHandler}
            >
              Reset
            </Button>
            <Button
              className="w-full bg-rose-400 font-bold text-white"
              onClick={onSaveHandler}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="flex">
          <Table title="Sessions & Exercises" className="mr-2">
            <Table.Column title="Mesocycle">
              {frequencyProgression.map((e, i) => {
                return <Table.Cell>{i + 1}</Table.Cell>;
              })}
            </Table.Column>

            <Table.Column title="Frequency">
              {frequencyProgression.map((frequency, index) => {
                const minMaxValues = getFrequencyProgressionRanges(
                  index,
                  frequencyProgression
                );
                const onFrequencyChangeHandler = (value: number) => {
                  updateFrequencyProgression(index, value);
                };
                return (
                  <Table.Cell>
                    <Counter
                      key={index}
                      value={frequency}
                      minMaxValues={minMaxValues}
                      onIncrement={onFrequencyChangeHandler}
                    />
                  </Table.Cell>
                );
              })}
            </Table.Column>

            <Table.Column title="Exercises">
              {frequencyProgression.map((e, i) => {
                const currentMesocycle = setProgressionMatrix[i];
                const totalExercises = currentMesocycle[0].reduce(
                  (acc, cur) => acc + cur.length,
                  0
                );
                const onTotalExercisesChangeHandler = () => {};
                return (
                  <Table.Cell>
                    <Counter
                      key={i}
                      value={totalExercises}
                      minMaxValues={[0, 3]}
                      onIncrement={onTotalExercisesChangeHandler}
                    />
                  </Table.Cell>
                );
              })}
            </Table.Column>
          </Table>

          <Table title="Total Set Volume Per Microcycle">
            {microcycleArray.map((each, index) => {
              return (
                <Table.Column title={`Week ${index + 1}`} className="w-12">
                  {setProgressionMatrix.map((e, i) => {
                    const totalSets = e[index]
                      .flat()
                      .reduce((acc, cur) => acc + cur, 0);
                    const quickFixHandler = (adjust: "add" | "subtract") => {
                      adjustVolumeSets(frequencyProgression[i] - 1, adjust);
                    };
                    const yikes = () => {};
                    if (index === 0) {
                      return (
                        <Table.Cell>
                          <Counter
                            value={totalSets}
                            minMaxValues={[0, 40]}
                            onIncrement={yikes}
                            quickFix={quickFixHandler}
                          />
                        </Table.Cell>
                      );
                    }
                    return <Table.Cell>{totalSets}</Table.Cell>;
                  })}
                </Table.Column>
              );
            })}
          </Table>
        </div>
      </div>
    </div>
  );
}

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}
function Table({ title, children, className, ...props }: LayoutProps) {
  return (
    <div {...props} className={cn(`flex flex-col`, className)}>
      <div
        className={cn(
          `mb-1 mr-1 flex indent-1 text-xs text-white ${BG_COLOR_M6}`
        )}
      >
        {title}
      </div>
      <div className={cn(`flex`)}>{children}</div>
    </div>
  );
}
function Column({ title, children, className, ...props }: LayoutProps) {
  return (
    <div {...props} className={cn(`mr-1 flex w-16 flex-col`, className)}>
      <div
        className={cn(
          `${BG_COLOR_M6} mb-1 flex items-center justify-center p-0.5 text-xs text-white`
        )}
      >
        {title}
      </div>
      <ul className={cn(`flex w-16 flex-col`, className)}>{children}</ul>
    </div>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <li
      className={cn(
        `mb-1 flex h-6 items-center justify-center border border-slate-500 text-xs text-white`
      )}
    >
      {children}
    </li>
  );
}
Table.Column = Column;
Table.Cell = Cell;
EditMuscleModal.Card = Card;

// |   muscle  | freq |  exercises
// ---------------------
// | triceps   |   4  |  2
// | back      |   4  |  2
// | delts s   |   4  |  2
// | traps     |   3  |  1
// | biceps    |   3  |  1
// | delts r   |   3  |  1
// | chest     |   2  |  1
// | forearm   |   2  |  1
// | quads     |   2  |  2
// | hams      |   2  |  2

// triceps :
// 1. JM Press - heavy
// 2. Overhead Extensions
// 3. Overhead Extensions (single)
// 4. ??
// 5. JM Press - light
// 6. Overhead Extensions
// 7. ??

// back :
// 1. T-Bar Rows - heavy
// 2. Seated Cable Row (Single, Lat-Focused)
// 3. Lat Prayers
// 4. Dumbbell Rows
// 5. ??
// 6. ??

// side delts :
// 1. BTB Lateral Raise (Cable) - heavy
// 2. Seated Overhead Press (Dumbbell)
// 3. Lateral Raise (Dumbbell) - heavy
// 4. Upright Row (Cable)
// 5. BTB Lateral Raise (Cable) - light
// 6. Lateral Raise (Dumbbell) - light

// Traps :
// 1. Smith Machine Barbell Shrugs
// 2. Shrug (machine)
// 3. Dumbbell Shrugs

// biceps :
// 1. Preacher Curls (Barbell)
// 2. Incline Curl (Dumbbell)
// 3. Hammer Curl (Dumbbell)

// rear delts :
// 1. Reverse Fly
// 2. Face Pull
// 3. Cross Arm Reverse Fly (Cable)

// forearms :
// 1. ??
// 2. ??

// chest :
// 1. Close-Grip Bench Press
// 2. Incline Bench Press (Dumbbell)

// quads :
// 1. Squat
// 2. Leg Press
// 3. Leg Extensions
// 4. Deadlifts

// hamstrings :
// 1. Romanian Deadlifts
// 2. Leg Curls
