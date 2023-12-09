import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import {
  DayType,
  ExerciseType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getGroupList } from "~/utils/getExercises";
import { getRankColor } from "~/utils/getRankColor";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import StrictModeDroppable from "~/utils/react-beautiful-dnd/StrictModeDroppable";
import {
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M6,
  BORDER_COLOR_M7,
  BORDER_COLOR_M8,
} from "~/utils/themes";
import { canAddExerciseToSplit, getSplitOptions } from "./exerciseSelectUtils";

type PromptProps = {
  options: { name: string; list: string[] }[];
  isOpen: boolean;
  onClose: (split: string) => void;
};

// probably don't even need to prompt user for this, just automatically change it.
function Prompt({ options, isOpen, onClose }: PromptProps) {
  const root = document.getElementById("modal-body")!;

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className="absolute flex h-full w-full items-center justify-center"
      style={{ background: "#00000082" }}
    >
      <div className={BG_COLOR_M7 + " flex w-64 flex-col p-2"}>
        <div className=" text-xxs flex flex-col text-white">
          <div className=" mb-0.5 text-slate-300">
            Adding this Exercise to this day would change the Training Split for
            that day.
          </div>
          <div className=" mb-1">
            Please select the Split you want to change it to:
          </div>
        </div>

        <ul>
          {options.map((each, index) => {
            return (
              <li
                key={`${each.name}_${index}`}
                className={BG_COLOR_M6 + " flex text-sm text-white"}
                onClick={() => onClose(each.name)}
              >
                <div className=" mr-1 indent-1">{index + 1}</div>
                <div className=" ">{each.name}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>,
    root
  );
}

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
        <div className={BORDER_COLOR_M7 + " w-1/12 border-r-2"}>
          {exercise.sets}x
        </div>

        <div className=" flex w-11/12 flex-col">
          <select className={bgColor.bg + " truncate"}>
            {exercises.map((each) => {
              return (
                <option
                  selected={each.name === exercise.exercise ? true : false}
                >
                  {each.name}
                </option>
              );
            })}
          </select>

          <div
            className={
              BORDER_COLOR_M7 + " truncate border-t indent-1 text-slate-300"
            }
          >
            {exercise.group}
          </div>
        </div>
      </div>
    </li>
  );
}
// function DaySessionItem({ index, exercise }: DaySessionItemProps) {
//   const bgColor = getRankColor(exercise.rank);
//   const exercises = getGroupList(exercise.group);
//   return (
//     <li className={" text-xxs mb-0.5 flex w-full text-white"}>
//       <div className={" flex w-1/12 indent-1"}>{index}</div>

//       <div className={BORDER_COLOR_M7 + " flex w-11/12 border-2 " + bgColor.bg}>
//         <div
//           className={BORDER_COLOR_M7 + " w-3/12 truncate border-r-2 indent-1"}
//         >
//           {exercise.group}
//         </div>

//         <div className={BORDER_COLOR_M7 + " w-1/12 border-r-2"}>
//           {exercise.sets}x
//         </div>

//         <select className={bgColor.bg + " w-8/12 truncate"}>
//           {exercises.map((each) => {
//             return (
//               <option selected={each.name === exercise.exercise ? true : false}>
//                 {each.name}
//               </option>
//             );
//           })}
//         </select>
//       </div>
//     </li>
//   );
// }

type DroppableDayProps = {
  split: SplitType;
  droppableId: string;
  exercises: ExerciseType[];
};
function DroppableDay({ split, droppableId, exercises }: DroppableDayProps) {
  const totalSets = exercises.reduce((acc, prev) => acc + prev.sets, 0);
  const setDurationInSeconds = totalSets * 20;
  const setRestDurationInSeconds = totalSets * 120;
  const setDurationInMinutes = setDurationInSeconds / 60;
  const setRestDurationInMinutes = setRestDurationInSeconds / 60;
  const totalDuration = Math.round(
    setDurationInMinutes + setRestDurationInMinutes
  );

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
            {exercises.map((each, index) => {
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

      <div className=" mt-1 flex w-full flex-col">
        <div className=" text-xxs text-white">Total Est. Duration</div>
        <div className=" text-xxs text-white">{totalDuration}min</div>
      </div>
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
    exercises: ExerciseType[];
  }[];
};
type WeekSessionsProps = {
  training_week: TrainingDayType[];
};
export default function WeekSessions({ training_week }: WeekSessionsProps) {
  const [draggableExercisesObject, setDraggableExercisesObject] = useState<
    DraggableExercisesObjectType[]
  >([]);
  const [isModalPrompted, setIsModalPrompted] = useState<boolean>(false);
  const [modalOptions, setModalOptions] = useState<
    { name: string; list: string[] }[]
  >([]);
  const [updateSplit, setUpdateSplit] = useState<{
    id: string;
    oldSplit: string;
    newSplit: string;
  }>();

  useEffect(() => {
    let draggableExerciseList: DraggableExercisesObjectType[] = [];
    for (let i = 0; i < training_week.length; i++) {
      let day: DraggableExercisesObjectType = {
        day: training_week[i].day,
        sessions: [],
      };

      for (let j = 0; j < training_week[i].sessions.length; j++) {
        if (training_week[i].isTrainingDay) {
          day.sessions.push({
            id: `${training_week[i].day}_${j}`,
            split: training_week[i].sessions[j].split,
            exercises: training_week[i].sessions[j].exercises.flat(),
          });
        }
      }

      draggableExerciseList.push(day);
    }
    setDraggableExercisesObject(draggableExerciseList);
  }, [training_week]);

  // NOTE: a lot of logic missing here to determine if an exercise CAN move to another split
  //       as well as if it can should it change the split type?

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

      const sourceExercise =
        items[outerSourceId].sessions[outerSourceSessionId].exercises[
          innerSourceId
        ];
      const targetSplit =
        items[outerDestinationId].sessions[outerDestinationSessionId];
      const canAdd = canAddExerciseToSplit(
        sourceExercise.group,
        targetSplit.split
      );

      if (!canAdd) {
        const splitOptions = getSplitOptions(
          sourceExercise.group,
          targetSplit.split
        );
        setModalOptions(splitOptions);
        setUpdateSplit({
          id: targetSplit.id,
          oldSplit: targetSplit.split,
          newSplit: "",
        });
        setIsModalPrompted(true);
      }

      const [removed] = items[outerSourceId].sessions[
        outerSourceSessionId
      ].exercises.splice(innerSourceId, 1);

      items[outerDestinationId].sessions[
        outerDestinationSessionId
      ].exercises.splice(outerDestinationExerciseIndex, 0, removed);

      setDraggableExercisesObject(items);
    },
    [draggableExercisesObject]
  );

  // TODO: add settings UI.
  // REST TIME INTERVAL BTN,
  // RESET BTN, UNDO BTN, SAVE BTN

  const onCloseModal = (split: string) => {
    if (!updateSplit) return;

    const updateList: DraggableExercisesObjectType[] =
      draggableExercisesObject.map((each) => {
        const sessions = each.sessions.map((each) => {
          if (each.id === updateSplit.id) {
            return { ...each, split: split as SplitType };
          } else return each;
        });

        return { ...each, sessions: sessions };
      });

    setDraggableExercisesObject(updateList);
    setIsModalPrompted(false);
  };

  return (
    <div className={" flex flex-col"}>
      <div className={BORDER_COLOR_M6 + " mb-2 border-b-2"}>
        <h3 className=" text-white">Exercises</h3>
      </div>

      {isModalPrompted && (
        <Prompt
          options={modalOptions}
          isOpen={isModalPrompted}
          onClose={onCloseModal}
        />
      )}

      <div className=" text-xxs mb-2 flex text-white">
        <div className=" flex flex-col">
          <div className="mb-0.5">Calculate Duration</div>
          <div className=" flex">
            <div>Rest Period - </div>
            <div> 2:00</div>
          </div>
        </div>
      </div>

      <div className="flex">
        <DragDropContext onDragEnd={onDragEnd}>
          {draggableExercisesObject.map((each) => {
            // NOTE: to not display days w/o any sessions
            const hasSessions = each.sessions.find((ea) => ea.exercises.length);
            if (!hasSessions) return null;
            return <DayLayout session={each} />;
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
