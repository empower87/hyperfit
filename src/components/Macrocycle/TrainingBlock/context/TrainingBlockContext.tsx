import { ReactNode, createContext, useContext } from "react";
// import { SessionDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import useTrainingBlock from "../hooks/useTrainingBlock";

type TrainingBlockType = ReturnType<typeof useTrainingBlock>;

const TrainingBlockContext = createContext<TrainingBlockType>({
  trainingBlock: [],
  editExerciseHandler: () => "",
});

const TraingingBlockProvider = ({
  children,
  training_week,
}: {
  children: ReactNode;
  training_week: TrainingDayType[];
}) => {
  const values = useTrainingBlock(training_week);
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
