"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { PageShell } from "@/components/layout/PageShell";
import { BookingProgressBar } from "@/components/booking/BookingProgressBar";
import { useBookingStore } from "@/stores/bookingStore";
import { useBookingHydrated } from "@/hooks/useBookingHydrated";
import { getAvailableDates, getSlotsForDate } from "@/data/slots";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/lib/types";

const PERIOD_LABELS: Record<string, string> = {
  morning: "Morning ☀️",
  afternoon: "Afternoon 🌤️",
  evening: "Evening 🌙",
};

export default function SlotPage() {
  const router = useRouter();
  const { cart, slotDate, slotTime, setSlot } = useBookingStore();
  const hydrated = useBookingHydrated();

  const dates = getAvailableDates();
  const [selectedDate, setSelectedDate] = useState<Date>(
    slotDate ? new Date(slotDate) : dates[0].date
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(slotTime);

  useEffect(() => {
    if (!hydrated) return;
    if (cart.length === 0) router.replace("/book");
  }, [cart, hydrated, router]);

  const slots = getSlotsForDate(selectedDate);
  const allSlots: { period: string; slots: TimeSlot[] }[] = [
    { period: "morning", slots: slots.morning },
    { period: "afternoon", slots: slots.afternoon },
    { period: "evening", slots: slots.evening },
  ];

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setSelectedTime(null); // reset time when date changes
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
  }

  function handleContinue() {
    if (selectedTime) {
      setSlot(format(selectedDate, "yyyy-MM-dd"), selectedTime);
      router.push("/book/patient");
    }
  }

  return (
    <PageShell noPadBottom>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-4 min-h-0 h-auto"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <BookingProgressBar currentStep={4} />

      <h1 className="font-heading text-xl font-extrabold text-stone-900 mb-1">
        Pick a date & time
      </h1>
      <p className="text-sm text-stone-500 mb-5">
        Choose when you'd like to give your sample
      </p>

      {/* Date strip */}
      <div className="flex gap-2 overflow-x-auto scroll-x pb-1 mb-6 -mx-1 px-1">
        {dates.map(({ date, dayLabel }) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const isSelected = format(selectedDate, "yyyy-MM-dd") === dateStr;
          return (
            <button
              key={dateStr}
              onClick={() => handleDateSelect(date)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-2xl border-2 px-3 py-3 min-w-[68px] flex-shrink-0 transition-all",
                isSelected
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-stone-700 hover:border-primary/40"
              )}
            >
              <span className={cn("text-[11px] font-semibold", isSelected ? "text-white/80" : "text-stone-400")}>
                {dayLabel.length > 3 ? dayLabel : format(date, "EEE")}
              </span>
              <span className={cn("font-heading text-xl font-extrabold leading-none")}>
                {format(date, "d")}
              </span>
              <span className={cn("text-[10px]", isSelected ? "text-white/70" : "text-stone-400")}>
                {format(date, "MMM")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slot grid by period */}
      <div className="flex flex-col gap-5 mb-6">
        {allSlots.map(({ period, slots: periodSlots }) => {
          const hasAvailable = periodSlots.some((s) => s.available);
          return (
            <div key={period}>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
                {PERIOD_LABELS[period]}
                {!hasAvailable && (
                  <span className="ml-2 font-normal text-stone-300 normal-case">No slots</span>
                )}
              </p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {periodSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={cn(
                      "rounded-xl border py-2.5 text-xs font-semibold transition-all",
                      slot.available
                        ? selectedTime === slot.time
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-stone-700 hover:border-primary/40"
                        : "border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed line-through"
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-0">
        <button
          onClick={handleContinue}
          disabled={!selectedTime}
          className="flex items-center justify-center w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {selectedTime ? `Continue — ${format(selectedDate, "d MMM")}, ${selectedTime}` : "Select a Time Slot"}
        </button>
      </div>
    </PageShell>
  );
}
