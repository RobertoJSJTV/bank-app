import { create } from "zustand";

type AuthState = {
  user: { name: string; email: string } | null;
  token: string | null;
  login: (token: string, user: { name: string; email: string }) => void;
  logout: () => void;
};

const savedToken = localStorage.getItem("token");
const savedUserJson = localStorage.getItem("user");
const savedUser = savedUserJson ? JSON.parse(savedUserJson) : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser,
  token: savedToken,
  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));