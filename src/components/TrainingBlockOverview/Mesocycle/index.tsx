import { useState } from "react";
import CollapsableHeader from "~/components/Layout/CollapsableHeader";
import { DraggableExercises } from "~/components/TrainingWeekOverview/components/hooks/useExerciseSelection";
import { BG_COLOR_M6 } from "~/constants/themes";
import { cn } from "~/lib/clsx";
import { HeaderRow, SessionRow } from "./Rows";

type MesocycleProps = {
  training_week: DraggableExercises[];
  currentMesocycleIndex: number;
};

export default function Mesocycle({
  training_week,
  currentMesocycleIndex,
}: MesocycleProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onCollapse = () => setIsCollapsed(true);
  const onExpand = () => setIsCollapsed(false);

  const filteredOutOffDays = training_week.filter(
    (each) => each.sessions[0].split !== "off"
  );
  const sessionNumbers = filteredOutOffDays.reduce((acc: number[][], cur) => {
    const realSessions = cur.sessions.filter((each) => each.split !== "off");
    const sessions: number[] = [];
    const previousDay = acc[acc.length - 1];
    const lastSession =
      previousDay && previousDay.length
        ? previousDay[previousDay.length - 1]
        : 0;
    realSessions.forEach((each, index) =>
      sessions.push(lastSession + index + 1)
    );
    if (sessions.length) acc.push(sessions);
    return acc;
  }, []);

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
          {filteredOutOffDays.map((each, index) => {
            return (
              <SessionRow
                key={`${each.day}-${index}`}
                training_day={each}
                sessionNumbers={sessionNumbers[index]}
                currentMesocycleIndex={currentMesocycleIndex}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
