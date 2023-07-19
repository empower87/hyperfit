import { ReactNode } from "react";
import { SessionType } from "~/pages";
import { subtractSetsForMeso } from "~/utils/createPeriodizationMesocycle";
import Microcycle from "./Microcycle";

type MesocycleTableProps = {
  split: SessionType[];
};

function TableHeadColumns() {
  const ColumnHead = ({ text }: { text: string }) => {
    return (
      <th className="bg-slate-500" style={{ fontSize: "13px" }}>
        {text}
      </th>
    );
  };

  return (
    <thead>
      <tr>
        <ColumnHead text="Session" />
        <ColumnHead text="Week 1" />
        <ColumnHead text="Week 2" />
        <ColumnHead text="Week 3" />
        <ColumnHead text="Week 4" />
        <ColumnHead text="Deload" />
      </tr>
    </thead>
  );
}

const CELL_HEADS_WEEK_1 = ["Sets", "Reps", "Weight", "RiR"];
const CELL_HEADS_WEEK_2PLUS = ["Sets", "Weight", "RiR"];

function TableBody({ split }: { split: SessionType }) {
  const values = subtractSetsForMeso(split.sets);
  const filterSessionCells = values[0].map((each) => {
    if (each[1] > 0) {
      return each[0];
    } else return "";
  });

  return (
    <tr className="">
      <Microcycle head={[split.split]} body={filterSessionCells} />
      <Microcycle head={CELL_HEADS_WEEK_1} body={values[0]} />
      <Microcycle head={CELL_HEADS_WEEK_2PLUS} body={values[1]} />
      <Microcycle head={CELL_HEADS_WEEK_2PLUS} body={values[2]} />
      <Microcycle head={CELL_HEADS_WEEK_2PLUS} body={values[3]} />
      <Microcycle head={CELL_HEADS_WEEK_2PLUS} body={values[4]} />
    </tr>
  );
}

const splitMuscleSetsForExercises = (split: SessionType[]) => {
  const newSplit = split.map((each) => {
    let newSets: [string, number][] = [];
    for (let i = 0; i < each.sets.length; i++) {
      let totalSets = each.sets[i][1];
      let muscle = each.sets[i][0];
      if (totalSets === 6) {
        newSets.push([muscle, 3]);
        newSets.push([muscle, 3]);
      } else if (totalSets === 7) {
        newSets.push([muscle, 4]);
        newSets.push([muscle, 3]);
      } else if (totalSets === 8) {
        newSets.push([muscle, 4]);
        newSets.push([muscle, 4]);
      } else if (totalSets === 9) {
        newSets.push([muscle, 5]);
        newSets.push([muscle, 4]);
      } else if (totalSets === 10) {
        newSets.push([muscle, 5]);
        newSets.push([muscle, 5]);
      } else {
        newSets.push([muscle, totalSets]);
      }
    }
    return { ...each, sets: newSets };
  });
  return newSplit;
};

export function MesocycleTable({ split }: MesocycleTableProps) {
  const newSplit = splitMuscleSetsForExercises(split);
  return (
    <div className="flex flex-col">
      <table className="m-1 border-collapse">
        <TableHeadColumns />
        <tbody className="">
          {newSplit.map((each) => {
            return <TableBody key={`${each.day}`} split={each} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

type LayoutProps = {
  title: string;
  children: ReactNode;
};

export function MesocycleLayout({ title, children }: LayoutProps) {
  return (
    <div className="flex w-full flex-col rounded border-2 border-slate-500">
      <div className="w-full rounded-t-sm bg-slate-700">
        <h2 className="ml-1 p-1 text-white">{title}</h2>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
