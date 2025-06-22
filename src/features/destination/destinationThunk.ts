import { createAppThunk } from "../../utils/createAppThunk";
import api from "../../services/api";

// ✅ Fetch city suggestions without showing global loader
export const fetchDestinationSuggestions = createAppThunk<
  string[], // Return type
  string // Argument type (query string)
>({
  typePrefix: "destination/fetchSuggestions",
  showLoading: false, // 👈 Disable loader here
  showErrorPopup: false, // ❌ Do not show popup
  payloadCreator: async (query, { rejectWithValue }) => {
    try {
      const res = await api.get(`/cities?q=${encodeURIComponent(query)}`);
      const cities = res.data.map((item: any) => item.display_name);
      return cities;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch destination suggestions",
      );
    }
  },
});
