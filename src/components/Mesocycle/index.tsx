import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BG_COLOR_M5 } from "~/utils/themes";
import { SessionRow } from "./Rows";
import { ROW_SECTION_WIDTHS } from "./constants";

// TODO: Still need to move this into Cell.tsx and add customization
function SessionHeaderLayout() {
  return (
    <div className="ml-1 mr-1 mt-1 flex w-full border-2 border-slate-700">
      <div
        className="border-r-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[0] }}
      >
        Day
      </div>
      <div
        className="border-r-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[1] }}
      >
        Session
      </div>
      <div
        className="border-r-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[2] }}
      >
        Week 1
      </div>
      <div
        className="border-r-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[3] }}
      >
        Week 2
      </div>
      <div
        className="border-r-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[4] }}
      >
        Week 3
      </div>
      <div
        className="border-r-2 border-slate-700 bg-slate-500 text-white"
        style={{ width: ROW_SECTION_WIDTHS[5] }}
      >
        Week 4
      </div>
      <div
        className=" background border-slate-700 bg-slate-500 text-white"
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
    <div
      className={BG_COLOR_M5 + " mb-3 flex w-full flex-col"}
      style={{ width: "920px" }}
    >
      <div className="bg-slate-500 text-white">
        Mesocycle {currentMesocycleIndex + 1}
      </div>

      <div className="flex flex-col">
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
