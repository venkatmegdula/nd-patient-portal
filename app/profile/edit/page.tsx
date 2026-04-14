"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User, Check } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const GENDER_OPTIONS = [
  { id: "male",   label: "Male" },
  { id: "female", label: "Female" },
  { id: "other",  label: "Other" },
] as const;

export default function EditProfilePage() {
  const router = useRouter();
  const { name, login, phone } = useAuthStore();

  const [displayName, setDisplayName] = useState(name);
  const [age, setAge]           = useState("");
  const [gender, setGender]     = useState<"male" | "female" | "other" | "">("");
  const [saving, setSaving]     = useState(false);

  async function handleSave() {
    if (!displayName.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    login(phone, displayName.trim());
    toast.success("Profile updated!");
    setSaving(false);
    router.back();
  }

  return (
    <PageShell noPadBottom>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-5 min-h-0 h-auto"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="font-heading text-xl font-extrabold text-stone-900 mb-6">Edit Profile</h1>

      <div className="flex flex-col gap-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-border bg-white pl-10 pr-4 h-11 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Phone — read only */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Phone <span className="font-normal text-stone-400">(cannot change)</span>
          </label>
          <input
            type="tel"
            value={phone ? `+91 ${phone}` : "+91 xxxxxxxxxx"}
            disabled
            className="w-full rounded-xl border border-border bg-stone-50 px-4 h-11 text-sm text-stone-400 cursor-not-allowed"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 34"
            min={1}
            max={120}
            className="w-full rounded-xl border border-border bg-white px-4 h-11 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setGender(opt.id)}
                className={cn(
                  "h-11 rounded-xl border-2 text-sm font-semibold transition-all",
                  gender === opt.id
                    ? "border-primary bg-teal-50 text-teal-700"
                    : "border-border bg-white text-stone-600 hover:border-primary/40"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe mt-8 sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-6">
        <button
          onClick={handleSave}
          disabled={!displayName.trim() || saving}
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-40"
        >
          {saving ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
            </svg>
          ) : (
            <Check size={15} />
          )}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </PageShell>
  );
}
