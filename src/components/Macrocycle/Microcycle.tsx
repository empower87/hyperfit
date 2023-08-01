import { useEffect, useState } from "react";
import { ExerciseType } from "~/hooks/useMacrocycle";

type HeadType =
  | "week 1"
  | "week 2"
  | "week 3"
  | "week 4"
  | "deload"
  | "upper"
  | "lower"
  | "full";

type TableCellProps = {
  head: HeadType;
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

function useMesocycleProgression(
  head: HeadType,
  exerciseList: ExerciseType[][]
) {
  const [exercises, setExercises] = useState<ExerciseType[][]>([]);
  const [heads, setHeads] = useState<string[]>([]);

  useEffect(() => {
    const th_list = getCellHeads(head);
    setHeads(th_list);
  }, [head]);

  useEffect(() => {
    const exercises = exerciseList.map((each, index) => {
      let setsToAdd = progressWeeks(head, each);
      if (!setsToAdd.sets) return each;
      else if (setsToAdd.deload === true) {
        let exercises: ExerciseType[] = [];
        for (let i = 0; i < each.length; i++) {
          exercises.push({
            ...each[i],
            sets: setsToAdd.sets[i],
            rir: setsToAdd.rir,
          });
        }
        return exercises;
      } else {
        let exercises: ExerciseType[] = [];
        for (let i = 0; i < each.length; i++) {
          if (setsToAdd.sets[i]) {
            exercises.push({
              ...each[i],
              weight: each[i].weight + setsToAdd.weight,
              sets: each[i].sets + setsToAdd.sets[i],
              rir: each[i].rir - setsToAdd.rir,
            });
          } else {
            exercises.push({
              ...each[i],
              weight: each[i].weight + setsToAdd.weight,
              rir: each[i].rir - setsToAdd.rir,
            });
          }
        }
        return exercises;
      }
    });
    setExercises(exercises);
  }, [exerciseList, head]);

  const progressWeeks = (head: HeadType, values: ExerciseType[]) => {
    const PROGRESS_HOLDER = {
      sets: null,
      weight: 0,
      rir: 0,
      deload: false,
    };
    switch (head) {
      case "week 1":
        return PROGRESS_HOLDER;
      case "week 2":
        return { ...PROGRESS_HOLDER, sets: [1], weight: 5, rir: 1 };
      case "week 3":
        // if values is greater than 1 than there are 2 exercises.
        // Max of 2 exercises per session currently, so this will work but isn't scalable.
        if (values.length > 1)
          return { ...PROGRESS_HOLDER, sets: [1, 1], weight: 10, rir: 2 };
        else return { ...PROGRESS_HOLDER, sets: [2], weight: 10, rir: 2 };
      case "week 4":
        if (values.length > 1)
          return { ...PROGRESS_HOLDER, sets: [2, 1], weight: 15, rir: 3 };
        else return { ...PROGRESS_HOLDER, sets: [3], weight: 15, rir: 3 };
      case "deload":
        if (values.length > 1)
          return { sets: [2, 2], weight: 0, rir: 5, deload: true };
        else return { sets: [2], weight: 0, rir: 5, deload: true };
      default:
        return PROGRESS_HOLDER;
    }
  };

  const getCellHeads = (head: HeadType) => {
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

  return { heads, exercises };
}

export default function Microcycle({ head, body, bgColor }: TableCellProps) {
  const { heads, exercises } = useMesocycleProgression(head, body);

  return (
    <td className="">
      <table className="w-full border-collapse border-spacing-2">
        <thead className="border-2 border-slate-700 ">
          <tr className="leading-3">
            {heads.map((each, index) => {
              return (
                <TH key={`${each}_${index}_th`} text={each} bgColor={bgColor} />
              );
            })}
          </tr>
        </thead>

        <tbody>
          {exercises.map((each, index) => {
            return (
              <TR
                key={`body_${index}_${each[index]?.exercise}`}
                exercises={each}
                head={head}
              />
            );
          })}
        </tbody>
      </table>
    </td>
  );
}

const TR = ({
  exercises,
  head,
}: {
  exercises: ExerciseType[];
  head: HeadType;
}) => {
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

  return (
    <>
      {exercises.map((each) => {
        const cellsa = getInnerCells(head, each);
        console.log(cellsa, exercises, "this should always be an array");

        return (
          <tr className="leading-none">
            {cellsa.map((ea, i) => {
              return <TD key={`${ea}_tds_${i}`} value={ea} rank={each.rank} />;
            })}
          </tr>
        );
      })}
    </>
  );
};
