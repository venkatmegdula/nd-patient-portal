"use client";

import { useState } from "react";
import { ChevronLeft, User, Briefcase, Users, Stethoscope } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import type { UserType } from "@/lib/types";

const USER_TYPES: { id: UserType; label: string; desc: string; icon: React.ElementType }[] = [
  { id: "patient",        label: "Patient",         desc: "Book tests for myself",          icon: User },
  { id: "family-manager", label: "Family Manager",  desc: "Book for family members",        icon: Users },
  { id: "corporate",      label: "Corporate HR",    desc: "Manage employee health checks",  icon: Briefcase },
  { id: "doctor",         label: "Doctor / Clinic", desc: "Refer patients to labs",         icon: Stethoscope },
];

const GENDERS = [
  { id: "male",   label: "Male" },
  { id: "female", label: "Female" },
  { id: "other",  label: "Other" },
] as const;

export default function OnboardingSetupPage() {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const [userType, setUserType] = useState<UserType>("patient");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [city, setCity] = useState("Hyderabad");

  const canContinue = userType && age && Number(age) > 0 && gender;

  function handleDone() {
    if (!canContinue) return;
    completeOnboarding({
      userType,
      age: Number(age),
      gender: gender as "male" | "female" | "other",
      city: city || "Hyderabad",
    });
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => window.history.back()} className="p-1 rounded-lg hover:bg-stone-100">
          <ChevronLeft size={20} className="text-stone-600" />
        </button>
        <span className="font-semibold text-stone-800 text-sm">Quick setup</span>
        <span className="ml-auto text-xs text-stone-400">Takes 30 seconds</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-7">
        {/* User type */}
        <div>
          <h2 className="font-bold text-stone-900 text-base mb-1">I am a…</h2>
          <p className="text-xs text-stone-500 mb-3">We'll personalise your experience</p>
          <div className="grid grid-cols-2 gap-2.5">
            {USER_TYPES.map((ut) => {
              const Icon = ut.icon;
              const selected = userType === ut.id;
              return (
                <button
                  key={ut.id}
                  onClick={() => setUserType(ut.id)}
                  className={cn(
                    "flex flex-col items-start gap-1.5 p-3.5 rounded-2xl border-2 text-left transition-all",
                    selected
                      ? "border-primary bg-teal-50"
                      : "border-border bg-white hover:border-primary/40"
                  )}
                >
                  <Icon size={20} className={selected ? "text-primary" : "text-stone-400"} />
                  <span className={cn("text-sm font-semibold", selected ? "text-teal-700" : "text-stone-700")}>
                    {ut.label}
                  </span>
                  <span className="text-[11px] text-stone-400 leading-tight">{ut.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block font-bold text-stone-900 text-base mb-3">
            Your age <span className="text-red-400 font-normal text-sm">*</span>
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 32"
            className="w-full h-12 rounded-xl border border-border bg-white px-4 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-bold text-stone-900 text-base mb-3">
            Gender <span className="text-red-400 font-normal text-sm">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGender(g.id)}
                className={cn(
                  "h-11 rounded-xl border-2 text-sm font-semibold transition-all",
                  gender === g.id
                    ? "border-primary bg-teal-50 text-teal-700"
                    : "border-border bg-white text-stone-600 hover:border-primary/40"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block font-bold text-stone-900 text-base mb-3">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-12 rounded-xl border border-border bg-white px-4 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {["Hyderabad", "Warangal", "Vizag", "Other"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-4 bg-white border-t border-border pb-safe">
        <button
          onClick={handleDone}
          disabled={!canContinue}
          className="w-full h-12 rounded-2xl bg-primary text-white font-bold text-base hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Let's go →
        </button>
        <button
          onClick={() => { completeOnboarding({ userType: "patient", age: 30, gender: "other", city: "Hyderabad" }); window.location.href = "/"; }}
          className="w-full mt-2 text-center text-xs text-stone-400 py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
