import api from "@/lib/api";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/types";

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", data);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },


  getDecodedToken(): { id: number; role: string } | null {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  },
};
