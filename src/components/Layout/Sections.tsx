import { ReactNode } from "react";
import {
  BG_COLOR_M6,
  BORDER_COLOR_M5,
  BORDER_COLOR_M6,
} from "~/constants/themes";
import { cn } from "~/lib/clsx";

type SectionProps = {
  title: string;
  children: ReactNode;
};
export function SectionXL({ title, children }: SectionProps) {
  return (
    <div className="mb-6 p-2">
      <div className={BORDER_COLOR_M6 + " mb-4 border-b-2"}>
        <h1 className="p-1 indent-1 text-lg text-white">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function SectionM({ title, children }: SectionProps) {
  return (
    <div className={"m-1 flex flex-col"}>
      <div className={cn(`mb-2 ${BG_COLOR_M6}`)}>
        <h3 className=" text-m indent-1 text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function CardS({ title, children }: SectionProps) {
  return (
    <div className={cn(`flex flex-col ${BG_COLOR_M6} rounded-md p-1.5`)}>
      <div className={cn(`flex items-center ${BORDER_COLOR_M5} border-b`)}>
        <h3 className={`indent-1 text-lg text-white`}>{title}</h3>
      </div>
      <div className={`pt-2`}>{children}</div>
    </div>
  );
}
