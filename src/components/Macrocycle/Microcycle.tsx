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
  bgColor: string;
};

function TH({ text, bgColor }: { text: string; bgColor: string }) {
  return (
    <th
      className={bgColor + " border-2 border-slate-700 text-white"}
      style={{ fontSize: "8px" }}
    >
      {text}
    </th>
  );
}

function TD({
  value,
  rank,
}: {
  value: string | number;
  rank: "MRV" | "MEV" | "MV";
}) {
  const bgColor =
    rank === "MRV"
      ? "bg-red-400"
      : rank === "MEV"
      ? "bg-orange-400"
      : "bg-green-400";
  return (
    <td className={bgColor + " text-white"} style={{ fontSize: "10px" }}>
      {value}
    </td>
  );
}

export default function Microcycle({ head, body, bgColor }: TableCellProps) {
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
    <td className="">
      <table className="w-full border-collapse border-spacing-2">
        <thead className="border-2 border-slate-700 ">
          <tr className="leading-3">
            {th_list.map((each, index) => {
              return (
                <TH key={`${each}_${index}`} text={each} bgColor={bgColor} />
              );
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
                    return (
                      <TD key={`${cell}_cell`} value={cell} rank={ea.rank} />
                    );
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
