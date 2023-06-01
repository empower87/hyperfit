import { ReactNode } from "react";

export default function PrioritySectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mt-2 flex justify-center">
      <div className="flex w-3/4 flex-col rounded border-2 border-slate-500">
        <div className="w-full rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">Priority</h2>
        </div>
        <div className="flex">
          <div className="flex w-1/2 flex-col p-2">
            <div className="mt-1 rounded border-2 border-slate-700 bg-red-400 p-1 pb-2 text-xs text-white">
              Primary
            </div>

            <div className="rounded border-2 border-slate-700 bg-orange-400">
              <div className="mt-1 rounded border-2 border-orange-400 p-1 text-xs text-white">
                Secondary
              </div>
              <div className=" rounded border-2 border-orange-400 p-1 text-xs text-white">
                -
              </div>
            </div>

            <div className=" rounded border-2 border-slate-700 bg-yellow-400">
              <div className="rounded border-2 border-yellow-400 p-1 text-xs text-white">
                Medium Effectiveness
              </div>
              <div className="mt-1 rounded border-2 border-yellow-400 p-1 text-xs text-white">
                -
              </div>
              <div className="mt-1 rounded border-2 border-yellow-400 p-1 text-xs text-white">
                -
              </div>
              <div className="mt-1 rounded border-2 border-yellow-400 p-1 text-xs text-white">
                -
              </div>
            </div>

            <div className="rounded border-2 border-slate-700 bg-blue-400">
              <div className="rounded border-2 border-blue-400 p-1 text-xs text-white">
                Minimum Effectiveness
              </div>
              <div className="mt-1 rounded border-2 border-blue-400 p-1 text-xs text-white">
                -
              </div>
              <div className="mt-1 rounded border-2 border-blue-400 p-1 text-xs text-white">
                -
              </div>
            </div>

            <div className="rounded border-2 border-slate-700 bg-green-400">
              <div className="rounded border-2 border-green-400 p-1 text-xs text-white">
                Maintenance
              </div>
              <div className="mt-1 rounded border-2 border-green-400 p-1 text-xs text-white">
                -
              </div>
              <div className="mt-1 rounded border-2 border-green-400 p-1 text-xs text-white">
                -
              </div>
              <div className="rounded border-2 border-green-400 p-1 text-xs text-white">
                -
              </div>
            </div>
          </div>
          <div className="flex w-1/2 flex-col border-l-2 border-slate-400 p-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
