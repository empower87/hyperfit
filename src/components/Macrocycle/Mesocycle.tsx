import { ReactNode } from "react";
import { SessionType } from "~/pages";
import Microcycle from "./Microcycle";

type MesocycleTableProps = {
  split: SessionType[];
};

function TableHeadColumns() {
  const ColumnHead = ({ text, width }: { text: string; width?: number }) => {
    return (
      <th
        className="bg-slate-500 text-white"
        style={{ fontSize: "12px", width: `${width}%` }}
      >
        {text}
      </th>
    );
  };

  return (
    <thead className="w-full">
      <tr>
        <ColumnHead text="Session" width={45} />
        <ColumnHead text="Week 1" width={15} />
        <ColumnHead text="Week 2" width={10} />
        <ColumnHead text="Week 3" width={10} />
        <ColumnHead text="Week 4" width={10} />
        <ColumnHead text="Deload" width={10} />
      </tr>
    </thead>
  );
}

function MesocycleCell({ children }: { children: ReactNode }) {
  return <td className="">{children}</td>;
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
      <MesocycleCell>
        <Microcycle
          head={split.split}
          body={split.sets}
          bgColor={backgroundColor}
        />
      </MesocycleCell>
      <MesocycleCell>
        <Microcycle
          head={"week 1"}
          body={split.sets}
          bgColor={backgroundColor}
        />
      </MesocycleCell>

      <MesocycleCell>
        <Microcycle
          head={"week 2"}
          body={split.sets}
          bgColor={backgroundColor}
        />
      </MesocycleCell>
      <MesocycleCell>
        <Microcycle
          head={"week 3"}
          body={split.sets}
          bgColor={backgroundColor}
        />
      </MesocycleCell>
      <MesocycleCell>
        <Microcycle
          head={"week 4"}
          body={split.sets}
          bgColor={backgroundColor}
        />
      </MesocycleCell>
      <MesocycleCell>
        <Microcycle
          head={"deload"}
          body={split.sets}
          bgColor={backgroundColor}
        />
      </MesocycleCell>
    </tr>
  );
}

export function MesocycleTable({ split }: MesocycleTableProps) {
  return (
    <div className="flex flex-col">
      <table
        className="m-1 table-fixed border-collapse"
        style={{ width: "700px" }}
      >
        <TableHeadColumns />
        <tbody className="">
          {split.map((each, index) => {
            if (each.sets.length) {
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
