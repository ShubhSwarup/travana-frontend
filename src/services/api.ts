import axios from "axios";

import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

//   Add request interceptor to attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//   Catch 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth token
      localStorage.removeItem("token");

      // Optional: clear Redux state, e.g. dispatch(logout())
      store.dispatch(logout());

      // Redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
