"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { BookingProgressBar } from "@/components/booking/BookingProgressBar";
import { useBookingStore } from "@/stores/bookingStore";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

const GENDER_OPTIONS = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
] as const;

export default function PatientPage() {
  const router = useRouter();
  const { cart, patientName, patientAge, patientGender, patientNotes, setPatient, setSelectedFamilyMember } =
    useBookingStore();
  const { name: selfName, familyMembers } = useAuthStore();

  // "myself" | family member id
  const [selectedFor, setSelectedFor] = useState<string>("myself");

  const [name, setName] = useState(patientName);
  const [age, setAge] = useState(patientAge);
  const [gender, setGender] = useState<"male" | "female" | "other" | "">(patientGender);
  const [notes, setNotes] = useState(patientNotes);

  useEffect(() => {
    if (cart.length === 0) router.replace("/book");
  }, [cart, router]);

  function handleSelectFor(id: string) {
    setSelectedFor(id);

    if (id === "myself") {
      setSelectedFamilyMember(null);
      setName("");
      setAge("");
      setGender("");
    } else {
      const member = familyMembers.find((m) => m.id === id);
      if (!member) return;
      setSelectedFamilyMember(member.id);
      setName(member.name);
      const dobYear = new Date(member.dob).getFullYear();
      const computedAge = String(new Date().getFullYear() - dobYear);
      setAge(computedAge);
      setGender(member.gender);
    }
  }

  const canContinue = name.trim().length >= 2 && age.trim() !== "" && gender !== "";

  function handleContinue() {
    if (!canContinue) return;
    setPatient({ name: name.trim(), age: age.trim(), gender, notes: notes.trim() });
    router.push("/book/summary");
  }

  return (
    <PageShell noPadBottom>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-4 min-h-0 h-auto"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <BookingProgressBar currentStep={5} />

      <h1 className="font-heading text-xl font-extrabold text-stone-900 mb-1">
        Patient details
      </h1>
      <p className="text-sm text-stone-500 mb-6">
        Who is this test for? This will appear on your report.
      </p>

      <div className="flex flex-col gap-5">
        {/* Who is this for? */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Who is this for?
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* Myself chip */}
            <button
              onClick={() => handleSelectFor("myself")}
              className={cn(
                "flex-shrink-0 px-4 h-9 rounded-full border-2 text-sm font-semibold transition-all whitespace-nowrap",
                selectedFor === "myself"
                  ? "border-primary bg-teal-50 text-teal-700"
                  : "border-border bg-white text-stone-600 hover:border-primary/40"
              )}
            >
              {selfName ? `Myself (${selfName})` : "Myself"}
            </button>

            {/* Family member chips */}
            {familyMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handleSelectFor(member.id)}
                className={cn(
                  "flex-shrink-0 px-4 h-9 rounded-full border-2 text-sm font-semibold transition-all whitespace-nowrap",
                  selectedFor === member.id
                    ? "border-primary bg-teal-50 text-teal-700"
                    : "border-border bg-white text-stone-600 hover:border-primary/40"
                )}
              >
                {member.name}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Full name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ravi Kumar"
              className="w-full rounded-xl border border-border bg-white pl-10 pr-4 h-11 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Age <span className="text-red-400">*</span>
          </label>
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
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Gender <span className="text-red-400">*</span>
          </label>
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

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Notes for phlebotomist{" "}
            <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Difficult veins, please use right arm"
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe mt-6 sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-4">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex items-center justify-center w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue to Summary
        </button>
      </div>
    </PageShell>
  );
}
