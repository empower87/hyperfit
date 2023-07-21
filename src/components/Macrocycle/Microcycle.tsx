import { ExerciseType } from "~/utils/distributeSets";

type TableCellProps = {
  head:
    | "week 1"
    | "week 2"
    | "week 3"
    | "week 4"
    | "deload"
    | "upper"
    | "lower"
    | "full";
  body: ExerciseType[][];
};

function TH({ text }: { text: string }) {
  const backgroundColor =
    text === "upper"
      ? "bg-blue-400"
      : text === "lower"
      ? "bg-red-400"
      : text === "full"
      ? "bg-purple-400"
      : "bg-slate-400";
  return (
    <th className={backgroundColor + " text-white"} style={{ fontSize: "8px" }}>
      {text}
    </th>
  );
}

function TD({ value }: { value: string | number }) {
  return (
    <td className="border-2 pl-2 text-slate-600" style={{ fontSize: "10px" }}>
      {value}
    </td>
  );
}

export default function Microcycle({ head, body }: TableCellProps) {
  const getCellHeads = (head: string) => {
    const CELL_HEADS_WEEK_1 = ["Sets", "Reps", "Weight", "RiR"];
    const CELL_HEADS_WEEK_2PLUS = ["Sets", "Weight", "RiR"];

    switch (head) {
      case "week 1":
        return CELL_HEADS_WEEK_1;
      case "week 2":
        return CELL_HEADS_WEEK_2PLUS;
      case "week 3":
        return CELL_HEADS_WEEK_2PLUS;
      case "week 4":
        return CELL_HEADS_WEEK_2PLUS;
      case "deload":
        return CELL_HEADS_WEEK_2PLUS;
      default:
        return [head];
    }
  };

  const getInnerCells = (head: string, values: ExerciseType) => {
    const sessions = ["upper", "lower", "full"];
    if (sessions.includes(head)) {
      return [values.exercise];
    } else if (head === "week 1") {
      return [values.sets, values.reps, values.weight, values.rir];
    } else {
      return [values.sets, values.weight, values.rir];
    }
  };

  const th_list = getCellHeads(head);

  return (
    <td className="pb-1 pt-1">
      <table className="w-full border-collapse">
        <thead>
          <tr className="leading-3">
            {th_list.map((each, index) => {
              return <TH key={`${each}_${index}`} text={each} />;
            })}
          </tr>
        </thead>

        <tbody>
          {body.map((each, index) => {
            return each.map((ea) => {
              const cells = getInnerCells(head, ea);
              return (
                <tr key={`${ea.exercise}_${index}_tr`} className="leading-none">
                  {cells.map((cell) => {
                    return <TD key={`${cell}_cell`} value={cell} />;
                  })}
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </td>
  );
}
