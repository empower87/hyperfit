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
    <div className="flex w-full">
      <div className="" style={{ width: ROW_SECTION_WIDTHS[0] }}></div>
      <div
        className="border border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[1] }}
      >
        Session
      </div>
      <div
        className="border border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[2] }}
      >
        Week 1
      </div>
      <div
        className="border border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[3] }}
      >
        Week 2
      </div>
      <div
        className="border border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[4] }}
      >
        Week 3
      </div>
      <div
        className="border border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[5] }}
      >
        Week 4
      </div>
      <div
        className="border border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[6] }}
      >
        Deload
      </div>
    </div>
  );
}

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
  option: 1 | 2;
  session: string;
};

const SessionDetailsRow = ({
  day,
  exercises,
  currentMesocycleIndex,
  option,
  session,
}: SessionDetailsRowProps) => {
  const SessionDayTitle = ({ day, option }: { day: string; option: 1 | 2 }) => {
    switch (option) {
      case 2:
        return <div className="h-4 text-xs"></div>;
      default:
        return <div className="bg-slate-300 text-xs">{day}</div>;
    }
  };
  const backgroundColor =
    session === "upper"
      ? "bg-blue-400"
      : session === "lower"
      ? "bg-red-400"
      : "bg-purple-400";
  return (
    <div className="flex flex-row">
      <div className="flex flex-col justify-start" style={{ width: "80px" }}>
        <SessionDayTitle day={day} option={option} />
        <div className="flex justify-end">
          <p
            className={
              backgroundColor +
              " flex w-9 justify-center rounded border-2 border-slate-500 font-bold text-white"
            }
            style={{ fontSize: "10px" }}
          >
            {session}
          </p>
        </div>
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
    <div className="mb-1 flex flex-col">
      {split.sets.map((each, index) => {
        const isDouble =
          split.sets[0].length && split.sets[1].length ? true : false;
        const option = index === 0 ? 1 : 2;
        if (!each.length) return null;
        return (
          <SessionDetailsRow
            day={split.day}
            session={split.sessions[index]}
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
    <div className="flex w-full flex-col" style={{ width: "920px" }}>
      <div className="bg-slate-500 text-white">
        Mesocycle {currentMesocycleIndex + 1}
      </div>

      <div className="mt-1 flex flex-col">
        <SessionHeaderLayout />
        <div className="flex flex-col">
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

const SESSION_HEADERS = ["#", "Group", "Exercise", "Category", "Modality"];
const WEEK_ONE_HEADERS = ["Sets", "Reps", "Weight", "RIR"];
const WEEK_TWO_TO_FOUR_HEADERS = ["Sets", "Weight", "RIR"];

const ROW_SECTION_WIDTHS = [
  "80px",
  "300px",
  "120px",
  "100px",
  "100px",
  "100px",
  "120px",
];

const EXERCISE_WIDTHS = ["5%", "15%", "50%", "15%", "15%"];
const week_one_deload_widths = ["15%", "25%", "25%", "15%"];
const week_two_three_four_widths = ["25%", "50%", "25%"];

const ROW_CELL_WIDTHS = {
  exercise: EXERCISE_WIDTHS,
  "week 1": week_one_deload_widths,
  "week 2": week_two_three_four_widths,
  "week 3": week_two_three_four_widths,
  "week 4": week_two_three_four_widths,
  deload: week_one_deload_widths,
};

function SessionDetails({
  exercises,
  currentMesocycleIndex,
}: SessionDetailsProps) {
  const SessionHeaders = () => {
    const Headers = ({
      values,
      width,
      cellWidths,
    }: {
      values: string[];
      width: string;
      cellWidths: string[];
    }) => {
      return (
        <div className="flex flex-row bg-slate-300" style={{ width: width }}>
          {values.map((each, index) => (
            <Cell value={each} width={cellWidths[index]} />
          ))}
        </div>
      );
    };

    return (
      <div className="flex flex-row">
        <Headers
          values={SESSION_HEADERS}
          width={ROW_SECTION_WIDTHS[1]}
          cellWidths={ROW_CELL_WIDTHS["exercise"]}
        />
        <Headers
          values={WEEK_ONE_HEADERS}
          width={ROW_SECTION_WIDTHS[2]}
          cellWidths={ROW_CELL_WIDTHS["week 1"]}
        />
        <Headers
          values={WEEK_TWO_TO_FOUR_HEADERS}
          width={ROW_SECTION_WIDTHS[3]}
          cellWidths={ROW_CELL_WIDTHS["week 2"]}
        />
        <Headers
          values={WEEK_TWO_TO_FOUR_HEADERS}
          width={ROW_SECTION_WIDTHS[4]}
          cellWidths={ROW_CELL_WIDTHS["week 3"]}
        />
        <Headers
          values={WEEK_TWO_TO_FOUR_HEADERS}
          width={ROW_SECTION_WIDTHS[5]}
          cellWidths={ROW_CELL_WIDTHS["week 4"]}
        />
        <Headers
          values={WEEK_ONE_HEADERS}
          width={ROW_SECTION_WIDTHS[6]}
          cellWidths={ROW_CELL_WIDTHS["deload"]}
        />
      </div>
    );
  };

  let count = 0;
  return (
    <div className="flex flex-col border border-slate-300">
      <SessionHeaders />
      <div className="flex flex-col">
        {exercises.map((exerciseSet) => {
          return exerciseSet.map((exercise, index) => {
            count++;
            return (
              <MicrocyclesRow
                exercise={exercise}
                index={count}
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
  index: number;
  currentMesocycleIndex: number;
};

function MicrocyclesRow({
  exercise,
  index,
  currentMesocycleIndex,
}: MicrocyclesRowProps) {
  const details = exercise.meso_details[currentMesocycleIndex];
  if (!details) return null;

  return (
    <div className="flex flex-row">
      <ExerciseRow
        exercise={exercise}
        index={index}
        width={ROW_SECTION_WIDTHS[1]}
        cellWidths={ROW_CELL_WIDTHS["exercise"]}
      />
      <MicrocycleRow
        week="week 1"
        details={details}
        width={ROW_SECTION_WIDTHS[2]}
        cellWidths={ROW_CELL_WIDTHS["week 1"]}
      />
      <MicrocycleRow
        week="week 2"
        details={details}
        width={ROW_SECTION_WIDTHS[3]}
        cellWidths={ROW_CELL_WIDTHS["week 2"]}
      />
      <MicrocycleRow
        week="week 3"
        details={details}
        width={ROW_SECTION_WIDTHS[4]}
        cellWidths={ROW_CELL_WIDTHS["week 3"]}
      />
      <MicrocycleRow
        week="week 4"
        details={details}
        width={ROW_SECTION_WIDTHS[5]}
        cellWidths={ROW_CELL_WIDTHS["week 4"]}
      />
      <MicrocycleRow
        week="deload"
        details={details}
        width={ROW_SECTION_WIDTHS[6]}
        cellWidths={ROW_CELL_WIDTHS["deload"]}
      />
    </div>
  );
}

type Week = "week 1" | "week 2" | "week 3" | "week 4" | "deload";

type ExerciseRowProps = {
  exercise: ExerciseType;
  index: number;
  width: string;
  cellWidths: string[];
};
function ExerciseRow({ exercise, index, width, cellWidths }: ExerciseRowProps) {
  const bgColor =
    exercise.rank === "MRV"
      ? "bg-red-400"
      : exercise.rank === "MEV"
      ? "bg-orange-400"
      : "bg-green-400";

  return (
    <div className={bgColor + " flex flex-row"} style={{ width: width }}>
      <Cell value={`${index}`} width={cellWidths[0]} />
      <Cell value={exercise.group} width={cellWidths[1]} />
      <Cell value={exercise.exercise} width={cellWidths[2]} />
      <Cell value={"dumbbell"} width={cellWidths[3]} />
      <Cell value={"straight"} width={cellWidths[4]} />
    </div>
  );
}

type MicrocycleRowProps = {
  week: Week;
  details: ExerciseDetails;
  width: string;
  cellWidths: string[];
};
// week
function MicrocycleRow({
  week,
  details,
  width,
  cellWidths,
}: MicrocycleRowProps) {
  const getCellData = (week: Week, details: ExerciseDetails) => {
    let _details = details;

    switch (week) {
      case "week 1":
        return [
          `${_details.sets}`,
          `${_details.reps}`,
          `${_details.weight}`,
          `${_details.rir}`,
        ];
      case "week 2":
        return [
          `${_details.sets + 1}`,
          `${_details.weight + 5}`,
          `${_details.rir - 1}`,
        ];
      case "week 3":
        return [
          `${_details.sets + 2}`,
          `${_details.weight + 10}`,
          `${_details.rir - 2}`,
        ];
      case "week 4":
        return [
          `${_details.sets + 3}`,
          `${_details.weight + 15}`,
          `${_details.rir - 3}`,
        ];
      default:
        return ["2", `${_details.reps}`, `${_details.weight}`, "5"];
    }
  };

  const cells = getCellData(week, details);

  return (
    <div className="flex" style={{ width: width }}>
      {cells.map((cell, index) => (
        <Cell value={cell} width={cellWidths[index]} />
      ))}
    </div>
  );
}

// sets, reps, weight, rir
function Cell({ value, width }: { value: string; width: string }) {
  return (
    <div className="flex" style={{ width: width }}>
      <p className="overflow-hidden text-ellipsis" style={{ fontSize: "10px" }}>
        {value}
      </p>
    </div>
  );
}
