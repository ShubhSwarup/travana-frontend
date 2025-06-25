export type AuthMode = "login" | "signup";

// src/features/auth/types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string; // for register success message
}
