import { ReactNode } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";

Navbar.Topbar = Topbar;
Navbar.Sidebar = Sidebar;

type NavbarProps = {
  children: ReactNode;
};
export default function Navbar({ children }: NavbarProps) {
  return <div>{children}</div>;
}
