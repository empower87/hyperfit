import { ReactNode, useRef } from "react";
import { SessionType } from "~/pages";
import Lift, { LiftTable } from "./Lift";

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

  const renderRef = useRef<number>(0);
  console.log(renderRef.current++, "<WorkoutCard /> render count");
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

export type ListTuple = [string, number];

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

type LayoutProps = {
  number: number;
  children: ReactNode;
};
type MesocycleTableProps = {
  split: SessionType[];
};
type MicrocycleTableProps = {
  values: number[][];
};

export const MesocycleLayout = ({ number, children }: LayoutProps) => {
  return (
    <div className="flex flex-col rounded border-2 border-slate-500">
      <div className="w-full rounded-t-sm bg-slate-700">
        <h2 className="ml-1 p-1 text-white">Mesocycle {number}</h2>
      </div>
      <div className="flex">{children}</div>
    </div>
  );
};

export const MicrocycleLayout = ({ number, children }: LayoutProps) => {
  return (
    <div className="mt-2 flex justify-center">
      <div className="flex w-20 flex-col rounded border-2 border-slate-500">
        <div className="w-full rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">Week {number}</h2>
        </div>
        <div className="flex">{children}</div>
      </div>
    </div>
  );
};

export const MesocycleTable = ({ split }: MesocycleTableProps) => {
  return (
    <div className="flex flex-col">
      {split.map((each) => {
        return (
          <table className="m-1">
            <TableHeadColumns session={each.split} />
            <tbody>
              {each.sets.map((set) => {
                if (set[1] > 0) {
                  return <TableBodyRows exercise={set[0]} sets={set[1]} />;
                }
              })}
            </tbody>
          </table>
        );
      })}
    </div>
  );
};

export function TableHeadColumns({ session }: TableBodyRowsProps) {
  const ColumnHead = ({ text }: { text: string }) => {
    return (
      <th className="bg-slate-300 pl-2" style={{ fontSize: "10px" }}>
        {text}
      </th>
    );
  };

  const ColumnsForEachWeek = () => (
    <>
      <ColumnHead text="Sets" />
      <ColumnHead text="Reps" />
      <ColumnHead text="Weight" />
      <ColumnHead text="RIR" />
    </>
  );

  return (
    <thead>
      <tr>
        <ColumnHead text={session} />
        <ColumnsForEachWeek />
        <ColumnsForEachWeek />
        <ColumnsForEachWeek />
        <ColumnsForEachWeek />
        <ColumnsForEachWeek />
      </tr>
    </thead>
  );
}

type TableBodyRowsProps = {
  session: "upper" | "lower" | "full";
};

const Row = ({ value }: { value: number | string }) => {
  return (
    <td className="border-l-2 pl-2" style={{ fontSize: "10px" }}>
      {value}
    </td>
  );
};

export function TableBodyRows({
  exercise,
  sets,
}: {
  exercise: string;
  sets: number;
}) {
  type RowsForEachWeekProps = {
    sets: number;
    reps: number;
    weight: number;
    rir: number;
  };
  const Row = ({ value }: { value: number | string }) => {
    return (
      <td className="border-l-2 pl-2" style={{ fontSize: "10px" }}>
        {value}
      </td>
    );
  };

  const RowsForEachWeek = ({
    sets,
    reps,
    weight,
    rir,
  }: RowsForEachWeekProps) => {
    return (
      <>
        <Row value={sets} />
        <Row value={reps} />
        <Row value={weight} />
        <Row value={rir} />
      </>
    );
  };

  return (
    <tr className="" style={{ lineHeight: 1.2 }}>
      <Row value={exercise} />
      <RowsForEachWeek sets={sets} reps={12} weight={100} rir={2} />
      <RowsForEachWeek sets={sets} reps={12} weight={100} rir={2} />
      <RowsForEachWeek sets={sets} reps={12} weight={100} rir={2} />
      <RowsForEachWeek sets={sets} reps={12} weight={100} rir={2} />
      <RowsForEachWeek sets={sets} reps={12} weight={100} rir={2} />
    </tr>
  );
}

export const MicrocycleTable = ({ values }: MicrocycleTableProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Sets</th>
          <th>Reps</th>
          <th>Weight</th>
          <th>RIR</th>
        </tr>
      </thead>
      <tbody>
        {values.map((columns) => {
          return (
            <tr key={`${columns.length}_row`}>
              {columns.map((column) => {
                return <td key={`${column}_column`}>{column}</td>;
              })}
              {/* <Row value={} /> */}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
