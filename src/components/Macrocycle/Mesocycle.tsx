import { ReactNode } from "react";
import { SessionType } from "~/pages";
import Microcycle from "./Microcycle";

type MesocycleTableProps = {
  split: SessionType[];
};
type MicrocycleTableProps = {
  values: [string, number][];
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
  const filterSessionCells = split.sets.map((each) => {
    if (each[1] > 0) {
      return each[0];
    } else return "";
  });

  const filterSessionNumberCellsWeek1 = split.sets.map((each) => {
    return [each[1], 12, 100, 3];
  });

  const filterSessionNumberCellsWeek2Plus = split.sets.map((each) => {
    return [each[1], 100, 3];
  });

  return (
    <tr className="">
      <Microcycle head={[split.split]} body={filterSessionCells} />
      <Microcycle
        head={CELL_HEADS_WEEK_1}
        body={filterSessionNumberCellsWeek1}
      />
      <Microcycle
        head={CELL_HEADS_WEEK_2PLUS}
        body={filterSessionNumberCellsWeek2Plus}
      />
      <Microcycle
        head={CELL_HEADS_WEEK_2PLUS}
        body={filterSessionNumberCellsWeek2Plus}
      />
      <Microcycle
        head={CELL_HEADS_WEEK_2PLUS}
        body={filterSessionNumberCellsWeek2Plus}
      />
      <Microcycle
        head={CELL_HEADS_WEEK_2PLUS}
        body={filterSessionNumberCellsWeek2Plus}
      />
    </tr>
  );
}

export function MesocycleTable({ split }: MesocycleTableProps) {
  return (
    <div className="flex flex-col">
      <table className="m-1 border-collapse">
        <TableHeadColumns />
        <tbody className="">
          {split.map((each) => {
            return <TableBody split={each} />;
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
