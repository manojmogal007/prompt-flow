import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/types";

interface AuthState {
  accessToken: string;
}

const initialState: AuthState = {
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    handleAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { handleAccessToken } = authSlice.actions;
export const accessTokenConfig = (state: RootState) => state.auth.accessToken;
export default authSlice.reducer;
