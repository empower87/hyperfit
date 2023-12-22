// import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { BG_COLOR_M6, BG_COLOR_M7, BORDER_COLOR_M6 } from "~/utils/themes";
import { SessionRow } from "./Rows";
import { ROW_SECTION_WIDTHS } from "./constants";

// TODO: Still need to move this into Cell.tsx and add customization
function SessionHeaderLayout() {
  return (
    <div className={BG_COLOR_M7 + " ml-1 mr-1 mt-1 flex"}>
      <div
        className={BORDER_COLOR_M6 + " border-r-2 indent-1 text-white"}
        style={{ width: ROW_SECTION_WIDTHS[0] }}
      >
        Day
      </div>
      <div
        className={BORDER_COLOR_M6 + " border-r-2 indent-1 text-white"}
        style={{ width: ROW_SECTION_WIDTHS[1] }}
      >
        Session
      </div>
      <div
        className={BORDER_COLOR_M6 + " border-r-2 indent-1 text-white"}
        style={{ width: ROW_SECTION_WIDTHS[2] }}
      >
        Week 1
      </div>
      <div
        className={BORDER_COLOR_M6 + " border-r-2 indent-1 text-white"}
        style={{ width: ROW_SECTION_WIDTHS[3] }}
      >
        Week 2
      </div>
      <div
        className={BORDER_COLOR_M6 + " border-r-2 indent-1 text-white"}
        style={{ width: ROW_SECTION_WIDTHS[4] }}
      >
        Week 3
      </div>
      <div
        className={BORDER_COLOR_M6 + " border-r-2 indent-1 text-white"}
        style={{ width: ROW_SECTION_WIDTHS[5] }}
      >
        Week 4
      </div>
      <div
        className=" indent-1 text-white"
        style={{ width: ROW_SECTION_WIDTHS[6] }}
      >
        Deload
      </div>
    </div>
  );
}

type MesocycleProps = {
  split: TrainingDayType[];
  currentMesocycleIndex: number;
};

export default function Mesocycle({
  split,
  currentMesocycleIndex,
}: MesocycleProps) {
  return (
    <div
      className={BG_COLOR_M6 + " mb-3 flex w-full flex-col"}
      style={{ width: "920px" }}
    >
      <div className="indent-1 text-white">
        Mesocycle {currentMesocycleIndex + 1}
      </div>

      <div className="flex flex-col">
        <div>
          <SessionHeaderLayout />
        </div>
        <div className="flex flex-col">
          {split.map((each) => {
            return (
              <SessionRow
                training_day={each}
                currentMesocycleIndex={currentMesocycleIndex}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
