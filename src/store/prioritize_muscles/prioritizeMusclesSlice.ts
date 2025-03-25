import { createSlice } from "@reduxjs/toolkit";
import { MUSCLE_PRIORITY_LIST } from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/musclePriorityListHandlers";

const prioritizeMusclesSlice = createSlice({
  name: "prioritize_muscles",
  initialState: MUSCLE_PRIORITY_LIST,
  reducers: {},
});

export const {} = prioritizeMusclesSlice.actions;
export default prioritizeMusclesSlice.reducer;
