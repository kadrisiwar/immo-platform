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
    // حفظ في cookie للـ middleware
    document.cookie = `access_token=${accessToken}; path=/; max-age=3600`;
    set({ user, accessToken });
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    document.cookie = "access_token=; path=/; max-age=0";
    set({ user: null, accessToken: null });
    window.location.href = "/login";
  },

  isAuthenticated: () => !!get().accessToken,
}));