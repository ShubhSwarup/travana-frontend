import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { Trip } from "../../types/trips";

// Async thunk to fetch trips for the logged-in user
export const fetchTrips = createAsyncThunk<
  Trip[],
  void,
  { rejectValue: string }
>("trips/fetchTrips", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/trips");
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch trips",
    );
  }
});
