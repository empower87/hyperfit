import { ReactNode } from "react";

export default function PrioritySectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-5/6 w-full items-center justify-center">
      <div
        className="flex flex-col rounded border-2 border-slate-500"
        style={{ height: "96%", width: "92%" }}
      >
        <div className="flex h-6 w-full items-center rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">Priority</h2>
        </div>
        <div className="flex h-full overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
}
