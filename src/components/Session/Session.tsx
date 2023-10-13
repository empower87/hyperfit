import {
  ExerciseDetails,
  ExerciseType,
  SessionDayType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";

const LayoutHeaderCell = ({
  name,
  height,
  width,
  bgColor,
  textColor,
}: {
  name: string;
  height: string;
  width: string;
  bgColor: string;
  textColor: string;
}) => {
  return (
    <div className={"flex " + `${height} ` + `${width} ` + `${bgColor}`}>
      <p className={"text-xs " + `${textColor}`}>{name}</p>
    </div>
  );
};

const LayoutHeader = ({ headers }: { headers: string[] }) => {
  return (
    <div>
      {headers.map((each) => {
        return (
          <LayoutHeaderCell
            name={each}
            height={"h-5"}
            width={"w-6"}
            bgColor="bg-slate-600"
            textColor="text-white"
          />
        );
      })}
    </div>
  );
};

const LayoutRows = ({ data }: { data: any[] }) => {
  return (
    <div>
      {data.map((each) => {
        return (
          <LayoutHeaderCell
            name={each}
            height={"h-5"}
            width={"w-6"}
            bgColor="bg-slate-600"
            textColor="text-white"
          />
        );
      })}
    </div>
  );
};

function LayoutSection({ headers, rows }: { headers: string[]; rows: any[] }) {
  return (
    <div className="flex flex-col">
      <LayoutHeader headers={headers} />
      <LayoutRows data={rows} />
    </div>
  );
}
function SessionHeaderLayout() {
  return (
    <div>
      <div></div>
      <div>Session</div>
      <div>Week 1</div>
      <div>Week 2</div>
      <div>Week 3</div>
      <div>Week 4</div>
      <div>Deload</div>
    </div>
  );
}

const SESSION_HEADERS = ["#", "Group", "Exercise", "Category", "Modality"];
const WEEK_ONE_HEADERS = ["Sets", "Reps", "Weight", "RIR"];
const WEEK_TWO_TO_DELOAD_HEADERS = ["Sets", "Weight", "RIR"];

// function SessionLayout({
//   split,
//   list,
//   totalSessions,
//   splitTest,
// }: {
//   split: SessionDayType[];
//   list: MusclePriorityType[];
//   totalSessions: [number, number];
//   splitTest: SessionDayType[];
// }) {
//   const block = useTrainingBlock(list, totalSessions, split)

//   return (
//     <div className="flex flex-col">
//       <SessionHeaderLayout />
//       <div className="flex">
//         <SessionDayLayout />
//         <div className="flex">
//           <LayoutSection headers={SESSION_HEADERS} rows={rows} />
//           <LayoutSection headers={WEEK_ONE_HEADERS} rows={rows} />
//           <LayoutSection headers={WEEK_TWO_TO_DELOAD_HEADERS} rows={rows} />
//           <LayoutSection headers={WEEK_TWO_TO_DELOAD_HEADERS} rows={rows} />
//           <LayoutSection headers={WEEK_TWO_TO_DELOAD_HEADERS} rows={rows} />
//           <LayoutSection headers={WEEK_TWO_TO_DELOAD_HEADERS} rows={rows} />
//         </div>
//       </div>
//     </div>
//   );
// }

type SessionDetailsProps = {
  exercises: ExerciseType[][];
  currentMesocycleIndex: number;
};

type SessionDetailsRowProps = {
  day: string;
  exercises: ExerciseType[][];
  currentMesocycleIndex: number;
  option: 1 | 2 | 3;
};

const SessionDetailsRow = ({
  day,
  exercises,
  currentMesocycleIndex,
  option,
}: SessionDetailsRowProps) => {
  const SessionDayTitle = ({
    day,
    option,
  }: {
    day: string;
    option: 1 | 2 | 3;
  }) => {
    switch (option) {
      case 2:
        return <div className="text-xs">late: </div>;
      case 3:
        return <div className="text-xs">{day} early: </div>;
      default:
        return <div className="text-xs">{day}</div>;
    }
  };

  return (
    <div className="flex flex-row">
      <div className="flex justify-start">
        <SessionDayTitle day={day} option={option} />
      </div>
      <SessionDetails
        exercises={exercises}
        currentMesocycleIndex={currentMesocycleIndex}
      />
    </div>
  );
};

function DaySessionLayout({
  split,
  currentMesocycleIndex,
}: {
  split: SessionDayType;
  currentMesocycleIndex: number;
}) {
  return (
    <div className="flex">
      {split.sets.map((each, index) => {
        const isDouble =
          split.sets[0].length && split.sets[1].length ? true : false;
        const option =
          index === 0 && isDouble ? 3 : index === 0 && !isDouble ? 1 : 2;
        return (
          <SessionDetailsRow
            day={split.day}
            exercises={each}
            currentMesocycleIndex={currentMesocycleIndex}
            option={option}
          />
        );
      })}
    </div>
  );
}

export function MesocycleLayout({
  split,
  currentMesocycleIndex,
}: {
  split: SessionDayType[];
  currentMesocycleIndex: number;
}) {
  // const block = useTrainingBlock(list, totalSessions, split)

  return (
    <div className="flex flex-col">
      <div className="bg-slate-500 text-white">
        Mesocycle {currentMesocycleIndex + 1}
      </div>

      <div className="flex flex-col">
        <SessionHeaderLayout />
        <div className="flex">
          {split.map((each) => {
            return (
              <DaySessionLayout
                split={each}
                currentMesocycleIndex={currentMesocycleIndex}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SessionDetails({
  exercises,
  currentMesocycleIndex,
}: SessionDetailsProps) {
  const SessionHeaders = () => {
    const Headers = ({ values }: { values: string[] }) => {
      return (
        <div className="flex flex-row">
          {values.map((each) => (
            <div className="text-xs">{each}</div>
          ))}
        </div>
      );
    };
    return (
      <div className="flex flex-row">
        <Headers values={SESSION_HEADERS} />
        <Headers values={WEEK_ONE_HEADERS} />
        <Headers values={WEEK_TWO_TO_DELOAD_HEADERS} />
        <Headers values={WEEK_TWO_TO_DELOAD_HEADERS} />
        <Headers values={WEEK_TWO_TO_DELOAD_HEADERS} />
        <Headers values={WEEK_TWO_TO_DELOAD_HEADERS} />
      </div>
    );
  };
  return (
    <div className="flex flex-col">
      <SessionHeaders />
      <div className="flex flex-col">
        {exercises.map((exerciseSet) => {
          return exerciseSet.map((exercise) => {
            return (
              <MicrocyclesRow
                exercise={exercise}
                currentMesocycleIndex={currentMesocycleIndex}
              />
            );
          });
        })}
      </div>
    </div>
  );
}

type MicrocyclesRowProps = {
  exercise: ExerciseType;
  currentMesocycleIndex: number;
};

function MicrocyclesRow({
  exercise,
  currentMesocycleIndex,
}: MicrocyclesRowProps) {
  const details = exercise.meso_details[currentMesocycleIndex];
  if (!details) return null;

  return (
    <div className="flex flex-row">
      <ExerciseRow exercise={exercise} />
      <MicrocycleRow week="week 1" details={details} />
      <MicrocycleRow week="week 2" details={details} />
      <MicrocycleRow week="week 3" details={details} />
      <MicrocycleRow week="week 4" details={details} />
      <MicrocycleRow week="deload" details={details} />
    </div>
  );
}

type Week = "week 1" | "week 2" | "week 3" | "week 4" | "deload";

type ExerciseRowProps = {
  exercise: ExerciseType;
};
function ExerciseRow({ exercise }: ExerciseRowProps) {
  return (
    <div className="flex flex-row">
      <div>1</div>
      <div>{exercise.group}</div>
      <div>{exercise.exercise}</div>
      <div>dumbbell</div>
      <div>straight</div>
    </div>
  );
}

type MicrocycleRowProps = {
  week: Week;
  details: ExerciseDetails;
};
// week
function MicrocycleRow({ week, details }: MicrocycleRowProps) {
  const getCellData = (week: Week, details: ExerciseDetails) => {
    let _details = details;

    switch (week) {
      case "week 1":
        return [_details.sets, _details.reps, _details.weight, _details.rir];
      case "week 2":
        return [_details.sets + 1, _details.weight + 5, _details.rir - 1];
      case "week 3":
        return [_details.sets + 2, _details.weight + 10, _details.rir - 2];
      case "week 4":
        return [_details.sets + 3, _details.weight + 15, _details.rir - 3];
      default:
        return [2, _details.weight, 5];
    }
  };

  const cells = getCellData(week, details);
  return (
    <div className="flex">
      {cells.map((cell) => (
        <MicrocycleCell value={cell} />
      ))}
    </div>
  );
}

// sets, reps, weight, rir
function MicrocycleCell({ value }: { value: number }) {
  return <div className="text-xs">{value}</div>;
}
