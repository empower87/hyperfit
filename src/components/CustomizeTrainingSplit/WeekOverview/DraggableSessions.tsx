import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { BG_COLOR_M6, BG_COLOR_M7, BORDER_COLOR_M7 } from "~/constants/themes";
import {
  DayType,
  SessionType,
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
      console.log(result, "am i getting here?");
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

      const items = [...draggableWeek];
      const sourceRemoved = items[outerSourceId].sessions[innerSourceId];
      const destinationRemoved =
        items[outerDestinationId].sessions[innerDestinationId];
      items[outerDestinationId].sessions[innerDestinationId] = sourceRemoved;
      items[outerSourceId].sessions[innerSourceId] = destinationRemoved;
      console.log(items, "WHAT THIS LOOK LIKE????");
      setDraggableWeek(items);
    },
    [draggableWeek]
  );

  const onSaveHandler = () => {
    // TODO: should do this filtering logic within REDUCER
    const filteredWeek = draggableWeek.map((each) => {
      const sessions = each.sessions.filter(
        (ea) => ea.split !== ("off" as SplitType)
      );
      return { ...each, sessions: sessions };
    });
    onSplitReorder(filteredWeek);
  };

  return (
    <>
      <div className=" mb-1 flex flex-col overflow-x-auto">
        <TrainingSplitHeaders />

        <div className=" flex justify-evenly">
          <DragDropContext onDragEnd={onDragEnd}>
            {draggableWeek.map((each, index) => {
              const droppable_id = DAYS[index];
              return (
                <DroppableDay
                  key={`${each.day}_${index}`}
                  droppableId={each.day}
                  sessions={each.sessions}
                />
              );
            })}
          </DragDropContext>
        </div>
      </div>
      <button onClick={onSaveHandler}>save</button>
    </>
  );
}

const DroppableDay = ({
  sessions,
  droppableId,
}: {
  sessions: SessionType[];
  droppableId: string;
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
    <StrictModeDroppable droppableId={droppableId} type={"sessionx"}>
      {(provided, snapshot) => (
        <ul
          id="sessionx"
          className=" mr-1 flex w-20 flex-col"
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

type SessionItemProps = {
  session: SessionType;
  index: number;
};
function SessionItem({ session, index }: SessionItemProps) {
  const bottomMargin = index === 0 ? "mb-1 " : " ";
  return (
    <li
      className={
        BORDER_COLOR_M7 + " flex h-8 items-center border-2 " + bottomMargin
      }
    >
      <div className=" text-xxs flex w-1/6 justify-center text-white">
        {/* {session.session > 0 ? session.session : ""} */}
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
