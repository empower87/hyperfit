import { HTMLAttributes } from "react";
import { CloseIcon } from "~/assets/icons/_icons";
import { useOutsideClick } from "~/hooks/useOnOutsideClick";
import { cn } from "~/lib/clsx";
import { Button } from "./Buttons";

interface ItemProps extends HTMLAttributes<HTMLDivElement> {

}

function Item({ className, children, ...props }: ItemProps) {
  return (
    <div
      {...props}
 
      className={cn(
        `flex w-32 cursor-pointer p-1 indent-1 text-white hover:bg-primary-600`,
        className
      )}
    >
      <p className={`text-xxs`}>{children}</p>
    </div>
  );
}

type HeaderProps = {
  title: string;
  onClose: () => void;
};
function Header({ title, onClose }: HeaderProps) {
  return (
    <div
      className={`mb-1 flex items-center justify-between border-b border-primary-500 p-1`}
    >
      <div className={`flex indent-1 text-xs text-primary-300`}>{title}</div>
      <Button onClick={onClose} className={`px-1 py-0.5 hover:bg-primary-600`}>
        <CloseIcon fill="white" />
      </Button>
    </div>
  );
}

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
}

Dropdown.Item = Item;
Dropdown.Header = Header;
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
        `absolute right-0 top-0 z-10 flex origin-bottom-right flex-col rounded border border-primary-500 bg-primary-700`,
        className
      )}
    >
      {children}
    </div>
  );
}
