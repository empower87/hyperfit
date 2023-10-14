import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { SessionRow } from "./Rows";
import { ROW_SECTION_WIDTHS } from "./constants";

// TODO: Still need to move this into Cell.tsx and add customization
function SessionHeaderLayout() {
  return (
    <div className="flex w-full">
      <div className="" style={{ width: ROW_SECTION_WIDTHS[0] }}></div>
      <div
        className="mr-1 border-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[1] }}
      >
        Session
      </div>
      <div
        className="mr-1 border-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[2] }}
      >
        Week 1
      </div>
      <div
        className="mr-1 border-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[3] }}
      >
        Week 2
      </div>
      <div
        className="mr-1 border-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[4] }}
      >
        Week 3
      </div>
      <div
        className="mr-1 border-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[5] }}
      >
        Week 4
      </div>
      <div
        className="border-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[6] }}
      >
        Deload
      </div>
    </div>
  );
}

type MesocycleProps = {
  split: SessionDayType[];
  currentMesocycleIndex: number;
};

export default function Mesocycle({
  split,
  currentMesocycleIndex,
}: MesocycleProps) {
  return (
    <div className="flex w-full flex-col" style={{ width: "920px" }}>
      <div className="bg-slate-500 text-white">
        Mesocycle {currentMesocycleIndex + 1}
      </div>

      <div className="mt-1 flex flex-col">
        <SessionHeaderLayout />
        <div className="flex flex-col">
          {split.map((each) => {
            return (
              <SessionRow
                split={each}
                currentMesocycleIndex={currentMesocycleIndex}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
