import Mesocycle from "~/components/Mesocycle";
import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BORDER_COLOR_M6 } from "~/utils/themes";
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
      <div id="modal-body" className={" flex flex-col"}>
        <div className={BORDER_COLOR_M6 + " mb-4 border-b-2"}>
          <h2 className="ml-1 p-1 text-white">Training Block</h2>
        </div>
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
