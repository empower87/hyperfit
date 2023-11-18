import { COMBINED_SPLITS, getGroupList } from "~/constants/workoutSplits";
import { ExerciseType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getMuscleData } from "~/utils/getMuscleData";

export const canAddExerciseToSplit = (
  muscleGroup: string,
  targetSplit: string
) => {
  // Can muscleGroup be added to Split type??
  // ---No?: Prompt User if they would like to Update Split
  // ---YES?: Will extra set break past MAV limit?
  //          ---NO?: Add
  //          ---YES?: either adjust sets of all muscle groups or don't add (possible prompt user)

  let groupList = getGroupList(targetSplit);

  if (groupList.includes(muscleGroup)) {
    return true;
  } else return false;
};

export const canAddExerciseSets = (
  exercise: ExerciseType,
  exercises: ExerciseType[]
) => {
  const muscleData = getMuscleData(exercise.group);
  const getMuscleGroupExercises = exercises.filter(
    (each) => each.group === exercise.group
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

export const getSplitOptions = (muscleGroup: string, targetSplit: string) => {
  let groupList = getGroupList(targetSplit);
  let combinedGroup = [...groupList, muscleGroup];

  const list = COMBINED_SPLITS.filter(
    (each) => each.list.length >= combinedGroup.length
  );

  let options = [];
  for (let i = 0; i < list.length; i++) {
    let option = list[i];
    let listlist = list[i].list;

    let add = true;
    for (let j = 0; j < combinedGroup.length; j++) {
      if (!listlist.includes(combinedGroup[j])) {
        add = false;
        break;
      }
    }
    if (add) {
      options.push(option);
    }
  }
  return options;
};
