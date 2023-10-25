import { useEffect, useState } from "react";
import {
  DayType,
  MusclePriorityType,
  SessionDayType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getTrainingSplit } from "~/utils/getTrainingSplit";
import { BG_COLOR_M6, BG_COLOR_M7, BORDER_COLOR_M7 } from "~/utils/themes";

type WeekProps = {
  title: string;
  split: [SplitType, SplitType][];
};

const Cell = ({
  value,
  time,
}: {
  value: SplitType | "";
  time: "am: " | "pm: " | "";
}) => {
  const getColor = (
    split: "off" | "push" | "pull" | "upper" | "lower" | "full" | ""
  ) => {
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

const Week = ({ title, split }: WeekProps) => {
  let numOfOffDaysToAdd = 7 - split.length;

  let updateSplit = [...split];

  if (numOfOffDaysToAdd > 0) {
    let copySplit = [...split];

    for (let i = 0; i < numOfOffDaysToAdd; i++) {
      copySplit.push(["off", "off"]);
    }

    updateSplit = copySplit;
  }

  return (
    <div className={" m-1 flex flex-col"}>
      <p className="m-1 text-xs font-bold text-slate-300">{title}</p>

      <div className="flex">
        <Day session={updateSplit[0]} day={"Sunday"} />
        <Day session={updateSplit[1]} day={"Monday"} />
        <Day session={updateSplit[2]} day={"Tuesday"} />
        <Day session={updateSplit[3]} day={"Wednesday"} />
        <Day session={updateSplit[4]} day={"Thursday"} />
        <Day session={updateSplit[5]} day={"Friday"} />
        <Day session={updateSplit[6]} day={"Saturday"} />
      </div>
    </div>
  );
};

type TrainingSplitProps = {
  split: SessionDayType[];
  list: MusclePriorityType[];
  total_sessions: [number, number];
};

export default function TrainingSplit({
  split,
  list,
  total_sessions,
}: TrainingSplitProps) {
  const [hardCodedSessions, setHardCodedSessions] = useState<
    [SplitType, SplitType][]
  >([]);
  const [algorithmicSessions, setAlgorithmicSessions] = useState<
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

  useEffect(() => {
    const _list: [SplitType, SplitType][] = [];
    for (let i = 0; i < split.length; i++) {
      _list.push(split[i].sessions);
    }
    setAlgorithmicSessions(_list);
  }, [split]);

  return (
    <div className={BG_COLOR_M6 + " flex flex-col"}>
      <Week title="Hard Coded For Testing Purposes" split={hardCodedSessions} />
      <Week title="Feature Logic" split={algorithmicSessions} />
    </div>
  );
}
