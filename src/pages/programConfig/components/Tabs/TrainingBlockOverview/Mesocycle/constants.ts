export const EXERCISE_HEADERS = ["#", "Group", "Name", "Equipment", "Modality"];
export const WEEK_HEADERS = ["Set", "Rep", "Lbs", "RIR"];

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
