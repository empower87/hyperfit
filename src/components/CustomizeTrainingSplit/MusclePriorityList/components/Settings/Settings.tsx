import { ReactNode } from "react";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M5,
  BORDER_COLOR_M6,
  BORDER_COLOR_M7,
} from "~/constants/themes";
import { cn } from "~/lib/clsx";
import { Breakpoints } from "./Breakpoints";

function ToggleButton({ title }: { title: string }) {
  return (
    <button
      className={`rounded ${BORDER_COLOR_M6} flex items-center justify-center border px-1 py-0.5`}
    >
      <div className={`text-[.5rem] text-white`}>{title}</div>
    </button>
  );
}

type SettingsProps = {
  children: ReactNode;
};
type SectionProps = SettingsProps & {
  title: string;
  variant?: "dark" | "light";
};

function Section({ title, variant, children }: SectionProps) {
  const variants =
    variant === "dark"
      ? { border: BORDER_COLOR_M7, bg: BG_COLOR_M7 }
      : variant === "light"
      ? { border: BORDER_COLOR_M5, bg: BG_COLOR_M5 }
      : { border: BORDER_COLOR_M6, bg: BG_COLOR_M6 };
  return (
    <div className={`flex flex-col rounded border ${variants.border}`}>
      <div
        className={`flex items-center justify-center px-2 py-0.5 text-xxs text-slate-300 ${variants.bg}`}
      >
        {title}
      </div>
      <div className={`flex space-x-1`}>{children}</div>
    </div>
  );
}

Settings.Breakpoints = Breakpoints;
Settings.Button = ToggleButton;
Settings.Section = Section;
export default function Settings({ children }: SettingsProps) {
  return <div className={cn(`flex space-x-1`)}>{children}</div>;
}
