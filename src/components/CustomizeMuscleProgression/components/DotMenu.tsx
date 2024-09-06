import { ReactNode } from "react";
import { DotsIcon } from "~/assets/icons/_icons";
type DotButtonProps = {
  onClick: () => void;
};
function Button({ onClick }: DotButtonProps) {
  return (
    <button className={``} onClick={onClick}>
      <DotsIcon fill="#1E293B" />
      {/* {dropdown} */}
    </button>
  );
}

type DotDropdownProps = {
  isOpen: boolean;
  children: ReactNode;
};
function Dropdown({ isOpen, children }: DotDropdownProps) {
  if (!isOpen) return null;
  return (
    <div className={`absolute -bottom-5 right-0 z-10 rounded-md shadow-md`}>
      {children}
    </div>
  );
}
type DotMenuProps = {
  children: ReactNode;
};

DotMenu.Button = Button;
DotMenu.Dropdown = Dropdown;
export default function DotMenu({ children }: DotMenuProps) {
  return <div className={`flex w-3 justify-center`}>{children}</div>;
}
