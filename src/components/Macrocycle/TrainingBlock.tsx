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

export const determineWorkoutSplit = (
  push: number,
  pull: number,
  lower: number,
  totalSessions: number
) => {
  var total = push + pull + lower;

  var pushDecimal = push / total;
  var pullDecimal = pull / total;
  var lowerDecimal = lower / total;

  var pushRatio = totalSessions * pushDecimal;
  var pullRatio = totalSessions * pullDecimal;
  var lowerRatio = totalSessions * lowerDecimal;

  var pushInteger = Math.floor(pushRatio);
  var pullInteger = Math.floor(pullRatio);
  var lowerInteger = Math.floor(lowerRatio);

  var pushTenths = pushRatio - pushInteger;
  var pullTenths = pullRatio - pullInteger;
  var lowerTenths = lowerRatio - lowerInteger;

  let upperSessions = 0;
  let lowerSessions = 0;
  let fullSessions = 0;

  upperSessions = pushInteger + pullInteger;
  lowerSessions = lowerInteger;

  if (pushTenths + pullTenths + lowerTenths <= 1.1) {
    if (pushTenths >= 0.7 || pullTenths >= 0.7) {
      upperSessions = upperSessions + 1;
    } else if (lowerTenths >= 0.6) {
      lowerSessions = lowerSessions + 1;
    } else {
      fullSessions = fullSessions + 1;
    }
  } else {
    if (lowerTenths <= 0.33) {
      upperSessions = upperSessions + 2;
    } else if (lowerTenths >= 0.6) {
      lowerSessions = lowerSessions + 1;
      upperSessions = upperSessions + 1;
    } else {
      upperSessions = upperSessions + 1;
      fullSessions = fullSessions + 1;
    }
  }

  let split: ("upper" | "lower" | "full")[] = [];

  // this may not be efficient and cause infinite loop need to fine tune it.
  while (upperSessions + lowerSessions + fullSessions > 0) {
    if (upperSessions > 0) {
      split.push("upper");
      upperSessions = upperSessions - 1;
    } else if (lowerSessions > 0) {
      split.push("lower");
      lowerSessions = lowerSessions - 1;
    } else if (fullSessions > 0) {
      split.push("full");
      fullSessions = fullSessions - 1;
    } else {
      break;
    }
  }

  // LOGGING FOR TESTING
  const pushRatioFixed = pushRatio.toFixed(2);
  const pullRatioFixed = pullRatio.toFixed(2);
  const lowerRatioFixed = lowerRatio.toFixed(2);

  const pushPercentage = Math.round((push / total) * 100);
  const pullPercentage = Math.round((pull / total) * 100);
  const lowerPercentage = Math.round((lower / total) * 100);

  console.log("push: --------------------------------------");
  console.log(
    `push: ${push} -- pull: ${pull} -- lower: ${lower} total: ${total}`
  );
  console.log(
    `push: ${pushPercentage}% -- pull: ${pullPercentage}% -- lower: ${lowerPercentage}% total: 100%`
  );
  console.log(
    `push: ${pushRatioFixed} -- pull: ${pullRatioFixed} -- lower: ${lowerRatioFixed} total: ${totalSessions}`
  );
  console.log("push: --------------------------------------");

  return split;
};
