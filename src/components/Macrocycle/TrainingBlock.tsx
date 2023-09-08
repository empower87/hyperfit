import { useEffect, useState } from "react";
import { initializeSessions } from "~/hooks/usePrioritizeMuscles";
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
  sessions: [number, number],
  split: SessionDayType[]
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
  const getNextSession = (
    previousSession: SplitType,
    upper: number,
    lower: number,
    push: number,
    pull: number,
    full: number,
    off: number,
    totalLower: number,
    totalPush: number,
    totalPull: number
  ) => {
    switch (previousSession) {
      case "upper":
        if (lower > 0) {
          return "lower";
        } else if (full > 0) {
          return "full";
        } else if (off > 0) {
          return "off";
        } else if (push > 0) {
          return "push";
        } else if (pull > 0) {
          return "pull";
        } else if (upper > 0) {
          return "upper";
        } else {
          return "off";
        }
      case "lower":
        if (upper > 0) {
          return "upper";
        } else if (push > 0) {
          return "push";
        } else if (pull > 0) {
          return "pull";
        } else if (off > 0) {
          return "off";
        } else if (full > 0) {
          return "full";
        } else if (lower > 0) {
          return "lower";
        } else {
          return "off";
        }
      case "push":
        if (pull > 0) {
          return "pull";
        } else if (lower > 0) {
          return "lower";
        } else if (full > 0) {
          return "full";
        } else if (upper > 0) {
          return "upper";
        } else if (off > 0) {
          return "off";
        } else {
          return "push";
        }
      case "pull":
        if (push > 0) {
          return "push";
        } else if (lower > 0) {
          return "lower";
        } else if (full > 0) {
          return "full";
        } else if (upper > 0) {
          return "upper";
        } else if (off > 0) {
          return "off";
        } else {
          return "pull";
        }
      case "full":
        if (upper > 0) {
          return "upper";
        } else if (lower > 0) {
          return "lower";
        } else if (push > 0) {
          return "push";
        } else if (pull > 0) {
          return "pull";
        } else if (off > 0) {
          return "off";
        } else {
          return "full";
        }
      default:
        // off
        if (
          lower > 0 &&
          ((totalLower >= totalPush && totalLower >= totalPull) ||
            (totalPush >= totalPull && totalPush - 1 <= totalLower) ||
            (totalPull >= totalPush && totalPull - 1 <= totalLower))
        ) {
          return "lower";
        } else if (upper > 0) {
          return "upper";
        } else if (totalPush >= totalPull && push > 0) {
          return "push";
        } else if (totalPull >= totalPush && pull > 0) {
          return "pull";
        } else if (full > 0) {
          return "full";
        } else {
          return "off";
        }
    }
  };

  let update_split: SessionDayType[] = [...split];

  let _doubles = numOfDoubles;
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

  for (let i = 0; i < split.length; i++) {
    let isTrainingDay = split[i].sessionNum > 0 ? true : false;
    let sessionOne = split[i].sessions[0];
    let sessiontwo = split[i].sessions[1];
    let prevSessionOne = split[i - 1]?.sessions[0];
    let prevSessionTwo = split[i - 1]?.sessions[1];

    let newCurrentSessionOne = prevSessionOne;
    let newCurrentSessionTwo = prevSessionTwo;

    if (isTrainingDay) {
      const newCurrentSessionOneValue = getNextSession(
        _doubles > 0 ? newCurrentSessionTwo : newCurrentSessionOne,
        counter.upper,
        counter.lower,
        counter.push,
        counter.pull,
        counter.full,
        counter.off,
        totalLower,
        totalPush,
        totalPull
      );
      counter = {
        ...counter,
        [newCurrentSessionOneValue]: counter[newCurrentSessionOneValue] - 1,
      };

      newCurrentSessionOne = newCurrentSessionOneValue;
      newCurrentSessionTwo = "off";

      if (_doubles > 0) {
        const newCurrentSessionTwoValue = getNextSession(
          newCurrentSessionOne,
          counter.upper,
          counter.lower,
          counter.push,
          counter.pull,
          counter.full,
          counter.off,
          totalLower,
          totalPush,
          totalPull
        );

        counter = {
          ...counter,
          [newCurrentSessionTwoValue]: counter[newCurrentSessionTwoValue] - 1,
        };

        newCurrentSessionTwo = newCurrentSessionTwoValue;
        _doubles--;
      } else {
        newCurrentSessionTwo = "off";
      }

      update_split[i] = {
        ...update_split[i],
        sessions: [newCurrentSessionOne, newCurrentSessionTwo],
      };
    }
    console.log(split, update_split, "IS THIS CHANGING???");
  }

  return update_split;
};

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

// const populateSplit = (
//   pushSessions: number,
//   pullSessions: number,
//   lowerSessions: number,
//   upperSessions: number,
//   fullSessions: number,
//   sessions: [number, number],
//   split: SessionDayType[]
// ): SessionDayType[] => {
//   let first_sessions = sessions[0];
//   let second_sessions = sessions[1];

//   let index = 0;

//   let newSplit = setSessionNums(first_sessions, split);
//   while (
//     pushSessions + pullSessions + lowerSessions + upperSessions + fullSessions >
//     0
//   ) {
//     if (first_sessions > 0) {
//       if (pullSessions > 0) {
//         split.push(["pull", "none"]);
//         pullSessions--;
//       } else if (pushSessions > 0) {
//         split.push(["push", "none"]);
//         pushSessions--;
//       } else if (upperSessions > 0) {
//         split.push(["upper", "none"]);
//         upperSessions--;
//       } else if (lowerSessions > 0) {
//         split.push(["lower", "none"]);
//         lowerSessions--;
//       } else if (fullSessions > 0) {
//         split.push(["full", "none"]);
//         fullSessions--;
//       }
//       first_sessions--;
//     } else if (second_sessions > 0) {
//       if (pullSessions > 0) {
//         split[index].splice(1, 1, "pull");
//         pullSessions--;
//         index++;
//       } else if (pushSessions > 0) {
//         split[index].splice(1, 1, "push");
//         pushSessions--;
//         index++;
//       } else if (upperSessions > 0) {
//         split[index].splice(1, 1, "upper");
//         upperSessions--;
//         index++;
//       } else if (lowerSessions > 0) {
//         split[index].splice(1, 1, "lower");
//         lowerSessions--;
//         index++;
//       } else if (fullSessions > 0) {
//         split[index].splice(1, 1, "full");
//         fullSessions--;
//         index++;
//       }
//       second_sessions--;
//     }
//   }
//   return split;
// };
