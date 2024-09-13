import { HTMLAttributes, ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "~/assets/icons/_icons";
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
export default function CollapsibleHeader({
  children,
  className,
  ...props
}: CollapsableHeaderProps) {
  return (
    <div
      {...props}
      className={cn(
        `flex rounded-t bg-primary-700 justify-between `,
        className
      )}
    >
      {children}
    </div>
  );
}
CollapsibleHeader.Title = Title;
CollapsibleHeader.Button = CollapseButton;
