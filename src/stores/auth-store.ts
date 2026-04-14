import { create } from "zustand";

type Role = "admin" | "proprietaire" | "locataire";

interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  phone: string;
  avatar: string | null;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    set({ user, accessToken });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, accessToken: null });
    window.location.href = "/login";
  },

  isAuthenticated: () => !!get().accessToken,
}));
