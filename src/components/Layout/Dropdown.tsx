import { HTMLAttributes } from "react";
import { BG_COLOR_M6, BG_COLOR_M7, BORDER_COLOR_M5 } from "~/constants/themes";
import { useOutsideClick } from "~/hooks/useOnOutsideClick";
import { cn } from "~/lib/clsx";

interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  onClick: () => void;
}

function Item({ onClick, className, children, ...props }: ItemProps) {
  return (
    <div
      {...props}
      onClick={onClick}
      className={cn(
        `flex w-32 cursor-pointer p-1 indent-1 text-white hover:${BG_COLOR_M6}`,
        className
      )}
    >
      <p className={`text-xxs`}>{children}</p>
    </div>
  );
}

Dropdown.Item = Item;

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
}
export default function Dropdown({
  onClose,
  children,
  className,
  ...props
}: DropdownProps) {
  const ref = useOutsideClick(onClose);
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        `absolute -bottom-2 right-0 flex flex-col rounded border ${BORDER_COLOR_M5} ${BG_COLOR_M7}`,
        className
      )}
    >
      {children}
    </div>
  );
}
