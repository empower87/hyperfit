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

export default function useExerciseSelection(
  training_week: TrainingDayType[],
  mesocycle_index: number
) {
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
          id: `${each.day}_${i}_${mesocycle_index}`,
          exercises: e.exercises.flat(),
        }));
        return { ...each, sessions: sessions };
      }
    );
    setDraggableExercises(draggableExercises);
  }, [training_week]);

  useEffect(() => {
    const newDraggableExercises = structuredClone(draggableExercises);
    for (let i = 0; i < newDraggableExercises.length; i++) {
      let day = newDraggableExercises[i];
      for (let j = 0; j < day.sessions.length; j++) {
        const session = day.sessions[j];
        const exercises = session.exercises;
        const sorted = updateExercisesWithSuperset(exercises, supersets);
        newDraggableExercises[i].sessions[j].exercises = sorted;
      }
    }
    setDraggableExercises(newDraggableExercises);
  }, [supersets]);

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

      setDraggableExercises(updatedSplitForExercises);
    },
    [draggableExercises]
  );

  const updateExercisesWithSuperset = (
    exercises: ExerciseType[],
    supersets: [string, string][]
  ) => {
    const paired: { [key: string]: boolean } = {};
    const newExercises: ExerciseType[] = [];

    for (let exercise of exercises) {
      if (paired[exercise.id]) continue;

      const superset = supersets.find((set) => {
        return set.includes(exercise.id);
      });

      if (superset) {
        const [first, second] = superset;
        let supersetExercise = exercises.find(
          (e) => e.id === (first === exercise.id ? second : first)
        );
        if (!supersetExercise) continue;
        paired[first] = true;
        paired[second] = true;
        supersetExercise = {
          ...supersetExercise,
          supersetWith: first === supersetExercise.id ? second : first,
        };
        newExercises.push(supersetExercise);
      }

      exercise = {
        ...exercise,
        supersetWith:
          superset && exercise.id === superset[0]
            ? superset[1]
            : superset && exercise.id === superset[1]
            ? superset[0]
            : null,
      };
      newExercises.push(exercise);
    }

    return newExercises;
  };

  const onSupersetUpdate = useCallback(
    (
      exerciseOne: ExerciseType,
      exerciseTwo: ExerciseType,
      sessionId: string
    ) => {
      let _exercises: ExerciseType[] = [];

      const newExercises = structuredClone(draggableExercises);

      for (let i = 0; i < newExercises.length; i++) {
        const session = newExercises[i].sessions.find((each) => {
          return each.id === sessionId;
        });
        if (!session) continue;
        _exercises = session.exercises;
      }

      // TODO: use this logic to update superset state and cause a resorting of draggableExercises in a useEffect
      let newSupersets: [string, string][] = [];
      if (!supersets.length) {
        newSupersets.push([exerciseOne.id, exerciseTwo.id]);
      } else {
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
          }
        }
      }

      setSupersets(newSupersets);
    },
    [draggableExercises, supersets]
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

  // TODO: Needs to check if exercise has a superset and drag that along with it.
  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      let outerDestinationId = 0;
      let outerDestinationSessionId = 0;
      let outerDestinationExerciseIndex = result.destination.index;

      let outerSourceId = 0;
      let outerSourceSessionId = 0;
      let innerSourceId = result.source.index;

      const destIndices = getInnerAndOuterIndices(
        result.destination.droppableId
      );
      outerDestinationId = destIndices[0];
      outerDestinationSessionId = destIndices[1];

      const sourceIndices = getInnerAndOuterIndices(result.source.droppableId);
      outerSourceId = sourceIndices[0];
      outerSourceSessionId = sourceIndices[1];

      const items = structuredClone(draggableExercises);

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
      }

      const [removed] = items[outerSourceId].sessions[
        outerSourceSessionId
      ].exercises.splice(innerSourceId, 1);

      items[outerDestinationId].sessions[
        outerDestinationSessionId
      ].exercises.splice(outerDestinationExerciseIndex, 0, removed);

      setDraggableExercises(items);
    },
    [draggableExercises]
  );

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
