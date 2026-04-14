"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isLoggedIn: boolean;
  phone: string;
  name: string;
  login: (phone: string, name?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      phone: "",
      name: "",
      login: (phone, name = "Ravi Kumar") =>
        set({ isLoggedIn: true, phone, name }),
      logout: () => set({ isLoggedIn: false, phone: "", name: "" }),
    }),
    { name: "nd-auth" }
  )
);
