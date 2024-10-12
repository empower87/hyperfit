import { ReactNode } from "react";
import { PlusIcon } from "~/assets/icons/_icons";
import { Button } from "~/components/Layout/Buttons";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { MuscleType } from "~/constants/workoutSplits";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

type DaysProps = {
  days: ExerciseType[][];
};
export function Days({ days }: DaysProps) {
  return (
    <div className="flex w-full flex-col rounded bg-primary-500/50 p-1">
      <div className="flex p-1 indent-1 text-sm text-white">
        Training Day Frequency
      </div>

      <div className="flex">
        <ul className="flex space-x-2 overflow-x-auto p-1">
          {days.map((day, dayIndex) => {
            // return <DayItem index={dayIndex} />;
            return (
              <Card>
                <CardHeader>Day {dayIndex}</CardHeader>
                <CardContent>STUFF</CardContent>
              </Card>
            );
          })}
          <Card className="flex items-center justify-center bg-primary-500">
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
