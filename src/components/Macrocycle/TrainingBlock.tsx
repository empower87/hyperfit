import { ReactNode, useEffect, useState } from "react";
import {
  ExerciseType,
  MusclePriorityType,
  SessionDayType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getTrainingBlock } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
import { MesocycleLayout, MesocycleTable } from "./Mesocycle";

type TrainingBlockProps = {
  // trainingBlock: SessionDayType[][];
  list: MusclePriorityType[];
  split: SessionDayType[];
  children?: ReactNode;
};

export default function TrainingBlock({
  // trainingBlock,
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
    let index = 0;
    let sessionIndex = 0;
    let setIndex = 0;
    let exerciseIndex = 0;

    for (let i = 0; i < splitState.length; i++) {
      let sets = splitState[i].sets;
      let setOne = sets[0];
      let setTwo = sets[1];

      for (let j = 0; j < setOne.length; j++) {
        if (setOne[j][0].id === id) {
          index = i;
          sessionIndex = 0;
          setIndex = j;
          exerciseIndex = 0;
        } else if (setOne[j][1].id === id) {
          index = i;
          sessionIndex = 1;
          setIndex = j;
          exerciseIndex = 1;
        }
      }

      for (let k = 0; k < setTwo.length; k++) {
        if (setTwo[k][0].id === id) {
          index = i;
          sessionIndex = 0;
          setIndex = k;
          exerciseIndex = 0;
        } else if (setTwo[k][1].id === id) {
          index = i;
          sessionIndex = 1;
          setIndex = k;
          exerciseIndex = 1;
        }
      }
    }

    const newSplit = splitState.map((each) => {
      if (each.sessionNum === index) {
        return {
          ...each,
          sets: each.sets.map((eachSet, eachSetIndex) => {
            if (eachSetIndex === sessionIndex) {
              return eachSet.map((eachEachSet, eachEachSetIndex) => {
                if (eachEachSetIndex === setIndex) {
                  return eachEachSet.map((wow, wowIndex) => {
                    if (wowIndex === exerciseIndex) {
                      let newWow: ExerciseType = { ...wow, exercise: value };
                      return newWow;
                    } else return wow;
                  });
                } else return eachEachSet;
              });
            } else return eachSet;
          }),
        };
      } else return each;
    });
    setSplitState(newSplit);
  };

  return (
    <div className="flex flex-col">
      {children}

      {trainingBlock.map((each, index) => {
        return (
          <MesocycleLayout
            key={`${index}_${each[index]?.day}_mesocycles`}
            title={`Mesocycle ${index + 1}`}
          >
            <MesocycleTable split={each} />
          </MesocycleLayout>
        );
      })}
    </div>
  );
}

const useTrainingBlock = (split: SessionDayType[]) => {};
