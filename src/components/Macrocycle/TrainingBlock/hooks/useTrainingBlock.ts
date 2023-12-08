import { useEffect, useState } from "react";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { ExerciseType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";

export default function useTrainingBlock(training_week: TrainingDayType[]) {
  const [splitState, setSplitState] = useState<TrainingDayType[]>([]);
  const [trainingBlock, setTrainingBlock] = useState<TrainingDayType[][]>([]);

  useEffect(() => {
    setSplitState([...training_week]);
  }, [training_week]);

  useEffect(() => {
    const block = getTrainingBlock(splitState);
    setTrainingBlock(block);
  }, [splitState]);

  const getTrainingBlock = (_split: TrainingDayType[]) => {
    const getSplitForMesocycle = (
      split: TrainingDayType[],
      mesocycle: number
    ) => {
      const newSplit = split.map((session) => {
        const sets_one = session.sessions[0];
        const sets_two = session.sessions[1];

        let setsOne = sets_one?.exercises?.map((exercises) => {
          return exercises.filter((exercise) => {
            let details = exercise.meso_details[mesocycle - 1];

            if (details !== null) {
              let update_exercise = {
                ...exercise,
                sets: details.sets,
                weight: details.weight,
              };
              console.log(exercise, update_exercise, "TEST: WHAT?");
              return update_exercise;
            }
          });
        });

        let setsTwo = sets_two?.exercises?.map((exercises) => {
          return exercises.filter((exercise) => {
            let details = exercise.meso_details[mesocycle - 1];

            if (details !== null) {
              let update_exercise = {
                ...exercise,
                sets: details.sets,
                weight: details.weight,
              };
              return update_exercise;
            }
          });
        });

        const filterEmptySetsOne = setsOne?.filter((each) => each.length);
        const filterEmptySetsTwo = setsTwo?.filter((each) => each.length);
        const newSets: [ExerciseType[][], ExerciseType[][]] = [
          filterEmptySetsOne,
          filterEmptySetsTwo,
        ];
        return { ...session, sets: newSets };
      });

      return newSplit;
    };

    const meso_one = getSplitForMesocycle(_split, 1);
    const meso_two = getSplitForMesocycle(_split, 2);
    const meso_three = getSplitForMesocycle(_split, 3);

    return [meso_one, meso_two, meso_three];
  };

  const editExerciseHandler = (id: string, value: string) => {
    const test = splitState.map((session) => {
      let seshone = session.sessions[0];
      let seshtwo = session.sessions[1];

      let sessionOne = seshone.exercises?.map((exercises) => {
        return exercises.map((ex) => {
          if (ex.id === id) {
            return { ...ex, exercise: value };
          } else return ex;
        });
      });

      let sessionTwo = seshtwo.exercises?.map((exercises) => {
        return exercises.map((ex) => {
          if (ex.id === id) {
            return { ...ex, exercise: value };
          } else return ex;
        });
      });

      const newSets: [ExerciseType[][], ExerciseType[][]] = [
        sessionOne,
        sessionTwo,
      ];

      return { ...session, sets: newSets };
    });

    console.log(splitState, test, "EDIT EXERCISE CHANGE??? 1");
    setSplitState(test);
  };

  return {
    trainingBlock,
    editExerciseHandler,
  };
}
