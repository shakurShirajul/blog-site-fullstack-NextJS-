import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { create } from "domain";
interface UserState {
  user: null | { name: string; email: string; image?: string };
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ name: string; email: string }>
    ) => {
      state.user = action.payload;
    },
    logut: (state) => {
      state.user = null;
    },
  },
});
export const { setUser, logut } = userSlice.actions;
export default userSlice.reducer;
