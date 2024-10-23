import { ReactNode } from "react";
import { PlusIcon } from "~/assets/icons/_icons";
import { Button } from "~/components/Layout/Buttons";
import { Card } from "~/components/ui/card";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import DayItem from "./DayItem";

type ExercisesProps = {
  muscleGroup: MusclePriorityType;
};
export function Exercises({ muscleGroup }: ExercisesProps) {
  const exercises = muscleGroup?.exercises;
  return (
    <div className="flex w-full flex-col rounded">
      <div className="mb-3 flex p-1 indent-1 text-sm text-white">Exercises</div>

      <ul className="flex w-full space-x-2 overflow-x-auto p-1">
        {exercises?.map((day, dayIndex) => {
          return <DayItem index={dayIndex} exercises={day} />;
        })}
        <Card className="flex items-center justify-center ">
          <Button>
            <PlusIcon fill="white" />
          </Button>
        </Card>
      </ul>
    </div>
  );
}

type ActionsProps = {
  children: ReactNode;
};
export function Actions({ children }: ActionsProps) {
  return (
    <div className="flex w-full space-x-2 rounded-lg border border-input p-4">
      {children}
    </div>
  );
}

type ActionCardProps = {
  title: string;
  children: ReactNode;
};
export function ActionCard({ title, children }: ActionCardProps) {
  return (
    <div className=" flex flex-col rounded p-1">
      <div className="indent-1 text-sm text-white">{title}</div>
      {children}
    </div>
  );
}
