import { ReactNode } from "react";

export default function PrioritySectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-3/4 w-full items-center justify-center">
      <div
        className="flex flex-col rounded border-2 border-slate-500"
        style={{ height: "96%", width: "92%" }}
      >
        <div className="h-6 w-full rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">Priority</h2>
        </div>
        <div className="flex h-full overflow-y-scroll">
          <div className="flex w-full flex-col p-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
