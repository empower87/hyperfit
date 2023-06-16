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
          <div className="flex w-1/3 flex-col p-2">{children}</div>
          <div className="flex w-2/3 flex-col border-l-2 border-slate-400 p-2">
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
