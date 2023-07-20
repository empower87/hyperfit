import { useEffect, useState } from "react";
import { MusclePriorityType, SessionType } from "~/pages";
import { setUpMesoOne } from "~/utils/distributeSets";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type MacrocycleProps = {
  priorityRanking: MusclePriorityType[];
  workoutSplit: SessionType[];
};

// TODO: Should take in a list of workoutSplits so as to map out Mesocycles 1-4 including the Resensitization phase.
//       This should also allow for deleting a mesocycle in the list so as to reduce the amount of mesos a user wants to create
//       Resensitization phase should be easy as it's all workouts at maintenance at 2x per week
export default function Macrocycle({
  workoutSplit,
  priorityRanking,
}: MacrocycleProps) {
  const [state, setState] = useState<SessionType[][]>([]);

  useEffect(() => {
    // const meso1 = ugh([...workoutSplit], priorityRanking, 0);
    // const meso2 = ugh([...workoutSplit], priorityRanking, 1);
    // const meso3 = ugh([...workoutSplit], priorityRanking, 2);
    // console.log(meso1, meso2, meso3, "OH BOY HERE COMES A LOT OF DATA!!");
    const list = setUpMesoOne(workoutSplit, priorityRanking);
    setState(list);
  }, [workoutSplit, priorityRanking]);

  return (
    <div className="flex w-3/4 flex-wrap justify-center">
      {state.map((each, index) => {
        return (
          <MesocycleLayout
            key={`${index}_mesocycles`}
            title={`Mesocycle ${index + 1}`}
          >
            <MesocycleTable split={each} />
          </MesocycleLayout>
        );
      })}
    </div>
  );
}
