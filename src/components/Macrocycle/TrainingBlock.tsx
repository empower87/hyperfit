import { ReactNode } from "react";
import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type TrainingBlockProps = {
  trainingBlock: SessionDayType[][];
  children?: ReactNode;
};

export default function TrainingBlock({
  trainingBlock,
  children,
}: TrainingBlockProps) {
  return (
    <div className="flex flex-col">
      {children}

      {trainingBlock.map((each, index) => {
        return (
          <MesocycleLayout
            key={`${index}_${each[index]?.day}_mesocycles`}
            title={`Mesocycle ${index + 1}`}
          >
            <MesocycleTable split={each} />
          </MesocycleLayout>
        );
      })}
    </div>
  );
}
