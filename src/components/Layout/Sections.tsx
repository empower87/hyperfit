import { ReactNode } from "react";
import { BG_COLOR_M6, BORDER_COLOR_M6 } from "~/constants/themes";
import { cn } from "~/lib/clsx";

type SectionProps = {
  title: string;
  children: ReactNode;
};
export function SectionXL({ title, children }: SectionProps) {
  return (
    <div className="mb-6 p-2">
      <div className={BORDER_COLOR_M6 + " mb-4 border-b-2"}>
        <h1 className="p-1 indent-1 text-white">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function SectionM({ title, children }: SectionProps) {
  return (
    <div className={"flex w-1/2 flex-col py-2 pr-2"}>
      <div className={cn(`mb-2 ${BG_COLOR_M6}`)}>
        <h3 className=" indent-1 text-white">{title}</h3>
      </div>

      <div className="">{children}</div>
    </div>
  );
}
