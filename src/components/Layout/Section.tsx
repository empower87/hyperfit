import { ReactNode } from "react";
import { BORDER_COLOR_M6 } from "~/utils/themes";

type SectionProps = {
  title: string;
  children: ReactNode;
};
export default function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6 pl-1">
      <div className={BORDER_COLOR_M6 + " mb-4 border-b-2"}>
        <h2 className="ml-1 p-1 text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}
