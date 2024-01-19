import { useCallback, useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import {
  ExerciseType,
  SessionType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { canAddExerciseToSplit, findOptimalSplit } from "./exerciseSelectUtils";

type DraggableSessionType = Pick<SessionType, "id" | "split"> & {
  exercises: ExerciseType[];
};
export type DraggableExercises = Pick<
  TrainingDayType,
  "day" | "isTrainingDay"
> & {
  sessions: DraggableSessionType[];
};

export default function useExerciseSelection(training_week: TrainingDayType[]) {
  const [draggableExercises, setDraggableExercises] = useState<
    DraggableExercises[]
  >([]);
  const [supersets, setSupersets] = useState<[string, string][]>([]);

  const [modalOptions, setModalOptions] = useState<{
    id: string;
    options: SplitType[];
    isOpen: boolean;
  }>();

  useEffect(() => {
    const draggableExercises: DraggableExercises[] = training_week.map(
      (each) => {
        const sessions = each.sessions.map((e, i) => ({
          ...e,
          id: `${each.day}_${i}`,
          exercises: e.exercises.flat(),
        }));
        return { ...each, sessions: sessions };
      }
    );
    setDraggableExercises(draggableExercises);
  }, [training_week]);

  const onSplitChange = useCallback((sessionId: string, split: SplitType) => {
    const updatedSplitForExercises = draggableExercises.map((each) => {
      const sessions = each.sessions.map((each) => {
        if (each.id === sessionId) {
          return { ...each, split: split };
        } else return each;
      });

      return { ...each, sessions: sessions };
    });

    setDraggableExercises(updatedSplitForExercises);
  }, []);

  /// not working correctly, returning empty array
  const onSupersetUpdate = (
    exerciseOne: ExerciseType,
    exerciseTwo: ExerciseType,
    sessionId: string
  ) => {
    let indexOne = 0;
    let indexTwo = 0;

    let _exercises: ExerciseType[] = [];

    for (let i = 0; i < draggableExercises.length; i++) {
      const session = draggableExercises[i].sessions.find((each) => {
        return each.id === sessionId;
      });
      if (!session) continue;
      _exercises = session.exercises;
    }

    let newSupersets: [string, string][] = [];
    for (let j = 0; j < supersets.length; j++) {
      const each = supersets[j];
      if (each[0] === exerciseOne.id) {
        newSupersets.push([each[0], exerciseTwo.id]);
      } else if (each[0] === exerciseTwo.id) {
        newSupersets.push([each[0], exerciseOne.id]);
      } else if (each[1] === exerciseOne.id) {
        newSupersets.push([exerciseTwo.id, each[1]]);
      } else if (each[1] === exerciseTwo.id) {
        newSupersets.push([exerciseOne.id, each[1]]);
      } else {
        newSupersets.push(each);
      }
    }
    console.log(newSupersets, "OK THIS SHOULD WORK??");
    setSupersets(newSupersets);
    // const _exercises = structuredClone(getExercises);
    // if (!_exercises) return;
    const newList = _exercises.map((each, index) => {
      if (each.id === exerciseOne.id) {
        indexOne = index;
        return { ...each, supersetWith: exerciseTwo.id };
      } else if (each.id === exerciseTwo.id) {
        indexTwo = index;
        return { ...each, supersetWith: exerciseOne.id };
      } else return each;
    });

    if (indexOne > indexTwo) {
      const temp = indexOne;
      indexOne = indexTwo;
      indexTwo = temp;
    }

    // const newNewList = sortListOnSuperset(newList);
    // const supersetExercises = newList.splice(indexTwo, 1);
    // newList.splice(indexOne + 1, 0, ...supersetExercises);

    const updateList = draggableExercises.map((each) => {
      const sessions = each.sessions.map((each) => {
        if (each.id === sessionId) {
          return { ...each, exercises: newList };
        } else return each;
      });
      return { ...each, sessions: sessions };
    });

    // setSupersets([...supersets, [exerciseOne.id, exerciseTwo.id]]);
    setDraggableExercises(updateList);
  };

  const getInnerAndOuterIndices = (droppableId: string) => {
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    let outerDestinationId = 0;
    let outerDestinationSessionId = 0;
    let outerDestinationExerciseIndex = result.destination.index;

    let outerSourceId = 0;
    let outerSourceSessionId = 0;
    let innerSourceId = result.source.index;

    const destIndices = getInnerAndOuterIndices(result.destination.droppableId);
    outerDestinationId = destIndices[0];
    outerDestinationSessionId = destIndices[1];

    const sourceIndices = getInnerAndOuterIndices(result.source.droppableId);
    outerSourceId = sourceIndices[0];
    outerSourceSessionId = sourceIndices[1];

    const items = [...draggableExercises];

    const sourceExercise =
      items[outerSourceId].sessions[outerSourceSessionId].exercises[
        innerSourceId
      ];
    const targetSplit =
      items[outerDestinationId].sessions[outerDestinationSessionId];
    const canAdd = canAddExerciseToSplit(
      sourceExercise.muscle,
      targetSplit.split
    );

    if (!canAdd) {
      const splitOptions = findOptimalSplit(
        sourceExercise.muscle,
        targetSplit.exercises
      );

      setModalOptions({
        id: targetSplit.id,
        options: splitOptions,
        isOpen: true,
      });
      // setIsModalPrompted(true);
    }

    const [removed] = items[outerSourceId].sessions[
      outerSourceSessionId
    ].exercises.splice(innerSourceId, 1);

    items[outerDestinationId].sessions[
      outerDestinationSessionId
    ].exercises.splice(outerDestinationExerciseIndex, 0, removed);

    setDraggableExercises(items);
  };

  return {
    draggableExercises,
    setDraggableExercises,
    onSplitChange,
    onSupersetUpdate,
    modalOptions,
    onDragEnd,
    supersets,
  };
}
