import { useState } from "react";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/constants/themes";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";

type ExercisesPreviewProps = {
  musclePriorityList: MusclePriorityType[];
};
export default function ExercisesPreview({
  musclePriorityList,
}: ExercisesPreviewProps) {
  const [selectedMuscleIndex, setSelectedMuscleIndex] = useState<number>(0);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);
  // const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>(
  //   []
  // );
  const selectedExercises =
    musclePriorityList[selectedMuscleIndex].exercises.flat();

  // useEffect(() => {
  //   setSelectedExercises(
  //     musclePriorityList[selectedExerciseIndex].exercises.flat()
  //   );
  // }, [musclePriorityList, selectedExerciseIndex]);

  // const selectedExercises =
  //   musclePriorityList[selectedExerciseIndex].exercises.flat();

  const onSelectHandler = (type: "muscle" | "exercise", index: number) => {
    if (type === "muscle") {
      setSelectedMuscleIndex(index);
      setSelectedExerciseIndex(0);
    } else {
      setSelectedExerciseIndex(index);
    }
  };

  return (
    <div className={cn(`mr-2 flex w-44 flex-col`)}>
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
              selected={selectedExercises[selectedExerciseIndex].exercise}
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
