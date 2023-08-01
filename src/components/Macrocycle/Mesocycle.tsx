import { ReactNode } from "react";
import { SessionType } from "~/pages";
import Microcycle from "./Microcycle";

type MesocycleTableProps = {
  split: SessionType[];
};

function TableHeadColumns() {
  const ColumnHead = ({ text }: { text: string }) => {
    return (
      <th className="bg-slate-500 text-white" style={{ fontSize: "13px" }}>
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

function TableBody({ split }: { split: SessionType }) {
  const backgroundColor =
    split.split === "upper"
      ? "bg-blue-400"
      : split.split === "lower"
      ? "bg-red-400"
      : "bg-purple-400";
  return (
    <tr className="">
      <Microcycle
        head={split.split}
        body={split.testSets}
        bgColor={backgroundColor}
      />
      <Microcycle
        head={"week 1"}
        body={split.testSets}
        bgColor={backgroundColor}
      />
      <Microcycle
        head={"week 2"}
        body={split.testSets}
        bgColor={backgroundColor}
      />
      <Microcycle
        head={"week 3"}
        body={split.testSets}
        bgColor={backgroundColor}
      />
      <Microcycle
        head={"week 4"}
        body={split.testSets}
        bgColor={backgroundColor}
      />
      <Microcycle
        head={"deload"}
        body={split.testSets}
        bgColor={backgroundColor}
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
          {split.map((each, index) => {
            if (each.testSets.length) {
              return (
                <TableBody
                  key={`${each.split}_${index}_tablebodymesocycle`}
                  split={each}
                />
              );
            }
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
