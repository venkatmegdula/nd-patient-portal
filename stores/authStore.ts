"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserType, FamilyMember, LoyaltyAccount } from "@/lib/types";

interface AuthStore {
  isLoggedIn: boolean;
  phone: string;
  name: string;
  userType: UserType;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  city: string;
  onboardingComplete: boolean;
  familyMembers: FamilyMember[];
  loyalty: LoyaltyAccount;

  login: (phone: string, name?: string) => void;
  logout: () => void;
  completeOnboarding: (data: {
    userType: UserType;
    age: number;
    gender: "male" | "female" | "other";
    city: string;
  }) => void;
  addFamilyMember: (member: Omit<FamilyMember, "id">) => void;
  removeFamilyMember: (id: string) => void;
  addLoyaltyPoints: (points: number) => void;
}

const DEFAULT_LOYALTY: LoyaltyAccount = {
  points: 120,
  tier: "bronze",
  totalEarned: 120,
  referralCode: "ND-RAVI23",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      phone: "",
      name: "",
      userType: "patient",
      age: null,
      gender: null,
      city: "Hyderabad",
      onboardingComplete: false,
      familyMembers: [],
      loyalty: DEFAULT_LOYALTY,

      login: (phone, name = "Ravi Kumar") =>
        set({ isLoggedIn: true, phone, name }),

      logout: () =>
        set({
          isLoggedIn: false,
          phone: "",
          name: "",
          onboardingComplete: false,
          familyMembers: [],
          loyalty: DEFAULT_LOYALTY,
        }),

      completeOnboarding: (data) =>
        set({
          userType: data.userType,
          age: data.age,
          gender: data.gender,
          city: data.city,
          onboardingComplete: true,
        }),

      addFamilyMember: (member) =>
        set((s) => ({
          familyMembers: [
            ...s.familyMembers,
            { ...member, id: `fm-${Date.now()}` },
          ],
        })),

      removeFamilyMember: (id) =>
        set((s) => ({
          familyMembers: s.familyMembers.filter((m) => m.id !== id),
        })),

      addLoyaltyPoints: (points) =>
        set((s) => {
          const total = s.loyalty.totalEarned + points;
          const tier =
            total >= 1000 ? "gold" : total >= 500 ? "silver" : "bronze";
          return {
            loyalty: {
              ...s.loyalty,
              points: s.loyalty.points + points,
              totalEarned: total,
              tier,
            },
          };
        }),
    }),
    { name: "nd-auth" }
  )
);
