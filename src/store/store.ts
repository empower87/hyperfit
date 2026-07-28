import { configureStore } from "@reduxjs/toolkit";
import trainingProgramReducer from "./trainingProgram/trainingProgramSlice";
import { persistMiddleware } from "./middleware/persistMiddleware";

export const store = configureStore({
  reducer: {
    trainingProgram: trainingProgramReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
