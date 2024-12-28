import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  DayType,
  ExerciseType,
  MusclePriorityType,
  SessionSplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getExerciseSetsOverMicrocycles } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
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

const getExercisesById = (
  list: MusclePriorityType[],
  exerciseIds: string[],
  mesocycle_index: number,
  microcycle_index: number,
  microcycles: number
): ExerciseType[] => {
  const exercises: ExerciseType[] = [];

  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list[i].exercises.length; j++) {
      for (let k = 0; k < list[i].exercises[j].length; k++) {
        const raw_exercise = list[i].exercises[j][k];
        if (exerciseIds.includes(raw_exercise.id)) {
          const meso_sets = getExerciseSetsOverMicrocycles(
            raw_exercise.id,
            list[i],
            mesocycle_index,
            microcycles
          );
          const micro_sets = meso_sets[microcycle_index];
          const exercise = {
            ...list[i].exercises[j][k],
            sets: micro_sets,
          };
          exercises.push(exercise);
        }
      }
    }
  }
  return exercises;
};

const useActiveWorkout = () => {
  const programConfig = useProgramConfigContext();
  const { trainingBlock, muscle_priority_list, training_program_params } =
    programConfig;
  const { microcycles } = training_program_params;
  const savedTrainingBlocks = [trainingBlock, TBLOCK_TEST, TBLOCK_TEST];
  const [selectedWorkout, setSelectedWorkout] = useState<
    [number, number, number, number]
  >([0, 0, 0, 0]);
  const [activeWorkout, setActiveWorkout] = useState<{
    day: DayType;
    session: { id: string; split: SessionSplitType; exercises: ExerciseType[] };
  } | null>(null);

  const onSelectWorkout = useCallback(
    (
      training_block_index: number,
      mesocycle_index: number,
      day_index: number,
      microcycle_index: number
    ) => {
      const get_workout =
        savedTrainingBlocks[training_block_index][mesocycle_index][day_index];
      const get_exerciseIds = get_workout.sessions[0].exercises.map(
        (e, i) => e[1]
      );
      const hydrated_exercises = getExercisesById(
        muscle_priority_list,
        get_exerciseIds,
        mesocycle_index,
        microcycle_index,
        microcycles
      );
      const active_workout = {
        day: get_workout.day,
        session: {
          id: get_workout.sessions[0].id,
          split: get_workout.sessions[0].split,
          exercises: hydrated_exercises,
        },
      };

      console.log(
        savedTrainingBlocks,
        training_block_index,
        mesocycle_index,
        day_index,
        microcycle_index,
        get_workout,
        get_exerciseIds,
        hydrated_exercises,
        active_workout,
        muscle_priority_list,
        "WHAT AM I GETTING HERE??"
      );
      setSelectedWorkout([0, mesocycle_index, day_index, microcycle_index]);
      setActiveWorkout(active_workout);
    },
    [savedTrainingBlocks, muscle_priority_list, microcycles]
  );

  return {
    active_workout: activeWorkout,
    onSelectWorkout,
  };
};
