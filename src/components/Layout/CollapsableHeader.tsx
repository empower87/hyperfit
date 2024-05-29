import { HTMLAttributes, ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "~/assets/icons/_icons";
import { BG_COLOR_M7 } from "~/constants/themes";
import { cn } from "~/lib/clsx";
import { Button } from "./Buttons";

type TitleProps = {
  label: string;
};
function Title({ label }: TitleProps) {
  return <div className={`flex p-1 indent-1 text-sm text-white`}>{label}</div>;
}

type CollapseButtonProps = {
  isCollapsed: boolean;
  onCollapse: () => void;
};
function CollapseButton({ isCollapsed, onCollapse }: CollapseButtonProps) {
  return (
    <div className={`flex items-center justify-center pr-2`}>
      <Button onClick={onCollapse}>
        {isCollapsed ? (
          <ArrowUpIcon fill="white" />
        ) : (
          <ArrowDownIcon fill="white" />
        )}
      </Button>
    </div>
  );
}

interface CollapsableHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export default function CollapsableHeader({
  children,
  className,
  ...props
}: CollapsableHeaderProps) {
  return (
    <div
      {...props}
      className={cn(
        `flex rounded-t ${BG_COLOR_M7} justify-between `,
        className
      )}
    >
      {children}
    </div>
  );
}
CollapsableHeader.Title = Title;
CollapsableHeader.Button = CollapseButton;
