import { ReactNode } from "react";
import {
  BG_COLOR_M5,
  BG_COLOR_M7,
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
        `rounded-sm px-1 py-0.5 text-xxs ${text} ${bgColor} ${BORDER_COLOR_M6} hover:opacity-80`
      )}
    >
      <p className={`text-nowrap`}>{label}</p>
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
  return (
    <div
      className={cn(`flex w-full items-start`, {
        ["flex-col space-y-1"]: alignment === "y",
      })}
    >
      {children}
    </div>
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

BottomBar.Container = Container;
BottomBar.Button = Button;
BottomBar.Section = Section;
BottomBar.ToggleMesocycle = ToggleMesocycle;
BottomBar.Cell = Cell;
export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex flex-col space-y-1 border-t p-2 text-xxs text-white ${BORDER_COLOR_M6}`}
    >
      {children}
    </div>
  );
}
// export default function BottomBar({ children }: { children: ReactNode }) {
//   return (
//     <div
//       className={`flex justify-between border-t px-2 py-2 text-xxs text-white ${BORDER_COLOR_M6}`}
//     >
//       {children}
//     </div>
//   );
// }

function Counter() {
  return <button></button>;
}

type ToggleMesocycleProps = {
  mesocycles: ReactNode;
  frequency: ReactNode;
  volume: ReactNode;
};
export function ToggleMesocycle({
  mesocycles,
  frequency,
  volume,
}: ToggleMesocycleProps) {
  return (
    <div
      className={cn(`flex w-full flex-col rounded border ${BORDER_COLOR_M7}`)}
    >
      <div
        className={`flex items-center justify-between text-xxs text-white ${BG_COLOR_M7}`}
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
  value: number;
  selectedValue: boolean;
};
function Cell({ value, selectedValue }: CellProps) {
  return (
    <div
      className={cn(
        `flex w-10 items-center justify-center p-0.5 text-xxs text-white`,
        {
          ["border"]: selectedValue,
        }
      )}
    >
      {value}
    </div>
  );
}
