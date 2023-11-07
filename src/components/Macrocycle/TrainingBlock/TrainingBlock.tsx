import Mesocycle from "~/components/Mesocycle";
import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import {
  TraingingBlockProvider,
  useTrainingBlockContext,
} from "./context/TrainingBlockContext";

type TrainingBlockProps = {
  training_week: SessionDayType[];
};

export default function TrainingBlock({ training_week }: TrainingBlockProps) {
  return (
    <TraingingBlockProvider split={training_week}>
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
