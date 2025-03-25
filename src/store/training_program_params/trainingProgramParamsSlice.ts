import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_TRAINING_PROGRAM_PARAMS } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

const trainingProgramParamsSlice = createSlice({
  name: "training_program_params",
  initialState: INITIAL_TRAINING_PROGRAM_PARAMS,
  reducers: {},
});

export const {} = trainingProgramParamsSlice.actions;
export default trainingProgramParamsSlice.reducer;
