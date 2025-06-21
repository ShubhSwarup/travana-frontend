// src/features/trips/tripSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { TripState } from "../../types/trips";
import { fetchTrips } from "./tripsThunk";

const initialState: TripState = {
  trips: [],
  status: "idle",
  error: null,
};

const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});
export default tripSlice.reducer;
