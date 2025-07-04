// features/destination/destinationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchDestinationSuggestions } from "./destinationThunk";
import { DestinationSuggestion } from "../../types/types";

interface DestinationState {
  suggestions: DestinationSuggestion[];
  loading: boolean;
  error: string | null;
}

const initialState: DestinationState = {
  suggestions: [],
  loading: false,
  error: null,
};

const destinationSlice = createSlice({
  name: "destination",
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinationSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinationSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchDestinationSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch destination suggestions";
        state.suggestions = [];
      });
  },
});

export const { clearSuggestions } = destinationSlice.actions;
export default destinationSlice.reducer;
