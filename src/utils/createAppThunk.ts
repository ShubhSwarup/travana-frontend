// utils/createAppThunk.ts
import { createAsyncThunk, AsyncThunkPayloadCreator } from "@reduxjs/toolkit";
import {
  startLoading,
  stopLoading,
  setGlobalError,
} from "../features/ui/uiSlice";

export function createAppThunk<Returned, ThunkArg = void>({
  typePrefix,
  payloadCreator,
  showLoading = true,
  showErrorPopup = true,
  showCloseButton = true,
}: {
  typePrefix: string;
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg>;
  showLoading?: boolean;
  showErrorPopup?: boolean;
  showCloseButton?: boolean;
}) {
  return createAsyncThunk<Returned, ThunkArg>(
    typePrefix,
    //   Don't make this an `async` function
    (arg, thunkAPI) => {
      const { dispatch } = thunkAPI;

      if (showLoading) dispatch(startLoading());

      //   Always return a `Promise<Returned | RejectWithValue<...>>`
      return Promise.resolve(payloadCreator(arg, thunkAPI))
        .catch((err: any) => {
          const message =
            err?.response?.data?.message ||
            err.message ||
            "Something went wrong";

          if (showErrorPopup) {
            dispatch(setGlobalError({ message, showCloseButton }));
          }

          return thunkAPI.rejectWithValue(message);
        })
        .finally(() => {
          if (showLoading) dispatch(stopLoading());
        });
    }
  );
}
