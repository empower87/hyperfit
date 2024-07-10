import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import useTrainingWeek from "../TrainingWeekOverview/components/hooks/useTrainingWeek";
import Mesocycle from "./Mesocycle";

export default function TrainingBlock() {
  const { training_block, prioritized_muscle_list } =
    useTrainingProgramContext();
  const { hydratedTrainingBlock } = useTrainingWeek(
    training_block,
    prioritized_muscle_list,
    0
  );
  return (
    <div id="training_block" className={"flex w-full flex-col"}>
      {hydratedTrainingBlock.map((each, index) => {
        return (
          <Mesocycle
            key={`${index}_${each[index]?.day}_mesocycles`}
            training_week={each}
            currentMesocycleIndex={index}
          />
        );
      })}
    </div>
  );
}
