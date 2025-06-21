import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import tripReducer from "../features/trips/tripSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
