import { useCallback, useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import {
  ExerciseTrainingModality,
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

export default function useExerciseSelection(
  training_week: TrainingDayType[],
  mesocycle_index: number
) {
  const [draggableExercises, setDraggableExercises] = useState<
    DraggableExercises[]
  >([]);

  const [modalOptions, setModalOptions] = useState<{
    id: string;
    options: SplitType[];
    isOpen: boolean;
  }>();

  useEffect(() => {
    const cloned_week = structuredClone(training_week);
    const draggableExercises: DraggableExercises[] = cloned_week?.map(
      (each) => {
        const sessions = each.sessions.map((e, i) => ({
          ...e,
          id: `${each.day}_${i}_${mesocycle_index}`,
          exercises: e.exercises.flat(),
        }));
        return { ...each, sessions: sessions };
      }
    );
    setDraggableExercises(draggableExercises);
  }, [training_week]);

  const onSplitChange = useCallback(
    (sessionId: string, split: SplitType) => {
      const updatedSplitForExercises = draggableExercises.map((each) => {
        const sessions = each.sessions.map((each) => {
          if (each.id === sessionId) {
            return { ...each, split: split };
          } else return each;
        });

        return { ...each, sessions: sessions };
      });
      setModalOptions(undefined);
      setDraggableExercises(updatedSplitForExercises);
    },
    [draggableExercises]
  );

  const updateExercisesWithSuperset = (
    exerciseOne: ExerciseType,
    exerciseTwo: ExerciseType,
    exercises: ExerciseType[]
  ) => {
    const superset: ExerciseTrainingModality = "superset";
    const one = {
      ...exerciseOne,
      supersetWith: exerciseTwo.id,
      trainingModality: superset,
    };
    const two = {
      ...exerciseTwo,
      supersetWith: exerciseOne.id,
      trainingModality: superset,
    };

    const newExercises: ExerciseType[] = [];
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      if (exercise.id === two.id) continue;
      if (exercise.id === one.id) {
        newExercises.push(one, two);
      } else {
        if (
          exercise.supersetWith === one.id ||
          exercise.supersetWith === two.id
        ) {
          const updatedSuperset = { ...exercise, supersetWith: null };
          newExercises.push(updatedSuperset);
        } else {
          newExercises.push(exercise);
        }
      }
    }
    return newExercises;
  };

  const onSupersetUpdate = useCallback(
    (
      exerciseOne: ExerciseType,
      exerciseTwo: ExerciseType,
      sessionId: string
    ) => {
      const newExercises = [...draggableExercises];
      for (let i = 0; i < newExercises.length; i++) {
        const newSessions = newExercises[i].sessions.map((each) => {
          if (each.id === sessionId) {
            const exercises = each.exercises;
            // const one = { ...exerciseOne, supersetWith: exerciseTwo.id };
            // const two = { ...exerciseTwo, supersetWith: exerciseOne.id };
            // const oneIndex = exercises.findIndex((each) => each.id === one.id);
            // const twoIndex = exercises.findIndex((each) => each.id === two.id);
            // exercises[oneIndex] = one;

            // const [removed] = exercises.splice(twoIndex, 1);
            // exercises.splice(oneIndex, 0, two);
            const newExercises = updateExercisesWithSuperset(
              exerciseOne,
              exerciseTwo,
              exercises
            );
            return { ...each, exercises: newExercises };
          } else return each;
        });
        newExercises[i].sessions = newSessions;
        // const sessionList = newExercises[i].sessions.filter(each => each.id === sessionId)
        // const session = sessionList[0]
        // if (session) {
        //   const one = { ...exerciseOne, supersetWith: exerciseTwo.id }
        //   const two = {...exerciseTwo, supersetWith: exerciseOne.id }
        //   const oneIndex = session.exercises.findIndex(each => each.id === one.id)
        //   const twoIndex = session.exercises.findIndex(each => each.id === two.id)

        //   const [removed] = session.exercises.splice(twoIndex, 1);
        //   session.exercises.splice(oneIndex, 0, removed)
        //   session.exercises[oneIndex] = one
        // }
        // const sessionIndex = newExercises[i].sessions.findIndex(each => each.id === session.id)
        // newExercises[i] = { ...newExercises[i], sessions: [...newExercises[i].sessions, session]}
      }
      console.log(newExercises, exerciseOne, exerciseTwo, "WHAT IS THIS?");
      setDraggableExercises(newExercises);
      // const [removed] = newExercises.splice(secondIndex, 1);
      // newExercises.splice(firstIndex, 0, removed);
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

  const onDragEndIndices = {
    destination: {
      dayIndex: 0,
      sessionIndex: 0,
      exerciseIndex: 0,
    },
    source: {
      dayIndex: 0,
      sessionIndex: 0,
      exerciseIndex: 0,
    },
  };
  const [onDragResults, setOnDragResults] = useState<
    typeof onDragEndIndices | null
  >(null);

  useEffect(() => {
    if (!onDragResults) return;
    const { destination, source } = onDragResults;
    const sourceDayIndex = source.dayIndex;
    const sourceSessionIndex = source.sessionIndex;
    const sourceExerciseIndex = source.exerciseIndex;
    const destinationDayIndex = destination.dayIndex;
    const destinationSessionIndex = destination.sessionIndex;
    const destinationExerciseIndex = destination.exerciseIndex;

    const items = structuredClone(draggableExercises);

    const sourceExercise =
      items[sourceDayIndex].sessions[sourceSessionIndex].exercises[
        sourceExerciseIndex
      ];
    const targetSplit =
      items[destinationDayIndex].sessions[destinationSessionIndex];
    const canAdd = canAddExerciseToSplit(
      sourceExercise.muscle,
      targetSplit.split as SplitType
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
    }

    const [removed] = items[sourceDayIndex].sessions[
      sourceSessionIndex
    ].exercises.splice(sourceExerciseIndex, 1);

    items[destinationDayIndex].sessions[
      destinationSessionIndex
    ].exercises.splice(destinationExerciseIndex, 0, removed);

    setDraggableExercises(items);
    setOnDragResults(null);
  }, [onDragResults]);

  // TODO: Needs to check if exercise has a superset and drag that along with it.
  //       This will extend to moving a exercise across week.
  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;
    let outerDestinationId = 0;
    let outerDestinationSessionId = 0;
    const outerDestinationExerciseIndex = result.destination.index;

    let outerSourceId = 0;
    let outerSourceSessionId = 0;
    const innerSourceId = result.source.index;

    const destIndices = getInnerAndOuterIndices(result.destination.droppableId);
    outerDestinationId = destIndices[0];
    outerDestinationSessionId = destIndices[1];

    const sourceIndices = getInnerAndOuterIndices(result.source.droppableId);
    outerSourceId = sourceIndices[0];
    outerSourceSessionId = sourceIndices[1];

    setOnDragResults({
      destination: {
        dayIndex: outerDestinationId,
        sessionIndex: outerDestinationSessionId,
        exerciseIndex: outerDestinationExerciseIndex,
      },
      source: {
        dayIndex: outerSourceId,
        sessionIndex: outerSourceSessionId,
        exerciseIndex: innerSourceId,
      },
    });

    // const items = structuredClone(draggableExercises);

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

    //   setModalOptions({
    //     id: targetSplit.id,
    //     options: splitOptions,
    //     isOpen: true,
    //   });
    // }

    // const [removed] = items[outerSourceId].sessions[
    //   outerSourceSessionId
    // ].exercises.splice(innerSourceId, 1);

    // items[outerDestinationId].sessions[
    //   outerDestinationSessionId
    // ].exercises.splice(outerDestinationExerciseIndex, 0, removed);

    // setDraggableExercises(items);
  }, []);

  return {
    draggableExercises,
    onSplitChange,
    onSupersetUpdate,
    modalOptions,
    onDragEnd,
  };
}
