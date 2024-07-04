import { HTMLAttributes, ReactNode } from "react";
import { BG_COLOR_M7 } from "~/constants/themes";
import { SessionSplitType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
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
  return (
    <div className={cn(`flex ${CELL_WIDTHS.day} justify-between`)}>
      {children}

      <div className={`flex items-start`}>
        <div
          className={cn(
            `${
              getSplitColor(split).bg
            } rounded-sm px-1 text-[10px] font-semibold text-white`
          )}
        >
          {split.charAt(0).toUpperCase() + split.slice(1)}
        </div>
      </div>
    </div>
  );
}
