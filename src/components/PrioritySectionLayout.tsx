import { ReactNode } from "react";

export default function PrioritySectionLayout({
  children,
  table,
}: {
  children: ReactNode;
  table: ReactNode;
}) {
  return (
    <div className="mt-2 flex justify-center">
      <div className="flex w-3/4 flex-col rounded border-2 border-slate-500">
        <div className="w-full rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">Priority</h2>
        </div>
        <div className="flex">
          <div className="flex w-1/2 flex-col p-2">
            {/* <div className="mt-1 rounded border-2 border-slate-700 bg-red-400 p-1 pb-2 text-xs text-white">
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
            </div> */}

            {children}
          </div>
          <div className="flex w-1/2 flex-col border-l-2 border-slate-400 p-2">
            {table}
          </div>
        </div>
      </div>
    </div>
  );
}

// MUSCLE     |  MV | MEV |  1  |  2   |  3   |  4   |   5
// ========================================================
// quads      |  6  |  8  |  9  |  18  |  22  |  26  |  30
// hamstrings |  3  |  4  |  6  |  12  |  16  |  18  |  20

// chest      |  4  |  6  |  9  |  20  |  25  |  30  |  35
// back       |  6  | 10  | 10  |  20  |  25  |  30  |  35

// triceps    |  4  |  6  |  8  |  16  |  20  |  25  |  35
// biceps     |  4  |  6  | 10  |  20  |  25  |  30  |  35
// side_delts |  6  |  8  | 12  |  25  |  30  |  35  |  30
// calves     |  6  |  8  |  8  |  16  |  20  |  25  |  35

// traps      |  0  |  4  | 10  |  20  |  25  |  30  |  35
// glutes     |  0  |  0  |  6  |  12  |  18  |  25  |  30
// rear_delts |  0  |  6  |  9  |  18  |  25  |  30  |  35
