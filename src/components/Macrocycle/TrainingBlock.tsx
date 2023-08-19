import { useEffect } from "react";
import useTrainingBlock from "~/hooks/useTrainingBlock";
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
  const { trainingBlock, testSplit } = useTrainingBlock(
    workoutSplit,
    priorityRanking
  );

  // TEMPORARY: to look at  console.log to find algorithm
  const getColor = (split: "upper" | "lower" | "full") => {
    switch (split) {
      case "upper":
        return "text-blue-500";
      case "lower":
        return "text-red-500";
      case "full":
        return "text-purple-500";
    }
  };
  useEffect(() => {
    console.log(testSplit);
  }, [testSplit]);
  return (
    <div className="flex w-4/5 flex-wrap justify-center">
      <div className="flex">
        {workoutSplit.map((each) => {
          return <p className={`${getColor(each.split)} m-2`}>{each.split}</p>;
        })}
      </div>

      <div className="flex">
        {testSplit?.map((each) => {
          return <p className={`${getColor(each)} m-2`}>{each}</p>;
        })}
      </div>
      {trainingBlock.map((each, index) => {
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
