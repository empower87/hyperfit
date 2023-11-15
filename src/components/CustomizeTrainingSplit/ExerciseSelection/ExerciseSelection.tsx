import {
  ExerciseType,
  SessionDayType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import {
  BG_COLOR_M6,
  BORDER_COLOR_M6,
  BORDER_COLOR_M7,
  BORDER_COLOR_M8,
} from "~/utils/themes";

type DaySessionItemProps = {
  index: number;
  muscleGroup: string;
  exercise: string;
};
function DaySessionItem({ index, muscleGroup, exercise }: DaySessionItemProps) {
  return (
    <li className={" text-xxs mb-0.5 flex w-full text-white"}>
      <div className={" flex w-1/12 indent-1"}>{index}</div>
      <div className={BORDER_COLOR_M7 + " flex w-11/12 border-2"}>
        <div className={" w-1/4 overflow-ellipsis"}>{muscleGroup}</div>
        <div className={" w-3/4 overflow-ellipsis"}>{exercise}</div>
      </div>
    </li>
  );
}

type DaySessionListType = {
  split: SplitType;
  exercises: ExerciseType[][];
};
function DaySessionList({ split, exercises }: DaySessionListType) {
  const flattenExercises = exercises.flat();
  return (
    <div className=" w-52">
      <div className={" mb-1 p-1"}>
        <div
          className={
            getSessionSplitColor(split).bg + " indent-1 text-sm text-white"
          }
        >
          {split}
        </div>
      </div>

      <ul className=" w-full">
        {flattenExercises.map((each, index) => {
          return (
            <DaySessionItem
              index={index + 1}
              muscleGroup={each.group}
              exercise={each.exercise}
            />
          );
        })}
      </ul>
    </div>
  );
}

type DaySessionProps = {
  training_day: SessionDayType;
};
function DaySession({ training_day }: DaySessionProps) {
  const { day, sessions, sets } = training_day;

  return (
    <div className={BG_COLOR_M6 + " mr-1"}>
      <div className={BORDER_COLOR_M8 + " mb-1 border-b-2"}>
        <h3 className=" indent-1 text-white">{day}</h3>
      </div>

      <div className=" flex flex-col">
        {sessions.map((each, index) => {
          if (each === "off") return null;
          return <DaySessionList split={each} exercises={sets[index]} />;
        })}
      </div>
    </div>
  );
}

type WeekSessionsProps = {
  training_week: SessionDayType[];
};
export default function WeekSessions({ training_week }: WeekSessionsProps) {
  return (
    <div className={" flex flex-col"}>
      <div className={BORDER_COLOR_M6 + " mb-2 border-b-2"}>
        <h3 className=" text-white">Exercises</h3>
      </div>
      <div className="flex">
        {training_week.map((each) => {
          if (each.sessionNum === 0) return null;
          return <DaySession training_day={each} />;
        })}
      </div>
    </div>
  );
}
