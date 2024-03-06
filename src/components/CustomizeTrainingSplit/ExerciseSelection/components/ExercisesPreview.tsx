import { useState } from "react";
// import FilterIcon from "src/assets/icons/filter-svg.svg";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/constants/themes";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { EditMuscleModal } from "../../MusclePriorityList/components/EditMuscleModal";
import SelectExercise from "./ChangeExerciseModal/ChangeExerciseModal";
import { ExerciseSearchFiltersProvider } from "./useSortableExercises";

type ExercisesPreviewProps = {
  musclePriorityList: MusclePriorityType[];
  onExerciseChange: (items: MusclePriorityType[]) => void;
};
export default function ExercisesPreview({
  musclePriorityList,
  onExerciseChange,
}: ExercisesPreviewProps) {
  const [selectedMuscleIndex, setSelectedMuscleIndex] = useState<number>(0);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const selectedExercises =
    musclePriorityList[selectedMuscleIndex].exercises.flat();

  const onSelectHandler = (type: "muscle" | "exercise", index: number) => {
    if (type === "muscle") {
      setSelectedMuscleIndex(index);
      setSelectedExerciseIndex(0);
    } else {
      setSelectedExerciseIndex(index);
      setIsOpen(true);
    }
  };

  const onExerciseChangeHandler = (updated_muscle: MusclePriorityType) => {
    onExerciseChange(musclePriorityList);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn(`mr-2 flex w-44 flex-col`)}>
      {isOpen ? (
        <EditMuscleModal isOpen={isOpen} onClose={onClose}>
          <ExerciseSearchFiltersProvider
            muscle={musclePriorityList[selectedMuscleIndex]}
            exerciseId={selectedExercises[selectedExerciseIndex]?.id}
            onExerciseChange={onExerciseChangeHandler}
          >
            <SelectExercise />
          </ExerciseSearchFiltersProvider>
        </EditMuscleModal>
      ) : null}

      <div className={cn(`mb-2 flex space-x-1 overflow-x-auto border-b-2`)}>
        {musclePriorityList.map((each, index) => {
          return (
            <Item
              key={`${each}_${index}`}
              value={each.muscle}
              selected={musclePriorityList[selectedMuscleIndex].muscle}
              onClick={() => onSelectHandler("muscle", index)}
            />
          );
        })}
      </div>
      <div className={cn(`space-y-1 overflow-y-auto`)}>
        {selectedExercises.map((each, index) => {
          return (
            <Item
              key={`${each.id}`}
              value={each.exercise}
              selected={selectedExercises[selectedExerciseIndex]?.exercise}
              onClick={() => onSelectHandler("exercise", index)}
              className="text-xxs"
            />
          );
        })}
      </div>
    </div>
  );
}

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  selected: string;
}
function Item({ value, selected, className, ...props }: ItemProps) {
  const selectedClasses = `font-bold text-white ${BG_COLOR_M5}`;
  return (
    <div
      {...props}
      className={cn(
        `flex p-1 indent-1 text-xs text-slate-400 ${BG_COLOR_M6} cursor-pointer hover:${BG_COLOR_M5}`,
        {
          [selectedClasses]: value === selected,
        },
        className
      )}
    >
      {value}
    </div>
  );
}
