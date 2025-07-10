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
  State,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

import { getExerciseSetsOverMicrocycles } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { parseState, STORAGE_KEY } from "~/utils/localStorageHelpers";

type ActiveWorkoutType = ReturnType<typeof useActiveWorkout>;

const ActiveWorkoutContext = createContext<ActiveWorkoutType | null>(null);

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
  const context = useContext(ActiveWorkoutContext);
  if (!context) {
    throw new Error(
      "useActiveWorkoutContext must be used within a ActiveWorkoutProvider"
    );
  }
  return context;
};

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
  const [localStorageTrainingProgram, setLocalStorageTrainingProgram] =
    useState<State | null>(null);
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
      console.log(localState, savedTrainingBlocks, "LOCAL_STORAGE_STUFF");
      if (!localState) return;
      setLocalStorageTrainingProgram(localState);
      setSavedTrainingBlocks([localState.training_block]);
    }
  }, []);

  const onSelectWorkout = useCallback(
    (
      training_block_index: number,
      mesocycle_index: number,
      day_index: number,
      microcycle_index: number
    ) => {
      const microcycles = localStorageTrainingProgram
        ? localStorageTrainingProgram.training_program_params.microcycles
        : 4;
      const muscle_priority_list = localStorageTrainingProgram
        ? localStorageTrainingProgram.muscle_priority_list
        : [];
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
    [savedTrainingBlocks, localStorageTrainingProgram]
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
    localStorageTrainingProgram,
  };
};

// NOTES:
// 3/28/2025 - Add a popup on completion that will let user know that a PR has been reached and for them to double check it's accuracy. Needs to be able to not show this popup again.
