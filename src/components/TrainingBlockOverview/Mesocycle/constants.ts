export const EXERCISE_HEADERS = ["#", "Group", "Name", "Equipment", "Modality"];
export const WEEK_HEADERS = ["Set", "Rep", "Lbs", "RIR"];
export const WEEK_TWO_TO_FOUR_HEADERS = ["Sets", "Weight", "RIR"];

export const ROW_SECTION_WIDTHS = [
  "5%",
  "45%",
  "10%",
  "10%",
  "10%",
  "10%",
  "10%",
];
// export const ROW_SECTION_WIDTHS = [
//   "65px",
//   "315px",
//   "120px",
//   "100px",
//   "100px",
//   "100px",
//   "120px",
// ];
const DAY_WIDTH = "w-14";
const EXERCISE_WIDTHS = ["w-4", "w-14", "w-44", "w-14", "w-14"];
const WEEK_WIDTHS = ["w-6", "w-6", "w-6", "w-6"];
export const CELL_WIDTHS = {
  day: DAY_WIDTH,
  exercise: {
    headers: EXERCISE_HEADERS,
    widths: EXERCISE_WIDTHS,
  },
  week: {
    headers: WEEK_HEADERS,
    widths: WEEK_WIDTHS,
  },
};

// const EXERCISE_WIDTHS = ["w-[5%]", "w-[12%]", "w-[51%]", "w-[16%]", "w-[16%]"];
const week_one_deload_widths = ["w-[20%]", "w-[25%]", "w-[35%]", "w-[20%]"];
const week_two_three_four_widths = ["w-[25%]", "w-[50%]", "w-[25%]"];

export const ROW_CELL_WIDTHS = {
  session: ["5%"],
  exercise: EXERCISE_WIDTHS,
  "week 1": week_one_deload_widths,
  "week 2": week_two_three_four_widths,
  "week 3": week_two_three_four_widths,
  "week 4": week_two_three_four_widths,
  deload: week_one_deload_widths,
};
