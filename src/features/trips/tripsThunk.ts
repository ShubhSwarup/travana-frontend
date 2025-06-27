import { createAppThunk } from "../../utils/createAppThunk";
import api from "../../services/api";
import { Trip, TripOverview } from "../../types/trips";

// 1. Fetch all trips (with loader)
export const fetchTrips = createAppThunk<Trip[], void>({
  typePrefix: "trips/fetchTrips",
  payloadCreator: async () => {
    const res = await api.get("/trips");
    return res.data;
  },
  showCloseButton: false,
});

// 2. Generate Trip via AI (with loader)
export const generateAITrip = createAppThunk<Trip, Partial<Trip>>({
  typePrefix: "trips/generateAITrip",
  payloadCreator: async (payload) => {
    const res = await api.post("/ai/generate-trip", payload);
    return res.data;
  },
});

// 3. Create Trip (with loader)
export const createTrip = createAppThunk<Trip, Trip>({
  typePrefix: "trips/createTrip",
  payloadCreator: async (tripData) => {
    const res = await api.post("/trips", tripData);
    return res.data;
  },
});

// 4. Fetch Trip by ID (no loader or error modal if you want to customize it)
export const fetchTripById = createAppThunk<Trip, string>({
  typePrefix: "trips/fetchTripById",
  payloadCreator: async (id) => {
    const res = await api.get(`/trips/${id}`);
    return res.data;
  },
  showCloseButton: false,
});

export const fetchTripOverview = createAppThunk<TripOverview, string>({
  typePrefix: "trips/fetchTripOverView",
  payloadCreator: async (id) => {
    const res = await api.get(`/trips/${id}/overview`);
    return res.data;
  },
  showCloseButton: false,
});
