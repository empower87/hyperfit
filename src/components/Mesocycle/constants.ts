export const SESSION_HEADERS = [
  "#",
  "Group",
  "Exercise",
  "Category",
  "Modality",
];
export const WEEK_ONE_HEADERS = ["Sets", "Reps", "Weight", "RIR"];
export const WEEK_TWO_TO_FOUR_HEADERS = ["Sets", "Weight", "RIR"];

export const ROW_SECTION_WIDTHS = [
  "80px",
  "300px",
  "120px",
  "100px",
  "100px",
  "100px",
  "120px",
];

const EXERCISE_WIDTHS = ["5%", "15%", "50%", "15%", "15%"];
const week_one_deload_widths = ["20%", "25%", "35%", "20%"];
const week_two_three_four_widths = ["25%", "50%", "25%"];

export const ROW_CELL_WIDTHS = {
  exercise: EXERCISE_WIDTHS,
  "week 1": week_one_deload_widths,
  "week 2": week_two_three_four_widths,
  "week 3": week_two_three_four_widths,
  "week 4": week_two_three_four_widths,
  deload: week_one_deload_widths,
};
