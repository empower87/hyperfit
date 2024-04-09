import { ReactNode } from "react";
import { BG_COLOR_M5, BG_COLOR_M6, BORDER_COLOR_M6 } from "~/constants/themes";
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
        `rounded-sm px-2 py-0.5 text-xxs ${text} ${bgColor} ${BORDER_COLOR_M6} hover:opacity-80`
      )}
    >
      {label}
    </button>
  );
}
function Container({ children }: { children: ReactNode }) {
  return <div className={`flex space-x-2`}>{children}</div>;
}

type SectionProps = {
  title: string;
  children: ReactNode;
};
function Section({ title, children }: SectionProps) {
  return (
    <div className={`flex rounded border ${BORDER_COLOR_M6}`}>
      <div
        className={`flex items-center justify-center px-2 py-0.5 text-xxs text-white ${BG_COLOR_M6}`}
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
export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex justify-between border-t px-2 py-2 text-xxs text-white ${BORDER_COLOR_M6}`}
    >
      {children}
    </div>
  );
}
