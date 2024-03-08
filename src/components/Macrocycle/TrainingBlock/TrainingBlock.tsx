import Mesocycle from "~/components/Mesocycle";
// import { TrainingDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";

type TrainingBlockProps = {
  training_block: TrainingDayType[][];
};

export default function TrainingBlock() {
  const { training_block } = useTrainingProgramContext();
  return (
    // <TraingingBlockProvider training_week={training_week}>
    <div className={" flex flex-col"}>
      {training_block.map((each, index) => {
        return (
          <Mesocycle
            key={`${index}_${each[index]?.day}_mesocycles`}
            split={each}
            currentMesocycleIndex={index}
          />
        );
      })}
    </div>
    // </TraingingBlockProvider>
  );
}
