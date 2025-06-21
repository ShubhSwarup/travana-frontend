import api from "../../services/api";

const API_BASE = "/auth";

export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const response = await api.post(`${API_BASE}/login`, { email, password });
  return response.data.token;
};

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<string> => {
  const response = await api.post(`${API_BASE}/register`, {
    name,
    email,
    password,
  });
  return response.data.token;
};
