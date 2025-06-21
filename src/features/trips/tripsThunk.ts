import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { Trip } from "../../types/trips";
import { startLoading, stopLoading } from "../ui/uiSlice"; // ✅ import stopLoading

// 1. Fetch Trips
export const fetchTrips = createAsyncThunk<
  Trip[],
  void,
  { rejectValue: string }
>("trips/fetchTrips", async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(startLoading());
    const res = await api.get("/trips");
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch trips"
    );
  } finally {
    dispatch(stopLoading());
  }
});

// 2. Generate Trip via AI
export const generateAITrip = createAsyncThunk<
  Trip,
  Partial<Trip>,
  { rejectValue: string }
>("trips/generateAITrip", async (payload, { rejectWithValue, dispatch }) => {
  try {
    dispatch(startLoading());
    const res = await api.post("/ai/generate-trip", payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "AI trip generation failed"
    );
  } finally {
    dispatch(stopLoading());
  }
});

// 3. Create Trip in DB
export const createTrip = createAsyncThunk<
  Trip,
  Trip,
  { rejectValue: string }
>("trips/createTrip", async (tripData, { rejectWithValue, dispatch }) => {
  try {
    dispatch(startLoading());
    const res = await api.post("/trips", tripData);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to save trip"
    );
  } finally {
    dispatch(stopLoading());
  }
});
