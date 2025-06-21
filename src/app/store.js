import { configureStore } from '@reduxjs/toolkit';
// import tripReducer from '../features/trip/tripSlice'; // example

export const store = configureStore({
  reducer: {
    // trip: tripReducer,
  },
});
