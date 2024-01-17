import { useCallback, useEffect, useState } from "react";
import {
  ExerciseType,
  SessionType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

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
    console.log(draggableExercises, "THIS GETTING CALLED AFTER SUPERSET??");
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

  const sortListOnSuperset = (exercises: ExerciseType[]) => {
    let sorted: ExerciseType[] = [];
    let skippableIds: string[] = [];

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      if (skippableIds.includes(exercise.id)) continue;
      if (exercise.supersetWith) {
        const index = exercises.findIndex(
          (each) => each.id === exercise.supersetWith
        );
        sorted.push(exercises[i], exercises[index]);
        skippableIds.push(exercise.supersetWith);
      } else {
        sorted.push(exercise);
      }
    }
    return sorted;
  };

  /// not working correctly, returning empty array
  const onSupersetUpdate = useCallback(
    (
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

      const newNewList = sortListOnSuperset(newList);
      // const supersetExercises = newList.splice(indexTwo, 1);
      // newList.splice(indexOne + 1, 0, ...supersetExercises);
      console.log(
        _exercises,
        sessionId,
        newList,
        newNewList,
        "THIS GOING WRONG?"
      );
      const updateList = draggableExercises.map((each) => {
        const sessions = each.sessions.map((each) => {
          if (each.id === sessionId) {
            return { ...each, exercises: newNewList };
          } else return each;
        });
        return { ...each, sessions: sessions };
      });

      setDraggableExercises(updateList);
    },
    [draggableExercises]
  );

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

  const onDraggableReorder = useCallback(
    (
      destinationId: string,
      sourceId: string,
      destinationIndex: number,
      sourceIndex: number
    ) => {
      // const destIndices = getOutterIndex(result.destination.droppableId);
      // outerDestinationId = destIndices[0];
      // outerDestinationSessionId = destIndices[1];
      // const sourceIndices = getOutterIndex(result.source.droppableId);
      // outerSourceId = sourceIndices[0];
      // outerSourceSessionId = sourceIndices[1];
      // const items = [...draggableExercises];
      // const sourceExercise =
      //   items[outerSourceId].sessions[outerSourceSessionId].exercises[
      //     innerSourceId
      //   ];
      // const targetSplit =
      //   items[outerDestinationId].sessions[outerDestinationSessionId];
      // const canAdd = canAddExerciseToSplit(
      //   sourceExercise.muscle,
      //   targetSplit.split
      // );
      // if (!canAdd) {
      //   const splitOptions = findOptimalSplit(
      //     sourceExercise.muscle,
      //     targetSplit.exercises
      //   );
      //   setModalOptions({ id: targetSplit.id, options: splitOptions });
      //   setIsModalPrompted(true);
      // }
      // const [removed] = items[outerSourceId].sessions[
      //   outerSourceSessionId
      // ].exercises.splice(innerSourceId, 1);
      // items[outerDestinationId].sessions[
      //   outerDestinationSessionId
      // ].exercises.splice(outerDestinationExerciseIndex, 0, removed);
      // setDraggableExercises(items);
    },
    []
  );

  return {
    draggableExercises,
    setDraggableExercises,
    onSplitChange,
    onSupersetUpdate,
  };
}
