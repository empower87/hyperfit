// TOTAL_SESSION = 6

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
const MAX_MEV_FREQUENCY = 2;

// NOTE: may need to adjust how this responds to total_sessions
export const determineFrequencyByRange = (
  range: [number, number],
  rank: number,
  breakpoints: [number, number],
  total_sessions: number
) => {
  if (rank >= breakpoints[0] && rank < breakpoints[1]) return 2;
  else if (rank >= breakpoints[1]) return 1;
  else {
    const min = Math.max(range[0], MIN_MRV_FREQUENCY);
    const max = Math.min(range[1] - rank, total_sessions);
    const spread = max - min;
    const decrement = spread / breakpoints[0];

    let frequency = 0;
    if (spread === 1) {
      frequency = Math.round(max - decrement * rank);
    } else {
      frequency = Math.floor(max - decrement * rank);
    }

    return frequency;
  }
};
