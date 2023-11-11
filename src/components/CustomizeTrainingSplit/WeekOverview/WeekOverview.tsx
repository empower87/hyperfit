import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { WeekTest } from "~/components/WeekOverviewTest";
import {
  DayType,
  MusclePriorityType,
  SessionDayType,
  SplitSessionsType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import StrictModeDroppable from "~/utils/react-beautiful-dnd/StrictModeDroppable";
import {
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M6,
  BORDER_COLOR_M7,
} from "~/utils/themes";
import SplitOverview from "../Settings/SplitOverview";

type SessionListProps = {
  sessions: DraggableSplitObjectType[][];
};

const DAYS: DayType[] = [
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
    (result: DropResult) => {
      console.log(result, "OK WHAT ARE WE WORKING WITH ERE??");
      if (!result.destination) return;

      let outerDestinationId = 0;
      let outerSourceId = 0;

      let innerDestinationId = result.destination.index;
      let innerSourceId = result.source.index;

      const getOutterIndex = (droppableId: string) => {
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
          const droppable_id = DAYS[index];
          return <DroppableDay sessions={each} droppableId={droppable_id} />;
        })}
      </DragDropContext>
    </div>
  );
}

const DroppableDay = ({
  sessions,
  droppableId,
}: {
  sessions: DraggableSplitObjectType[];
  droppableId: string;
}) => {
  return (
    <StrictModeDroppable droppableId={droppableId} type={"day"}>
      {(provided, snapshot) => (
        <ul
          id="day"
          className=" mr-1 flex w-20 flex-col"
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
        BORDER_COLOR_M7 + " flex h-8 items-center border-2 " + bottomMargin
      }
    >
      <div className=" text-xxs flex w-1/6 justify-center text-white">
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

function TrainingSplitHeaders() {
  return (
    <div className=" mb-1 flex justify-evenly">
      {DAYS.map((day, index) => {
        return (
          <div
            key={`${day}_${index}`}
            className={
              BG_COLOR_M7 + " flex w-20 justify-center text-xs text-white"
            }
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}

type TrainingSplitProps = {
  split: SessionDayType[];
};

function Week({ split }: TrainingSplitProps) {
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

  return (
    <div className=" mb-1 flex flex-col overflow-x-auto">
      <TrainingSplitHeaders />
      <SessionList sessions={draggableSplit} />
    </div>
  );
}

type WeekOverviewProps = {
  split_sessions: SplitSessionsType;
  training_week: SessionDayType[];
  list: MusclePriorityType[];
  total_sessions: [number, number];
};

export default function WeekOverview({
  split_sessions,
  training_week,
  list,
  total_sessions,
}: WeekOverviewProps) {
  return (
    <div className={" flex"}>
      <div className=" flex w-1/4 flex-col pr-2">
        <div className={BORDER_COLOR_M6 + " mb-2 h-6 border-b-2"}>
          <h3 className=" indent-1 text-sm text-white">Week Overview</h3>
        </div>

        <SplitOverview split={split_sessions} />
      </div>
      <div className={BG_COLOR_M6 + " w-3/4 p-1"}>
        <WeekTest
          title="Hard Coded For Testing Purposes"
          list={list}
          total_sessions={total_sessions}
        />
        {/* <Week title="Feature Logic" split={algorithmicSessions} /> */}
        <Week split={training_week} />
      </div>
    </div>
  );
}
