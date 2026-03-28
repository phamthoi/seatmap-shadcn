import { AuthProvider } from "ra-core";
import { BASE_URL } from '@/constants/enviroment.constant'

export const authProvider: AuthProvider = {
  async login({ email, password }) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const { token, user } = await response.json();

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  async checkError({ status }) {
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      throw new Error("Session expired");
    }
  },

  async checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
  },

  async getIdentity() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return { id: user.id, fullName: user.name, avatar: user.avatar };
  },

  async getPermissions() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role; 
  },
};