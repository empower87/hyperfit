import { Card, CardContent, CardHeader } from "~/components/ui/card";
import ExerciseItem from "./ExerciseItem";

type DayItemProps = {
  index: number;
};

export default function DayItem({ index }: DayItemProps) {
  const sessions: number[] = [1, 2];
  return (
    <Card>
      <CardHeader>Day {index + 1}</CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sessions.map((session, sessionIndex) => {
            return <Session index={sessionIndex} />;
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

// export default function DayItem({ index }: DayItemProps) {
//   const sessions: number[] = [1, 2];
//   return (
//     <div className="flex flex-col rounded bg-primary-500">
//       <div className="flex p-1 indent-1 text-sm text-white">
//         Day {index + 1}
//       </div>

//       <ul className="flex flex-col space-y-1 border-primary-500 p-1">
//         {sessions.map((session, sessionIndex) => {
//           return <Session index={sessionIndex} />;
//         })}
//       </ul>
//     </div>
//   );
// }

type SessionProps = {
  index: number;
};
function Session({ index }: SessionProps) {
  const exercises: number[] = [1];
  return (
    <div className="">
      <div className="flex pb-2 indent-1 text-sm text-white">
        Session {index + 1}
      </div>
      <ul className="space-y-1 p-1">
        {exercises.map((exercise, exerciseIndex) => {
          return <ExerciseItem index={exerciseIndex} />;
        })}
      </ul>
    </div>
  );
}
