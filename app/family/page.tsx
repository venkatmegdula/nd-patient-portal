"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, UserPlus, Users } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useAuthStore } from "@/stores/authStore";
import { useBookingStore } from "@/stores/bookingStore";
import { cn } from "@/lib/utils";
import type { FamilyMember } from "@/lib/types";

/* ── helpers ───────────────────────────────────────── */

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function computeAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function formatDOB(dob: string): string {
  try {
    return new Date(dob).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dob;
  }
}

const RELATION_LABELS: Record<FamilyMember["relation"], string> = {
  self: "Self",
  spouse: "Spouse",
  child: "Child",
  parent: "Parent",
  other: "Other",
};

const RELATION_COLOURS: Record<FamilyMember["relation"], string> = {
  self: "bg-teal-50 text-teal-700 border-teal-200",
  spouse: "bg-rose-50 text-rose-700 border-rose-200",
  child: "bg-sky-50 text-sky-700 border-sky-200",
  parent: "bg-amber-50 text-amber-700 border-amber-200",
  other: "bg-stone-100 text-stone-600 border-stone-200",
};

/* ── blank form state ─────────────────────────────── */

interface FormState {
  name: string;
  relation: FamilyMember["relation"];
  dob: string;
  gender: FamilyMember["gender"];
}

const BLANK_FORM: FormState = {
  name: "",
  relation: "spouse",
  dob: "",
  gender: "male",
};

/* ── page ─────────────────────────────────────────── */

export default function FamilyPage() {
  const router = useRouter();
  const familyMembers = useAuthStore((s) => s.familyMembers);
  const addFamilyMember = useAuthStore((s) => s.addFamilyMember);
  const removeFamilyMember = useAuthStore((s) => s.removeFamilyMember);
  const setSelectedFamilyMember = useBookingStore(
    (s) => s.setSelectedFamilyMember
  );

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.dob) next.dob = "Date of birth is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleAdd() {
    if (!validate()) return;
    addFamilyMember({
      name: form.name.trim(),
      relation: form.relation,
      dob: form.dob,
      gender: form.gender,
    });
    setForm(BLANK_FORM);
    setErrors({});
    setShowForm(false);
  }

  function handleBook(member: FamilyMember) {
    setSelectedFamilyMember(member.id);
    router.push("/book");
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white hover:border-primary/40 transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={16} className="text-stone-600" />
        </button>
        <h1 className="font-heading font-extrabold text-stone-900 text-xl">
          Family Members
        </h1>
      </div>

      {/* Empty state */}
      {familyMembers.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 mb-4">
            <Users size={36} className="text-teal-400" />
          </div>
          <p className="font-heading font-bold text-stone-700 text-lg mb-1">
            No family members yet
          </p>
          <p className="text-sm text-stone-400 max-w-xs">
            Add someone to book tests for them.
          </p>
        </div>
      )}

      {/* Member cards */}
      {familyMembers.length > 0 && (
        <div className="flex flex-col gap-3 mb-4">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-border bg-white px-4 py-4"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-teal-100">
                  <span className="font-heading font-extrabold text-teal-700 text-sm">
                    {getInitials(member.name)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-heading font-bold text-stone-900 text-base">
                      {member.name}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                        RELATION_COLOURS[member.relation]
                      )}
                    >
                      {RELATION_LABELS[member.relation]}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    {member.gender.charAt(0).toUpperCase() +
                      member.gender.slice(1)}{" "}
                    · DOB {formatDOB(member.dob)} · Age {computeAge(member.dob)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFamilyMember(member.id)}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Book button */}
              <button
                onClick={() => handleBook(member)}
                className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                Book for {member.name.split(" ")[0]}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add member button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/50 py-4 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
        >
          <UserPlus size={16} />
          Add Family Member
        </button>
      )}

      {/* Inline add form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-white px-4 py-5 mt-2">
          <p className="font-heading font-bold text-stone-800 text-base mb-4">
            Add Family Member
          </p>

          {/* Name */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-primary transition-colors",
                errors.name ? "border-red-300" : "border-border"
              )}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Relation */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">
              Relation
            </label>
            <select
              value={form.relation}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  relation: e.target.value as FamilyMember["relation"],
                }))
              }
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-primary transition-colors bg-white"
            >
              <option value="self">Self</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="parent">Parent</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* DOB */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-stone-500 mb-1.5">
              Date of Birth
            </label>
            <input
              type="date"
              value={form.dob}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-primary transition-colors",
                errors.dob ? "border-red-300" : "border-border"
              )}
            />
            {errors.dob && (
              <p className="mt-1 text-xs text-red-500">{errors.dob}</p>
            )}
          </div>

          {/* Gender */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-stone-500 mb-2">
              Gender
            </label>
            <div className="flex gap-3">
              {(["male", "female", "other"] as const).map((g) => (
                <label
                  key={g}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-center rounded-xl border py-2.5 text-sm font-medium transition-colors",
                    form.gender === g
                      ? "border-primary bg-teal-50 text-primary"
                      : "border-border text-stone-500 hover:border-stone-300"
                  )}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={() => setForm((f) => ({ ...f, gender: g }))}
                    className="sr-only"
                  />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowForm(false);
                setForm(BLANK_FORM);
                setErrors({});
              }}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
            >
              Add Member
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
