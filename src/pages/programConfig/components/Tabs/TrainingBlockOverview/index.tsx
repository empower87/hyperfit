import { useMemo } from "react";
import { useProgramConfigContext } from "~/pages/programConfig/hooks/useProgramConfig";
import { hydrateTrainingWeek } from "../TrainingWeekOverview/hooks/useTrainingWeek";
import MesocycleTrainingWeek from "./Mesocycle";

export default function TrainingBlock() {
  const { trainingBlock, muscle_priority_list } = useProgramConfigContext();

  const hydratedTrainingBlock = useMemo(
    () =>
      trainingBlock.map((each) =>
        hydrateTrainingWeek(each, muscle_priority_list)
      ),
    [trainingBlock, muscle_priority_list]
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
