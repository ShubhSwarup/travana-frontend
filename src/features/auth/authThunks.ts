import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "./authAPI";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const token = await authAPI.login(email, password);
      return token;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    thunkAPI,
  ) => {
    try {
      const token = await authAPI.register(name, email, password);
      return token;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Signup failed",
      );
    }
  },
);
