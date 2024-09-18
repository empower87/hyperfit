import { HTMLAttributes, ReactNode } from "react";
import {
  DayType,
  SessionSplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { getSplitColor } from "~/utils/getIndicatorColors";
import { CELL_WIDTHS } from "./constants";

interface CellProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  fontSize?: string;
}
function Cell({ value, className, fontSize, ...props }: CellProps) {
  return (
    <div {...props} className={cn(`flex justify-center`, className)}>
      <p className={cn(`truncate text-[10px] text-white`, fontSize)}>{value}</p>
    </div>
  );
}

type RowCellProps = {
  data: string[] | number[];
  widths: string[];
  bgColor: string;
  fontSize?: string;
};
export function ExerciseCell({
  data,
  widths,
  bgColor,
  fontSize,
}: RowCellProps) {
  return (
    <div className={cn(`flex space-x-0.5`)}>
      {data.map((each, index) => {
        const nonCenteredCells = index !== 0 ? "justify-start indent-1" : "";
        return (
          <Cell
            key={`${each}_ExerciseCell_${index}`}
            value={each}
            className={`${bgColor} ${widths[index]} ${nonCenteredCells}`}
            fontSize={fontSize}
          />
        );
      })}
    </div>
  );
}

export function WeekCell({ data, widths, bgColor, fontSize }: RowCellProps) {
  return (
    <div className={cn(`flex space-x-0.5`)}>
      {data?.map((each, index) => {
        return (
          <Cell
            key={`${each}_WeekCell_${index}`}
            value={each}
            className={`${bgColor} ${widths[index]}`}
            fontSize={fontSize}
          />
        );
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
      <div className={`flex justify-center text-[12px] bg-primary-700`}>
        {label}
      </div>
      <div className={`flex space-x-0.5`}>{children}</div>
    </div>
  );
}

type SessionCellProps = {
  split: SessionSplitType;
  sessionNum: number;
  children?: ReactNode;
};
export function SessionCell({ split, sessionNum, children }: SessionCellProps) {
  return (
    <div className={cn(`flex ${CELL_WIDTHS.day} pl-1`)}>
      {children}

      <div
        className={cn(
          `${
            getSplitColor(split).bg
          } flex w-full items-center justify-center rounded text-[10px] font-semibold text-white`
        )}
      >
        <span className="flex items-center justify-center px-0.5">
          {sessionNum}
        </span>
        <span className=" truncate overflow-ellipsis px-0.5">
          {split.charAt(0).toUpperCase() + split.slice(1)}
        </span>
      </div>
    </div>
  );
}
type DayCellProps = {
  day: DayType;
};

export function DayCell({ day }: DayCellProps) {
  return (
    <div
      className={cn(
        `p flex items-center justify-center py-1 pl-1 `,
        CELL_WIDTHS.day
      )}
    >
      <div className="flex w-full items-center justify-center rounded bg-primary-700 text-xs font-semibold text-primary-300">
        {day.slice(0, 3)}
      </div>
    </div>
  );
}
