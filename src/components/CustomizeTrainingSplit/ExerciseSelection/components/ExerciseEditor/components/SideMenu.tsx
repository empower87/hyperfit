import { ReactNode } from "react";
import { BG_COLOR_M6 } from "~/constants/themes";
import { cn } from "~/lib/clsx";

type SideMenuProps = {
  children: ReactNode;
};
export default function SideMenu({ children }: SideMenuProps) {
  return (
    <div className={cn(`w-56 ${BG_COLOR_M6} flex flex-col`)}>{children}</div>
  );
}
