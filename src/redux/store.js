import { configureStore } from "@reduxjs/toolkit";
import { baseAPI } from "./api/baseAPI";
import geminiSlice from "./features/geminiSlice";
export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    gemini: geminiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseAPI.middleware),
});
