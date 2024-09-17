import { ReactNode } from "react";
import SessionItem from "./SessionItem";

SessionList.Item = SessionItem
export default function SessionList({ children }: {children: ReactNode}) {
  return (
    <ul className={`space-y-1 p-1`}>{children}</ul>
  )
}