import { SessionType } from "~/pages";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type MacrocycleProps = {
  workoutSplit: SessionType[];
};

// TODO: Should take in a list of workoutSplits so as to map out Mesocycles 1-4 including the Resensitization phase.
//       This should also allow for deleting a mesocycle in the list so as to reduce the amount of mesos a user wants to create
//       Resensitization phase should be easy as it's all workouts at maintenance at 2x per week
export default function Macrocycle({ workoutSplit }: MacrocycleProps) {
  return (
    <div className="flex w-3/4 flex-wrap justify-center">
      <MesocycleLayout title={"Mesocycle 3"}>
        <MesocycleTable split={workoutSplit} />
      </MesocycleLayout>
    </div>
  );
}
