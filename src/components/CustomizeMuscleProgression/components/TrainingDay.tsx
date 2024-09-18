import { useMuscleEditorContext } from "../context/MuscleEditorContext";
import { ReactNode, useCallback, useState } from "react";
import DotMenu from "./DotMenu";
import Dropdown from "~/components/Layout/Dropdown";
import { PlusIcon } from "~/assets/icons/_icons";
import SessionList from "./Session/SessionList";

const MIN_TDAY_ITEMS = 5

export default function TrainingDays() {
  const { frequencyProgression, selectedMesocycleIndex, exercises } = useMuscleEditorContext()
  const totalExercisesByMeso =
    frequencyProgression[selectedMesocycleIndex];
  const trainingDaysByExercises = exercises.slice(0, totalExercisesByMeso)
  const totalTrainingDays = trainingDaysByExercises.length
  const totalItemsToFill = totalTrainingDays < MIN_TDAY_ITEMS ? MIN_TDAY_ITEMS - totalTrainingDays : 0;
  const canAddTrainingDayAtMesocycle =
    !frequencyProgression[selectedMesocycleIndex + 1] ||
    (frequencyProgression[selectedMesocycleIndex + 1] &&
        frequencyProgression[selectedMesocycleIndex] <
          frequencyProgression[selectedMesocycleIndex + 1])
          ? true
          : false;

  const itemsWithContents = Array.from(Array(totalItemsToFill), (e, i) => i === 0 && canAddTrainingDayAtMesocycle ? "ADD" : "BLANK");
  
  const exerciseIndices = Array.from(
    Array(trainingDaysByExercises.flat().length),
    (e, i) => i + 1
  );

  return (
    <ul className={`w-auto min-h-[95px] space-x-1 overflow-x-auto p-2 flex`}>
      {trainingDaysByExercises.map((sessionExercises, index) => {
        const indices = exerciseIndices.splice(0, sessionExercises.length);
        return (
          <TrainingDay
            key={`TrainingDay_${index}`}
            index={index}
          > 
            <SessionList>
              <SessionList.Item
                sessionExercises={sessionExercises}
                sessionIndex={index}
                exerciseIndices={indices}
              />
            </SessionList>
          </TrainingDay>
        )
      })}

      {itemsWithContents.map((item, index) => {
        return (
          <BlankTrainingDay key={`${item}_${index}`} itemType={item} />
        )
      })}
    </ul>
  )
}

type TrainingDayProps = {
  index: number;
  children: ReactNode;
};
function TrainingDay({ index, children }: TrainingDayProps) {
  const { onRemoveTrainingDay } = useMuscleEditorContext();
  const [isDropdownOpen, setIsDropownOpen] = useState(false);
  const onDropdownClose = () => setIsDropownOpen(false);
  const onDropdownOpen = () => setIsDropownOpen(true);

  const onDeleteSession = useCallback(() => {
    onRemoveTrainingDay(index)
    onDropdownClose()
  }, [index])

  return (
    <li className={`flex flex-col rounded-md bg-primary-600 mb-2`}>
      <div className={`relative flex justify-between p-1`}>
        <div className={`indent-1 text-xs font-bold text-white`}>
          Day {index + 1}
        </div>
        
        <DotMenu>
          <DotMenu.Button onClick={onDropdownOpen} />
          <DotMenu.Dropdown isOpen={isDropdownOpen}>
            <Dropdown onClose={onDropdownClose}>
              <Dropdown.Header title="Actions" onClose={onDropdownClose} />
              <Dropdown.Item onClick={() => onDeleteSession()}>
                Delete Session
              </Dropdown.Item>
            </Dropdown>
          </DotMenu.Dropdown>
        </DotMenu>
      </div>

      {children}
    </li>
  );
}

type BlankTrainingDayProps = {
  itemType: "ADD" | "BLANK"
};
function BlankTrainingDay({ itemType }: BlankTrainingDayProps) {
  const { onAddTrainingDay } = useMuscleEditorContext()

  const AddButton = () => {
    return (
      <button
        onClick={onAddTrainingDay}
        className={`flex items-center justify-center p-1 hover:bg-primary-700`}
      >
        <PlusIcon fill="white" />
      </button>
    )
  }
  return (
    <li
      className={`mb-2 flex w-56 items-center justify-center rounded-md p-2 bg-primary-800 opacity-[40%]`}
    >
      {itemType === "ADD" ? (
        <AddButton />
      ): null}
    </li>
  );
}
