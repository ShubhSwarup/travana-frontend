// src/features/user/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  name: string | null;
  email: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  name: null,
  email: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = null;
      state.email = null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
