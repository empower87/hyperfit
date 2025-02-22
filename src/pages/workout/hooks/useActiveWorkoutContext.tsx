import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
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
import {
  parseState,
  STORAGE_KEY,
} from "~/hooks/useTrainingProgram/useTrainingProgram";
import { getExerciseSetsOverMicrocycles } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { NewTrainingWeek } from "~/hooks/useTrainingProgram/utils/training_block/trainingBlockHelpers";
import { useProgramConfigContext } from "~/pages/programConfig/hooks/useProgramConfig";

type ActiveWorkoutType = ReturnType<typeof useActiveWorkout>;

const ActiveWorkoutContext = createContext<ActiveWorkoutType>({
  active_workout: null,
  selectedExerciseHistoryId: "",
  onSelectWorkout: () => {},
  onExerciseNameClick: () => {},
  savedTrainingBlocks: [],
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

export type ActiveWorkout = {
  day: DayType;
  session: {
    id: string;
    split: SessionSplitType;
    name?: string;
    exercises: ExerciseType[];
  };
};
const useActiveWorkout = () => {
  const programConfig = useProgramConfigContext();
  const { trainingBlock, muscle_priority_list, training_program_params } =
    programConfig;
  const { microcycles } = training_program_params;
  // const savedTrainingBlocks = [trainingBlock, TBLOCK_TEST, TBLOCK_TEST];
  const [savedTrainingBlocks, setSavedTrainingBlocks] = useState<
    TrainingDayType[][][]
  >([]);
  const [selectedWorkout, setSelectedWorkout] = useState<
    [number, number, number, number]
  >([0, 0, 0, 0]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(
    null
  );
  const [selectedExerciseHistoryId, setSelectedExerciseHistoryId] =
    useState<string>("");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    console.log(raw, localStorage, "RAW IN ACTIVE CONTEXT");
    if (raw) {
      const localState = parseState(raw);
      console.log(localState, "LOCAL_STORAGE_STUFF");
      if (!localState) return;
      setSavedTrainingBlocks((prev) => [...prev, localState.training_block]);
    }
  }, []);

  const onSelectWorkout = useCallback(
    (
      training_block_index: number,
      mesocycle_index: number,
      day_index: number,
      microcycle_index: number
    ) => {
      setActiveWorkout(null);
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

      setSelectedWorkout([0, mesocycle_index, day_index, microcycle_index]);
      setActiveWorkout(active_workout);
    },
    [savedTrainingBlocks, muscle_priority_list, microcycles]
  );

  const onExerciseNameClick = useCallback((exercise_id: string) => {
    setSelectedExerciseHistoryId(exercise_id);
  }, []);

  return {
    active_workout: activeWorkout,
    selectedExerciseHistoryId,
    onSelectWorkout,
    onExerciseNameClick,
    savedTrainingBlocks,
  };
};
