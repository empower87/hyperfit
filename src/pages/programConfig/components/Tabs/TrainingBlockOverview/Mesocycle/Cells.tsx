import { HTMLAttributes, ReactNode } from "react";
import {
  DayType,
  SessionSplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { VolumeLandmarkType } from "~/types/muscles/muscleTypes";
import { getRankColor, getSplitColor } from "~/utils/getIndicatorColors";
import { CELL_WIDTHS } from "./constants";

interface CellProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  fontSize?: string;
}
function Cell({ value, className, fontSize, ...props }: CellProps) {
  return (
    <div {...props} className={cn(`flex justify-center text-white`, className)}>
      <p className={cn(`truncate text-[10px] `, fontSize)}>{value}</p>
    </div>
  );
}

type RowCellProps = {
  data: string[] | number[];
  widths: string[];
  bgColor: string;
  volume_landmark: VolumeLandmarkType;
  fontSize?: string;
};
export function ExerciseCellGroup({
  data,
  widths,
  bgColor,
  volume_landmark,
  fontSize,
}: RowCellProps) {
  return (
    <div className={cn(`flex space-x-0.5`)}>
      {data.map((each, index) => {
        const nonCenteredCells = index !== 0 ? "justify-start indent-1" : "";
        const isRankCell = index < 2;
        const rankColor = getRankColor(volume_landmark).bg;
        const finalBGColor = isRankCell ? rankColor : bgColor;
        const textColor = isRankCell ? "text-white" : "text-primary-700";
        return (
          <Cell
            key={`${each}_ExerciseCell_${index}`}
            value={each}
            className={`${finalBGColor} ${widths[index]} ${nonCenteredCells} ${textColor}`}
            fontSize={fontSize}
          />
        );
      })}
    </div>
  );
}

export function WeekCellGroup({
  data,
  widths,
  bgColor,
  fontSize,
  volume_landmark,
}: RowCellProps) {
  const { text, bg } = getRankColor(volume_landmark);
  return (
    <div className={cn(`flex space-x-0.5`)}>
      {data?.map((each, index) => {
        const isSetsCell = index === 0;
        const textColor = isSetsCell ? "text-white" : "text-primary-700";
        return (
          <Cell
            key={`${each}_WeekCell_${index}`}
            value={each}
            className={cn(`${bgColor} ${widths[index]} ${textColor}`, {
              [bg]: isSetsCell,
            })}
            fontSize={fontSize}
          />
        );
      })}
    </div>
  );
}

type HeaderCellGroupProps = Omit<RowCellProps, "volume_landmark">;
export function HeaderCellGroup({
  data,
  widths,
  bgColor,
  fontSize,
}: HeaderCellGroupProps) {
  return (
    <div className={cn(`flex space-x-0.5 `)}>
      {data?.map((each, index) => {
        const isLeftBorderRounded = index === 0 ? "rounded-l" : "";
        const isRightBorderRounded =
          index === data.length - 1 ? "rounded-r" : "";
        return (
          <Cell
            key={`${each}_HeaderCellGroup_${index}`}
            value={each}
            className={`${bgColor} ${widths[index]} items-center ${isLeftBorderRounded} ${isRightBorderRounded}`}
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
    <div
      className={cn(
        `flex flex-col space-y-0.5 overflow-hidden rounded bg-primary-700`
      )}
    >
      <div className={`flex justify-center text-[12px]`}>{label}</div>
      <div className={`flex space-x-0.5`}>{children}</div>
    </div>
  );
}

type SessionCellProps = {
  split: SessionSplitType;
  sessionNum: number;
};
export function SessionCell({ split, sessionNum }: SessionCellProps) {
  return (
    <div className={cn(`flex ${CELL_WIDTHS.day} pl-1`)}>
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
        `flex items-center justify-center rounded bg-primary-700 text-xs font-semibold text-primary-300`
      )}
    >
      {day.slice(0, 3)}
    </div>
  );
}
