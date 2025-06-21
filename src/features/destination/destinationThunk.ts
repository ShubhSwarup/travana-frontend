import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// The async thunk to fetch destination suggestions
export const fetchDestinationSuggestions = createAsyncThunk<
  string[], // Returned value type
  string, // Argument type (query string)
  { rejectValue: string }
>("destination/fetchSuggestions", async (query, { rejectWithValue }) => {
  try {
    const res = await api.get(`/cities?q=${encodeURIComponent(query)}`);
    const cities = res.data.map((item: any) => item.display_name);
    return cities;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch destination suggestions",
    );
  }
});
