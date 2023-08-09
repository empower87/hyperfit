import useMacrocycle from "~/hooks/useMacrocycle";
import { MusclePriorityType, SessionType } from "~/pages";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type TrainingBlockProps = {
  priorityRanking: MusclePriorityType[];
  workoutSplit: SessionType[];
};

export default function TrainingBlock({
  workoutSplit,
  priorityRanking,
}: TrainingBlockProps) {
  const { macrocycle } = useMacrocycle(workoutSplit, priorityRanking);

  return (
    <div className="flex w-4/5 flex-wrap justify-center">
      {macrocycle.map((each, index) => {
        return (
          <MesocycleLayout
            key={`${index}_${each[index]?.day}_mesocycles`}
            title={`Mesocycle ${index + 1}`}
          >
            <MesocycleTable split={each} />
          </MesocycleLayout>
        );
      })}
    </div>
  );
}
