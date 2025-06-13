import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  response: null,
  loading: false,
  error: null,
};

const geminiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setGeneratedContent: (state, action) => {
      state.response = action.payload;
      state.loading = false;
      state.error = null;
    },
    setGeminiLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.response = null;
    },
    setGeminiError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.response = null;
    },
  },
});
export const { setGeneratedContent, setGeminiLoading, setGeminiError } =
  geminiSlice.actions;

export default geminiSlice.reducer;
