import { useCallback, useEffect, useState } from "react";
import {
  ExerciseTrainingModality,
  ExerciseType,
  SessionType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

export type DraggableSessionType = Pick<SessionType, "id" | "split"> & {
  exercises: ExerciseType[];
};
export type DraggableExercises = Pick<
  TrainingDayType,
  "day" | "isTrainingDay"
> & {
  sessions: DraggableSessionType[];
};

export default function useExerciseSelection(
  training_week: DraggableExercises[],
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
    console.log(training_week, "OK LETS CHECK OUT THIS");

    // const cloned_week = structuredClone(training_week);
    // const draggableExercises: DraggableExercises[] = training_week?.map(
    //   (each) => {
    //     const sessions = each.sessions.map((e, i) => ({
    //       ...e,
    //       id: `${each.day}_${i}_${mesocycle_index}`,
    //       exercises: e.exercises.flat(),
    //     }));
    //     return { ...each, sessions: sessions };
    //   }
    // );
    setDraggableExercises(training_week);
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

  return {
    draggableExercises,
    setDraggableExercises,
    onSplitChange,
    onSupersetUpdate,
    modalOptions,
  };
}
