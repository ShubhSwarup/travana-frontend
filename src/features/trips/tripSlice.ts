// src/features/trips/tripSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { TripState } from "../../types/trips";
import { fetchTrips, generateAITrip, createTrip } from "./tripsThunk";

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
      // Fetch trips
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

    // Generate AI Trip
    builder
      .addCase(generateAITrip.pending, (state) => {
        state.status = "loading";
      })
      .addCase(generateAITrip.fulfilled, (state, action) => {
        state.status = "succeeded";
        // We don't push it directly — we wait for createTrip + fetch
      })
      .addCase(generateAITrip.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "AI generation failed";
      });

    // Create Trip
    builder
      .addCase(createTrip.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trips.push(action.payload);
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Trip creation failed";
      });
  },
});

export default tripSlice.reducer;
