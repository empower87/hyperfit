import { useEffect, useState } from "react";
import { BG_COLOR_M7, BORDER_COLOR_M7 } from "~/constants/themes";
import {
  DayType,
  MusclePriorityType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getTrainingSplit } from "~/z-unused/getTrainingSplit";

const Cell = ({
  value,
  time,
}: {
  value: SplitType | "off" | "";
  time: "am: " | "pm: " | "";
}) => {
  const getColor = (split: SplitType | "off" | "") => {
    switch (split) {
      case "off":
        return "text-slate-400";
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
    <div className="ml-1 flex " style={{ height: "20px" }}>
      <p
        className={getColor(value) + " font-bold"}
        style={{ fontSize: "10px" }}
      >
        <span className=" font-normal text-white">{time}</span>
        {value}
      </p>
    </div>
  );
};

const Day = ({
  session,
  day,
}: {
  session: [SplitType, SplitType];
  day: DayType;
}) => {
  const isOffDay =
    session.length && session[0] === "off" && session[1] === "off"
      ? true
      : false;
  const isSingleSession =
    session.length && session.includes("off") ? true : false;

  return (
    <div
      className={BORDER_COLOR_M7 + " mr-1 flex flex-col border-2"}
      style={{ width: "80px" }}
    >
      <div className={BG_COLOR_M7 + " flex"} style={{ height: "20px" }}>
        <p className="text-bold ml-1 text-xs text-white">{day}</p>
      </div>

      {isOffDay ? (
        <>
          <Cell value={session[0]} time={""} />
          <Cell value={""} time={""} />
        </>
      ) : isSingleSession && session[0] !== "off" ? (
        <>
          <Cell value={session[0]} time={""} />
          <Cell value={""} time={""} />
        </>
      ) : isSingleSession && session[1] !== "off" ? (
        <>
          <Cell value={""} time={""} />
          <Cell value={session[1]} time={""} />
        </>
      ) : (
        <>
          <Cell value={session[0]} time={"am: "} />
          <Cell value={session[1]} time={"pm: "} />
        </>
      )}
    </div>
  );
};

type WeekProps = {
  title: string;
  list: MusclePriorityType[];
  total_sessions: [number, number];
};

export const WeekTest = ({ title, list, total_sessions }: WeekProps) => {
  const [hardCodedSessions, setHardCodedSessions] = useState<
    [SplitType, SplitType][]
  >([]);

  useEffect(() => {
    const hardCodedSessions = getTrainingSplit(
      list,
      total_sessions[0],
      total_sessions[1]
    );
    setHardCodedSessions(hardCodedSessions);
  }, [list, total_sessions]);

  const DAYS: DayType[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className={" mb-1 flex flex-col"}>
      <p className="m-1 text-xs font-bold text-slate-300">{title}</p>

      <div className="flex">
        {hardCodedSessions.map((splits, index) => {
          return <Day session={splits} day={DAYS[index]} />;
        })}
      </div>
    </div>
  );
};
