import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import TrainingDay from "./TrainingDay";

type TrainingDaysProps = {
  muscleGroup: MusclePriorityType;
};
export function TrainingDays({ muscleGroup }: TrainingDaysProps) {
  const exercises = muscleGroup?.exercises;
  return (
    <div className="flex w-full flex-col rounded">
      <div className="mb-3 flex p-1 indent-1 text-sm text-white">Exercises</div>

      <ul className="flex w-full space-x-2 overflow-x-auto p-1">
        {exercises?.map((exercise, dayIndex) => {
          return (
            <TrainingDay
              index={dayIndex}
              exercises={exercise}
              muscle={muscleGroup}
            />
          );
        })}
        <Card className="flex items-center justify-center">
          <div className="p-4">
            <Button variant="outline" className="">
              <PlusIcon fill="white" />
              <span className="pl-2">Add Training Day</span>
            </Button>
          </div>
        </Card>
      </ul>
    </div>
  );
}
