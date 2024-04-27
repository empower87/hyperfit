import { HTMLAttributes, ReactNode } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "~/assets/icons/_icons";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M5,
  BORDER_COLOR_M6,
  BORDER_COLOR_M7,
} from "~/constants/themes";
import { cn } from "~/lib/clsx";

type ButtonProps = {
  label: string;
  onClick: () => void;
};
function Button({ label, onClick }: ButtonProps) {
  const bgColor = label === "Reset" ? BG_COLOR_M5 : "bg-rose-400";
  const text = label === "Reset" ? "text-slate-700" : "text-white font-bold";
  return (
    <button
      onClick={onClick}
      className={cn(
        `rounded-sm px-2 py-1 text-xxs ${text} ${bgColor} ${BORDER_COLOR_M6} flex items-center justify-center hover:opacity-80`
      )}
    >
      {label}
    </button>
  );
}

function Container({
  children,
  alignment,
}: {
  children: ReactNode;
  alignment: "x" | "y";
}) {
  const classes =
    alignment === "x" ? "space-x-1 p-1 justify-end" : "flex-col space-y-1";
  return (
    <div className={cn(`flex w-full items-start ${classes}`)}>{children}</div>
  );
}

type SectionProps = {
  title: string;
  children: ReactNode;
  alignment: "y" | "x";
};
function Section({ title, children, alignment }: SectionProps) {
  return (
    <div
      className={cn(`flex w-full rounded border ${BORDER_COLOR_M7}`, {
        ["flex-col"]: alignment === "y",
      })}
    >
      <div
        className={`flex items-center justify-center px-2 py-0.5 text-xxs text-white ${BG_COLOR_M7}`}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Contents({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex flex-col space-y-1 border-t px-1 pb-1 text-xxs text-white ${BORDER_COLOR_M6}`}
    >
      {children}
    </div>
  );
}

type ToggleMesocycleProps = {
  mesocycles: ReactNode;
  frequency: ReactNode;
  volume: ReactNode;
};
function ToggleMesocycle({
  mesocycles,
  frequency,
  volume,
}: ToggleMesocycleProps) {
  return (
    <div
      className={cn(`flex w-full flex-col rounded border ${BORDER_COLOR_M7}`)}
    >
      <div
        className={`flex items-center justify-between border-b text-xxs text-white ${BG_COLOR_M7}`}
      >
        <div className={`px-1 py-0.5`}>Mesocycle</div>
        {mesocycles}
      </div>

      <div className={`flex items-center justify-between text-xxs text-white`}>
        <div className={`px-1 py-0.5`}>Frequency</div>
        {frequency}
      </div>
      <div className={`flex items-center justify-between text-xxs text-white`}>
        <div className={`px-1 py-0.5`}>Volume</div>
        {volume}
      </div>
    </div>
  );
}

type CellProps = {
  children: ReactNode;
  selectedValue: boolean;
};
function Cell({ children, selectedValue }: CellProps) {
  return (
    <div
      className={cn(
        `flex w-10 items-center justify-center p-0.5 text-xxs text-slate-300`,
        {
          ["font-bold text-white"]: selectedValue,
        }
      )}
    >
      {children}
    </div>
  );
}

interface MesocycleCellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  selectedValue: boolean;
}
function MesocycleCell({
  children,
  selectedValue,
  className,
  ...props
}: MesocycleCellProps) {
  return (
    <div
      {...props}
      className={cn(
        `flex w-10 cursor-pointer items-center justify-center p-0.5 text-xxs text-white last:rounded-tr`,
        {
          [`bg-white font-bold text-slate-700`]: selectedValue,
          [`hover:${BG_COLOR_M6}`]: !selectedValue,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

type SideMenuProps = {
  children: ReactNode;
  isCollapsed: boolean;
  onCollapse: () => void;
};

SideMenu.Container = Container;
SideMenu.Button = Button;
SideMenu.Section = Section;
SideMenu.ToggleMesocycle = ToggleMesocycle;
SideMenu.Cell = Cell;
SideMenu.MesocycleCell = MesocycleCell;
SideMenu.Contents = Contents;
export default function SideMenu({
  children,
  isCollapsed,
  onCollapse,
}: SideMenuProps) {
  if (isCollapsed) {
    return (
      <div className={cn(`w-8 ${BG_COLOR_M6} flex flex-col rounded-bl`)}>
        <div className={`flex p-1`}>
          <button
            onClick={onCollapse}
            className={`border ${BORDER_COLOR_M5} flex h-4 w-4 items-center justify-center rounded p-0.5`}
          >
            <ArrowRightIcon fill="white" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={cn(`w-56 ${BG_COLOR_M6} flex flex-col rounded-bl`)}>
      <div className={`flex p-1`}>
        <button
          onClick={onCollapse}
          className={`border ${BORDER_COLOR_M5} flex h-4 w-4 items-center justify-center rounded p-0.5`}
        >
          <ArrowLeftIcon fill="white" />
        </button>
      </div>

      {children}
    </div>
  );
}
