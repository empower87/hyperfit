import Lift, { LiftTable } from "./Lift";

export type ListTuple = [string, number];

type WorkoutCardProps = {
  day: number;
  split: string;
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

function Header({ day, split }: Pick<WorkoutCardProps, "day" | "split">) {
  const textcolor = split === "upper" ? "text-red-500" : "text-blue-500";
  const capSplit = split === "upper" ? "Upper" : "Lower";

  return (
    <div className="flex justify-between bg-slate-700">
      <div className="flex w-1/2">
        <h2 className="p-1 text-sm font-medium text-white">Day {day}: </h2>
        <h2 className={`${textcolor} p-1 text-sm font-medium`}>{capSplit}</h2>
      </div>
      <div style={{ width: "150px" }} className="flex text-sm text-white">
        <h2 className="p-1 text-sm font-medium text-white">Week 1</h2>
      </div>
    </div>
  );
}

function Footer({ time, sets }: { time: string; sets: number }) {
  return (
    <div className="flex w-full justify-between bg-slate-300">
      <div className="flex flex-col">
        <p className="p-1 text-xs font-medium text-slate-500">Total Sets:</p>
        <p className="p-1 text-xs text-white"> {sets}</p>
      </div>
      <div className="flex flex-col">
        <p className="p-1 text-xs font-medium text-slate-500">
          Total Workout Duration:
        </p>
        <p className="p-1 text-xs text-white"> {time}</p>
      </div>
    </div>
  );
}

export default function WorkoutCard({ day, split, sets }: WorkoutCardProps) {
  const totalSets = sets.reduce((total, [, number]) => total + number, 0);

  const totalWorkoutTime = getEstimatedWorkoutDuration(totalSets);

  return (
    <div className="mb-2 mr-2">
      <Header day={day} split={split} />
      <LiftTable>
        {sets.map((each, index) => {
          return (
            <Lift
              key={`${each[1]}_${index}}`}
              index={index}
              sets={each[1]}
              category={each[0]}
            />
          );
        })}
      </LiftTable>
      <Footer time={totalWorkoutTime} sets={totalSets} />
    </div>
  );
}
