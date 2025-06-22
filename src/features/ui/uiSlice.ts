// src/features/ui/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  loading: boolean;
  error: {
    message: string | null;
    showCloseButton: boolean;
  };
}

const initialState: UIState = {
  loading: false,
  error: {
    message: null,
    showCloseButton: true,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    setGlobalError: (
      state,
      action: PayloadAction<{ message: string; showCloseButton: boolean }>,
    ) => {
      state.error.message = action.payload.message;
      state.error.showCloseButton = action.payload.showCloseButton;
    },
    clearGlobalError: (state) => {
      state.error.message = null;
      state.error.showCloseButton = true;
    },
  },
});

export const { startLoading, stopLoading, setGlobalError, clearGlobalError } =
  uiSlice.actions;

export default uiSlice.reducer;
