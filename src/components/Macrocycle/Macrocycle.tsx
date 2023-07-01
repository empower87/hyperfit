import { SessionType } from "~/pages";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type MacrocycleProps = {
  workoutSplit: SessionType[];
};

export default function Macrocycle({ workoutSplit }: MacrocycleProps) {
  return (
    <div className="flex w-3/4 flex-wrap justify-center">
      <MesocycleLayout title={"Mesocycle 1"}>
        <MesocycleTable split={workoutSplit} />
      </MesocycleLayout>
    </div>
  );
}
