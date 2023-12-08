import Mesocycle from "~/components/Mesocycle";
// import { TrainingDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import {
  TraingingBlockProvider,
  useTrainingBlockContext,
} from "./context/TrainingBlockContext";

type TrainingBlockProps = {
  training_week: TrainingDayType[];
};

export default function TrainingBlock({ training_week }: TrainingBlockProps) {
  return (
    <TraingingBlockProvider training_week={training_week}>
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
