import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { NewTrainingWeek } from "~/hooks/useTrainingProgram/utils/training_block/trainingBlockHelpers";
import { useProgramConfigContext } from "~/pages/programConfig/hooks/useProgramConfig";

type TrainingProgramType = ReturnType<typeof useActiveWorkout>;

const ActiveWorkoutContext = createContext<TrainingProgramType>({
  active_workout: null,
  onSelectWorkout: () => {},
});

export const ActiveWorkoutProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const values = useActiveWorkout();
  const contextValues = useMemo(() => {
    return values;
  }, [values]);

  return (
    <ActiveWorkoutContext.Provider value={contextValues}>
      {children}
    </ActiveWorkoutContext.Provider>
  );
};

export const useActiveWorkoutContext = () => {
  return useContext(ActiveWorkoutContext);
};
const TBLOCK_TEST: NewTrainingWeek[][] | TrainingDayType[][] = [
  [
    {
      day: "Monday",
      isTrainingDay: true,
      sessions: [{ id: "0329", split: "upper", exercises: [] }],
    },
  ],
  [],
  [],
];
const useActiveWorkout = () => {
  const programConfig = useProgramConfigContext();
  const { trainingBlock } = programConfig;

  const savedTrainingBlocks = [trainingBlock, TBLOCK_TEST, TBLOCK_TEST];
  const [selectedWorkout, setSelectedWorkout] = useState<
    [number, number, number, number]
  >([0, 0, 0, 0]);
  const [activeWorkout, setActiveWorkout] = useState<
    TrainingDayType | NewTrainingWeek | null
  >(null);

  const onSelectWorkout = useCallback(
    (
      training_block_index: number,
      mesocycle_index: number,
      day_index: number,
      microcycle_index: number
    ) => {
      console.log(
        savedTrainingBlocks,
        training_block_index,
        mesocycle_index,
        day_index,
        microcycle_index,
        "WHAT AM I GETTING HERE??"
      );
      setSelectedWorkout([0, mesocycle_index, day_index, microcycle_index]);
    },
    []
  );

  useEffect(() => {
    const tblock = selectedWorkout[0];
    const meso = selectedWorkout[1];
    const day = selectedWorkout[2];
    const micro = selectedWorkout[3];

    const get_workout = savedTrainingBlocks[tblock][meso][day];
    setActiveWorkout(get_workout);
  }, [selectedWorkout, savedTrainingBlocks]);

  return {
    active_workout: activeWorkout,
    onSelectWorkout,
  };
};
