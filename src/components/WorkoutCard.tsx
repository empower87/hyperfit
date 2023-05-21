import { BACK_EXERCISES } from "~/constants/exercises";
import Lift, { LiftTable } from "./Lift";

type WorkoutCardProps = {
  day: number;
  session: string;
  sets: ListTuple[];
};

const AVERAGE_SET_DURATION = 20;
const REST_PERIOD = 60;

const getEstimatedWorkoutDuration = (sets: number) => {
  const setTime = sets * AVERAGE_SET_DURATION;
  const restTime = sets * REST_PERIOD;

  const totalMinutes = (setTime + restTime) / 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  const hoursText = hours === 1 ? `${hours}hr` : hours > 0 ? `${hours}hrs` : "";
  const minutesText = minutes > 0 ? `${minutes}min` : "";

  if (hoursText && minutesText) {
    return `${hoursText} ${minutesText}`;
  } else {
    return hoursText || minutesText;
  }
};

function Header({ day, session }: Pick<WorkoutCardProps, "day" | "session">) {
  const textcolor = session === "upper" ? "text-red-500" : "text-blue-500";
  const capitalizedSession = session === "upper" ? "Upper" : "Lower";

  return (
    <div className="flex justify-center bg-slate-700">
      <h2 className="p-1 text-sm font-medium text-white">Day {day}: </h2>
      <h2 className={`${textcolor} p-1 text-sm font-medium`}>
        {capitalizedSession}
      </h2>
    </div>
  );
}

function Footer({ time }: { time: string }) {
  return (
    <div className="w-full bg-slate-300">
      <h2 className="p-1 text-xs font-medium text-slate-500">
        Total Workout Duration: {time}
      </h2>
    </div>
  );
}

export default function WorkoutCard({ day, session, sets }: WorkoutCardProps) {
  const totalSets = sets.reduce((total, [, number]) => total + number, 0);

  const totalWorkoutTime = getEstimatedWorkoutDuration(totalSets);

  return (
    <div className="m-4">
      <Header day={day} session={session} />
      <LiftTable>
        {sets.map((each, index) => {
          return (
            <Lift
              key={`${each[1]}_${index}}`}
              sets={each[1]}
              category={each[0]}
              exercise={BACK_EXERCISES[index].name}
            />
          );
        })}
      </LiftTable>
      <Footer time={totalWorkoutTime} />
    </div>
  );
}

type ListTuple = [string, number];

export const updateList = (list: ListTuple[], tuple: ListTuple) => {
  const [searchString, searchNumber] = tuple;

  // Check if the tuple already exists in the list
  const existingTupleIndex = list.findIndex(([str]) => str === searchString);

  if (existingTupleIndex !== -1) {
    // Tuple exists, update its number value if it doesn't exceed 12
    const [existingString, existingNumber] = list[
      existingTupleIndex
    ] as ListTuple;
    const newNumber = existingNumber + searchNumber;

    if (newNumber <= 12) {
      list[existingTupleIndex] = [existingString, newNumber];
      return list;
    } else {
      return null;
    }
  } else {
    // Tuple does not exist, push it to the list
    list.push(tuple);
    return list;
  }
};
