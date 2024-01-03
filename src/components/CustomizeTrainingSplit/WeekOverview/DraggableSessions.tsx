import { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { BG_COLOR_M7 } from "~/constants/themes";
import {
  DayType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

type TrainingSplitProps = {
  training_week: TrainingDayType[];
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

function Week({ training_week }: TrainingSplitProps) {
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
      const sourceRemoved = items[outerSourceId][innerSourceId];
      const destinationRemoved = items[outerDestinationId][innerDestinationId];
      items[outerDestinationId][innerDestinationId] = sourceRemoved;
      items[outerSourceId][innerSourceId] = destinationRemoved;

      setDraggableWeek(items);
    },
    [draggableWeek]
  );

  return (
    <div className=" mb-1 flex flex-col overflow-x-auto">
      <TrainingSplitHeaders />

      <div className=" flex justify-evenly">
        <DragDropContext onDragEnd={onDragEnd}>
          {draggableWeek.map((each, index) => {
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
    </div>
  );
}
