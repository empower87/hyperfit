import { ReactNode } from "react";
import { BG_COLOR_M6, BORDER_COLOR_M6 } from "~/constants/themes";

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

BottomBar.Section = Section;
export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex space-x-2 border-t px-2 py-2 text-xxs text-white ${BORDER_COLOR_M6}`}
    >
      {children}
    </div>
  );
}
