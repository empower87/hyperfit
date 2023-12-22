import {
  ExerciseDetails,
  ExerciseType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { BG_COLOR_M7 } from "~/utils/themes";

type ExerciseCellProps = {
  exercise: ExerciseType;
  index: number;
  width: string;
  cellWidths: string[];
  position: "last" | "first" | "mid";
  openModal: () => void;
};
type HeaderCellProps = {
  values: string[];
  width: string;
  cellWidths: string[];
};
type Week = "week 1" | "week 2" | "week 3" | "week 4" | "deload";
type MicrocycleCellsProps = {
  week: Week;
  details: number[];
  width: string;
  cellWidths: string[];
  position: "last" | "first" | "mid";
};
type SessionCellProps = {
  split: SplitType;
  index: number;
  width: string;
};

function Cell({
  value,
  width,
  alignment,
}: {
  value: string | number;
  width: string;
  alignment: string;
}) {
  return (
    <div
      className={alignment + " flex border-r border-slate-600"}
      style={{ width: width }}
    >
      <p className="truncate text-white" style={{ fontSize: "10px" }}>
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
  position,
  openModal,
}: ExerciseCellProps) {
  const bgColor =
    exercise.rank === "MRV"
      ? "bg-red-400"
      : exercise.rank === "MEV"
      ? "bg-orange-400"
      : "bg-green-400";
  const bottomBorder = position !== "last" ? " border-b" : " border-b-2";
  const topBorder = position === "first" ? " border-t-2" : "";
  return (
    <div
      className={
        bgColor +
        bottomBorder +
        topBorder +
        " flex flex-row border-x-2 border-slate-600"
      }
      onClick={() => openModal()}
      style={{ width: width }}
    >
      <Cell
        value={`${index}`}
        width={cellWidths[0]}
        alignment="justify-center"
      />
      <Cell
        value={exercise.group}
        width={cellWidths[1]}
        alignment="justify-start"
      />
      <Cell
        value={exercise.exercise}
        width={cellWidths[2]}
        alignment="justify-start"
      />
      <Cell
        value={"dumbbell"}
        width={cellWidths[3]}
        alignment="justify-start"
      />
      <Cell
        value={"straight"}
        width={cellWidths[4]}
        alignment="justify-start"
      />
    </div>
  );
}

function HeaderCell({ values, width, cellWidths }: HeaderCellProps) {
  let bgColor = values[0] === "" ? "" : BG_COLOR_M7;
  return (
    <div className={bgColor + " flex flex-row"} style={{ width: width }}>
      {values.map((each, index) => (
        <Cell
          value={each}
          width={cellWidths[index]}
          alignment="justify-center"
        />
      ))}
    </div>
  );
}

function MicrocycleCell({
  week,
  details,
  width,
  cellWidths,
  position,
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

  const bottomBorder = position !== "last" ? " border-b" : " border-b-2";
  const topBorder = position === "first" ? " border-t-2" : " ";

  // const cells = getCellData(week, details);
  const cells = details;
  return (
    <div
      className={
        bottomBorder +
        topBorder +
        " flex border-r-2 border-slate-600 bg-slate-400"
      }
      style={{ width: width }}
    >
      {cells.map((cell, index) => (
        <Cell
          value={cell}
          width={cellWidths[index]}
          alignment="justify-center"
        />
      ))}
    </div>
  );
}

function SessionCell({ split, index, width }: SessionCellProps) {
  const backgroundColor =
    split === "upper"
      ? "bg-blue-400"
      : split === "lower"
      ? "bg-red-400"
      : "bg-purple-400";
  return (
    <div className={"flex justify-end"} style={{ width: width }}>
      {index === 1 && (
        <div className="flex">
          <p
            className={
              backgroundColor +
              " flex w-9 justify-center border-y-2 border-l-2 border-slate-600 font-bold text-white"
            }
            style={{ fontSize: "10px" }}
          >
            {split}
          </p>
        </div>
      )}
    </div>
  );
}

export { ExerciseCell, HeaderCell, MicrocycleCell, SessionCell };
