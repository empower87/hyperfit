// TOTAL_SESSION = 6

import { MuscleType } from "~/constants/workoutSplits";
import { getMuscleData } from "~/utils/getMuscleData";
import { VolumeLandmarkType } from "../../reducer/trainingProgramReducer";

// MRV_BREAKPOINTS = [ 4 , 9 ]

// legs = 1, 7, 11, 14
// freq = 5, 1,  2,  0
// avg  = 2

// pull = 2, 5, 9, 10
// freq = 3, 2, 1, 1
// avg  = 2

// push = 3, 4, 6, 12
// freq = 3, 4, 2, 0
// avg  = 2.25

// mrv_breakpoints is 6
// 3-6
// 6 6 6 6 6 6

// 6 5 5 4 4 3

// 5 4 4 4 3 3 ==== 5 - 3 === 2 / 6 === .33
// 5 4.66 4.33 4 3.66 3.33

// 4 4 4 3 3 3
// 4 3.83 3.66 3.5 3.33 3.17 3
// 4 4 4 3 3 3

// 3 3 3 3 3 3

// 4 3.75 3.5 3.25

// mrv_breakpoint is 4
// 3-6
// 6 6 6 6
// 6 5 4 4

const MIN_MRV_FREQUENCY = 3;
const MIN_MEV_MV_FREQUENCY = 0;
const MAX_MEV_FREQUENCY = 3;

// NOTE: may need to adjust how this responds to total_sessions
export const determineFrequencyByRange = (
  range: [number, number],
  rank: number,
  breakpoints: [number, number],
  total_sessions: number
) => {
  if (rank < breakpoints[0]) {
    const min = Math.max(range[0], MIN_MRV_FREQUENCY);
    const max = Math.max(
      Math.min(range[1] - rank, total_sessions),
      MIN_MRV_FREQUENCY
    );
    const spread = max - min;
    const decrement = spread / breakpoints[0];

    let frequency = 0;
    if (spread === 1) {
      frequency = Math.round(max - decrement * rank);
    } else {
      frequency = Math.floor(max - decrement * rank);
    }
    console.log(
      range,
      rank,
      min,
      max,
      spread,
      decrement,
      frequency,
      "OH BOY LOTS OF DATA"
    );
    return frequency;
  } else {
    const total = range[0] + range[1];
    // return Math.floor(total / 2);
    return range[1];
  }
};

const getFrequencyRange_mev_mv = (volume: number): [number, number] => {
  switch (volume) {
    case 0:
    case 1:
      return [0, 0];
    case 2:
    case 3:
      return [1, 1];
    case 4:
    case 5:
    case 6:
      return [1, 2];
    case 7:
    case 8:
    case 9:
    case 10:
      return [1, 3];
    default:
      return [0, 0];
  }
};

export const getFrequencyRange = (
  muscle: MuscleType,
  landmark: VolumeLandmarkType,
  range: [number, number]
) => {
  let newFrequency: [number, number] = [...range];
  if (landmark !== "MRV") {
    const muscleData = getMuscleData(muscle);
    const maxVolume = muscleData[landmark];
    newFrequency = getFrequencyRange_mev_mv(maxVolume);
  }
  return newFrequency;
};

// NOTE: Seems that subtracting 1 from the target frequency produces the best progression
// mesocycles         |  1    2    3    4    5
// -------------------------------------------
// freqEnd  0  goal   |  0    0    0    0    0   =  0 0 0 0 0
// T (0 - 1)/5 = -0.2 |  0   0.2  0.4  0.6  0.8  =  0 0 0 1 1
// T (0 - 0)/5 = 0    |  0    0    0    0    0   =  0 0 0 0 0

// freqEnd  1  goal   |  1    1    1    1    1   =  1 1 1 1 1
// T (1 - 1)/5 = 0    |  1    1    1    1    1   =  1 1 1 1 1
// T (1 - 0)/5 = 0.2  |  1   0.8  0.6  0.4  0.2  =  0 0 1 1 1

// 2 - 5 = -3
// freqEnd  2         |  1    1    2    2    2
// T (2 - 1)/5 = 0.2  |  2   1.8  1.6  1.4   1   =  1 1 2 2 2
// T (2 - 0)/5 = 0.4  |  2   1.6  1.2  0.8  0.4  =  0 1 1 2 2
// T (2 - 2)/5 = 0    |  2   1.8  1.6  1.4  1.2  =  1 1 2 2 2

// 3 - 5 = -2
// freqEnd  3  goal   |  1    2    2    3    3   =  1 2 2 3 3
// T (3 - 1)/5 = 0.4  |  3   2.6  2.2  1.8   1   =  1 2 2 3 3
// T (3 - 0)/5 = 0.6  |  3   2.4  1.8  1.2  0.6  =  1 1 2 2 3
// T (3 - 2)/5 = 0.2  |  3   2.8  2.6  2.4  2.2  =  2 2 3 3 3

// 4 - 5 = -1
// freqEnd  4  goal   |  1    2    3    3    4   =  1 2 3 3 4
// T (4 - 1)/5 = 0.6  |  4   3.4  2.8  2.2  1.6  =  2 2 3 3 4
// T (4 - 0)/5 = 0.8  |  4   3.2  2.4  1.6  0.8  =  1 2 2 3 4
// T (4 - 3)/5 = 0.2  |  4   3.8  3.6  3.4  3.2  =  3 3 4 4 4

// 5 - 5 = 0
// freqEnd  5 goal    |  1    2    3    4    5   =  1 2 3 4 5
// T (5 - 1)/5 = 0.8  |  5   4.2  3.4  2.6  1.8  =  2 3 3 4 5
// T (5 - 0)/5 = 1    |  5    4    3    2    1   =  1 2 3 4 5

// 6 - 5 = 1
// freqEnd  6 goal    |  2    3    4    5    6   =  2 3 4 5 6
// T (6 - 1)/5 = 1    |  6    5    4    3    2   =  2 3 4 5 6
// T (6 - 0)/5 = 1.2  |  6   4.8  3.6  2.4  1.2  =  1 2 4 5 6
// T (6 - 2)/5 = 0.8  |  6   5.2  4.4  3.6  2.8  =  3 4 4 5 6

// mesocycles         |  1    2    3    4
// --------------------------------------
// freqEnd  0  goal   |  0    0    0    0   =  0 0 0 0
// T (0 - 1)/3 = -0.3 |  0   0.3  0.6   4   =  0 0 1
// T (0 - 0)/3 = 0    |  0    0    0    4   =  0 0 0

// freqEnd  1  goal   |  1    2    3    4   =  1 2 3 4
// T (1 - 1)/3 = 0    |  1    1    1    4   =  1 1 1 1
// T (1 - 0)/3 = 0.3  |  1   0.7  0.3   4   =  0 1 1

// 2 - 4 = -2
// freqEnd  2         |  1    1    2    2   =  1 1 2 2
// T (2 - 1)/4 = 0.3  |  2   1.8  1.5  1.3  =  1 2 2 2
// T (2 - 0)/4 = 0.5  |  2   1.5   1   0.5  =  1 1 2 2
// T (2 - 2)/4 = 0    |  2    2    2    2   =  2 2 2 2

// 3 - 4 = -1
// freqEnd  3  goal   |  1    2    2    3   =  1 2 2 3
// T (3 + 1)/4 = 1    |  3    2    1    0  =   0 1 2 3
// T (3 - 1)/4 = 0.5  |  3   2.5   2   1.5  =  2 2 3 3
// T (3 - 0)/4 = 0.8  |  3   2.2  1.5  0.6  =  1 2 2 3
// T (3 - 2)/4 = 0.3  |  3   2.7  2.5  2.2  =  2 3 3 3

// 4 - 4 = 0
// freqEnd  4  goal   |  2    3    3    4   =  2 3 3 4
// T (4 - 1)/4 = 1    |  4    3    2    4   =  2 3 4
// T (4 - 0)/4 = 1.3  |  4   2.7  1.4   4   =  1 3 4
// T (4 - 2)/4 = 0.7  |  4   3.3  2.7   4   =  3 3 4

// 5 - 4 = 1
// freqEnd  5 goal    |  2    3    4    5   =  2 3 4 5
// T (5 - 1)/4 = 1.3  |  5   3.7  2.3   4   =  2 4 5
// T (5 - 0)/4 = 1.7  |  5   3.3  1.7   4   =  2 3 5
// T (5 - 2)/4 = 1    |  5    4    3   4    =  3 4 5

// 6 - 4 = 2
// freqEnd  6 goal    |  3    4    5    6   =  3 4 5 6
// T (6 - 1)/4 = 1.7  |  6   4.3  2.6   4   =  3 4 6
// T (6 - 0)/4 = 2    |  6    4    2    4   =  2 4 6
// T (6 - 2)/4 = 1.3  |  6   4.7  3.4   4   =  3 5 6
// T (6 - 3)/4 = 1    |  6    5    4    4   =  4 5 6

// mesocycles         |  1    2    3
// ----------------------------------
// freqEnd  0  goal   |  0    0    0   =  0 0 0
// T (0 - 1)/3 = -0.3 |  0   0.3  0.6  =  0 0 1
// T (0 - 0)/3 = 0    |  0    0    0   =  0 0 0

// freqEnd  1  goal   |  1    1    1   =  1 1 1
// T (1 - 1)/3 = 0    |  1    1    1   =  1 1 1
// T (1 - 0)/3 = 0.3  |  1   0.7  0.3  =  0 1 1

// 2 - 3 = -1
// freqEnd  2         |  1    2    2   =  1 2 2
// T (2 - 1)/3 = 0.3  |  2   1.7  1.4  =  1 2 2
// T (2 - 0)/3 = 0.7  |  2   1.3  0.7  =  1 1 2

// 3 - 3 = 0
// freqEnd  3  goal   |  2    2    3    =  2 2 3
// T (3 - 1)/3 = 0.4  |  3   2.6  2.2   =  2 3 3
// T (3 - 0)/3 = 0.6  |  3   2.4  1.8   =  2 2 3

// 4 - 3 = 1
// freqEnd  4  goal   |  2    3    4    =  2 3 4
// T (4 - 1)/3 = 1    |  4    3    2    =  2 3 4
// T (4 - 0)/3 = 1.3  |  4   2.7  1.4   =  1 3 4
// T (4 - 2)/3 = 0.7  |  4   3.3  2.7   =  3 3 4

// 5 - 3 = 2
// freqEnd  5 goal    |  3    4    5    =  3 4 5
// T (5 - 1)/3 = 1.3  |  5   3.7  2.3   =  2 4 5
// T (5 - 0)/3 = 1.7  |  5   3.3  1.7   =  2 3 5
// T (5 - 2)/3 = 1    |  5    4    3    =  3 4 5

// 6 - 3 = 3
// freqEnd  6 goal    |  4    5    6    =  4 5 6
// T (6 - 1)/3 = 1.7  |  6   4.3  2.6   =  3 4 6
// T (6 - 0)/3 = 2    |  6    4    2    =  2 4 6
// T (6 - 2)/3 = 1.3  |  6   4.7  3.4   =  3 5 6
// T (6 - 3)/3 = 1    |  6    5    4    =  4 5 6

export const initFrequencyProgressionAcrossMesocycles = (
  mesocycles: number,
  target_frequency: number
): number[] => {
  const init_frequency_progression: number[] = Array.from(
    Array(mesocycles),
    (e, i) => target_frequency
  );
  if (target_frequency <= 1) return init_frequency_progression;

  const min_frequency = target_frequency - mesocycles;
  const adj_min_frequncy = min_frequency < 0 ? 1 : min_frequency;
  const total_frequencies_to_decrement = target_frequency - adj_min_frequncy;
  const decrement_value = total_frequencies_to_decrement / mesocycles;

  let decrement_tracker = 0;

  for (let i = init_frequency_progression.length - 1; i >= 0; i--) {
    const frequency = init_frequency_progression[i];
    const final_frequency = Math.round(frequency - decrement_tracker);
    init_frequency_progression[i] = final_frequency;
    decrement_tracker = decrement_tracker + decrement_value;
  }

  return init_frequency_progression;
};
