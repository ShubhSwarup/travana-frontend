import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import tripReducer from "../features/trips/tripSlice";
import destinationReducer from "../features/destination/destinationSlice";
import uiReducer from "../features/ui/uiSlice";
import user from "../features/user/userSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripReducer,
    destination: destinationReducer,
    ui: uiReducer,
    user: user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
