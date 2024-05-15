const CHEST = 260;
const BICEPS = 112;
const TRICEPS = 237;
const QUADS = 1791;
const HAMSTRINGS = 724;
const CALVES = 849;
// ABS: GUESSING ENTIRELY
const ABS = 300;
// DELTS
const DELTS = 376;
const DELTS_FRONT = DELTS * 0.35;
const DELTS_REAR = DELTS * 0.25;
const DELTS_SIDE = DELTS * 0.4;
// TRAPS
const ENTIRE_TRAPS = 271;
const MIDDLE_TRAPS = ENTIRE_TRAPS * 0.4;
const TRAPS = ENTIRE_TRAPS * 0.6;
// FOREARMS
const BRACHIORADIALIS = 65 - 20;
const PRONATOR_TERES = 38 - 20;
const FLEXOR_CARPI_RADIALIS = 34 - 20;
const PALMARIS_LONGUS = 10 - 5;
const FLEXOR_CARPI_ULNARIS = 34 - 20;
const FOREARMS =
  BRACHIORADIALIS +
  PRONATOR_TERES +
  FLEXOR_CARPI_RADIALIS +
  PALMARIS_LONGUS +
  FLEXOR_CARPI_ULNARIS;
// BACK
const TERES_MAJOR = 35 - 20;
const TERES_MINOR = 30 - 20;
const INFRASPINATUS = 125 - 20;
const LATS = 244;
const BACK = TERES_MAJOR + TERES_MINOR + INFRASPINATUS + LATS + MIDDLE_TRAPS;
// GLUTES
const GLUTES_MAX = 871;
const GLUTES_MED = 332;
const GLUTES = GLUTES_MAX + GLUTES_MED;

const TOTAL_MUSCLE_VOLUME =
  ABS +
  BACK +
  BICEPS +
  CALVES +
  CHEST +
  DELTS_FRONT +
  DELTS_REAR +
  DELTS_SIDE +
  FOREARMS +
  GLUTES +
  HAMSTRINGS +
  QUADS +
  TRAPS +
  TRICEPS;

// Gets an integer that is a percentage of total body
export const MUSCLE_WEIGHTS = {
  abs: Math.floor((ABS / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  back: Math.floor((BACK / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  traps: Math.floor((TRAPS / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  biceps: Math.floor((BICEPS / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  calves: Math.floor((CALVES / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  chest: Math.floor((CHEST / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  delts_front: Math.floor((DELTS_FRONT / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  delts_rear: Math.floor((DELTS_REAR / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  delts_side: Math.floor((DELTS_SIDE / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  forearms: Math.floor((FOREARMS / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  glutes: Math.floor((GLUTES_MAX / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  hamstrings: Math.floor((HAMSTRINGS / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  quads: Math.floor((QUADS / TOTAL_MUSCLE_VOLUME) * 14 * 10),
  triceps: Math.floor((TRICEPS / TOTAL_MUSCLE_VOLUME) * 14 * 10),
};

const getMultiplier = (num: number, num_total: number) => {
  const integer = Math.floor((num / num_total) * 14 * 10);
  const multiplier_twoDigits = integer * 0.01 + 1;
  return multiplier_twoDigits;
};

export const MUSCLE_WEIGHTS_MODIFIERS = {
  abs: {
    muscleVolume: getMultiplier(ABS, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 4.5, // 3-6
    weight: 7 - 5,
  },
  back: {
    muscleVolume: getMultiplier(BACK, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 3.5, // 3-4
    weight: 7 - 3,
  },
  traps: {
    muscleVolume: getMultiplier(TRAPS, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 3, // 2-4
    weight: 7 - 4,
  },
  biceps: {
    muscleVolume: getMultiplier(BICEPS, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 4.5, // 3-6
    weight: 7 - 4,
  },
  calves: {
    muscleVolume: getMultiplier(CALVES, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 4.5, // 3-6
    weight: 7 - 5,
  },
  chest: {
    muscleVolume: getMultiplier(CHEST, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 4, // 2-4
    weight: 7 - 3,
  },
  delts_front: {
    muscleVolume: getMultiplier(DELTS_FRONT, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 2.5, // 2-3
    weight: 7 - 5,
  },
  delts_rear: {
    muscleVolume: getMultiplier(DELTS_REAR, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 4.5, // 3-6
    weight: 7 - 5,
  },
  delts_side: {
    muscleVolume: getMultiplier(DELTS_SIDE, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 4.5, // 3-6
    weight: 7 - 5,
  },
  forearms: {
    muscleVolume: getMultiplier(FOREARMS, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 4.5, // 3-6
    weight: 7 - 6,
  },
  glutes: {
    muscleVolume: getMultiplier(GLUTES_MAX, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 3.5, // 2-5
    weight: 7 - 3,
  },
  hamstrings: {
    muscleVolume: getMultiplier(HAMSTRINGS, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 2.5, // 2-3
    weight: 7 - 3,
  },
  quads: {
    muscleVolume: getMultiplier(QUADS, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 3.5, // 2-5
    weight: 7 - 3,
  },
  triceps: {
    muscleVolume: getMultiplier(TRICEPS, TOTAL_MUSCLE_VOLUME),
    optimalFrequency: 3, // 2-4
    weight: 7 - 4,
  },
};
