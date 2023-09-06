import { useEffect, useState } from "react";
import {
  SessionSplitTESTType,
  initializeSessions,
} from "~/hooks/usePrioritizeMuscles";
import useTrainingBlock from "~/hooks/useTrainingBlock";
import { MusclePriorityType, SessionType } from "~/pages";
import { getTrainingSplit } from "~/utils/getTrainingSplit";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type DayType =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";
type SplitType = "upper" | "lower" | "push" | "pull" | "full" | "off";

type SessionDayType = {
  day: DayType;
  sessionNum: number;
  sessions: [SplitType, SplitType];
};

const INITIAL_SPLIT: SessionDayType[] = [
  {
    day: "Sunday",
    sessionNum: 0,
    sessions: ["off", "off"],
  },
  {
    day: "Monday",
    sessionNum: 0,
    sessions: ["off", "off"],
  },
  {
    day: "Tuesday",
    sessionNum: 0,
    sessions: ["off", "off"],
  },
  {
    day: "Wednesday",
    sessionNum: 0,
    sessions: ["off", "off"],
  },
  {
    day: "Thursday",
    sessionNum: 0,
    sessions: ["off", "off"],
  },
  {
    day: "Friday",
    sessionNum: 0,
    sessions: ["off", "off"],
  },
  {
    day: "Saturday",
    sessionNum: 0,
    sessions: ["off", "off"],
  },
];

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

  console.log(setSessionNums(first_sessions, INITIAL_SPLIT), "CHECK THE SPLIT");
  // const newSplit = populateSplit(pushSessions, pullSessions, lowerSessions, upperSessions, fullSessions, sessions, INITIAL_SPLIT)
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

const setSessionNums = (sessions: number, split: SessionDayType[]) => {
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
  full: number,
  list: MusclePriorityType[],
) => {
  const setNewSplit: [SplitType, SplitType][] = []

  let _lower = lower
  let _upper = upper
  let _push = push
  let _pull = pull
  let _full = full

  let totalLower = lower + full
  let totalPush = push + upper + full
  let totalPull = pull + upper + full

  for (let i = 0; i < split.length; i++) {
    let currentSession = split[i].sessionNum
    let sessionOne = split[i].sessions[0]
    let sessiontwo = split[i].sessions[1]
    let prevSessionOne = split[i - 1].sessions[0]
    let prevSessionTwo = split[i - 1].sessions[1]

    if (currentSession !== 0) {
      // Meaning we have a training day on this iteration

      if (prevSessionTwo === "off") {

        if ((totalLower >= totalPush && totalLower >= totalPush && _lower > 0) || ((totalPush > totalPull && totalPush - 1 <= totalLower && _lower > 0) || (totalPull > totalPush && totalPull - 1 <= totalLower && _lower > 0))) {
          // split[i].sessions[0] = "lower"
          // _lower--
        } else if (totalPush >= totalPull && upper === 0) {
          // split[i].sessions[0] = "push"
          // _push--
        } else if (totalPull >= totalPush && upper == 0) {
          // split[i].sessions[0] = "pull"
          // _pull--
        } else if (upper > 0) {
          // split[i].sessions[0] = "upper"
          // _upper--
        } else {
          // split[i].sessions[0] = "full"
          // _full--
        }

      }
    }
  }

  switch (frequency) {
    case 3:

    case 4:

    case 5:

    case 6:

    default:

  }
}

// 5 - 4

// upper: 3
// pull:  2
// push:  2
// lower: 2
// full:  0

// off upper pull off upper pull off
// off lower push off lower push upper

// off push lower off pull lower upper
// off pull upper off push upper off

// off upper lower off push lower pull
// off off   upper off pull upper push

// off upper lower off upper lower upper
// off push  pull  off push  pull  off

const populateSplit = (
  pushSessions: number,
  pullSessions: number,
  lowerSessions: number,
  upperSessions: number,
  fullSessions: number,
  sessions: [number, number],
  split: SessionDayType[],
): SessionDayType[] => {
  let first_sessions = sessions[0];
  let second_sessions = sessions[1];

  let index = 0;

  let newSplit = setSessionNums(first_sessions, split)
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
  return split
}
