import { useEffect, useState } from "react";
import { ExerciseType } from "~/hooks/useEverythingLol";
import { SplitType } from "~/pages";

type HeadType = "week 1" | "week 2" | "week 3" | "week 4" | "deload";

type TableCellProps = {
  head: SplitType | HeadType;
  body: ExerciseType[][];
  bgColor: string;
};

function useMesocycleProgression(
  head: HeadType | SplitType,
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

  const progressWeeks = (
    head: HeadType | SplitType,
    values: ExerciseType[]
  ) => {
    const PROGRESSION_HOLDER = {
      sets: null,
      weight: 0,
      rir: 0,
      deload: false,
    };
    switch (head) {
      case "week 1":
        return PROGRESSION_HOLDER;
      case "week 2":
        return { ...PROGRESSION_HOLDER, sets: [1], weight: 5, rir: 1 };
      case "week 3":
        // if values is greater than 1 than there are 2 exercises.
        // Max of 2 exercises per session currently, so this will work but isn't scalable.
        if (values.length > 1)
          return { ...PROGRESSION_HOLDER, sets: [1, 1], weight: 10, rir: 2 };
        else return { ...PROGRESSION_HOLDER, sets: [2], weight: 10, rir: 2 };
      case "week 4":
        if (values.length > 1)
          return { ...PROGRESSION_HOLDER, sets: [2, 1], weight: 15, rir: 3 };
        else return { ...PROGRESSION_HOLDER, sets: [3], weight: 15, rir: 3 };
      case "deload":
        if (values.length > 1)
          return { sets: [2, 2], weight: 0, rir: 5, deload: true };
        else return { sets: [2], weight: 0, rir: 5, deload: true };
      default:
        return PROGRESSION_HOLDER;
    }
  };

  const getCellHeads = (head: HeadType | SplitType) => {
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
        return ["#", head, "exercise", "category", "modalities"];
      // return [head];
    }
  };

  return { heads, exercises };
}

function TH({
  text,
  bgColor,
  width,
}: {
  text: string;
  bgColor: string;
  width: number;
}) {
  return (
    <th
      className={bgColor + " border-2 border-slate-600 text-white"}
      style={{ fontSize: "8px", width: `${width}%` }}
    >
      {text}
    </th>
  );
}

function TD({
  value,
  rank,
  bottomBorder,
  center,
}: {
  value: string | number;
  rank: "MRV" | "MEV" | "MV";
  bottomBorder: boolean;
  center?: "text-center";
}) {
  const bgColor =
    rank === "MRV"
      ? "bg-red-400"
      : rank === "MEV"
      ? "bg-orange-400"
      : "bg-green-400";
  const border = bottomBorder ? " border-b-2 border-slate-300" : "";
  const _center = center ? " text-center" : "";
  return (
    <td
      className={bgColor + border + _center + " truncate border-l-2 text-white"}
      style={{ fontSize: "10px", height: "20px" }}
    >
      {value}
    </td>
  );
}

const getIndices = (exercises: ExerciseType[][]) => {
  let addIndices = 0;

  let indices = [];
  for (let i = 0; i < exercises.length; i++) {
    if (exercises[i].length > 1) {
      indices.push([addIndices + 1, addIndices + 2]);
      addIndices = addIndices + 2;
    } else {
      indices.push([addIndices + 1]);
      addIndices = addIndices + 1;
    }
  }
  return indices;
};

const WEEK_1 = [20, 30, 30, 20];
const WEEK_2PLUS = [30, 40, 30];
const SESSION = [5, 15, 50, 15, 15];

export default function Microcycle({ head, body, bgColor }: TableCellProps) {
  const { heads, exercises } = useMesocycleProgression(head, body);

  const indices = getIndices(exercises);
  const widths =
    heads.length === 5 ? SESSION : heads.length === 4 ? WEEK_1 : WEEK_2PLUS;
  return (
    <table className="w-full table-fixed border-collapse border-spacing-2">
      <thead className="border-2 border-slate-700 ">
        <tr className="leading-3">
          {heads.map((each, index) => {
            return (
              <TH
                key={`${each}_${index}_th`}
                text={each}
                bgColor={bgColor}
                width={widths[index]}
              />
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
              index={indices[index]}
            />
          );
        })}
      </tbody>
    </table>
  );
}

const TR = ({
  exercises,
  head,
  index,
}: {
  exercises: ExerciseType[];
  head: HeadType | SplitType;
  index: number[];
}) => {
  return (
    <>
      {exercises.map((each, i) => {
        const hasBorder = i === exercises.length - 1 ? true : false;
        const sessions = ["upper", "lower", "full"];

        if (sessions.includes(head)) {
          return (
            <tr className="leading-none">
              <TD
                value={`${index[i]}`}
                rank={each.rank}
                bottomBorder={hasBorder}
              />
              <TD
                value={`${each.group}`}
                rank={each.rank}
                bottomBorder={hasBorder}
              />
              <TD
                value={`${each.exercise}`}
                rank={each.rank}
                bottomBorder={hasBorder}
              />
              <TD
                value={`dumbbell`}
                rank={each.rank}
                bottomBorder={hasBorder}
              />
              <TD
                value={`straight`}
                rank={each.rank}
                bottomBorder={hasBorder}
              />
            </tr>
          );
        } else if (head === "week 1") {
          return (
            <tr className="leading-none">
              <TD
                value={each.sets}
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              />
              <TD
                value={each.reps}
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              />
              <TD
                value={each.weight}
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              />
              <TD
                value={each.rir}
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              />
            </tr>
          );
        } else {
          return (
            <tr className="leading-none">
              <TD
                value={each.sets}
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              />
              <TD
                value={each.weight}
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              />
              <TD
                value={each.rir}
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              />
            </tr>
          );
        }
      })}
    </>
  );
};
