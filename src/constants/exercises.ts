// -- Notes -- //
// -- Add in logic for supersets and staggering rest time instead of jumping back to back into exercises
// -- supersets should be antagonist muscles. ie. bicep curls > tricep extensions .. bench press > bent-over row .. etc.

export const BACK_EXERCISES = [
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
    name: "Meadow's Row",
    rank: 2,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["bench"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Pull Ups",
    rank: 3,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbell"],
    requirements: ["bench"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Lat Pulldown",
    rank: 4,
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

const CHEST_EXERCISES = [
  {
    name: "Bench Press",
    rank: 1,
    group: "chest",
    specification: "lat",
    versions: ["dumbbell", "barbbell"],
    requirements: ["bench"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Chest Fly",
    rank: 2,
    group: "chest",
    specification: "lat",
    requirements: ["bench", "dumbbell", "machine", "cable"],
    angle: ["incline", "decline", "flat"],
    variations: [],
  },
  {
    name: "Chest Press",
    rank: 3,
    group: "chest",
    specification: "lat",
    requirements: ["machine"],
    angle: ["incline", "decline", "flat"],
    variations: ["close-grip", "wide-grip"],
  },
  {
    name: "Pushup",
    rank: 4,
    group: "chest",
    specification: "lat",
    requirements: [],
    angle: ["incline", "flat"],
    variations: ["diamond"],
  },
];

enum ExerciseEnum {
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
  "3_x_x_x_1",
  "3_x_x_1_1",
  "4_x_x_x_2",
  "3_x_x_4_3",
  "1_x_x_5_3",
  "1_3_4_x_3",
];

export const topSideDeltExercises = [
  "1_x_x_x_1",
  "3_x_x_6_1",
  "3_x_x_9_1",
  "1_3_1_x_1",
  "1_1_x_x_4",
  "2_1_x_x_4",
  "2_x_x_x_2",
  "3_x_x_x_2",
];

export const topBackExercises = ["2_x_3_x_1", ""];

const DELTS_REAR_EXERCISES = [
  {
    name: "Rear Delt Flyes",
    rank: 1,
    group: "delts_rear",
    specification: "lat",
    requirements: ["cable"],
    angle: [],
    variations: [],
  },
  {
    name: "Reverse Flyes",
    rank: 2,
    group: "delts_rear",
    specification: "lat",
    requirements: ["dumbbell"],
    angle: [],
    variations: ["bent-over", "chest-supported"],
  },
  {
    name: "Rear Delt Row",
    rank: 3,
    group: "delts_rear",
    specification: "lat",
    requirements: ["dumbbell", "barbell", "cable"],
    angle: [],
    variations: ["bent-over", "chest-supported"],
  },
  {
    name: "Face Pull",
    rank: 4,
    group: "delts_rear",
    specification: "lat",
    requirements: ["cable"],
    angle: [],
    variations: [],
  },
];

const angle = "seated";
const equipment = "dumbbell";
const variation = "lying";
const name = "Shoulder Press";
const exerciseKey = `${angle}_${equipment}_${name}`;

export const topFrontDelts = ["1-1-0", "1-0-0", "1-1-1", "1-0-1", "3-0-0"];

const DELTS_SIDE_FRONT_EXERCISES = [
  {
    name: "Lateral Raise",
    rank: 1,
    group: "delts_side",
    specification: "lat",
    requirements: ["dumbbell", "cable"],
    angle: [],
    variations: ["full-ROM", "chest-supported"],
  },
  {
    name: "Upright Row",
    rank: 2,
    group: "delts_side",
    specification: "lat",
    requirements: ["dumbbell", "barbell", "cable"],
    angle: [],
    variations: [],
  },
  {
    name: "Arnold Press",
    rank: 3,
    group: "delts_side",
    specification: "lat",
    requirements: ["bench", "dumbbell"],
    angle: [],
    variations: [],
  },
  {
    name: "Shoulder Press",
    rank: 4,
    group: "delts_front",
    specification: "lat",
    requirements: ["dumbbell", "barbell"],
    angle: [],
    variations: ["seated", "standing"],
  },
];

const BICEPS_EXERCISES = [
  {
    name: "Biceps Curls",
    rank: 1,
    group: "biceps",
    specification: "lat",
    requirements: ["cable", "dumbbell", "barbell", "ez-curl-bar"],
    angle: [],
    variations: [],
  },
  {
    name: "Rear Delt Fly",
    rank: 2,
    group: "biceps",
    specification: "lat",
    requirements: ["dumbbell", "machine", "cable"],
    angle: [],
    variations: [],
  },
  {
    name: "Reverse Fly",
    rank: 3,
    group: "biceps",
    specification: "lat",
    requirements: ["dumbbell"],
    angle: [],
    variations: ["bent-over", "chest-supported"],
  },
  {
    name: "Rear Delt Row",
    rank: 4,
    group: "biceps",
    specification: "lat",
    requirements: ["dumbbell", "barbell"],
    angle: [],
    variations: ["bent-over", "chest-supported"],
  },
  {
    name: "Face Pull",
    rank: 5,
    group: "biceps",
    specification: "lat",
    requirements: ["cable"],
    angle: [],
    variations: [],
  },
];
