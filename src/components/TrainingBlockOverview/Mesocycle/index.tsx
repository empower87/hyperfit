import { useState } from "react";
import CollapsableHeader from "~/components/Layout/CollapsableHeader";
import { BG_COLOR_M6 } from "~/constants/themes";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import { HeaderRow, SessionRow } from "./Rows";

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

      <div className="flex flex-col space-y-1 overflow-x-auto p-2">
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
