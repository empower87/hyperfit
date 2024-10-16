import { ReactNode } from "react";
import { PlusIcon } from "~/assets/icons/_icons";
import { Button } from "~/components/Layout/Buttons";
import { Card } from "~/components/ui/card";
import { MuscleType } from "~/constants/workoutSplits";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import DayItem from "./DayItem";

type DaysProps = {
  muscleGroup: MusclePriorityType;
};
export function Days({ muscleGroup }: DaysProps) {
  const exercises = muscleGroup?.exercises;
  return (
    <div className="flex w-full flex-col rounded bg-primary-500/50 p-1">
      <div className="flex p-1 indent-1 text-sm text-white">
        Training Day Frequency
      </div>

      <div className="flex">
        <ul className="flex w-full space-x-2 overflow-x-auto p-1">
          {exercises?.map((day, dayIndex) => {
            return (
              // <Card>
              //   <CardHeader>Day {dayIndex + 1}</CardHeader>
              //   <CardContent>
              //     <ExerciseItem index={1} />
              //   </CardContent>
              // </Card>
              <DayItem index={dayIndex} exercises={day} />
            );
          })}
          <Card className="flex items-center justify-center ">
            <Button>
              <PlusIcon fill="white" />
            </Button>
          </Card>
        </ul>
      </div>
    </div>
  );
}

type ActionsProps = {
  children: ReactNode;
};
export function Actions({ children }: ActionsProps) {
  return <div className="flex w-full ">{children}</div>;
}

type ActionCardProps = {
  title: string;
  children: ReactNode;
};
export function ActionCard({ title, children }: ActionCardProps) {
  return (
    <div className=" flex flex-col rounded bg-primary-500/50 p-1">
      <div className="indent-1 text-sm text-white">{title}</div>
      {children}
    </div>
  );
}

type TitleCardProps = {
  muscle: MuscleType;
};
function TitleCard({ muscle }: TitleCardProps) {
  return (
    <div>
      <div>{muscle}</div>
    </div>
  );
}
