import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import ExerciseItem from "./ExerciseItem";

type DayItemProps = {
  index: number;
  exercises: ExerciseType[];
};

export default function DayItem({ index, exercises }: DayItemProps) {
  const sessions: number[] = [1];
  return (
    <Card>
      <CardHeader>Day {index + 1}</CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sessions.map((session, sessionIndex) => {
            return <Session index={sessionIndex} exercises={exercises} />;
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

type SessionProps = {
  index: number;
  exercises: ExerciseType[];
};
function Session({ index, exercises }: SessionProps) {
  return (
    <div className="">
      <div className="flex pb-2 text-sm text-white">Session {index + 1}</div>
      <ul className="space-y-1">
        {exercises.map((exercise, exerciseIndex) => {
          return <ExerciseItem index={exerciseIndex} exercise={exercise} />;
        })}
      </ul>
    </div>
  );
}
