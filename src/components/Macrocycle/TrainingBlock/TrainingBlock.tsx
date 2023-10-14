import { ReactNode } from "react";
import Mesocycle from "~/components/Mesocycle";
import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
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
          <Mesocycle
            key={`${index}_${each[index]?.day}_mesocycles`}
            split={each}
            currentMesocycleIndex={index}
          />
        );
      })}
    </div>
  );
}
