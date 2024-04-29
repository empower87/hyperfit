import { useState } from "react";
import CollapsableHeader from "~/components/Layout/CollapsableHeader";
import { BG_COLOR_M6, BG_COLOR_M7, BORDER_COLOR_M6 } from "~/constants/themes";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { HeaderRow, SessionRow } from "./Rows";
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onCollapse = () => setIsCollapsed(true);
  const onExpand = () => setIsCollapsed(false);

  if (isCollapsed) {
    return (
      <CollapsableHeader className={`mb-2 rounded`}>
        <CollapsableHeader.Title
          label={`Mesocycle ${currentMesocycleIndex + 1}`}
        />

        <CollapsableHeader.Button
          isCollapsed={isCollapsed}
          onCollapse={onExpand}
        />
      </CollapsableHeader>
    );
  }
  return (
    <div
      className={cn(`${BG_COLOR_M6} mb-3 flex max-w-[1200px] flex-col rounded`)}
    >
      <CollapsableHeader className={`bg-rose-400`}>
        <CollapsableHeader.Title
          label={`Mesocycle ${currentMesocycleIndex + 1}`}
        />

        <CollapsableHeader.Button
          isCollapsed={isCollapsed}
          onCollapse={onCollapse}
        />
      </CollapsableHeader>

      <div className="flex flex-col space-y-1 p-2">
        <HeaderRow />

        <div className="flex flex-col space-y-2">
          {split.map((each, index) => {
            return (
              <SessionRow
                key={`${each.day}-${index}`}
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
