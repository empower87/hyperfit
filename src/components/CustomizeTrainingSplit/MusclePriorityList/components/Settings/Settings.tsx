import { ReactNode } from "react";
import { BG_COLOR_M6, BORDER_COLOR_M6 } from "~/constants/themes";
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
type SectionProps = SettingsProps & { title: string };

function Section({ title, children }: SectionProps) {
  return (
    <div className={`flex flex-col rounded border ${BORDER_COLOR_M6}`}>
      <div
        className={`flex items-center justify-center px-2 py-0.5 text-xxs text-slate-300 ${BG_COLOR_M6}`}
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
  return <div className={cn(`flex space-x-1 pb-2`)}>{children}</div>;
}
