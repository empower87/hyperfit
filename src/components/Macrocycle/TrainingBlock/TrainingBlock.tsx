import { ReactNode } from "react";
import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
// import { MesocycleLayout, MesocycleTable } from "../Mesocycle";
import { MesocycleLayout } from "~/components/Session/Session";
import useTrainingBlock from "./hooks/useTrainingBlock";

type TrainingBlockProps = {
  split: SessionDayType[];
  children?: ReactNode;
};

export default function TrainingBlock({ split, children }: TrainingBlockProps) {
  const { trainingBlock, editExerciseHandler } = useTrainingBlock(split);

  return (
    <div className="flex flex-col">
      {children}

      {trainingBlock.map((each, index) => {
        return (
          <MesocycleLayout
            key={`${index}_${each[index]?.day}_mesocycles`}
            split={each}
            currentMesocycleIndex={index}
          />
        );
      })}
    </div>
  );
}
