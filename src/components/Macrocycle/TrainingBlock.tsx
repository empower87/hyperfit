import { useEffect, useState } from "react";
import {
  SessionSplitTESTType,
  initializeSessions,
} from "~/hooks/usePrioritizeMuscles";
import useTrainingBlock from "~/hooks/useTrainingBlock";
import { MusclePriorityType, SessionType } from "~/pages";
import { getTrainingSplit } from "~/utils/getTrainingSplit";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type TrainingBlockProps = {
  priorityRanking: MusclePriorityType[];
  workoutSplit: SessionType[];
  totalSessions: [number, number];
};

type TestingAlgorithmUIType = {
  title: string;
  split: SessionSplitTESTType[][];
  margin?: string;
};

const TestingAlgorithmUI = ({
  title,
  split,
  margin,
}: TestingAlgorithmUIType) => {
  const DEFAULT: SessionSplitTESTType[][] = [
    ["none", "none"],
    ["none", "none"],
    ["none", "none"],
    ["none", "none"],
    ["none", "none"],
    ["none", "none"],
    ["none", "none"],
  ];

  const updateSplit = DEFAULT.map((each, index) => {
    if (split[index]) {
      return split[index];
    } else return each;
  });

  return (
    <div className={margin ? margin : "" + " flex flex-col"}>
      <p className="text-xs font-bold">{title}</p>
      <div className="flex border border-slate-500">
        {updateSplit.map((each, index) => {
          return <TestingCard session={each} index={index + 1} />;
        })}
      </div>
    </div>
  );
};

const TestingCard = ({
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
  const isOffDay =
    session[0] === "none" && session[1] === "none" ? true : false;
  const isLastElement = index === 7 ? true : false;
  return (
    <div
      className={
        !isLastElement ? "border-r border-slate-500 " : "" + " flex flex-col"
      }
      style={{ width: "55px" }}
    >
      <div className="flex bg-slate-500" style={{ height: "20px" }}>
        <p className="text-bold ml-1 text-xs text-white">Day {index}</p>
      </div>
      <div className="ml-1" style={{ height: "20px" }}>
        <p className={"text-xs " + getColor(session[0])}>
          {isOffDay ? "off" : `1: ${session[0]}`}
        </p>
      </div>
      <div className="ml-1" style={{ height: "20px" }}>
        <p className={"text-xs " + getColor(session[1])}>
          {isOffDay ? "off" : `2: ${session[1]}`}
        </p>
      </div>
    </div>
  );
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
    const getTest = getTrainingSplit(
      priorityRanking,
      totalSessions[0],
      totalSessions[1]
    );
    setTest(getTest);
  }, [totalSessions, priorityRanking]);

  return (
    <div className="flex flex-wrap">
      <div className="m-2 rounded border border-slate-500 bg-gray-100 p-2">
        <TestingAlgorithmUI
          title="Hard Coded Sessions"
          split={test}
          margin={"mb-2"}
        />
        <TestingAlgorithmUI
          title="Algorithmic Coded Sessions"
          split={testSplit}
        />
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
  sessions: [number, number]
) => {
  const totalSessions = sessions[0] + sessions[1];
  const session_maxes_per_week = initializeSessions(totalSessions);
  const push_pull_max = session_maxes_per_week[0];
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
  let upperSessions = 0;
  let fullSessions = 0;

  let totalTenths = Math.round(pushTenths + pullTenths + lowerTenths);

  // -- Determine which session to create based on fractions of remainders
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

  // -- Maximize frequency by combining push and pulls --
  while (pullSessions + upperSessions < push_pull_max) {
    if (pushSessions > 0) {
      upperSessions++;
      pushSessions--;
    } else {
      break;
    }
  }
  while (pushSessions + upperSessions < push_pull_max) {
    if (pullSessions > 0) {
      upperSessions++;
      pullSessions--;
    } else {
      break;
    }
  }
  // ---------------------------------------------------

  let first_sessions = sessions[0];
  let second_sessions = sessions[1];

  let split: SessionSplitTESTType[][] = [];
  let index = 0;

  while (
    pushSessions + pullSessions + lowerSessions + upperSessions + fullSessions >
    0
  ) {
    if (first_sessions > 0) {
      if (pullSessions > 0) {
        split.push(["pull", "none"]);
        pullSessions--;
      } else if (pushSessions > 0) {
        split.push(["push", "none"]);
        pushSessions--;
      } else if (upperSessions > 0) {
        split.push(["upper", "none"]);
        upperSessions--;
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
      } else if (upperSessions > 0) {
        split[index].splice(1, 1, "upper");
        upperSessions--;
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

  // TODO: have to figure out a sorting algorithm to optimally place sessions

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
  console.log(`push: ${split}`);
  console.log("push: --------------------------------------");
  // LOGGING FOR TESTING ---------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  return split;
};
