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

      console.log(_exercises, sessionId, "THIS GOING WRONG?");
      // const _exercises = structuredClone(getExercises);
      if (!_exercises) return;
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

      const supersetExercises = newList.splice(indexTwo, 1);
      newList.splice(indexOne + 1, 0, ...supersetExercises);

      const updateList = draggableExercises.map((each) => {
        const sessions = each.sessions.map((each) => {
          if (each.id === sessionId) {
            return { ...each, exercises: newList };
          } else return each;
        });
        return { ...each, sessions: sessions };
      });

      setDraggableExercises(updateList);
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
