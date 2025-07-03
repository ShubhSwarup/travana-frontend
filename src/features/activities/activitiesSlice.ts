import { createSlice } from "@reduxjs/toolkit";
import { fetchActivities } from "./activitiesThunk";
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
  },
});

export default activitiesSlice.reducer;
