// src/features/auth/authThunks.ts
import * as authAPI from "./authAPI";
import { createAppThunk } from "../../utils/createAppThunk";
import { AuthResponse } from "../../types/auth";

//   Login User
export const loginUser = createAppThunk<
  AuthResponse,
  { email: string; password: string }
>({
  typePrefix: "auth/login",
  payloadCreator: async ({ email, password }) => {
    const response = await authAPI.login(email, password);
    return response; // Already matches AuthResponse
  },
  showErrorPopup: false,
});

//   Register User
export const registerUser = createAppThunk<
  AuthResponse,
  { name: string; email: string; password: string }
>({
  typePrefix: "auth/register",
  payloadCreator: async ({ name, email, password }) => {
    const response = await authAPI.register(name, email, password);
    return response; // Already matches AuthResponse
  },
  showErrorPopup: false,
});

export const fetchCurrentUser = createAppThunk<
  { id: string; name: string; email: string },
  void
>({
  typePrefix: "auth/fetchCurrentUser",
  payloadCreator: async (_, { rejectWithValue }) => {
    const response = await authAPI.getCurrentUser(); // create this in api file
    return response;
  },
});
