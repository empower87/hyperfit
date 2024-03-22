import { ReactNode } from "react";
import { BG_COLOR_M7 } from "~/constants/themes";

type SectionProps = {
  title: string;
  children: ReactNode;
};
function Section({ title, children }: SectionProps) {
  return (
    <div className={`flex flex-col`}>
      <div className={`px-1 py-0.5 text-xxs text-white ${BG_COLOR_M7}`}>
        {title}
      </div>
      {children}
    </div>
  );
}

BottomBar.Section = Section;
export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className={`flex space-x-2 p-1 text-xxs text-white`}>{children}</div>
  );
}
