import { ReactNode, useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { PlusIcon } from "~/assets/icons/_icons";
import { CardS } from "~/components/Layout/Sections";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BORDER_COLOR_M4,
  BORDER_COLOR_M7,
} from "~/constants/themes";
import {
  DayType,
  SessionType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import { Button } from "../MusclePriorityList/MusclePriorityList";
import SplitSelect from "./SplitSelect";

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

export function TrainingWeek() {
  const { training_week, handleRearrangeTrainingWeek } =
    useTrainingProgramContext();
  const [draggableWeek, setDraggableWeek] = useState<TrainingDayType[]>([]);

  useEffect(() => {
    setDraggableWeek(training_week);
  }, [training_week]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

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

    handleRearrangeTrainingWeek(draggableWeek);
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
    <div className={"p-1"}>
      <div className="mb-1 flex space-x-1 overflow-x-auto">
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
    </div>
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
    <div className={cn(`flex w-20 flex-col ${BG_COLOR_M5} rounded`)}>
      <div
        className={cn(
          `flex w-full justify-center p-1 text-xs font-bold text-white ${BORDER_COLOR_M7} border-b-2`
        )}
      >
        {day}
      </div>

      <div className={`flex flex-col space-y-1 p-1.5`}>
        <StrictModeDroppable droppableId={droppableId} type={"sessionx"}>
          {(provided, snapshot) => (
            <ul
              id="sessionx"
              className="flex w-full flex-col space-y-1"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sesh.map((each, index) => {
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
        <div className={`flex justify-center`}>
          <Button className={`${BG_COLOR_M6}`} onClick={() => {}}>
            <PlusIcon className={`fill-white`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

type SessionItemProps = {
  session: SessionType;
  index: number;
  onSplitChange: (newSplit: SplitType | "off", id: string) => void;
};
function SessionItem({ session, index, onSplitChange }: SessionItemProps) {
  const onSelectChange = (newSplit: SplitType | "off") => {
    onSplitChange(newSplit, session.id);
  };
  const bgColor = getSessionSplitColor(session.split).bg;

  const SPLIT_NAMES: (SplitType | "off")[] = [
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
      className={cn(`flex p-1 ${bgColor} space-x-1 rounded border-2`, {
        [`${BORDER_COLOR_M4}`]: session.split === ("off" as SplitType),
      })}
    >
      {/* <div className="flex w-4 items-center justify-center text-xxs text-white">
        x
      </div> */}

      <div className={`flex`}>
        <SelectSession
          session={session.split}
          splits={SPLIT_NAMES}
          onSelect={onSelectChange}
        />
      </div>
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
      className={"h-full w-full bg-inherit text-xxs font-bold text-white"}
      onChange={onSelectHandler}
    >
      {splits.map((split, index) => {
        return (
          <option
            key={`${split}_${index}`}
            className={`${BG_COLOR_M6} text-xxs font-bold text-white`}
            selected={split === session}
            value={split}
          >
            {split}
          </option>
        );
      })}
    </select>
  );
}

function Split() {
  return (
    <div className="flex items-center space-x-2 p-2 text-sm text-white">
      <div className={`text-xs text-slate-300`}>Choose A Training Split: </div>
      <SplitSelect />
    </div>
  );
}

SplitOverview.Split = Split;
SplitOverview.Week = TrainingWeek;

export default function SplitOverview({ children }: { children: ReactNode }) {
  return <CardS title="WORKOUT SPLIT">{children}</CardS>;
}