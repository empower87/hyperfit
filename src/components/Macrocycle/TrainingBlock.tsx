import { useEffect, useState } from "react";
import { pushPullLowerFrequencyMax } from "~/hooks/usePrioritizeMuscles";
import useTrainingBlock from "~/hooks/useTrainingBlock";
import {
  MusclePriorityType,
  SessionDayType,
  SessionType,
  SplitType,
} from "~/pages";
import { getNextSession } from "~/utils/getNextSession";
import { getTrainingSplit } from "~/utils/getTrainingSplit";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type TrainingBlockProps = {
  priorityRanking: MusclePriorityType[];
  workoutSplit: SessionType[];
  totalSessions: [number, number];
  split: SessionDayType[];
};

type TestingAlgorithmUIType = {
  title: string;
  split: [SplitType, SplitType][];
  margin?: string;
};

const TestingAlgorithmUI = ({
  title,
  split,
  margin,
}: TestingAlgorithmUIType) => {
  const DEFAULT: [SplitType, SplitType][] = [
    ["off", "off"],
    ["off", "off"],
    ["off", "off"],
    ["off", "off"],
    ["off", "off"],
    ["off", "off"],
    ["off", "off"],
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
  session: [SplitType, SplitType];
  index: number;
}) => {
  const getColor = (
    split: "off" | "push" | "pull" | "upper" | "lower" | "full"
  ) => {
    switch (split) {
      case "off":
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
  const isOffDay = session[0] === "off" && session[1] === "off" ? true : false;
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
  split,
}: TrainingBlockProps) {
  const { trainingBlock, testSplit } = useTrainingBlock(
    workoutSplit,
    priorityRanking,
    totalSessions,
    split
  );
  const [test, setTest] = useState<[SplitType, SplitType][]>([]);

  useEffect(() => {
    const getTest = getTrainingSplit(
      priorityRanking,
      totalSessions[0],
      totalSessions[1]
    );
    setTest(getTest);
  }, [totalSessions, priorityRanking]);

  return (
    <div className="flex flex-col">
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
  sessions: [number, number],
  split: SessionDayType[]
) => {
  const totalSessions = sessions[0] + sessions[1];
  const session_maxes_per_week = pushPullLowerFrequencyMax(totalSessions);
  const push_pull_max = session_maxes_per_week[0];
  const total = push + pull + lower;

  let pushDecimal = push / total;
  let pullDecimal = pull / total;
  let lowerDecimal = lower / total;

  let pushRatio = totalSessions * pushDecimal;
  let pullRatio = totalSessions * pullDecimal;
  let lowerRatio = totalSessions * lowerDecimal;

  let pushInteger = Math.floor(pushRatio);
  let pullInteger = Math.floor(pullRatio);
  let lowerInteger = Math.floor(lowerRatio);

  let pushTenths = pushRatio - pushInteger;
  let pullTenths = pullRatio - pullInteger;
  let lowerTenths = lowerRatio - lowerInteger;

  let pushSessions = pushInteger;
  let pullSessions = pullInteger;
  let lowerSessions = lowerInteger;
  let upperSessions = 0;
  let fullSessions = 0;

  let totalTenths = Math.round(pushTenths + pullTenths + lowerTenths);
  // -- Determine which session to create based on fractions of remainders

  // TODO: create a min value for some values if exceeds a certain session total
  //       i.e. sessions is greater than 8x and you only do 2 lower sessions, probably
  //       should be a min of 3 lower sessions regardless of rank, since you'll have adequate
  //       sessions for all your upper body volume.

  // let lower_min = 0;
  // if (totalSessions >= 8) {
  //   lower_min = 3;
  // }

  // if (lower_min === 3 && lowerSessions < lower_min) {
  //   if (totalTenths <= 1 && lowerTenths < 0.25) {
  //     let lower_add_value = 0.55 - lowerTenths;
  //     let push_pull_sub_value = Math.round(lower_add_value / 2);

  //     lowerTenths = lowerTenths + lower_add_value;
  //     pushTenths = pushTenths - push_pull_sub_value;
  //     pullTenths = pullTenths - push_pull_sub_value;
  //   } else if (totalTenths > 1 && lowerTenths <= 0.33) {
  //     let lower_add_value = 0.33 - lowerTenths;
  //     let push_pull_sub_value = Math.round(lower_add_value / 2);

  //     lowerTenths = lowerTenths + lower_add_value;
  //     pushTenths = pushTenths - push_pull_sub_value;
  //     pullTenths = pullTenths - push_pull_sub_value;
  //   }
  // }

  if (totalTenths <= 1) {
    if (lowerTenths >= 0.55) {
      lowerSessions++;
    } else if (lowerTenths >= 0.25 && lowerTenths < 0.55) {
      fullSessions++;
    } else if (Math.round(pullTenths) >= 0.6) {
      pullSessions++;
    } else if (Math.round(pushTenths) >= 0.6) {
      pushSessions++;
    } else if (pushTenths + pullTenths > 0.8) {
      upperSessions++;
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

  const _split = optimizeSplitFrequency(
    first_sessions,
    second_sessions,
    split,
    upperSessions,
    lowerSessions,
    pushSessions,
    pullSessions,
    fullSessions
  );

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
  console.log(
    `push: ${_split.map(
      (each) => `[${each.sessions[0]}, ${each.sessions[1]}] -- `
    )}`
  );
  console.log("push: --------------------------------------");
  // LOGGING FOR TESTING ---------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  return _split;
};

export const setSessionNums = (sessions: number, split: SessionDayType[]) => {
  switch (sessions) {
    case 3:
      let odd = 0;
      const oddSplit = split.map((each, index) => {
        if (index % 2 !== 0) {
          odd++;
          return { ...each, sessionNum: odd };
        } else return each;
      });
      return oddSplit;
    case 4:
      let four = 0;
      const fourSplit = split.map((each, index) => {
        if (index === 1 || index === 2 || index === 4 || index === 5) {
          four++;
          return { ...each, sessionNum: four };
        } else return each;
      });
      return fourSplit;
    case 5:
      let five = 0;
      const fiveSplit = split.map((each, index) => {
        if (
          index === 1 ||
          index === 2 ||
          index === 4 ||
          index === 5 ||
          index === 6
        ) {
          five++;
          return { ...each, sessionNum: five };
        } else return each;
      });
      return fiveSplit;
    case 6:
      let six = 0;
      const sixSplit = split.map((each, index) => {
        if (index !== 0) {
          six++;
          return { ...each, sessionNum: six };
        } else return each;
      });
      return sixSplit;
    default:
      const sevenSplit = split.map((each, index) => ({
        ...each,
        sessionNum: index + 1,
      }));
      return sevenSplit;
  }
};

const optimizeSplitFrequency = (
  frequency: number,
  numOfDoubles: number,
  split: SessionDayType[],
  upper: number,
  lower: number,
  push: number,
  pull: number,
  full: number
) => {
  let update_split: SessionDayType[] = [...split];

  let off_count = numOfDoubles === 0 ? 0 : frequency - numOfDoubles;

  let counter = {
    lower: lower,
    upper: upper,
    push: push,
    pull: pull,
    full: full,
    off: off_count,
  };

  const totalLower = lower + full;
  const totalPush = push + upper + full;
  const totalPull = pull + upper + full;

  for (let i = 0; i < update_split.length; i++) {
    let isTrainingDay = update_split[i].sessionNum > 0 ? true : false;
    let prevSessionOne = update_split[i - 1]?.sessions[0];

    if (isTrainingDay) {
      const newCurrentSessionOneValue = getNextSession(
        counter.upper,
        counter.lower,
        counter.push,
        counter.pull,
        counter.full,
        0,
        totalLower,
        totalPush,
        totalPull,
        prevSessionOne
      );

      update_split[i] = {
        ...update_split[i],
        sessions: [newCurrentSessionOneValue, update_split[i].sessions[1]],
      };

      counter = {
        ...counter,
        [newCurrentSessionOneValue]: counter[newCurrentSessionOneValue] - 1,
      };
    }
  }

  if (numOfDoubles === 0) return update_split;

  for (let j = 0; j < update_split.length; j++) {
    let isTrainingDay = update_split[j].sessionNum > 0 ? true : false;
    let sessionOne = update_split[j].sessions[0];

    let prevSessions = update_split[j - 1]?.sessions;
    let nextSessions = update_split[j + 1]?.sessions;

    if (isTrainingDay) {
      const newSession = getNextSession(
        counter.upper,
        counter.lower,
        counter.push,
        counter.pull,
        counter.full,
        counter.off,
        totalLower,
        totalPush,
        totalPull,
        sessionOne,
        prevSessions,
        nextSessions
      );

      update_split[j] = {
        ...update_split[j],
        sessions: [update_split[j].sessions[0], newSession],
      };

      counter = {
        ...counter,
        [newSession]: counter[newSession] - 1,
      };
    }
  }

  return update_split;
};
