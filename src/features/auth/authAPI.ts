// src/features/auth/authAPI.ts
import api from "../../services/api";
import { AuthResponse } from "../../types/auth";

const API_BASE = "/auth";

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post(`${API_BASE}/login`, { email, password });
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post(`${API_BASE}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<{
  id: string;
  name: string;
  email: string;
}> => {
  const response = await api.get("/auth/me");
  return response.data;
};
