import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import Mesocycle from "./Mesocycle";

export default function TrainingBlock() {
  const { training_block } = useTrainingProgramContext();

  return (
    <div id="training_block" className={"flex w-full flex-col"}>
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
  );
}
