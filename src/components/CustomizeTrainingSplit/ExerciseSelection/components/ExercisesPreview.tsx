import { useCallback, useEffect, useState } from "react";
import { CardS as Card } from "~/components/Layout/Sections";
import Modal from "~/components/Modals/Modal";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/constants/themes";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import { ChangeExerciseProvider } from "./ChangeExerciseModal/ChangeExerciseContext";
import SelectExercise from "./ChangeExerciseModal/ChangeExerciseModal";

export default function ExercisesPreview() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const [selectedMuscleIndex, setSelectedMuscleIndex] = useState<number>(0);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>(
    []
  );

  useEffect(() => {
    const selectedExercises =
      prioritized_muscle_list[selectedMuscleIndex].exercises.flat();
    setSelectedExercises(selectedExercises);
  }, [selectedMuscleIndex, prioritized_muscle_list]);

  const onSelectHandler = (type: "muscle" | "exercise", index: number) => {
    if (type === "muscle") {
      setSelectedMuscleIndex(index);
      setSelectedExerciseIndex(0);
    } else {
      setSelectedExerciseIndex(index);
      setIsOpen(true);
    }
  };

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [isOpen]);

  return (
    <Card title="OVERVIEW">
      <div className={cn(`mr-2 flex w-80 flex-col`)}>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ChangeExerciseProvider
            muscle={prioritized_muscle_list[selectedMuscleIndex]}
            exerciseId={selectedExercises[selectedExerciseIndex]?.id}
          >
            <SelectExercise />
          </ChangeExerciseProvider>
        </Modal>

        <div className={cn(`mb-2 flex space-x-1 overflow-x-auto border-b-2`)}>
          {prioritized_muscle_list.map((each, index) => {
            return (
              <Item
                key={`${each}_${index}`}
                value={each.muscle}
                selected={prioritized_muscle_list[selectedMuscleIndex].muscle}
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
    </Card>
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
