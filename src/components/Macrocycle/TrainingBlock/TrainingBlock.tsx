import Mesocycle from "~/components/Mesocycle";
import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BORDER_COLOR_M6 } from "~/utils/themes";
import useTrainingBlock from "./hooks/useTrainingBlock";

type TrainingBlockProps = {
  split: SessionDayType[];
};

export default function TrainingBlock({ split }: TrainingBlockProps) {
  const { trainingBlock, editExerciseHandler } = useTrainingBlock(split);

  return (
    <div className={" flex flex-col"}>
      <div className={BORDER_COLOR_M6 + " mb-2 border-b-2"}>
        <h2 className="ml-1 p-1 text-white">Training Block</h2>
      </div>
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
