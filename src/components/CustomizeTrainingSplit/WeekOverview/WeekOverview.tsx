import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import {
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M6,
  BORDER_COLOR_M7,
} from "~/constants/themes";
import {
  DayType,
  SplitSessionsType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import SplitOverview from "../Settings/SplitOverview";
import { TrainingWeek } from "./DraggableSessions";

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
  split: SplitType | "off";
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
      if (!result.destination) return;

      let outerDestinationId = 0;
      let outerSourceId = 0;

      let innerDestinationId = result.destination.index;
      let innerSourceId = result.source.index;

      const getOutterIndex = (droppableId: string) => {
        switch (droppableId) {
          case "Sunday":
            return 0;
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
          return (
            <DroppableDay
              key={`${each}${index}`}
              sessions={each}
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
              <Draggable
                key={`${each.id}_${index}_DroppableDay`}
                draggableId={each.id}
                index={index}
              >
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

const SESSIONS_TEST: (SplitType | "off")[] = [
  "upper",
  "lower",
  "full",
  "push",
  "pull",
  "legs",
  "back",
  "chest",
  "arms",
  "shoulders",
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
  session: SplitType | "off";
  splits: (SplitType | "off")[];
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
      {splits.map((split, index) => {
        return (
          <option
            key={`${split}_${index}`}
            selected={split === session ? true : false}
          >
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
  training_week: TrainingDayType[];
};

function Week({ training_week }: TrainingSplitProps) {
  const [draggableSplit, setDraggableSplit] = useState<
    DraggableSplitObjectType[][]
  >([]);

  useEffect(() => {
    const _list: DraggableSplitObjectType[][] = [];

    for (let i = 0; i < training_week.length; i++) {
      const splits: DraggableSplitObjectType[] = [];

      let draggable_obj: DraggableSplitObjectType = {
        id: `${training_week[i].day}_off_1`,
        session: 0,
        split: "off",
      };

      for (let j = 0; j < training_week[i].sessions.length; j++) {
        let split = training_week[i].sessions[j];
        draggable_obj = {
          id: `${training_week[i].day}_${split}_${1}`,
          session: j,
          split: split.split,
        };
        splits.push(draggable_obj);
      }

      if (!splits.length) {
        splits.push(draggable_obj);
      }
      _list.push(splits);
    }

    setDraggableSplit(_list);
  }, [training_week]);

  return (
    <div className=" mb-1 flex flex-col overflow-x-auto">
      <TrainingSplitHeaders />
      <SessionList sessions={draggableSplit} />
    </div>
  );
}

type WeekOverviewProps = {
  split_sessions: SplitSessionsType;
  training_week: TrainingDayType[];
  onSplitReorder: (week: TrainingDayType[]) => void;
};

export default function WeekOverview({
  split_sessions,
  training_week,
  onSplitReorder,
}: WeekOverviewProps) {
  return (
    <div className={" mb-2 flex"}>
      <div className=" flex w-1/4 flex-col pr-2">
        <div className={BORDER_COLOR_M6 + " mb-2 h-6 border-b-2"}>
          <h3 className=" indent-1 text-sm text-white">Week Overview</h3>
        </div>
        <SplitOverview split_sessions={split_sessions} />
      </div>

      <div className={BG_COLOR_M6 + " w-3/4 p-1"}>
        <TrainingWeek
          training_week={training_week}
          onSplitReorder={onSplitReorder}
        />
      </div>
    </div>
  );
}
