import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser, loginUser, registerUser } from "../auth/authThunks";

interface UserState {
  isAuthenticated: boolean;
  name: string | null;
  email: string | null;
  id: string | null;
  profilePic?: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  name: null,
  email: null,
  profilePic: null,
  id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = null;
      state.email = null;
      state.profilePic = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        const user = action.payload.user;
        state.name = user.name;
        state.email = user.email;
        state.profilePic = user.profilePic || null;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const user = action.payload.user;
        state.name = user.name;
        state.email = user.email;
        state.profilePic = user.profilePic || null;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
