import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import tripReducer from "../features/trips/tripSlice";
import destinationReducer from "../features/destination/destinationSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    destination: destinationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
