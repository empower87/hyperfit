import { ReactNode } from "react";
import { cn } from "~/lib/clsx";
import { Breakpoints, Toggles } from "./Breakpoints";

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
      ? { border: "border-primary-700", bg: "bg-primary-700" }
      : variant === "light"
      ? { border: "border-primary-500", bg: "bg-primary-500" }
      : { border: "border-primary-600", bg: "bg-primary-600" };
  return (
    <div className={`flex flex-col rounded border ${variants.border}`}>
      <div
        className={`flex items-center justify-center px-2 py-0.5 text-xs text-slate-300 ${variants.bg}`}
      >
        {title}
      </div>
      <div className={`flex space-x-1`}>{children}</div>
    </div>
  );
}

Settings.Breakpoints = Breakpoints;
Settings.Toggles = Toggles;
Settings.Section = Section;
export default function Settings({ children }: SettingsProps) {
  return <div className={cn(`flex space-x-1`)}>{children}</div>;
}
