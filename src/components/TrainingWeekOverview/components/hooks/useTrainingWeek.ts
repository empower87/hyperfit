import { useMemo } from "react";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { NewTrainingWeek } from "~/hooks/useTrainingProgram/utils/trainingBlockHelpers";
import {
  DraggableExercises,
  DraggableSessionType,
} from "./useExerciseSelection";

const hydrateTrainingWeek = (
  training_week: NewTrainingWeek[],
  muscle_priority_list: MusclePriorityType[]
) => {
  const hydratedTrainingWeek: DraggableExercises[] = [];

  for (let i = 0; i < training_week.length; i++) {
    const hydratedDay: DraggableExercises = {
      day: training_week[i].day,
      isTrainingDay: training_week[i].isTrainingDay,
      sessions: [],
    };

    for (let j = 0; j < training_week[i].sessions.length; j++) {
      const exerciseIds = training_week[i].sessions[j].exercises;
      const session: DraggableSessionType = {
        id: training_week[i].sessions[j].id,
        split: training_week[i].sessions[j].split,
        exercises: [],
      };

      for (let k = 0; k < exerciseIds.length; k++) {
        const muscleGroup = exerciseIds[k][0];
        const exerciseId = exerciseIds[k][1];
        const muscle = muscle_priority_list.find(
          (e) => e.muscle === muscleGroup
        );
        if (!muscle) break;
        const exercises = muscle.exercises.flat();
        const exercise = exercises.filter((e) => e.id === exerciseId);
        session.exercises.push(exercise[0]);
      }
      hydratedDay.sessions.push(session);
    }
    hydratedTrainingWeek.push(hydratedDay);
  }
  return hydratedTrainingWeek;
};

export default function useTrainingWeek(
  training_block: NewTrainingWeek[][],
  muscle_priority_list: MusclePriorityType[],
  mesocycle_index: number
) {
  const hydratedTrainingBlock = useMemo(
    () =>
      training_block.map((each) =>
        hydrateTrainingWeek(each, muscle_priority_list)
      ),
    [training_block, muscle_priority_list]
  );

  // const [modalOptions, setModalOptions] = useState<{
  //   id: string;
  //   options: SplitType[];
  //   isOpen: boolean;
  // }>();

  // const onSplitChange = useCallback(
  //   (sessionId: string, split: SplitType) => {
  //     const updatedSplitForExercises = hydratedTrainingBlock[mesocycle_index].map((each) => {
  //       const sessions = each.sessions.map((each) => {
  //         if (each.id === sessionId) {
  //           return { ...each, split: split };
  //         } else return each;
  //       });

  //       return { ...each, sessions: sessions };
  //     });
  //     setModalOptions(undefined);
  //     hydratedTrainingBlock[mesocycle_index] = updatedSplitForExercises;
  //   },
  //   [hydratedTrainingBlock]
  // );

  // const updateExercisesWithSuperset = (
  //   exerciseOne: ExerciseType,
  //   exerciseTwo: ExerciseType,
  //   exercises: ExerciseType[]
  // ) => {
  //   const superset: ExerciseTrainingModality = "superset";
  //   const one = {
  //     ...exerciseOne,
  //     supersetWith: exerciseTwo.id,
  //     trainingModality: superset,
  //   };
  //   const two = {
  //     ...exerciseTwo,
  //     supersetWith: exerciseOne.id,
  //     trainingModality: superset,
  //   };

  //   const newExercises: ExerciseType[] = [];
  //   for (let i = 0; i < exercises.length; i++) {
  //     const exercise = exercises[i];
  //     if (exercise.id === two.id) continue;
  //     if (exercise.id === one.id) {
  //       newExercises.push(one, two);
  //     } else {
  //       if (
  //         exercise.supersetWith === one.id ||
  //         exercise.supersetWith === two.id
  //       ) {
  //         const updatedSuperset = { ...exercise, supersetWith: null };
  //         newExercises.push(updatedSuperset);
  //       } else {
  //         newExercises.push(exercise);
  //       }
  //     }
  //   }
  //   return newExercises;
  // };

  // const onSupersetUpdate = useCallback(
  //   (
  //     exerciseOne: ExerciseType,
  //     exerciseTwo: ExerciseType,
  //     sessionId: string
  //   ) => {
  //     const newExercises = structuredClone(hydratedTrainingBlock)[mesocycle_index]
  //     for (let i = 0; i < newExercises.length; i++) {
  //       const newSessions = newExercises[i].sessions.map((each) => {
  //         if (each.id === sessionId) {
  //           const exercises = each.exercises;
  //           const newExercises = updateExercisesWithSuperset(
  //             exerciseOne,
  //             exerciseTwo,
  //             exercises
  //           );
  //           return { ...each, exercises: newExercises };
  //         } else return each;
  //       });
  //       newExercises[i].sessions = newSessions;

  //     }
  //     console.log(newExercises, exerciseOne, exerciseTwo, "WHAT IS THIS?");
  //     hydratedTrainingBlock[mesocycle_index] = newExercises;
  //   },
  //   [mesocycle_index, hydratedTrainingBlock]
  // );

  // const getInnerAndOuterIndices = (droppableId: string) => {
  //   const splitId = droppableId.split("_");
  //   const index = parseInt(splitId[1]);
  //   switch (splitId[0]) {
  //     case "Monday":
  //       return [1, index];
  //     case "Tuesday":
  //       return [2, index];
  //     case "Wednesday":
  //       return [3, index];
  //     case "Thursday":
  //       return [4, index];
  //     case "Friday":
  //       return [5, index];
  //     case "Saturday":
  //       return [6, index];
  //     default:
  //       return [0, index];
  //   }
  // };

  // const onDragEndIndices = {
  //   destination: {
  //     dayIndex: 0,
  //     sessionIndex: 0,
  //     exerciseIndex: 0,
  //   },
  //   source: {
  //     dayIndex: 0,
  //     sessionIndex: 0,
  //     exerciseIndex: 0,
  //   },
  // };
  // const [onDragResults, setOnDragResults] = useState<
  //   typeof onDragEndIndices | null
  // >(null);

  // useEffect(() => {
  //   if (!onDragResults) return;
  //   const { destination, source } = onDragResults;
  //   const sourceDayIndex = source.dayIndex;
  //   const sourceSessionIndex = source.sessionIndex;
  //   const sourceExerciseIndex = source.exerciseIndex;
  //   const destinationDayIndex = destination.dayIndex;
  //   const destinationSessionIndex = destination.sessionIndex;
  //   const destinationExerciseIndex = destination.exerciseIndex;

  //   const items = structuredClone(hydratedTrainingBlock)[mesocycle_index]

  //   const sourceExercise =
  //     items[sourceDayIndex].sessions[sourceSessionIndex].exercises[
  //       sourceExerciseIndex
  //     ];
  //   const targetSplit =
  //     items[destinationDayIndex].sessions[destinationSessionIndex];
  //   const canAdd = canAddExerciseToSplit(
  //     sourceExercise.muscle,
  //     targetSplit.split as SplitType
  //   );

  //   if (!canAdd) {
  //     const splitOptions = findOptimalSplit(
  //       sourceExercise.muscle,
  //       targetSplit.exercises
  //     );

  //     setModalOptions({
  //       id: targetSplit.id,
  //       options: splitOptions,
  //       isOpen: true,
  //     });
  //   }

  //   const [removed] = items[sourceDayIndex].sessions[
  //     sourceSessionIndex
  //   ].exercises.splice(sourceExerciseIndex, 1);

  //   items[destinationDayIndex].sessions[
  //     destinationSessionIndex
  //   ].exercises.splice(destinationExerciseIndex, 0, removed);

  //   // setDraggableExercises(items);
  //   hydratedTrainingBlock[mesocycle_index] = items;
  //   setOnDragResults(null);
  // }, [onDragResults, mesocycle_index]);

  // // TODO: Needs to check if exercise has a superset and drag that along with it.
  // //       This will extend to moving a exercise across week.
  // const onDragEnd = useCallback((result: DropResult) => {
  //   if (!result.destination) return;
  //   let outerDestinationId = 0;
  //   let outerDestinationSessionId = 0;
  //   const outerDestinationExerciseIndex = result.destination.index;

  //   let outerSourceId = 0;
  //   let outerSourceSessionId = 0;
  //   const innerSourceId = result.source.index;

  //   const destIndices = getInnerAndOuterIndices(result.destination.droppableId);
  //   outerDestinationId = destIndices[0];
  //   outerDestinationSessionId = destIndices[1];

  //   const sourceIndices = getInnerAndOuterIndices(result.source.droppableId);
  //   outerSourceId = sourceIndices[0];
  //   outerSourceSessionId = sourceIndices[1];

  //   setOnDragResults({
  //     destination: {
  //       dayIndex: outerDestinationId,
  //       sessionIndex: outerDestinationSessionId,
  //       exerciseIndex: outerDestinationExerciseIndex,
  //     },
  //     source: {
  //       dayIndex: outerSourceId,
  //       sessionIndex: outerSourceSessionId,
  //       exerciseIndex: innerSourceId,
  //     },
  //   });
  // }, []);
  return {
    hydratedTrainingBlock,
    // onDragEnd
  };
}
