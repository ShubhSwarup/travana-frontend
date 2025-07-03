import { createAppThunk } from "../../utils/createAppThunk";
import api from "../../services/api"; // destinationThunk.ts
import { DestinationSuggestion } from "../../types/types";

export const fetchDestinationSuggestions = createAppThunk<
  DestinationSuggestion[], // ✅ Return full objects
  string // query string
>({
  typePrefix: "destination/fetchSuggestions",
  showLoading: false,
  showErrorPopup: false,
  payloadCreator: async (query, { rejectWithValue }) => {
    try {
      const res = await api.get(`/cities?q=${encodeURIComponent(query)}`);
      const suggestions: DestinationSuggestion[] = res.data.map(
        (item: any) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        })
      );
      return suggestions;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch destination suggestions"
      );
    }
  },
});
