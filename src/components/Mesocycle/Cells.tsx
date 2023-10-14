import {
  ExerciseDetails,
  ExerciseType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";

type ExerciseCellProps = {
  exercise: ExerciseType;
  index: number;
  width: string;
  cellWidths: string[];
};
type HeaderCellProps = {
  values: string[];
  width: string;
  cellWidths: string[];
};
type Week = "week 1" | "week 2" | "week 3" | "week 4" | "deload";
type MicrocycleCellsProps = {
  week: Week;
  details: ExerciseDetails;
  width: string;
  cellWidths: string[];
};
type SessionCellProps = {
  day: string;
  sessionSplitIndex: 0 | 1;
  split: string;
};

function Cell({ value, width }: { value: string; width: string }) {
  return (
    <div
      className="flex justify-center border-r border-slate-500"
      style={{ width: width }}
    >
      <p className="overflow-hidden text-ellipsis" style={{ fontSize: "10px" }}>
        {value}
      </p>
    </div>
  );
}

function ExerciseCell({
  exercise,
  index,
  width,
  cellWidths,
}: ExerciseCellProps) {
  const bgColor =
    exercise.rank === "MRV"
      ? "bg-red-400"
      : exercise.rank === "MEV"
      ? "bg-orange-400"
      : "bg-green-400";

  return (
    <div
      className={bgColor + " flex flex-row border-r-2 border-slate-500"}
      style={{ width: width }}
    >
      <Cell value={`${index}`} width={cellWidths[0]} />
      <Cell value={exercise.group} width={cellWidths[1]} />
      <Cell value={exercise.exercise} width={cellWidths[2]} />
      <Cell value={"dumbbell"} width={cellWidths[3]} />
      <Cell value={"straight"} width={cellWidths[4]} />
    </div>
  );
}

function HeaderCell({ values, width, cellWidths }: HeaderCellProps) {
  return (
    <div className="flex flex-row bg-slate-300" style={{ width: width }}>
      {values.map((each, index) => (
        <Cell value={each} width={cellWidths[index]} />
      ))}
    </div>
  );
}

function MicrocycleCell({
  week,
  details,
  width,
  cellWidths,
}: MicrocycleCellsProps) {
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
  const borderRight = week !== "deload" ? "border-r-2 border-slate-500" : "";
  return (
    <div className={borderRight + " flex"} style={{ width: width }}>
      {cells.map((cell, index) => (
        <Cell value={cell} width={cellWidths[index]} />
      ))}
    </div>
  );
}

function SessionCell({ day, sessionSplitIndex, split }: SessionCellProps) {
  const backgroundColor =
    split === "upper"
      ? "bg-blue-400"
      : split === "lower"
      ? "bg-red-400"
      : "bg-purple-400";
  return (
    <div className="flex flex-col justify-start" style={{ width: "80px" }}>
      {sessionSplitIndex === 0 ? (
        <div className="bg-slate-300 text-xs">{day}</div>
      ) : (
        <div className="h-4 text-xs"></div>
      )}

      <div className="flex justify-end">
        <p
          className={
            backgroundColor +
            " flex w-9 justify-center border-2 border-slate-500 font-bold text-white"
          }
          style={{ fontSize: "10px" }}
        >
          {split}
        </p>
      </div>
    </div>
  );
}

export { ExerciseCell, HeaderCell, MicrocycleCell, SessionCell };
