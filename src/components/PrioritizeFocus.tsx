import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProps,
} from "react-beautiful-dnd";
import {
  SessionSplitType,
  featureTest,
  getTrainingSplit,
} from "src/utils/distributeSets";
import { MEV_RANK, MRV_RANK } from "~/constants/prioritizeRanks";
import { UPPER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType, SessionType } from "~/pages";
import { getMuscleData } from "~/utils/getMuscleData";

type PrioritizeFocusProps = {
  totalWorkouts: number;
  musclePriority: MusclePriorityType[];
  setMusclePriority: Dispatch<SetStateAction<MusclePriorityType[]>>;
  setWorkoutSplit: Dispatch<SetStateAction<SessionType[]>>;
};

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

export default function PrioritizeFocus({
  totalWorkouts,
  musclePriority,
  setMusclePriority,
  setWorkoutSplit,
}: PrioritizeFocusProps) {
  const [newList, setNewList] = useState<MusclePriorityType[]>([
    ...musclePriority,
  ]);

  const getMesoProgression = (sessions: number) => {
    switch (sessions) {
      case 5:
        return [3, 4, 5];
      case 4:
        return [2, 3, 4];
      case 3:
        return [2, 3, 3];
      case 2:
        return [1, 2, 2];
      case 1:
        return [1, 1, 1];
      default:
        return [0, 0, 0];
    }
  };

  const updateMuscleListSets = (
    items: MusclePriorityType[],
    split: SessionSplitType[]
  ) => {
    let upper = split.filter((each) => each !== "lower");
    let lower = split.filter((each) => each !== "upper");

    for (let i = 0; i < items.length; i++) {
      const muscleData = getMuscleData(items[i].muscle);
      const { featureMatrix } = muscleData;

      let rank = i < MRV_RANK ? 0 : i >= MRV_RANK && i < MEV_RANK ? 1 : 2;

      let sessions = lower.length;
      if (UPPER_MUSCLES.includes(items[i].muscle)) {
        sessions = upper.length;
      }

      console.log(upper, lower, sessions, muscleData.name, "OK WHAT??");

      if (rank === 0) {
        items[i].mesoProgression = getMesoProgression(sessions);
      } else if (rank === 1) {
        if (sessions <= 2) items[i].mesoProgression = [1, 2, 2];
        else if (
          items[i].muscle === "back" ||
          items[i].muscle === "quads" ||
          items[i].muscle === "calves"
        ) {
          items[i].mesoProgression = [2, 3, 3];
        }
      } else {
        if (sessions <= 1) items[i].mesoProgression = [1, 1, 1];
        else if (
          items[i].muscle === "back" ||
          items[i].muscle === "quads" ||
          items[i].muscle === "calves"
        ) {
          items[i].mesoProgression = [1, 2, 2];
        }
      }

      const sets = featureMatrix[rank];

      items[i].sets = sets;
    }
    return items;
  };

  useEffect(() => {
    const split = getTrainingSplit(newList, totalWorkouts);
    const getNewList = updateMuscleListSets(musclePriority, split);
    console.log(split, getNewList, "USE EFFECT IN PRIORITIZE FOCUS");
    setNewList(getNewList);
  }, [totalWorkouts, musclePriority, newList]);

  useEffect(() => {
    const split = getTrainingSplit(newList, totalWorkouts);
    const testSplit = featureTest(newList, split);
    setWorkoutSplit(testSplit);
  }, [newList, totalWorkouts]);

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) return;
      const items = [...newList];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      const split = getTrainingSplit(items, totalWorkouts);
      const newerList = updateMuscleListSets(items, split);
      setMusclePriority(newerList);

      const testSplit = featureTest(items, split);
      setWorkoutSplit(testSplit);
    },
    [newList, totalWorkouts]
  );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="droppable">
          {(provided, snapshot) => (
            <ul
              id="droppable"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {newList.map((each, index) => {
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
                        <Muscle
                          muscle={each.muscle}
                          sets={each.sets[0]}
                          index={index}
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
      </DragDropContext>

      <div className="flex w-full items-center justify-center">
        {/* --- not sure -- */}
      </div>
    </>
  );
}

const Muscle = ({
  muscle,
  sets,
  index,
}: {
  muscle: string;
  sets: number;
  index: number;
}) => {
  const bgColor =
    index < MRV_RANK
      ? "bg-red-500"
      : index >= MRV_RANK && index < MEV_RANK
      ? "bg-orange-400"
      : "bg-green-400";
  return (
    <li
      className={
        "mt-1 flex justify-between rounded border-2 border-slate-700 p-1 text-xs text-white " +
        bgColor
      }
    >
      <div>{index + 1}</div>
      <div className="font-bold">{muscle}</div>
      <div className="font-bold">{sets}</div>
    </li>
  );
};
