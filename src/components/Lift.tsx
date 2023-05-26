import { ReactNode } from "react";
import { BACK_EXERCISES } from "~/constants/exercises";

type LiftProps = {
  index: number;
  sets: number;
  category: string;
  // exercise: string;
};

// not as elegant or reuseable lol but whatever
const splitSets = (sets: number) => {
  if (sets === 0 || sets > 12) return [0];
  switch (sets) {
    case 12:
      return [4, 4, 4];
    case 11:
      return [4, 4, 3];
    case 10:
      return [4, 3, 3];
    case 9:
      return [5, 4];
    case 8:
      return [4, 4];
    case 7:
      return [4, 3];
    case 6:
      return [3, 3];
    default:
      return [sets];
  }
};

export default function Lift({ index, sets, category }: LiftProps) {
  const setList = splitSets(sets);

  const exercise = BACK_EXERCISES[index]
    ? BACK_EXERCISES[index].name
    : BACK_EXERCISES[0].name;
  return (
    <>
      {setList.map((each, index) => {
        return (
          <tr
            key={`#${each}_${index}`}
            className="whitespace-break-spaces text-xs"
          >
            <td style={{ width: "30px" }} className="overflow-hidden break-all">
              {each}
            </td>
            <td
              style={{ width: "150px" }}
              className="overflow-hidden break-all"
            >
              {exercise}
            </td>
            <td style={{ width: "75px" }} className="overflow-hidden break-all">
              {category}
            </td>
          </tr>
        );
      })}
    </>
  );
}

export function LiftTable({ children }: { children: ReactNode }) {
  return (
    <div className="">
      <table className="bg-slate-100 shadow">
        <thead className="rounded-md border-2 border-r-2 border-slate-700 bg-slate-400">
          <tr className="text-xs text-white ">
            <th style={{ width: "30px" }} className="p-1 text-start">
              Sets
            </th>
            <th style={{ width: "150px" }} className="p-1 text-start">
              Exercise
            </th>
            <th style={{ width: "75px" }} className="p-1 text-start">
              Category
            </th>
          </tr>
        </thead>
        <tbody className="">{children}</tbody>
      </table>
    </div>
  );
}
