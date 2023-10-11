import { ReactNode } from "react";
import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { MesocycleLayout, MesocycleTable } from "../Mesocycle";
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
            title={`Mesocycle ${index + 1}`}
          >
            <MesocycleTable split={each} onEdit={editExerciseHandler} />
          </MesocycleLayout>
        );
      })}
    </div>
  );
}
