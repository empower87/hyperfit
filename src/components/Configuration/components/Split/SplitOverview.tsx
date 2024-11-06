import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { ReactNode, useCallback } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { CardS } from "~/components/Layout/Sections";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  DayType,
  SessionType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { cn } from "~/lib/clsx";
import StrictModeDroppable from "~/lib/react-beautiful-dnd/StrictModeDroppable";
import { getSplitColor } from "~/utils/getIndicatorColors";
import { capitalizeFirstCharInString } from "~/utils/uiHelpers";
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
  const {
    trainingWeek: training_week,
    trainingBlock,
    onRearrangedWeek,
  } = useProgramConfigContext();
  const trainingWeek = trainingBlock[trainingBlock.length - 1];
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
    <div className="flex space-x-2">
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
    <div className={cn(`flex flex-col rounded-md`)}>
      <div
        className={`flex w-full justify-center pb-3 pt-0 text-xs font-semibold text-muted-foreground`}
      >
        {day}
      </div>

      <div className={`flex flex-col`}>
        <StrictModeDroppable droppableId={droppableId} type={"sessionx"}>
          {(provided, snapshot) => (
            <ul
              id="sessionx"
              className="min-w-20 flex h-10 w-24 flex-col space-y-1 rounded-md border border-dashed border-input p-1"
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
                            className={`flex items-center justify-start `}
                          >
                            <DragHandleDots2Icon fill="white" />
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

  if (session.split === "off") return null;
  return (
    <li className={cn(`flex rounded-sm border border-white ${bgColor} py-1`)}>
      {children}
      <div className={`relative flex text-xxs text-white`}>
        <Select onValueChange={onSelectChange}>
          <SelectTrigger className="h-5 w-16 border-none px-1.5">
            <SelectValue
              placeholder={capitalizeFirstCharInString(session.split)}
            />
          </SelectTrigger>

          <SelectContent>
            {SPLIT_NAMES.map((split, index) => {
              return (
                <SelectItem value={split}>
                  {capitalizeFirstCharInString(split)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </li>
  );
}

export function Split() {
  return (
    <div className="flex flex-col items-center space-x-2 text-sm text-white">
      <SplitSelect />
    </div>
  );
}

SplitOverview.SplitSelect = Split;
SplitOverview.SplitWeek = TrainingWeek;

export default function SplitOverview({ children }: { children: ReactNode }) {
  return <CardS title="WORKOUT SPLIT">{children}</CardS>;
}
// export default function SplitOverview({ children }: { children: ReactNode }) {
//   return <CardS title="WORKOUT SPLIT">{children}</CardS>;
// }
