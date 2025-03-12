import { useMemo } from "react";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { hydrateTrainingWeek } from "../TrainingWeekOverview/hooks/useTrainingWeek";
import MesocycleTrainingWeek from "./Mesocycle";

export default function TrainingBlock() {
  const { prioritized_muscle_list, training_block } =
    useTrainingProgramContext();

  const hydratedTrainingBlock = useMemo(
    () =>
      training_block.map((each) =>
        hydrateTrainingWeek(each, prioritized_muscle_list)
      ),
    [training_block, prioritized_muscle_list]
  );

  return (
    <div id="training_block" className={"flex w-full flex-col"}>
      {hydratedTrainingBlock.map((each, index) => {
        return (
          <MesocycleTrainingWeek
            key={`${index}_${each[index]?.day}_mesocycles`}
            mesocycleExercises={each}
            currentMesocycleIndex={index}
          />
        );
      })}
    </div>
  );
}
