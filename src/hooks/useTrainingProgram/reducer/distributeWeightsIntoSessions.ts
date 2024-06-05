export const getMaxFrequencyByMatrix = (
  range: string,
  rank: number,
  mrv_breakpoint: number
) => {
  switch (range) {
    case "3,6":
      return THREE_SIX[mrv_breakpoint][rank];
    case "3,4":
      return THREE_FOUR[mrv_breakpoint][rank];
    case "2,4":
      return TWO_FOUR[mrv_breakpoint][rank];
    case "2,3":
      return TWO_THREE[mrv_breakpoint][rank];
    case "2,5":
      return TWO_FIVE[mrv_breakpoint][rank];
    default:
      return THREE_SIX[3][0];
  }
};

const THREE_SIX = [
  [6],
  [6, 6],
  [6, 6, 5],
  [6, 5, 5, 4],
  [5, 5, 4, 3, 3],
  [5, 4, 3, 3, 3, 3],
  [4, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const THREE_SIX_MIN = [
  [5],
  [5, 5],
  [5, 5, 4],
  [4, 4, 3, 3],
  [4, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const THREE_FOUR = [
  [4],
  [4, 4],
  [4, 4, 4],
  [4, 4, 4, 3],
  [4, 4, 3, 3, 3],
  [4, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const THREE_FOUR_MIN = [
  [4],
  [4, 4],
  [4, 4, 4],
  [3, 3, 3, 3],
  [3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const TWO_THREE = [
  [3],
  [3, 3],
  [3, 3, 3],
  [3, 3, 3, 3],
  [3, 3, 3, 2, 2],
  [3, 3, 2, 2, 2, 2],
  [3, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
const TWO_FOUR = [
  [4],
  [4, 4],
  [4, 4, 4],
  [4, 4, 3, 3],
  [4, 4, 3, 3, 2],
  [4, 3, 3, 2, 2, 2],
  [3, 3, 2, 2, 2, 2, 2],
  [3, 2, 2, 2, 2, 2, 2, 2],
];
const TWO_FOUR_MIN = [
  [4],
  [4, 4],
  [4, 4, 3],
  [3, 3, 3, 2],
  [3, 3, 2, 2, 2],
  [3, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
const TWO_FIVE = [
  [5],
  [5, 5],
  [5, 5, 5],
  [5, 5, 4, 4],
  [5, 4, 4, 3, 3],
  [4, 4, 3, 3, 2, 2],
  [4, 3, 3, 2, 2, 2, 2],
  [3, 3, 2, 2, 2, 2, 2, 2],
];
const TWO_FIVE_MIN = [
  [5],
  [5, 5],
  [5, 5, 4],
  [4, 3, 3, 2],
  [3, 3, 2, 2, 2],
  [3, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
