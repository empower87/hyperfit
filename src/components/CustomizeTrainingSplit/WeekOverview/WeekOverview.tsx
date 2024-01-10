import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import Section from "~/components/Layout/Section";
import { BG_COLOR_M6, BG_COLOR_M7, BORDER_COLOR_M7 } from "~/constants/themes";
import {
  DayType,
  SessionType,
  SplitSessionsType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";

type TrainingSplitProps = {
  training_week: TrainingDayType[];
  onSplitReorder: (week: TrainingDayType[]) => void;
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
const getIndexOfDay = (droppableId: string) => {
  let index = 0;
  for (let i = 0; i < DAYS.length; i++) {
    if (DAYS[i] === droppableId) {
      index = i;
    }
  }
  return index;
};

export function TrainingWeek({
  training_week,
  onSplitReorder,
}: TrainingSplitProps) {
  const [draggableWeek, setDraggableWeek] = useState<TrainingDayType[]>([]);

  useEffect(() => {
    setDraggableWeek(training_week);
  }, [training_week]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      console.log(result, "drop result data");

      let outerDestinationId = 0;
      let outerSourceId = 0;

      let innerDestinationId = result.destination.index;
      let innerSourceId = result.source.index;

      outerDestinationId = getIndexOfDay(result.destination.droppableId);
      outerSourceId = getIndexOfDay(result.source.droppableId);

      const items = [...draggableWeek];
      const sourceRemoved = items[outerSourceId].sessions[innerSourceId];
      let destinationRemoved: SessionType;
      destinationRemoved =
        items[outerDestinationId].sessions[innerDestinationId];
      if (!destinationRemoved) {
        innerDestinationId--;
        destinationRemoved =
          items[outerDestinationId].sessions[innerDestinationId];
      }
      items[outerDestinationId].sessions[innerDestinationId] = sourceRemoved;
      items[outerSourceId].sessions[innerSourceId] = destinationRemoved;
      console.log(items, "WHAT THIS LOOK LIKE????");
      setDraggableWeek(items);
    },
    [draggableWeek]
  );

  const onSaveHandler = () => {
    // TODO: should do this filtering logic within REDUCER
    // const filteredWeek = draggableWeek.map((each) => {
    //   const sessions = each.sessions.filter(
    //     (ea) => ea.split !== ("off" as SplitType)
    //   );
    //   return { ...each, sessions: sessions };
    // });
    onSplitReorder(draggableWeek);
  };

  const onResetHandler = () => {
    setDraggableWeek(training_week);
  };

  const onSplitChange = (newSplit: SplitType | "off", id: string) => {
    const update_week = draggableWeek.map((day) => {
      const sessions: SessionType[] = day.sessions.map((session) => {
        if (session.id === id)
          return { ...session, split: newSplit as SplitType };
        else return session;
      });
      return { ...day, sessions: sessions };
    });
    setDraggableWeek(update_week);
  };

  return (
    <>
      <div className=" mb-1 flex overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          {draggableWeek.map((each, index) => {
            const day = DAYS[index];
            return (
              <DroppableDay
                key={`${each.day}_${index}`}
                day={day}
                droppableId={each.day}
                sessions={each.sessions}
                onSplitChange={onSplitChange}
              />
            );
          })}
        </DragDropContext>
      </div>

      <div className=" flex justify-start p-1">
        <button
          className=" mr-1 bg-slate-500 p-1 text-xs text-slate-700"
          onClick={onResetHandler}
        >
          reset
        </button>
        <button
          className="bg-rose-400 p-1 text-xs font-bold text-white"
          onClick={onSaveHandler}
        >
          save
        </button>
      </div>
    </>
  );
}

const DroppableDay = ({
  day,
  sessions,
  droppableId,
  onSplitChange,
}: {
  day: DayType;
  sessions: SessionType[];
  droppableId: string;
  onSplitChange: (newSplit: SplitType | "off", id: string) => void;
}) => {
  const offDay = {
    id: `${droppableId}_off_session`,
    split: "off",
    exercises: [],
  };
  const sesh = sessions;
  if (!sesh.length) {
    sesh.push(offDay as unknown as SessionType);
  }

  return (
    <div className="mr-2 flex w-20 flex-col">
      <div
        className={
          BG_COLOR_M7 + " mb-1 flex w-full justify-center text-xs text-white"
        }
      >
        {day}
      </div>

      <StrictModeDroppable droppableId={droppableId} type={"sessionx"}>
        {(provided, snapshot) => (
          <ul
            id="sessionx"
            className=" mr-1 flex w-full flex-col border-2 border-slate-500"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {sesh.map((each, index) => {
              console.log(each, "OK I THINK THERES NO ID HERE!");
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
                      <SessionItem
                        session={each}
                        index={index}
                        onSplitChange={onSplitChange}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </StrictModeDroppable>
    </div>
  );
};

type SessionItemProps = {
  session: SessionType;
  index: number;
  onSplitChange: (newSplit: SplitType | "off", id: string) => void;
};
function SessionItem({ session, index, onSplitChange }: SessionItemProps) {
  const bottomMargin = index === 0 ? "mb-1 " : " ";
  const onSelectChange = (newSplit: SplitType | "off") => {
    onSplitChange(newSplit, session.id);
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

  return (
    <li
      className={
        BORDER_COLOR_M7 + " flex h-8 items-center border-2 " + bottomMargin
      }
    >
      <div className=" text-xxs flex w-1/6 justify-center text-white">
        {/* {session.session > 0 ? session.session : ""} */}
      </div>
      <SelectSession
        session={session.split}
        splits={SESSIONS_TEST}
        onSelect={onSelectChange}
      />
    </li>
  );
}

type SelectSessionProps = {
  session: SplitType | "off";
  splits: (SplitType | "off")[];
  onSelect: (newSplit: SplitType | "off") => void;
};
function SelectSession({ session, splits, onSelect }: SelectSessionProps) {
  const onSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSplit = event.target.value as SplitType | "off";
    onSelect(newSplit);
  };
  return (
    <select
      className={
        getSessionSplitColor(session).text +
        " text-xxs w-4/6 font-bold " +
        BG_COLOR_M6
      }
      onChange={onSelectHandler}
    >
      {splits.map((split, index) => {
        return (
          <option
            key={`${split}_${index}`}
            selected={split === session ? true : false}
            value={split}
          >
            {split}
          </option>
        );
      })}
    </select>
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
    <Section title="Week Overview">
      <div className="mb-2 flex text-sm text-white">
        Split: {split_sessions.split}
      </div>
      <div className={BG_COLOR_M6 + " w-full p-2"}>
        <TrainingWeek
          training_week={training_week}
          onSplitReorder={onSplitReorder}
        />
      </div>
    </Section>
  );
}
