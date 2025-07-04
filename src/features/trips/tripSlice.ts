// src/features/trips/tripSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { TripState } from "../../types/trips";
import {
  fetchTrips,
  generateAITrip,
  createTrip,
  fetchTripById,
  fetchTripOverview,
  updateTrip,
} from "./tripsThunk";

const initialState: TripState = {
  trips: [],
  selectedTripOverview: null,
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
        state.error = "Unknown error";
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
        state.error = "AI generation failed";
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
        console.log("test on error ", action.payload);
        state.error = "Trip creation failed";
      });

    //getbyId
    builder
      .addCase(fetchTripById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const existingIndex = state.trips.findIndex(
          (trip) => trip._id === action.payload._id
        );
        if (existingIndex === -1) {
          state.trips.push(action.payload); //   add if not already present
        } else {
          state.trips[existingIndex] = action.payload; //   update if already exists
        }
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.status = "failed";
        state.error = "Trip fetch failed";
      });

    builder
      .addCase(fetchTripOverview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTripOverview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTripOverview = action.payload; //   save overview in dedicated state
      })
      .addCase(fetchTripOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = "Trip fetch failed";
      });

    // Update Trip
    builder.addCase(updateTrip.fulfilled, (state, action) => {
      // Update trip in trips list (if it's there)
      const index = state.trips.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.trips[index] = action.payload;
      }

      // Also update selectedTripOverview.trip if it's the same trip
      if (
        state.selectedTripOverview &&
        state.selectedTripOverview.trip._id === action.payload._id
      ) {
        state.selectedTripOverview.trip = {
          ...state.selectedTripOverview.trip,
          ...action.payload,
        };
      }
    });
  },
});

export default tripSlice.reducer;
