import { HTMLAttributes, ReactNode } from "react";
import {
  BG_COLOR_M6,
  BG_COLOR_M7,
  BG_COLOR_M8,
  BORDER_COLOR_M6,
} from "~/constants/themes";
import { cn } from "~/lib/clsx";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  children: ReactNode;
}
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

export function SectionH2({ title, children }: SectionProps) {
  return (
    <div className={"mx-1 mb-8 flex flex-col"}>
      <div className={cn(`relative my-6 ${BORDER_COLOR_M6} border-b-2`)}>
        <h3
          className={`${BG_COLOR_M8} absolute bottom-[-8px] left-[50%] translate-x-[-50%] px-3 text-xs text-rose-400`}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
export function CardS({ title, children, className, ...props }: SectionProps) {
  return (
    <div
      {...props}
      className={cn(`flex flex-col ${BG_COLOR_M7} rounded-md p-1.5`, className)}
    >
      <div
        className={cn(`flex items-center ${BORDER_COLOR_M6} border-b pb-0.5`)}
      >
        <h3 className={`indent-1 text-xs font-bold text-white`}>{title}</h3>
      </div>
      <div className={`pt-2`}>{children}</div>
    </div>
  );
}
