import { PlusIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";
import TrainingDay from "./TrainingDay";

type TrainingDaysProps = {
  muscleGroup: MusclePriorityType;
};
export function TrainingDays({ muscleGroup }: TrainingDaysProps) {
  const { exercisesInView } = useMuscleEditorContext();
  console.log(exercisesInView, "WHAT IS GOING ON EHRE");

  const AddTrainingDayItem = () => {
    return (
      <Card className="flex items-center justify-center">
        <div className="p-4">
          <Button variant="outline" className="">
            <PlusIcon fill="white" />
            <span className="pl-2">Add Training Day</span>
          </Button>
        </div>
      </Card>
    );
  };

  const TrainingDays = useCallback(() => {
    const Days = exercisesInView.map((exercise, dayIndex) => {
      return <TrainingDay index={dayIndex} exercises={exercise} />;
    });

    const canAddTrainingDay = Days.length < 7;

    if (canAddTrainingDay) {
      Days.push(<AddTrainingDayItem />);
    }
    return Days;
  }, [exercisesInView]);

  return (
    <div className="flex w-full flex-col rounded">
      <div className="mb-3 flex p-1 indent-1 text-sm text-white">Exercises</div>

      <div className="flex w-full space-x-2 overflow-x-auto p-1">
        {TrainingDays()}
        {/* {exercisesInView.map((exercise, dayIndex) => {
          return <TrainingDay index={dayIndex} exercises={exercise} />;
        })}
        <Card className="flex items-center justify-center">
          <div className="p-4">
            <Button variant="outline" className="">
              <PlusIcon fill="white" />
              <span className="pl-2">Add Training Day</span>
            </Button>
          </div>
        </Card> */}
      </div>
    </div>
  );
}
