import Mesocycle from "~/components/Mesocycle";
import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import {
  TraingingBlockProvider,
  useTrainingBlockContext,
} from "./context/TrainingBlockContext";

type TrainingBlockProps = {
  split: SessionDayType[];
};

export default function TrainingBlock({ split }: TrainingBlockProps) {
  return (
    <TraingingBlockProvider split={split}>
      <div className={" flex flex-col"}>
        <Mesocycles />
      </div>
    </TraingingBlockProvider>
  );
}

const Mesocycles = () => {
  const { trainingBlock, editExerciseHandler } = useTrainingBlockContext();
  return (
    <>
      {trainingBlock.map((each, index) => {
        return (
          <Mesocycle
            key={`${index}_${each[index]?.day}_mesocycles`}
            split={each}
            currentMesocycleIndex={index}
          />
        );
      })}
    </>
  );
};
