import { ReactNode } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "~/assets/icons/_icons";
import { BG_COLOR_M6, BORDER_COLOR_M5 } from "~/constants/themes";
import { cn } from "~/lib/clsx";

type SideMenuProps = {
  children: ReactNode;
  isCollapsed: boolean;
  onCollapse: () => void;
};

export default function SideMenu({
  children,
  isCollapsed,
  onCollapse,
}: SideMenuProps) {
  if (isCollapsed) {
    return (
      <div className={cn(`w-8 ${BG_COLOR_M6} flex flex-col`)}>
        <div className={`flex p-1`}>
          <button
            onClick={onCollapse}
            className={`border ${BORDER_COLOR_M5} flex h-4 w-4 items-center justify-center rounded p-0.5`}
          >
            <ArrowRightIcon fill="white" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={cn(`w-56 ${BG_COLOR_M6} flex flex-col`)}>
      <div className={`flex p-1`}>
        <button
          onClick={onCollapse}
          className={`border ${BORDER_COLOR_M5} flex h-4 w-4 items-center justify-center rounded p-0.5`}
        >
          <ArrowLeftIcon fill="white" />
        </button>
      </div>

      {children}
    </div>
  );
}
