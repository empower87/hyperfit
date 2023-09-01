import { ReactNode } from "react";

export default function PrioritySectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-2 flex w-full flex-col rounded border-2 border-slate-500">
      <div className="w-full rounded-t-sm bg-slate-700">
        <h2 className="ml-1 p-1 text-white">Priority</h2>
      </div>
      <div className="flex">
        <div className="flex w-full flex-col p-2">{children}</div>
      </div>
    </div>
  );
}
