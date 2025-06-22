import * as authAPI from "./authAPI";
import { createAppThunk } from "../../utils/createAppThunk";

// ✅ Login User
export const loginUser = createAppThunk<
  string, // Returned type
  { email: string; password: string } // Argument type
>({
  typePrefix: "auth/login",
  payloadCreator: async ({ email, password }, { rejectWithValue }) => {
    const token = await authAPI.login(email, password);
    return token;
  },
  showErrorPopup: false,
});

// ✅ Register User
export const registerUser = createAppThunk<
  string,
  { name: string; email: string; password: string }
>({
  typePrefix: "auth/register",
  payloadCreator: async ({ name, email, password }, { rejectWithValue }) => {
    const token = await authAPI.register(name, email, password);
    return token;
  },
  showErrorPopup: false,
});
