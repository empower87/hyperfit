import { useState } from "react";
import CollapsibleHeader from "~/components/Layout/CollapsibleHeader";

import { cn } from "~/lib/clsx";
import { DraggableExercises } from "../../TrainingWeekOverview/hooks/useExerciseSelection";
import { HeaderRow, SessionRow } from "./Rows";

type MesocycleProps = {
  mesocycleExercises: DraggableExercises[];
  currentMesocycleIndex: number;
};

export default function MesocycleTrainingWeek({
  mesocycleExercises,
  currentMesocycleIndex,
}: MesocycleProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onCollapse = () => setIsCollapsed(true);
  const onExpand = () => setIsCollapsed(false);

  const filteredOutOffDays = mesocycleExercises.filter(
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
      <CollapsibleHeader className={`mb-2 rounded`}>
        <CollapsibleHeader.Title
          label={`Mesocycle ${currentMesocycleIndex + 1}`}
        />
        <CollapsibleHeader.Button
          isCollapsed={isCollapsed}
          onCollapse={onExpand}
        />
      </CollapsibleHeader>
    );
  }
  return (
    <div
      className={cn(`mb-3 flex max-w-[1200px] flex-col rounded bg-primary-600`)}
    >
      <CollapsibleHeader className={`rounded-t bg-rose-400`}>
        <CollapsibleHeader.Title
          label={`Mesocycle ${currentMesocycleIndex + 1}`}
        />
        <CollapsibleHeader.Button
          isCollapsed={isCollapsed}
          onCollapse={onCollapse}
        />
      </CollapsibleHeader>

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
