import { useEffect, useState } from "react";
import {
  MusclePriorityType,
  SessionDayType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getTrainingSplit } from "~/utils/getTrainingSplit";

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
  const [updateSplit, setUpdateSplit] = useState<[SplitType, SplitType][]>([]);

  useEffect(() => {
    let numOfOffDaysToAdd = 7 - split.length;
    if (numOfOffDaysToAdd > 0) {
      let copySplit = [...split];

      for (let i = 0; i < numOfOffDaysToAdd; i++) {
        copySplit.push(["off", "off"]);
      }
      setUpdateSplit(copySplit);
    } else {
      setUpdateSplit(split);
    }
  }, [split]);

  return (
    <div className={margin ? margin : "" + " flex flex-col"}>
      <p className="text-xs font-bold">{title}</p>
      <div className="flex border border-slate-500">
        {updateSplit.map((each, index) => {
          return (
            <TestingCard
              key={`${each[0]}_${each[1]}_${index}`}
              session={each}
              index={index + 1}
            />
          );
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
  const isOffDay =
    session.length && session[0] === "off" && session[1] === "off"
      ? true
      : false;
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

type TestingWeeklySplitProps = {
  split: SessionDayType[];
  list: MusclePriorityType[];
  total_sessions: [number, number];
};
export default function TestingWeeklySplit({
  split,
  list,
  total_sessions,
}: TestingWeeklySplitProps) {
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
    <div className="m-2 rounded border border-slate-500 bg-gray-100 p-2">
      <TestingAlgorithmUI
        title="Hard Coded Sessions"
        split={hardCodedSessions}
        margin={"mb-2"}
      />
      <TestingAlgorithmUI
        title="Algorithmic Coded Sessions"
        split={algorithmicSessions}
      />
    </div>
  );
}
