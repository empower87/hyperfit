type WorkoutCardProps = {
  day: number;
  session: string;
  sets: ListTuple[];
};

export default function WorkoutCard({ day, session, sets }: WorkoutCardProps) {
  const textcolor = session === "upper" ? "text-red-500" : "text-blue-500";
  return (
    <div>
      <h2>Workout: {day} </h2>
      <h3>
        Split: <span className={`${textcolor}`}>{session}</span>{" "}
      </h3>
      <ul>
        <li>{console.log(sets, "WHAT THIS LOOK LIKE?")}</li>
        {sets.map((each) => {
          return (
            <li>
              {each[1]} sets: {each[0]}
            </li>
          );
        })}
        {/* <li>4 sets: biceps</li>
        <li>4 sets: biceps</li>
        <li>4 sets: back</li>
        <li>4 sets: back</li>
        <li>4 sets: rear delts</li>
        <li>4 sets: traps</li> */}
      </ul>
    </div>
  );
}

25;

4;
4;
4;

21;
17;
13;

8;
8;
8;

9;
5;
1;

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
