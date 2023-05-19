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

  const hoursText = hours > 0 ? `${hours} hrs` : "";
  const minutesText = minutes > 0 ? `${minutes} minutes` : "";

  if (hoursText && minutesText) {
    return `${hoursText} and ${minutesText}`;
  } else {
    return hoursText || minutesText;
  }
};

export default function WorkoutCard({ day, session, sets }: WorkoutCardProps) {
  const textcolor = session === "upper" ? "text-red-500" : "text-blue-500";
  const totalSets = sets.reduce((total, [, number]) => total + number, 0);

  const totalWorkoutTime = getEstimatedWorkoutDuration(totalSets);

  return (
    <div className="m-4">
      <h2>Workout: {day} </h2>
      <h3>
        Split: <span className={`${textcolor}`}>{session}</span>{" "}
      </h3>
      <ul>
        {sets.map((each) => {
          return (
            <li>
              {each[1]} sets: {each[0]}
            </li>
          );
        })}
      </ul>
      <h4>~{totalWorkoutTime}</h4>
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
