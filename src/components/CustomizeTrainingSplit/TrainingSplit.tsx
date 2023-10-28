import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import {
  DayType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import { BG_COLOR_M6, BG_COLOR_M7, BORDER_COLOR_M7 } from "~/utils/themes";
import { StrictModeDroppable } from "../PrioritizeFocus";

type SessionListProps = {
  sessions: [SplitType, SplitType][];
};

function SessionList({ sessions }: SessionListProps) {
  const [flattenedSessions, setFlattenedSessions] = useState<
    { id: string; split: SplitType }[]
  >([]);
  const ids = [
    "s-1",
    "m-1",
    "t-1",
    "w-1",
    "th-1",
    "f-1",
    "sa-1",
    "s-2",
    "m-2",
    "t-2",
    "w-2",
    "th-2",
    "f-2",
    "sa-2",
  ];
  useEffect(() => {
    let earlySessions: { id: string; split: SplitType }[] = [];
    let lateSessions: { id: string; split: SplitType }[] = [];
    console.log(sessions, "WHAT??");

    for (let i = 0; i < sessions.length; i++) {
      earlySessions.push({ id: ids[i], split: sessions[i][0] });
      lateSessions.push({ id: ids[i + 7], split: sessions[i][0] });
    }
    const flattenedSessions: { id: string; split: SplitType }[] = [
      ...earlySessions,
      ...lateSessions,
    ];
    setFlattenedSessions(flattenedSessions);
  }, [sessions]);

  let count = 0;

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;
      const items = [...flattenedSessions];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);
      setFlattenedSessions(items);
    },
    [flattenedSessions]
  );
  return (
    // <ul className=" flex flex-wrap justify-evenly">
    //   {flattenedSessions.map((session, index) => {
    //     if (session !== "off") {
    //       count = count + 1;
    //     }
    //     return <SessionItem session={session} sessionNum={count} />;
    //   })}

    // </ul>

    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="droppable">
        {(provided, snapshot) => (
          <ul
            id="droppable"
            className=" flex flex-wrap justify-evenly"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {flattenedSessions.map((each, index) => {
              return (
                <Draggable
                  key={`${each}_${index}_TrainingSplitTest`}
                  draggableId={each.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SessionItem session={each} sessionNum={count} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}

type SessionItemProps = {
  session: { id: string; split: SplitType };
  sessionNum: number;
};

const SESSIONS_TEST: SplitType[] = [
  "upper",
  "lower",
  "full",
  "push",
  "pull",
  "off",
];

function SessionItem({ session, sessionNum }: SessionItemProps) {
  return (
    <li
      className={BORDER_COLOR_M7 + " mb-1 flex h-8 w-20 items-center border-2"}
    >
      <div className=" flex h-full w-1/6 flex-col items-center justify-center text-white">
        <div className=" text-xxs">#</div>
        {/* <div className=" h-1 w-1 font-bold">.</div>
        <div className=" h-1 w-1 font-bold">.</div> */}
      </div>
      <div className=" text-xxs w-1/6 text-white">
        {sessionNum > 0 ? sessionNum : ""}
      </div>
      <SelectSession session={session.split} splits={SESSIONS_TEST} />
    </li>
  );
}

type SelectSessionProps = {
  session: SplitType;
  splits: SplitType[];
};
function SelectSession({ session, splits }: SelectSessionProps) {
  return (
    <select
      className={
        getSessionSplitColor(session).text +
        " text-xxs w-4/6 font-bold " +
        BG_COLOR_M6
      }
    >
      {splits.map((split) => {
        return (
          <option key={split} selected={split === session ? true : false}>
            {split}
          </option>
        );
      })}
    </select>
  );
}

function TrainingSplitHeader({ day }: { day: DayType }) {
  return (
    <div
      className={BG_COLOR_M7 + " flex w-20 justify-center text-xs text-white"}
    >
      {day}
    </div>
  );
}

function TrainingSplitHeaders() {
  return (
    <div className=" mb-1 flex justify-evenly">
      <TrainingSplitHeader day="Sunday" />
      <TrainingSplitHeader day="Monday" />
      <TrainingSplitHeader day="Tuesday" />
      <TrainingSplitHeader day="Wednesday" />
      <TrainingSplitHeader day="Thursday" />
      <TrainingSplitHeader day="Friday" />
      <TrainingSplitHeader day="Saturday" />
    </div>
  );
}

type TrainingSplitProps = {
  sessions: [SplitType, SplitType][];
};

export default function TrainingSplitTest({ sessions }: TrainingSplitProps) {
  return (
    <div className=" flex flex-col">
      <TrainingSplitHeaders />
      <SessionList sessions={sessions} />
    </div>
  );
}
