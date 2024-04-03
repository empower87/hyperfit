import {
  determineSplitHandler,
  redistributeSessionsIntoNewSplit,
} from "../reducer/splitSessionsHandler";
import {
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
      const sessions = each.sessions.map((ea) => ea.split);
      const noOffSessions = sessions.filter((each) => each !== "off");
      return noOffSessions;
    })
    .flat();

  const getSplit = determineSplitHandler(splits);
  const split_change = getSplit.includes(split_sessions.split);

  const new_sessions = redistributeSessionsIntoNewSplit(getSplit[0], splits);

  console.log(
    splits,
    new_sessions,
    "what this look like? lets just have a looksie"
  );

  const filteredWeek = rearranged_week.map((each) => {
    const sessions = each.sessions.filter((ea) => ea.split !== "off");
    return {
      ...each,
      sessions: sessions,
    };
  });

  return filteredWeek;
};
