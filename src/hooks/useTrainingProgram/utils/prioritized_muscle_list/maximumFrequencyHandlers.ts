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
    return frequency;
  } else {
    const total = range[0] + range[1];
    return Math.floor(total / 2);
  }
};

const getFrequencyRange_mev_mv = (volume: number): [number, number] => {
  switch (volume) {
    case 0:
      return [0, 0];
    case 2:
      return [1, 1];
    case 4:
      return [1, 2];
    case 6:
      return [1, 3];
    case 8:
      return [1, 3];
    case 10:
      return [1, 3];
    default:
      return [0, 0];
  }
};
export const getFrequencyRange = (
  muscle: MuscleType,
  rank: VolumeLandmarkType,
  range: [number, number]
) => {
  let newFrequency: [number, number] = [...range];
  if (rank === "MEV" || rank === "MV") {
    const muscleData = getMuscleData(muscle);
    const maxVolume = muscleData[rank];
    newFrequency = getFrequencyRange_mev_mv(maxVolume);
  }
  return newFrequency;
};
// mesocycles |  1  2  3
// ----------------------
// freqEnd  1 |  1  1  1
// freqEnd  2 |  1  2  2
// freqEnd  3 |  1  2  3
// freqEnd  4 |  2  3  4
// freqEnd  5 |  3  4  5
// freqEnd  6 |  4  5  6

// mesocycles |  1  2  3  4
// -------------------------
// freqEnd  1 |  1  1  1  1
// freqEnd  2 |  1  1  2  2
// freqEnd  3 |  1  2  2  3
// freqEnd  4 |  1  2  3  4
// freqEnd  5 |  2  3  4  5
// freqEnd  6 |  3  4  5  6

// mesocycles |  1  2  3  4  5
// ----------------------------
// freqEnd  1 |  1  1  1  1  1
// freqEnd  2 |  1  1  2  2  2
// TEST       |  2  1.8 1.6 1.4 1
// freqEnd  3 |  1  2  2  3  3
// TEST          3  2.6 2.2 1.8  1

// freqEnd  4 |  1  2  3  3  4
// TEST          4 3.3 2.7 2.1 1

// freqEnd  5 |  1  2  3  4  5
// freqEnd  6 |  2  3  4  5  6

// case where MV frequency is 0, needs to be factored in.
export const determineFrequencyProgression = (
  mesocycles: number,
  tar_frequency: number
) => {
  const freq_prog: number[] = [tar_frequency];
  switch (true) {
    case tar_frequency === 1:
      return Array.from(Array(mesocycles), (e, i) => 1);
    case mesocycles <= tar_frequency:
      for (let i = 1; i < mesocycles; i++) {
        freq_prog.push(tar_frequency - i);
      }
      return freq_prog.reverse();
    default:
      const spread = tar_frequency - 1;
      const decrement = spread / mesocycles;

      for (let i = 1; i < mesocycles; i++) {
        freq_prog.push(Math.round(tar_frequency - decrement * i));
      }
      return freq_prog.reverse();
  }
};
