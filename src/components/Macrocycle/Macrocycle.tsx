import useMacrocycle from "~/hooks/useMacrocycle";
import { MusclePriorityType, SessionType } from "~/pages";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type MacrocycleProps = {
  priorityRanking: MusclePriorityType[];
  workoutSplit: SessionType[];
};

export default function Macrocycle({
  workoutSplit,
  priorityRanking,
}: MacrocycleProps) {
  const { macrocycle } = useMacrocycle(workoutSplit, priorityRanking);

  return (
    <div className="flex w-3/4 flex-wrap justify-center">
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
