import {
  determineSplitHandler,
  redistributeSessionsIntoNewSplit,
} from "../reducer/splitSessionHandler";
import {
  SplitSessionsSplitsType,
  SplitSessionsType,
  TrainingDayType,
} from "../reducer/trainingProgramReducer";

export const isTrainingDay = (training_day: TrainingDayType) => {
  const session_splits = training_day.sessions.map((ea) => ea.split !== "off");
  if (session_splits.length) return true;
  return false;
};

export const onRearrangeTrainingWeek = (
  rearranged_week: TrainingDayType[],
  split_sessions: SplitSessionsType
) => {
  const splits = rearranged_week
    .map((each) => {
      console.log(each.sessions, "BUT WHY?");
      const sessions = each.sessions.map((ea) => ea.split);
      const noOffSessions = sessions.filter((each) => each !== "off");
      return noOffSessions;
    })
    .flat();

  const getSplit = determineSplitHandler(splits);
  const split_change = getSplit.includes(split_sessions.split);

  const new_sessions = redistributeSessionsIntoNewSplit(getSplit[0], splits);

  const filteredWeek = rearranged_week.map((each) => {
    const sessions = each.sessions.filter((ea) => ea.split !== "off");
    return {
      ...each,
      sessions: sessions,
    };
  });

  return rearranged_week;
};

const THREE = ["lower", "legs", "back", "chest"];
const TWO = ["upper", "pull", "push", "full"];
const ONE = ["arms", "shoulders"];

const INITIAL_WEEK = [0, 0, 0, 0, 0, 0, 0];

const distributeSessions = (sessions: SplitSessionsSplitsType) => {
  let three = [];
  let two = [];
  let one = [];
  let off = [];

  for (const key in sessions) {
    const value: number = sessions[key as keyof SplitSessionsSplitsType];
    if (THREE.includes(key)) {
      for (let i = 0; i < value; i++) {
        three.push(key);
      }
    }
    if (TWO.includes(key)) {
      for (let i = 0; i < value; i++) {
        two.push(key);
      }
    }
    if (ONE.includes(key)) {
      for (let i = 0; i < value; i++) {
        one.push(key);
      }
    }
  }

  const offDays = 7 - (three.length + two.length + one.length);
  for (let i = 0; i < offDays; i++) {
    off.push("off");
  }
  return {
    three: three,
    two: two,
    one: one,
    off: off,
  };
};
// -- 0  1  2  3  4  5  6
// -- 1  0  1  0  1  0  0

// -- 1  0  1  0  1  0  1
// -- 1.4 2.8  4.2  5.6  7

// -- [7 / 6 = 1.2] 1.2 2.4 3.6 4.8 6 7.2 = 1 2 4 5 6 7 = 1 1 0 1 1 1 1
// -- [7 / 5 = 1.4]                                       1 0 1 1 0 1 1
// -- [7 / 4 = 1.75] 1.75  3.5 5.25 7 --- 2 4 5 7 =       0 1 0 1 1 0 1
// -- [7 / 3 = 2.33] 2.33 4.66 6.99   --- 2 5 7   =       0 0 1 0 1 0 1
// -- [7 / 1 = 7  ] 7                                     0 0 0 0 0 0 1
// -- [7 / 2 = 3.5] 3.5 7                                 0 0 0 1 0 0 1
// -- [5 / 3 = 1.7] 1.7 3.4 5.1 2 3 5                     0 1 1 1 1 0 1
// --
const getArrangedSplit = (sessions: SplitSessionsSplitsType) => {
  let number_split: number[] = [...INITIAL_WEEK];
  let arranged_split: (number | string)[] = [...INITIAL_WEEK];

  let { three, two, one, off } = distributeSessions(sessions);

  // initialize array with level threes distributed as evenly as possible
  const restPeriod = parseFloat((7 / three.length).toFixed(2));
  let currentTotal = 0;
  for (let i = 0; i < three.length; i++) {
    currentTotal = currentTotal + restPeriod;
    const roundedTotal = Math.round(currentTotal);
    const targetIndex = roundedTotal - 1;
    number_split[targetIndex] = 3;
    arranged_split[targetIndex] = three[i];
  }

  // 0 1 2 3 4 5 6
  for (let j = 0; j < number_split.length; j++) {
    let first = j;
    let last = number_split.length - 1 - j;
  }

  while (three.length + two.length + one.length + off.length > 0) {
    // divide 7 by total sessions
    // loop over sessions and add above + itself and round to get indices
    // distribute indices ie. [0, 1, 0, 1, 1, 0, 1]

    for (let i = 0; i < number_split.length; i++) {
      let left = i - 1;
      let right = i + 1;
    }

    if (three.length) {
    }
  }
};
