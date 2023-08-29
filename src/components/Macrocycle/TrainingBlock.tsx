import { useEffect, useState } from "react";
import {
  SessionSplitTESTType,
  getTrainingSplitTEST,
  initializeSessions,
} from "~/hooks/usePrioritizeMuscles";
import useTrainingBlock from "~/hooks/useTrainingBlock";
import { MusclePriorityType, SessionType } from "~/pages";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type TrainingBlockProps = {
  priorityRanking: MusclePriorityType[];
  workoutSplit: SessionType[];
  totalSessions: [number, number];
};

export default function TrainingBlock({
  workoutSplit,
  priorityRanking,
  totalSessions,
}: TrainingBlockProps) {
  const { trainingBlock, testSplit } = useTrainingBlock(
    workoutSplit,
    priorityRanking,
    totalSessions
  );
  const [test, setTest] = useState<SessionSplitTESTType[][]>([]);

  useEffect(() => {
    const getTest = getTrainingSplitTEST(
      priorityRanking,
      totalSessions[0],
      totalSessions[1]
    );
    setTest(getTest);
  }, [totalSessions, priorityRanking]);

  return (
    <div className="flex w-4/5 flex-wrap justify-center">
      <div className="flex w-full flex-col">
        <p>Hard Coded Sessions</p>
        <div className="flex">
          {test.map((each, index) => {
            return <SessionCard session={each} index={index + 1} />;
          })}
        </div>
      </div>
      <div className="flex w-full flex-col">
        <p>Algorithmic Coded Sessions</p>
        <div className="flex">
          {testSplit.map((each, index) => {
            return <SessionCard session={each} index={index + 1} />;
          })}
        </div>
      </div>

      {/* <div className="flex">
        {workoutSplit.map((each) => {
          return <p className={`${getColor(each.split)} m-2`}>{each.split}</p>;
        })}
      </div> */}
      {/* 
      <div className="flex">
        {testSplit?.map((each) => {
          return <p className={`${getColor(each)} m-2`}>{each}</p>;
        })}
      </div> */}

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

const SessionCard = ({
  session,
  index,
}: {
  session: SessionSplitTESTType[];
  index: number;
}) => {
  const getColor = (
    split: "none" | "push" | "pull" | "upper" | "lower" | "full"
  ) => {
    switch (split) {
      case "none":
        return "text-slate-500";
      case "upper":
        return "text-blue-500";
      case "lower":
        return "text-red-500";
      case "full":
        return "text-purple-500";
      default:
        return "text-blue-300";
    }
  };

  return (
    <div className="flex flex-col border border-slate-500">
      <p className="m-1 w-20 text-sm">Day {index}</p>
      <p className={"m-1 w-20 text-sm " + getColor(session[0])}>
        1st Session: {session[0]}
      </p>
      <p className={"m-1 w-20 text-sm " + getColor(session[1])}>
        2nd Session: {session[1]}
      </p>
    </div>
  );
};

// const combinePushPullUpper = (
//   push: number,
//   pull: number,
//   max: number,
//   total: number
// ) => {
//   let pushPull = 0;

//   // Calculate the maximum possible value for pushPull without exceeding max
//   pushPull = Math.min(max, total - (push + pull));

//   // Distribute the remaining pushPull value between push and pull as evenly as possible
//   if (pushPull > 0) {
//     const remainingSpace = max - pushPull;
//     const pushShare = Math.min(push, remainingSpace / 2);
//     const pullShare = Math.min(pull, remainingSpace / 2);

//     push -= pushShare;
//     pull -= pullShare;
//   }

//   return [push, pull, pushPull];
// };

const combinePushPullUpper = (
  push: number,
  pull: number,
  max: number,
  total: number
) => {
  let upper = total;
  let pushCount = 0;
  let pullCount = 0;

  while (pushCount + upper > max || pullCount + upper > max) {
    upper = upper - 2;
    pushCount++;
    pullCount++;
  }

  return [pushCount, pullCount, upper];
};

export const determineWorkoutSplit = (
  push: number,
  pull: number,
  lower: number,
  sessions: [number, number]
) => {
  const totalSessions = sessions[0] + sessions[1];
  const session_maxes_per_week = initializeSessions(totalSessions);
  const total = push + pull + lower;

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

  let pushSessions = pushInteger;
  let pullSessions = pullInteger;
  let lowerSessions = lowerInteger;
  let upperSessions = pushSessions + pullSessions;
  let fullSessions = 0;

  let totalTenths = Math.round(pushTenths + pullTenths + lowerTenths);

  if (totalTenths <= 1) {
    if (pushTenths >= 0.6) {
      pushSessions++;
    } else if (pullTenths >= 0.6) {
      pullSessions++;
    } else if (lowerTenths >= 0.55) {
      lowerSessions++;
    } else {
      fullSessions++;
    }
  } else {
    if (lowerTenths <= 0.33) {
      pushSessions++;
      pullSessions++;
    } else if (lowerTenths >= 0.6) {
      lowerSessions++;
      if (pullTenths > pushTenths) {
        pullSessions++;
      } else {
        pushSessions++;
      }
    } else {
      fullSessions = fullSessions + 1;
      if (pullTenths > pushTenths) {
        pullSessions++;
      } else {
        pushSessions++;
      }
    }
  }

  // upperSessions = pushSessions + pullSessions;

  // let split: ("push" | "pull" | "upper" | "lower" | "full")[] = [];
  let first_sessions = sessions[0];
  let second_sessions = sessions[1];

  let split: SessionSplitTESTType[][] = [];
  let index = 0;

  while (pushSessions + pullSessions + lowerSessions + fullSessions > 0) {
    if (first_sessions > 0) {
      if (pullSessions > 0) {
        split.push(["pull", "none"]);
        pullSessions--;
      } else if (pushSessions > 0) {
        split.push(["push", "none"]);
        pushSessions--;
      } else if (lowerSessions > 0) {
        split.push(["lower", "none"]);
        lowerSessions--;
      } else if (fullSessions > 0) {
        split.push(["full", "none"]);
        fullSessions--;
      }
      first_sessions--;
    } else if (second_sessions > 0) {
      if (pullSessions > 0) {
        split[index].splice(1, 1, "pull");
        pullSessions--;
        index++;
      } else if (pushSessions > 0) {
        split[index].splice(1, 1, "push");
        pushSessions--;
        index++;
      } else if (lowerSessions > 0) {
        split[index].splice(1, 1, "lower");
        lowerSessions--;
        index++;
      } else if (fullSessions > 0) {
        split[index].splice(1, 1, "full");
        fullSessions--;
        index++;
      }
      second_sessions--;
    }
  }

  // test logic
  const push_pull_max = session_maxes_per_week[0];
  const lower_max = session_maxes_per_week[2];

  // if (pullSessions < push_pull_max) {
  //   if (pushSessions > 0) {
  //     pushSessions--;
  //     upperSessions++;
  //   }
  // }
  let finalPush = 0;
  let finalPull = 0;

  for (let i = 0; i < split.length; i++) {
    if (split[i][0] === "push") {
      finalPush++;
    } else if (split[i][0] === "pull") {
      finalPull++;
    } else if (split[i][1] === "push") {
      finalPush++;
    } else if (split[i][1] === "pull") {
      finalPull++;
    }
  }

  const totals = finalPush + finalPull;
  const values = combinePushPullUpper(
    finalPush,
    finalPull,
    push_pull_max,
    totals
  );

  // 6 -- 5
  // pull pull pull pull
  // push push

  // pull pull pull upper
  // push upper

  // const lowerTotal = split.filter(
  //   (each) => each === "full" || each === "lower"
  // );

  // const upperTotal = split.filter((each) => each !== "lower");

  console.log(sessions, split, totalSessions, values, "WHAT THESE LOOK LIKE??");

  // upperSessions = pushSessions + pullSessions;

  // let split: ("upper" | "lower" | "full")[] = [];

  // while (upperSessions + lowerSessions + fullSessions > 0) {
  //   if (upperSessions > 0) {
  //     split.push("upper");
  //     upperSessions = upperSessions - 1;
  //   } else if (lowerSessions > 0) {
  //     split.push("lower");
  //     lowerSessions = lowerSessions - 1;
  //   } else if (fullSessions > 0) {
  //     split.push("full");
  //     fullSessions = fullSessions - 1;
  //   }
  // }

  // LOGGING FOR TESTING ---------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
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
  // LOGGING FOR TESTING ---------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  return split;
};
