import { createSlice } from "@reduxjs/toolkit";
import {
  createActivity,
  fetchActivities,
  updateActivity,
} from "./activitiesThunk";
import { Activity } from "../../types/trips";
import { ActivityFormValues } from "../../components/ActivityFormModal";

interface ActivitiesState {
  activities: ActivityFormValues[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  activities: [],
  loading: false,
  error: null,
};

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load activities";
      });
    builder
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities.push(action.payload); // ✅ append new activity
      })
      .addCase(createActivity.rejected, (state) => {
        state.loading = false;
        state.error = "Activity creation failed";
      });

    builder
      .addCase(updateActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.activities.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.activities[index] = action.payload; // update in place
        }
      })
      .addCase(updateActivity.rejected, (state) => {
        state.loading = false;
        state.error = "Activity update failed";
      });
  },
});

export default activitiesSlice.reducer;
