import { ReactNode, useCallback } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { DragHandleIcon } from "~/assets/icons/_icons";
import { CardS } from "~/components/Layout/Sections";
import {
  DayType,
  SessionType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getSplitColor } from "~/utils/getIndicatorColors";
import { useProgramConfigContext } from "../../hooks/useProgramConfig";
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
  const { trainingWeek, onRearrangedWeek } = useProgramConfigContext();
  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      let outerDestinationId = 0;
      let outerSourceId = 0;

      let innerDestinationId = result.destination.index;
      const innerSourceId = result.source.index;

      outerDestinationId = getIndexOfDay(result.destination.droppableId);
      outerSourceId = getIndexOfDay(result.source.droppableId);

      const items = [...trainingWeek];
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

      onRearrangedWeek(items);
    },
    [trainingWeek]
  );

  const onSplitChange = (newSplit: SplitType | "off", id: string) => {
    const update_week = trainingWeek.map((day) => {
      const sessions: SessionType[] = day.sessions.map((session) => {
        if (session.id === id)
          return { ...session, split: newSplit as SplitType };
        else return session;
      });
      return { ...day, sessions: sessions };
    });
    onRearrangedWeek(update_week);
  };

  return (
    <div className={"p-1"}>
      <div className="mb-1 flex space-x-1 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          {trainingWeek?.map((each, index) => {
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
  return (
    <div className={cn(`flex flex-col rounded bg-primary-500`)}>
      <div
        className={cn(
          `flex w-full justify-center border-b-2 border-primary-700 p-1 text-xs font-bold text-white`
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
              {sessions.map((each, index) => {
                return (
                  <Draggable
                    key={`${each.id}_${index}_DroppableDay`}
                    draggableId={each.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <SessionItem
                          session={each}
                          onSplitChange={onSplitChange}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className={`flex items-center justify-start`}
                          >
                            <DragHandleIcon fill="white" />
                          </div>
                        </SessionItem>
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
    </div>
  );
};

type SessionItemProps = {
  session: SessionType;
  onSplitChange: (newSplit: SplitType | "off", id: string) => void;
  children?: ReactNode;
};
function SessionItem({ session, onSplitChange, children }: SessionItemProps) {
  const onSelectChange = (newSplit: SplitType | "off") => {
    onSplitChange(newSplit, session.id);
  };
  const bgColor = getSplitColor(session.split).bg;

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
      className={cn(
        `flex py-1 ${bgColor} rounded border-2 focus-within:border-rose-400`,
        {
          [`border-primary-400`]: session.split === ("off" as SplitType),
        }
      )}
    >
      {children}
      <div className={`relative flex w-14 text-xxs text-white`}>
        {session.split === "off" ? (
          <div className="h-full w-full bg-inherit py-0.5 indent-2 text-xxs font-bold text-white">
            off
          </div>
        ) : (
          <SelectSession
            session={session.split}
            splits={SPLIT_NAMES}
            onSelect={onSelectChange}
          />
        )}
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
      className={
        "h-full w-full bg-inherit py-0.5 text-xxs font-bold text-white outline-none"
      }
      onChange={onSelectHandler}
    >
      {splits.map((split, index) => {
        return (
          <option
            key={`${split}_${index}`}
            className={`bg-primary-700 p-1 text-xxs font-bold text-white`}
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

SplitOverview.SplitSelect = Split;
SplitOverview.SplitWeek = TrainingWeek;

export default function SplitOverview({ children }: { children: ReactNode }) {
  return <CardS title="WORKOUT SPLIT">{children}</CardS>;
}
