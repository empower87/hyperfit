import { ReactNode } from "react";

export default function Topbar() {
  return (
    <div
      className={
        "sticky left-0 top-0 z-10 flex h-12 w-full items-center justify-end bg-primary-700 pl-24 pr-6"
      }
    >
      <TopbarButton>
        <>Sign In</>
      </TopbarButton>
    </div>
  );
}

type TopbarButtonProps = {
  children: ReactNode;
};

function TopbarButton({ children }: TopbarButtonProps) {
  return (
    <button className="rounded border border-primary-600 px-2 py-1 text-sm text-secondary-400">
      {children}
    </button>
  );
}
