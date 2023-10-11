import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  ExerciseType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getGroupList } from "~/utils/getExercises";

type HeadType = "week 1" | "week 2" | "week 3" | "week 4" | "deload";

type TableCellProps = {
  head: SplitType | HeadType;
  body: ExerciseType[][];
  bgColor: string;
  onEdit?: (id: string, value: string) => void;
};

type MesoProgressionRowType = {
  id: string;
  sessionNum: string;
  group: string;
  session: [number, string, string, string, string];
  deload: [number, string, number, number];
  week_one: [number, string, number, number];
  week_two: [number, number, number];
  week_three: [number, number, number];
  week_four?: [number, number, number];
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
  children,
  rank,
  bottomBorder,
  center,
}: {
  children: ReactNode;
  rank: "MRV" | "MEV" | "MV";
  bottomBorder: boolean;
  center?: "text-center";
}) {
  const border = bottomBorder ? " border-b-2 border-slate-300" : "";
  const _center = center ? " text-center" : "";
  return (
    <td
      className={border + _center + " truncate border-l-2 text-white"}
      style={{ fontSize: "10px", height: "20px" }}
    >
      {children}
    </td>
  );
}

type SelectExerciseProps = {
  id: string;
  group: string;
  currentValue: string;
  onChange: (id: string, value: string) => void;
  bgColor: string;
};

const GROUPS = [
  "chest",
  "back",
  "biceps",
  "triceps",
  "delts_side",
  "delts_rear",
  "delts_front",
  "traps",
  "forearms",
  "abs",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
];

function SelectExercise({
  id,
  group,
  currentValue,
  onChange,
  bgColor,
}: SelectExerciseProps) {
  const exercises = getGroupList(group);
  const groups = [...GROUPS];

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(id, event.target.value);
  };

  console.log(exercises, "ok is there an error here??");
  return (
    <select
      className={bgColor + " w-full"}
      onChange={handleSelectChange}
      defaultValue={currentValue}
    >
      {group === currentValue
        ? groups.map((option) => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })
        : exercises.map((option) => {
            return (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            );
          })}
    </select>
  );
}

const WEEK_1 = [20, 30, 30, 20];
const WEEK_2PLUS = [30, 40, 30];
const SESSION = [5, 15, 50, 15, 15];

export default function Microcycle({
  head,
  body,
  bgColor,
  onEdit,
}: TableCellProps) {
  const { heads, exercises } = useMesocycleProgression(head, body);

  const getIndices = useCallback((exercises: ExerciseType[][]) => {
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
  }, []);

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
              onEdit={onEdit}
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
  onEdit,
}: {
  exercises: ExerciseType[];
  head: HeadType | SplitType;
  index: number[];
  onEdit: ((id: string, value: string) => void) | undefined;
}) => {
  const onChangeHandler = (id: string, value: string) => {
    if (!onEdit) return;
    onEdit(id, value);
  };

  return (
    <>
      {exercises.map((each, i) => {
        const hasBorder = i === exercises.length - 1 ? true : false;
        const SESSIONS = ["upper", "lower", "full", "push", "pull"];

        const bgColor =
          each.rank === "MRV"
            ? "bg-red-400"
            : each.rank === "MEV"
            ? "bg-orange-400"
            : "bg-green-400";

        if (SESSIONS.includes(head)) {
          return (
            <tr key={`${each.id}_${i}`} className={bgColor + " leading-none"}>
              <TD rank={each.rank} bottomBorder={hasBorder}>
                {index[i]}
              </TD>
              <TD rank={each.rank} bottomBorder={hasBorder}>
                <SelectExercise
                  id={each.id}
                  group={each.group}
                  currentValue={each.group}
                  onChange={onChangeHandler}
                  bgColor={bgColor}
                />
              </TD>
              <TD rank={each.rank} bottomBorder={hasBorder}>
                <SelectExercise
                  id={each.id}
                  group={each.group}
                  currentValue={each.exercise}
                  onChange={onChangeHandler}
                  bgColor={bgColor}
                />
              </TD>
              <TD rank={each.rank} bottomBorder={hasBorder}>
                {`dumbbell`}
              </TD>
              <TD rank={each.rank} bottomBorder={hasBorder}>
                {`straight`}
              </TD>
            </tr>
          );
        } else if (head === "week 1") {
          return (
            <tr key={`${each.id}_${i}`} className={bgColor + " leading-none"}>
              <TD
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              >
                {each.sets}
              </TD>
              <TD
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              >
                {each.reps}
              </TD>
              <TD
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              >
                {each.weight}
              </TD>
              <TD
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              >
                {each.rir}
              </TD>
            </tr>
          );
        } else {
          return (
            <tr key={`${each.id}_${i}`} className={bgColor + " leading-none"}>
              <TD
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              >
                {each.sets}
              </TD>
              <TD
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              >
                {each.weight}
              </TD>
              <TD
                rank={each.rank}
                bottomBorder={hasBorder}
                center="text-center"
              >
                {each.rir}
              </TD>
            </tr>
          );
        }
      })}
    </>
  );
};
