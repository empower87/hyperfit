import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import {
  DayType,
  ExerciseType,
  SessionDayType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getGroupList } from "~/utils/getExercises";
import { getRankColor } from "~/utils/getRankColor";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import StrictModeDroppable from "~/utils/react-beautiful-dnd/StrictModeDroppable";
import {
  BG_COLOR_M6,
  BORDER_COLOR_M6,
  BORDER_COLOR_M7,
  BORDER_COLOR_M8,
} from "~/utils/themes";

type DaySessionItemProps = {
  index: number;
  exercise: ExerciseType;
};
function DaySessionItem({ index, exercise }: DaySessionItemProps) {
  const bgColor = getRankColor(exercise.rank);
  const exercises = getGroupList(exercise.group);
  return (
    <li className={" text-xxs mb-0.5 flex w-full text-white"}>
      <div className={" flex w-1/12 indent-1"}>{index}</div>

      <div className={BORDER_COLOR_M7 + " flex w-11/12 border-2 " + bgColor.bg}>
        <div
          className={BORDER_COLOR_M7 + " w-3/12 truncate border-r-2 indent-1"}
        >
          {exercise.group}
        </div>

        <div className={BORDER_COLOR_M7 + " w-1/12 border-r-2"}>
          {exercise.sets}x
        </div>

        <select className={bgColor.bg + " w-8/12 truncate"}>
          {exercises.map((each) => {
            return (
              <option selected={each.name === exercise.exercise ? true : false}>
                {each.name}
              </option>
            );
          })}
        </select>
      </div>
    </li>
  );
}

type DroppableDayProps = {
  split: SplitType;
  droppableId: string;
  exercises: ExerciseType[][];
};
function DroppableDay({ split, droppableId, exercises }: DroppableDayProps) {
  const flattenExercises = exercises.flat();
  return (
    <li className=" w-52">
      <div className={" mb-1 p-1"}>
        <div
          className={
            getSessionSplitColor(split).bg + " indent-1 text-sm text-white"
          }
        >
          {split}
        </div>
      </div>

      <StrictModeDroppable droppableId={droppableId} type={"week"}>
        {(provided, snapshot) => (
          <ul
            id="week"
            className=" w-full"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {flattenExercises.map((each, index) => {
              return (
                <Draggable
                  key={`${each.id}`}
                  draggableId={each.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <DaySessionItem index={index + 1} exercise={each} />
                    </div>
                  )}
                </Draggable>
              );
            })}
          </ul>
        )}
      </StrictModeDroppable>
    </li>
  );
}

type DayLayoutProps = {
  session: DraggableExercisesObjectType;
};

function DayLayout({ session }: DayLayoutProps) {
  const { day, sessions } = session;

  return (
    <div className={BG_COLOR_M6 + " mr-1"}>
      <div className={BORDER_COLOR_M8 + " mb-1 border-b-2"}>
        <h3 className=" indent-1 text-white">{day}</h3>
      </div>

      <StrictModeDroppable droppableId={day} type={"session"}>
        {(provided, snapshot) => (
          <ul
            id="session"
            className=" flex flex-col"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {sessions.map((each, index) => {
              return (
                <DroppableDay
                  split={each.split}
                  droppableId={each.id}
                  exercises={each.exercises}
                />
              );
            })}
          </ul>
        )}
      </StrictModeDroppable>
    </div>
  );
}

type DraggableExercisesObjectType = {
  day: DayType;
  sessions: {
    id: string;
    split: SplitType;
    exercises: ExerciseType[][];
  }[];
};
type WeekSessionsProps = {
  training_week: SessionDayType[];
};
export default function WeekSessions({ training_week }: WeekSessionsProps) {
  const [draggableExercisesObject, setDraggableExercisesObject] = useState<
    DraggableExercisesObjectType[]
  >([]);

  useEffect(() => {
    let draggableExerciseList: DraggableExercisesObjectType[] = [];
    for (let i = 0; i < training_week.length; i++) {
      let day: DraggableExercisesObjectType = {
        day: training_week[i].day,
        sessions: [],
      };

      for (let j = 0; j < training_week[i].sessions.length; j++) {
        if (training_week[i].sessions[j] !== "off") {
          day.sessions.push({
            id: `${training_week[i].day}_${j}`,
            split: training_week[i].sessions[j],
            exercises: training_week[i].sets[j],
          });
        }
      }
      draggableExerciseList.push(day);
    }
    setDraggableExercisesObject(draggableExerciseList);
  }, [training_week]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      console.log(result, "OK WHAT ARE WE WORKING WITH ERE??");
      if (!result.destination) return;

      let outerDestinationId = 0;
      let outerDestinationSessionId = 0;
      let outerDestinationExerciseIndex = result.destination.index;

      let outerSourceId = 0;
      let outerSourceSessionId = 0;
      let innerSourceId = result.source.index;

      const getOutterIndex = (droppableId: string) => {
        const splitId = droppableId.split("_");
        const index = parseInt(splitId[1]);
        switch (splitId[0]) {
          case "Monday":
            return [1, index];
          case "Tuesday":
            return [2, index];
          case "Wednesday":
            return [3, index];
          case "Thursday":
            return [4, index];
          case "Friday":
            return [5, index];
          case "Saturday":
            return [6, index];
          default:
            return [0, index];
        }
      };

      const destIndices = getOutterIndex(result.destination.droppableId);
      outerDestinationId = destIndices[0];
      outerDestinationSessionId = destIndices[1];

      const sourceIndices = getOutterIndex(result.source.droppableId);
      outerSourceId = sourceIndices[0];
      outerSourceSessionId = sourceIndices[1];

      const items = [...draggableExercisesObject];
      const sourceRemoved =
        items[outerSourceId].sessions[outerSourceSessionId].exercises[
          innerSourceId
        ];
      const destinationRemoved =
        items[outerDestinationId].sessions[outerDestinationSessionId].exercises[
          outerDestinationExerciseIndex
        ];
      items[outerDestinationId].sessions[outerDestinationSessionId].exercises[
        outerDestinationExerciseIndex
      ] = sourceRemoved;
      items[outerSourceId].sessions[outerSourceSessionId].exercises[
        innerSourceId
      ] = destinationRemoved;

      setDraggableExercisesObject(items);
    },
    [draggableExercisesObject]
  );

  return (
    <div className={" flex flex-col"}>
      <div className={BORDER_COLOR_M6 + " mb-2 border-b-2"}>
        <h3 className=" text-white">Exercises</h3>
      </div>
      <div className="flex">
        <DragDropContext onDragEnd={onDragEnd}>
          {draggableExercisesObject.map((each) => {
            return <DayLayout session={each} />;
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
