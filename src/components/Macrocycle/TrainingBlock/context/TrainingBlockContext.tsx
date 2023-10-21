import { ReactNode, createContext, useContext } from "react";
import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import useTrainingBlock from "../hooks/useTrainingBlock";

type TrainingBlockType = ReturnType<typeof useTrainingBlock>;

const TrainingBlockContext = createContext<TrainingBlockType>({
  trainingBlock: [],
  editExerciseHandler: () => "",
});

const TraingingBlockProvider = ({
  children,
  split,
}: {
  children: ReactNode;
  split: SessionDayType[];
}) => {
  const values = useTrainingBlock(split);
  return (
    <TrainingBlockContext.Provider value={values}>
      {children}
    </TrainingBlockContext.Provider>
  );
};

const useTrainingBlockContext = () => {
  return useContext(TrainingBlockContext);
};

export { TraingingBlockProvider, useTrainingBlockContext };
