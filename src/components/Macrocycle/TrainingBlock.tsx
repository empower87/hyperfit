import { ReactNode, useEffect, useState } from "react";
import {
  ExerciseType,
  MusclePriorityType,
  SessionDayType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getTrainingBlock } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type TrainingBlockProps = {
  list: MusclePriorityType[];
  split: SessionDayType[];
  children?: ReactNode;
};

export default function TrainingBlock({
  list,
  split,
  children,
}: TrainingBlockProps) {
  const [splitState, setSplitState] = useState<SessionDayType[]>([]);
  const [trainingBlock, setTrainingBlock] = useState<SessionDayType[][]>([]);

  useEffect(() => {
    setSplitState([...split]);
  }, [split]);

  useEffect(() => {
    const block = getTrainingBlock(list, splitState);
    setTrainingBlock(block);
  }, [splitState, list]);

  const editExerciseHandler = (id: string, value: string) => {
    const test = splitState.map((session) => {
      let seshone = session.sets[0];
      let seshtwo = session.sets[1];

      let sessionOne = seshone.map((exercises) => {
        return exercises.map((ex) => {
          if (ex.id === id) {
            return { ...ex, exercise: value };
          } else return ex;
        });
      });
      let sessionTwo = seshtwo.map((exercises) => {
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

    const block = getTrainingBlock(list, test);
    setTrainingBlock(block);
  };

  useEffect(() => {
    console.log(splitState, trainingBlock, "EDIT EXERCISE CHANGE??? 2");
  }, [splitState, trainingBlock]);

  return (
    <div className="flex flex-col">
      {children}

      {trainingBlock.map((each, index) => {
        return (
          <MesocycleLayout
            key={`${index}_${each[index]?.day}_mesocycles`}
            title={`Mesocycle ${index + 1}`}
          >
            <MesocycleTable split={each} onEdit={editExerciseHandler} />
          </MesocycleLayout>
        );
      })}
    </div>
  );
}

const useTrainingBlock = (split: SessionDayType[]) => {};
