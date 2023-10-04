import { ReactNode } from "react";
import {
  ExerciseType,
  SessionDayType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import Microcycle from "./Microcycle";

type MesocycleTableProps = {
  split: SessionDayType[];
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

function TableBody({
  split,
  sets,
}: {
  split: SplitType;
  sets: ExerciseType[][];
}) {
  const backgroundColor =
    split === "upper"
      ? "bg-blue-400"
      : split === "lower"
      ? "bg-red-400"
      : "bg-purple-400";

  return (
    <tr className="">
      <MesocycleCell>
        <Microcycle head={split} body={sets} bgColor={backgroundColor} />
      </MesocycleCell>

      <MesocycleCell>
        <Microcycle head={"week 1"} body={sets} bgColor={backgroundColor} />
      </MesocycleCell>

      <MesocycleCell>
        <Microcycle head={"week 2"} body={sets} bgColor={backgroundColor} />
      </MesocycleCell>

      <MesocycleCell>
        <Microcycle head={"week 3"} body={sets} bgColor={backgroundColor} />
      </MesocycleCell>

      <MesocycleCell>
        <Microcycle head={"week 4"} body={sets} bgColor={backgroundColor} />
      </MesocycleCell>

      <MesocycleCell>
        <Microcycle head={"deload"} body={sets} bgColor={backgroundColor} />
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
            let sessionOne = each.sessions[0];
            let sessionTwo = each.sessions[1];
            if (sessionOne !== "off" && sessionTwo !== "off") {
              return (
                <>
                  <TableBody split={each.sessions[0]} sets={each.sets[0]} />
                  <TableBody split={each.sessions[1]} sets={each.sets[1]} />
                </>
              );
            } else if (sessionOne !== "off" || sessionTwo !== "off") {
              let num = sessionOne !== "off" ? 0 : 1;
              return (
                <TableBody
                  key={`${each.day}_${index}_tablebodymesocycle`}
                  split={each.sessions[num]}
                  sets={each.sets[num]}
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
