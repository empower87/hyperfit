import { HTMLAttributes, ReactNode } from "react";
import { BG_COLOR_M7 } from "~/constants/themes";
import { SessionSplitType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { CELL_WIDTHS } from "./constants";

interface CellProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
}
function Cell({ value, className, ...props }: CellProps) {
  return (
    <div {...props} className={cn(`flex justify-center`, className)}>
      <p className="truncate text-[10px] text-white">{value}</p>
    </div>
  );
}

type RowCellProps = {
  data: string[] | number[];
  widths: string[];
  bgColor: string;
};
export function ExerciseCell({ data, widths, bgColor }: RowCellProps) {
  return (
    <div className={cn(`flex space-x-0.5`)}>
      {data.map((each, index) => {
        const nonCenteredCells = index !== 0 ? "justify-start indent-1" : "";
        return (
          <Cell
            value={each}
            className={`${bgColor} ${widths[index]} ${nonCenteredCells}`}
          />
        );
      })}
    </div>
  );
}

export function WeekCell({ data, widths, bgColor }: RowCellProps) {
  return (
    <div className={cn(`flex space-x-0.5`)}>
      {data.map((each, index) => {
        return <Cell value={each} className={`${bgColor} ${widths[index]}`} />;
      })}
    </div>
  );
}

type HeaderCellProps = {
  label: string;
  children?: ReactNode;
};
export function HeaderCell({ label, children }: HeaderCellProps) {
  return (
    <div className={`flex flex-col space-y-0.5 overflow-hidden rounded`}>
      <div className={`flex justify-center text-[12px] ${BG_COLOR_M7}`}>
        {label}
      </div>
      <div className={`flex space-x-0.5`}>{children}</div>
    </div>
  );
}

type SessionCellProps = {
  split: SessionSplitType;
  children?: ReactNode;
};
export function SessionCell({ split, children }: SessionCellProps) {
  const backgroundColor =
    split === "upper"
      ? "bg-blue-400"
      : split === "lower"
      ? "bg-red-400"
      : "bg-purple-400";
  return (
    <div className={cn(`flex ${CELL_WIDTHS.day} justify-between`)}>
      {children}

      <div className={`flex items-start`}>
        <div
          className={cn(
            `${backgroundColor} rounded-sm px-1 text-[10px] font-semibold text-white`
          )}
        >
          {split.charAt(0).toUpperCase() + split.slice(1)}
        </div>
      </div>
    </div>
  );
}
