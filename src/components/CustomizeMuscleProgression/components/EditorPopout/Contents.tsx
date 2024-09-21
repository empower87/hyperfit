import { PlusIcon } from "~/assets/icons/_icons";
import { Button } from "~/components/Layout/Buttons";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import DayItem from "./DayItem";

type DaysProps = {
  days: ExerciseType[][];
};
export function Days({ days }: DaysProps) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex p-1 indent-1 text-sm text-white">
        Training Day Frequency
      </div>

      <div className="flex">
        <ul className="flex space-x-2 overflow-x-auto p-1">
          {days.map((day, dayIndex) => {
            return <DayItem index={dayIndex} />;
          })}
        </ul>

        <div>
          <Button>
            <PlusIcon fill="white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
