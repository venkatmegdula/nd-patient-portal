"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarX } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { BookingCard } from "@/components/account/BookingCard";
import { getActiveBookings, getPastBookings } from "@/data/bookings";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "active", label: "Active" },
  { id: "past",   label: "Past" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export default function MyBookingsPage() {
  const [tab, setTab] = useState<Tab>("active");

  const activeBookings = getActiveBookings();
  const pastBookings   = getPastBookings();
  const displayed      = tab === "active" ? activeBookings : pastBookings;

  return (
    <PageShell>
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
          My Bookings
        </h1>
        <p className="text-sm text-stone-500">
          Track your tests and download reports
        </p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl border border-border bg-stone-50 p-1 gap-1 mb-5">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl h-10 text-sm font-semibold transition-all",
              tab === id
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            {label}
            <span className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
              tab === id ? "bg-primary text-white" : "bg-stone-200 text-stone-500"
            )}>
              {id === "active" ? activeBookings.length : pastBookings.length}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
            <CalendarX size={28} className="text-stone-400" />
          </div>
          <p className="font-heading font-bold text-stone-700 text-lg mb-1">
            {tab === "active" ? "No active bookings" : "No past bookings"}
          </p>
          <p className="text-sm text-stone-400 mb-6">
            {tab === "active"
              ? "Book a test to get started"
              : "Your completed bookings will appear here"}
          </p>
          {tab === "active" && (
            <Link
              href="/tests"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 h-11 font-semibold text-sm hover:bg-teal-700 transition-colors"
            >
              Browse Tests
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayed.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
