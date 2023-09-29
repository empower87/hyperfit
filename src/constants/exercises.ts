// -- Notes -- //
// -- Add in logic for supersets and staggering rest time instead of jumping back to back into exercises
// -- supersets should be antagonist muscles. ie. bicep curls > tricep extensions .. bench press > bent-over row .. etc.

type ExerciseType = {
  name: string;
  rank: number;
  group: string;
  specification: string;
  versions: string[];
  requirements: string[];
  angle: string[];
  variations: string[];
};

export const BACK_EXERCISES: ExerciseType[] = [
  {
    name: "Rows",
    rank: 1,
    group: "back",
    specification: "upper",
    versions: ["dumbbell", "barbell"],
    requirements: ["barbell"],
    angle: [],
    variations: [],
  },
  {
    name: "Pull Ups",
    rank: 2,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["bench"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Lat Pulldown",
    rank: 3,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["bench"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Lat Prayers",
    rank: 4,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["bench"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Lat-Focused Rows",
    rank: 5,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["bench"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Meadow's Row",
    rank: 6,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["bench"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
];

export const TRICEPS_EXERCISES = [
  {
    name: "Incline Dumbbell Kickback",
    muscle: "triceps",
    specification: "upper",
    requirements: ["barbell"],
    variations: [],
  },
  {
    name: "Overhead Triceps Extension",
    muscle: "triceps",
    specification: "upper",
    requirements: ["barbell", "dumbbell", "dumbbells", "cable"],
    variations: ["barbell", "dumbbell", "dumbbells", "cable"],
  },
  {
    name: "Incline Triceps Extension",
    muscle: "triceps",
    specification: "upper",
    requirements: ["barbell"],
    variations: [],
  },
  {
    name: "Skullcrusher",
    muscle: "triceps",
    specification: "upper",
    requirements: ["dumbbell", "bench"],
    variations: [],
  },
  {
    name: "Triceps Pushdown",
    muscle: "triceps",
    specification: "upper",
    requirements: ["dumbbell", "bench"],
    variations: [],
  },
  {
    name: "Close-Grip Bench Press",
    muscle: "triceps",
    specification: "upper",
    requirements: ["dumbbell", "bench"],
    variations: [],
  },
  {
    name: "Dumbbell Row",
    muscle: "triceps",
    specification: "upper",
    requirements: ["dumbbell"],
    variations: [],
  },
  {
    name: "Barbell Row (Lat-Focused)",
    muscle: "triceps",
    specification: "lat",
    requirements: ["barbell"],
    variations: [],
  },
  {
    name: "Seated Row (Lat-Focused)",
    muscle: "triceps",
    specification: "lat",
    requirements: ["machine"],
    variations: ["neutral-grip", "pronated-grip"],
  },
  {
    name: "Dumbbell Lat Row",
    muscle: "triceps",
    specification: "lat",
    requirements: ["dumbbell", "bench"],
    variations: ["Chest-Supported"],
  },
  {
    name: "Lat Pulldown (One-Arm)",
    muscle: "triceps",
    specification: "lat",
    requirements: ["machine"],
    variations: [],
  },
];

const CHEST_EXERCISES: ExerciseType[] = [
  {
    name: "Bench Press",
    rank: 1,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["bench"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Chest Fly",
    rank: 2,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["bench", "dumbbell", "machine", "cable"],
    angle: ["incline", "decline", "flat"],
    variations: [],
  },
  {
    name: "Chest Press",
    rank: 3,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["machine"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Pushup",
    rank: 4,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: [],
    angle: ["incline", "flat"],
    variations: ["diamond"],
  },
];

enum EquipmentEnum {
  "dumbbell",
  "barbell",
  "cable",
  "machine",
}

enum PositionEnum {
  "seated",
  "standing",
  "lying",
}

enum AngleEnum {
  "incline",
  "decline",
  "chest-supported",
  "bent-over",
}

enum AdditionalInformationEnum {
  "single-arm",
  "double-arm",
  "close-grip",
  "wide-grip",
  "chest-supported",
  "leaning",
  "cross-body",
  "cross-arm",
  "behind-the-back",
}

// legend: equipment_position_angle_additional_exercise-rank
export const topRearDeltExercises = [
  "3_0_0_0_1",
  "3_0_0_1_1",
  "4_0_0_0_2",
  "3_0_0_4_3",
  "1_0_0_5_3",
  "1_3_4_0_3",
];

export const topSideDeltExercises = [
  "1_0_0_0_1",
  "3_0_0_6_1",
  "3_0_0_9_1",
  "1_3_1_0_1",
  "1_1_0_0_4",
  "2_1_0_0_4",
  "2_0_0_0_2",
  "3_0_0_0_2",
];

export const topUpperBackExercises = [
  "2_0_4_0_1",
  "3_1_0_0_1",
  "2_0_0_0_6",
  "1_0_1_4_1",
  "0_0_0_0_2",
  "0_0_0_0_3",
];

export const topLatBackExercises = [
  "3_1_0_0_1",
  "1_0_1_5_5",
  "1_0_0_0_5",
  "1_0_0_1_3",
];

const TEST = {
  name: "Rows",
  rank: 1,
  group: "back",
  specification: "upper",
  versions: ["dumbbell", "barbell"],
  requirements: ["barbell"],
  angle: [],
  variations: [],
};

const getExerciseObject = (key: string, exercises: ExerciseType[]) => {
  if (!key) return TEST;
  const splitString = key.split("_").map((each) => parseInt(each));

  const equipment = splitString[0] !== 0 ? EquipmentEnum[splitString[0]] : "";
  const position = splitString[1] !== 0 ? PositionEnum[splitString[1]] : "";
  const angle = splitString[2] !== 0 ? AngleEnum[splitString[2]] : "";
  const additional =
    splitString[3] !== 0 ? AdditionalInformationEnum[splitString[3]] : "";
  const exercise = exercises.filter((each) => each.rank === splitString[4]);
  const name =
    `${equipment} ${position} ${angle} ${additional} ${exercise[0].name}`.replace(
      /-+/g,
      " "
    );
  const newExercise = { ...exercise[0], name: name };
  return newExercise;
};

export function getExercise(group: string, index: number) {
  let key: string;

  switch (group) {
    case "back":
      key =
        index % 2 === 0
          ? topLatBackExercises[index]
          : topUpperBackExercises[index];
      return getExerciseObject(key, BACK_EXERCISES);
    case "chest":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
    case "delts_side":
      key = topSideDeltExercises[index]
        ? topSideDeltExercises[index]
        : topSideDeltExercises[0];
      return getExerciseObject(key, DELTS_SIDE_FRONT_EXERCISES);
    case "delts_front":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, DELTS_SIDE_FRONT_EXERCISES);
    case "delts_rear":
      key = topRearDeltExercises[index]
        ? topRearDeltExercises[index]
        : topRearDeltExercises[0];
      return getExerciseObject(key, DELTS_REAR_EXERCISES);
    case "triceps":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
    case "biceps":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
    case "traps":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
    case "forearms":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
    case "quads":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
    case "hamstrings":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
    case "glutes":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
    case "calves":
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
    default:
      key = topLatBackExercises[index]
        ? topLatBackExercises[index]
        : topLatBackExercises[0];
      return getExerciseObject(key, BACK_EXERCISES);
  }
}

const DELTS_REAR_EXERCISES: ExerciseType[] = [
  {
    name: "Rear Delt Flyes",
    rank: 1,
    group: "delts_rear",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["cable"],
    angle: [],
    variations: [],
  },
  {
    name: "Reverse Flyes",
    rank: 2,
    group: "delts_rear",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["dumbbell"],
    angle: [],
    variations: ["bent-over", "chest-supported"],
  },
  {
    name: "Rear Delt Row",
    rank: 3,
    group: "delts_rear",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["dumbbell", "barbell", "cable"],
    angle: [],
    variations: ["bent-over", "chest-supported"],
  },
  {
    name: "Face Pull",
    rank: 4,
    group: "delts_rear",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["cable"],
    angle: [],
    variations: [],
  },
];

const DELTS_SIDE_FRONT_EXERCISES: ExerciseType[] = [
  {
    name: "Lateral Raise",
    rank: 1,
    group: "delts_side",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["dumbbell", "cable"],
    angle: [],
    variations: ["full-ROM", "chest-supported"],
  },
  {
    name: "Upright Row",
    rank: 2,
    group: "delts_side",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["dumbbell", "barbell", "cable"],
    angle: [],
    variations: [],
  },
  {
    name: "Arnold Press",
    rank: 3,
    group: "delts_side",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["bench", "dumbbell"],
    angle: [],
    variations: [],
  },
  {
    name: "Shoulder Press",
    rank: 4,
    group: "delts_front",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["dumbbell", "barbell"],
    angle: [],
    variations: ["seated", "standing"],
  },
];

const BICEPS_EXERCISES: ExerciseType[] = [
  {
    name: "Biceps Curls",
    rank: 1,
    group: "biceps",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["cable", "dumbbell", "barbell", "ez-curl-bar"],
    angle: [],
    variations: [],
  },
  {
    name: "Rear Delt Fly",
    rank: 2,
    group: "biceps",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["dumbbell", "machine", "cable"],
    angle: [],
    variations: [],
  },
  {
    name: "Reverse Fly",
    rank: 3,
    group: "biceps",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["dumbbell"],
    angle: [],
    variations: ["bent-over", "chest-supported"],
  },
  {
    name: "Rear Delt Row",
    rank: 4,
    group: "biceps",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["dumbbell", "barbell"],
    angle: [],
    variations: ["bent-over", "chest-supported"],
  },
  {
    name: "Face Pull",
    rank: 5,
    group: "biceps",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["cable"],
    angle: [],
    variations: [],
  },
];

export const getGrouplist = (group: string) => {
  switch (group) {
    case "back":
      return BACK_EXERCISES;
    case "delts_side":
      return DELTS_SIDE_FRONT_EXERCISES;
    case "delts_front":
      return DELTS_SIDE_FRONT_EXERCISES;
    case "delts_rear":
      return DELTS_REAR_EXERCISES;
    case "chest":
      return CHEST_EXERCISES;
    case "triceps":
      return TRICEPS_EXERCISES;
    case "biceps":
      return BICEPS_EXERCISES;
    case "forearms":
      return BICEPS_EXERCISES;
    case "traps":
      return DELTS_SIDE_FRONT_EXERCISES;
    case "quads":
      return BACK_EXERCISES;
    case "hamstrings":
      return BACK_EXERCISES;
    case "glutes":
      return BACK_EXERCISES;
    case "calves":
      return BACK_EXERCISES;
    case "abs":
      return BACK_EXERCISES;
    default:
      return BACK_EXERCISES;
  }
};
