import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import {
  DayType,
  SessionDayType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import { BG_COLOR_M6, BG_COLOR_M7, BORDER_COLOR_M7 } from "~/utils/themes";
import { StrictModeDroppable } from "../PrioritizeFocus";

type SessionListProps = {
  sessions: DraggableSplitObjectType[][];
};

const DROPPABLE_IDS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type DraggableSplitObjectType = {
  id: string;
  session: number;
  split: SplitType;
};

function SessionList({ sessions }: SessionListProps) {
  const [flattenedSessions, setFlattenedSessions] = useState<
    DraggableSplitObjectType[][]
  >([]);

  useEffect(() => {
    setFlattenedSessions(sessions);
  }, [sessions]);

  const onDragEnd = useCallback(
    (result: any) => {
      console.log(result, "OK WHAT ARE WE WORKING WITH ERE??");
      if (!result.destination) return;

      let outerDestinationId = 0;
      let outerSourceId = 0;

      let innerDestinationId = result.destination.index;
      let innerSourceId = result.source.index;

      const getOutterIndex = (droppableId: DayType) => {
        switch (droppableId) {
          case "Monday":
            return 1;
          case "Tuesday":
            return 2;
          case "Wednesday":
            return 3;
          case "Thursday":
            return 4;
          case "Friday":
            return 5;
          case "Saturday":
            return 6;
          default:
            return 0;
        }
      };

      outerDestinationId = getOutterIndex(result.destination.droppableId);
      outerSourceId = getOutterIndex(result.source.droppableId);

      const items = [...flattenedSessions];
      const sourceRemoved = items[outerSourceId][innerSourceId];
      const destinationRemoved = items[outerDestinationId][innerDestinationId];
      items[outerDestinationId][innerDestinationId] = sourceRemoved;
      items[outerSourceId][innerSourceId] = destinationRemoved;

      setFlattenedSessions(items);
    },
    [flattenedSessions]
  );

  return (
    <div className=" flex justify-evenly">
      <DragDropContext onDragEnd={onDragEnd}>
        {flattenedSessions.map((each, index) => {
          const droppable_id = DROPPABLE_IDS[index];
          return (
            <DroppableDay
              sessions={each}
              type={each[0].id.split("-")[0]}
              droppableId={droppable_id}
            />
          );
        })}
      </DragDropContext>
    </div>
  );
}

const DroppableDay = ({
  sessions,
  type,
  droppableId,
}: {
  sessions: DraggableSplitObjectType[];
  type: string;
  droppableId: string;
}) => {
  return (
    <StrictModeDroppable droppableId={droppableId} type={"day"}>
      {(provided, snapshot) => (
        <ul
          id="day"
          className=" flex flex-col"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {sessions.map((each, index) => {
            return (
              <Draggable key={`${each.id}`} draggableId={each.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <SessionItem session={each} index={index} />
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </ul>
      )}
    </StrictModeDroppable>
  );
};

type SessionItemProps = {
  session: DraggableSplitObjectType;
  index: number;
};

const SESSIONS_TEST: SplitType[] = [
  "upper",
  "lower",
  "full",
  "push",
  "pull",
  "off",
];

function SessionItem({ session, index }: SessionItemProps) {
  const bottomMargin = index === 0 ? "mb-1 " : " ";
  return (
    <li
      className={
        BORDER_COLOR_M7 + " flex h-8 w-20 items-center border-2 " + bottomMargin
      }
    >
      {/* <div className=" flex h-full w-1/6 flex-col items-center justify-center text-white">
        <div className=" text-xxs">#</div>
      </div> */}
      <div className=" text-xxs w-1/6 text-white">
        {session.session > 0 ? session.session : ""}
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
  split: SessionDayType[];
};

export default function TrainingSplitTest({
  sessions,
  split,
}: TrainingSplitProps) {
  const [draggableSplit, setDraggableSplit] = useState<
    DraggableSplitObjectType[][]
  >([]);

  useEffect(() => {
    const _list: DraggableSplitObjectType[][] = [];

    let count = 0;
    for (let i = 0; i < split.length; i++) {
      let split_one = split[i].sessions[0];
      let split_two = split[i].sessions[1];

      let noCount = false;

      if (split_one !== "off") {
        count++;
      } else {
        noCount = true;
      }

      let draggable_one = {
        id: `${split[i].sessionNum}_${split_one}_${1}`,
        session: noCount ? 0 : count,
        split: split_one,
      };

      noCount = false;

      if (split_two !== "off") {
        count++;
      } else {
        noCount = true;
      }

      let draggable_two = {
        id: `${split[i].sessionNum}_${split_two}_${2}`,
        session: noCount ? 0 : count,
        split: split_two,
      };

      const splits = [draggable_one, draggable_two];
      _list.push(splits);
    }

    setDraggableSplit(_list);
  }, [split]);

  // useEffect(() => {
  //   console.log(sessions, "WHAT??");

  //   let sesh: { id: string; session: number; split: SplitType }[][] = [];
  //   for (let i = 0; i < sessions.length; i++) {
  //     sesh.push([
  //       { id: DROPPABLE_IDS[i] + `-${i + 1}`, split: sessions[i][0] },
  //       { id: DROPPABLE_IDS[i] + `-${i + 1.5}`, split: sessions[i][0] },
  //     ]);
  //   }

  //   setFlattenedSessions(sesh);
  // }, [sessions]);
  return (
    <div className=" mb-1 flex flex-col">
      <TrainingSplitHeaders />
      <SessionList sessions={draggableSplit} />
    </div>
  );
}
