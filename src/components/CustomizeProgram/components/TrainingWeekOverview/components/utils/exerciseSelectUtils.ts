import {
  MuscleType,
  getAvailableSplitsByMuscle,
  getGroupList,
} from "~/constants/workoutSplits";
import {
  ExerciseType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { getMuscleData } from "~/utils/getMuscleData";
import { includes } from "~/utils/readOnlyArrayIncludes";

export const canAddExerciseToSplit = (
  muscleGroup: MuscleType,
  targetSplit: SplitType
) => {
  // Can muscleGroup be added to Split type??
  // ---No?: Prompt User if they would like to Update Split
  // ---YES?: Will extra set break past MAV limit?
  //          ---NO?: Add
  //          ---YES?: either adjust sets of all muscle groups or don't add (possible prompt user)

  const groupList = getGroupList(targetSplit);

  if (includes(groupList, muscleGroup)) {
    return true;
  } else return false;
};

export const canAddExerciseSets = (
  exercise: ExerciseType,
  exercises: ExerciseType[]
) => {
  const muscleData = getMuscleData(exercise.muscle);
  const getMuscleGroupExercises = exercises.filter(
    (each) => each.muscle === exercise.muscle
  );
  const currentExerciseSets = exercise.sets;
  const targetExerciseSets = getMuscleGroupExercises.reduce(
    (acc, prev) => acc + prev.sets,
    0
  );
  let progressionSets = 0 + 1 + 1 + 1;

  if (getMuscleGroupExercises.length > 0) {
    progressionSets = progressionSets * 2;
  }

  if (
    targetExerciseSets + currentExerciseSets + progressionSets >
    muscleData.MAV
  ) {
    return true;
  } else {
    return false;
  }
};

export const findOptimalSplit = (
  muscle: MuscleType,
  targetExercises: ExerciseType[]
) => {
  const targetMuscles = targetExercises.map((each) => each.muscle);
  const allMuscles = [...targetMuscles, muscle];
  const muscleSet = new Set(allMuscles);

  const splitMap = new Map<SplitType, number>();
  for (const item of muscleSet.values()) {
    const splits = getAvailableSplitsByMuscle(item);

    splits.forEach((each) => {
      if (splitMap.has(each)) {
        const value = splitMap.get(each);
        if (value) {
          splitMap.set(each, value + 1);
        }
      } else {
        splitMap.set(each, 1);
      }
    });
  }

  const optimalSplits: SplitType[] = [];

  const setSize = muscleSet.size;
  splitMap.forEach((value, key) => {
    if (value >= setSize) {
      optimalSplits.push(key);
    }
  });

  return optimalSplits;
};

const SUPERSET_COLORS = [
  "bg-rose-500",
  "bg-rose-400",
  "bg-rose-300",
  "bg-rose-200",
];

export const getSupersetMap = (exercises: ExerciseType[]) => {
  const paired = new Map<string, string>();
  let supersetIndex = 0;

  for (let i = 0; i < exercises.length; i++) {
    const supersetWithId = exercises[i].supersetWith;
    const currentId = exercises[i].id;

    const supersetColor = SUPERSET_COLORS[supersetIndex];
    if (!supersetWithId) continue;
    const supersetKey = paired.get(supersetWithId);
    const current = paired.get(currentId);
    if (supersetKey) continue;
    else {
      if (current) {
        paired.set(supersetWithId, current);
      } else {
        paired.set(supersetWithId, supersetColor);

        if (supersetIndex + 1 >= SUPERSET_COLORS.length - 1) {
          supersetIndex = 0;
        } else {
          supersetIndex++;
        }
      }
    }
  }

  return paired;
};
