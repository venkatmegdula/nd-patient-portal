"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  FileText,
  Bell,
  FileDown,
  Brain,
  BellPlus,
  CalendarClock,
  Repeat2,
  FlaskConical,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { BookingCard } from "@/components/account/BookingCard";
import { bookings } from "@/data/bookings";
import { getTestById } from "@/data/tests";
import { getLabById } from "@/data/labs";
import { formatDate, formatCurrency, cn } from "@/lib/utils";

/* ── Tabs ── */
const TABS = [
  { id: "active",    label: "Active",    icon: Activity },
  { id: "reports",   label: "Reports",   icon: FileText },
  { id: "reminders", label: "Reminders", icon: Bell },
] as const;

type Tab = (typeof TABS)[number]["id"];

/* ── Filters ── */
const ACTIVE_STATUSES = ["confirmed", "pending", "sample-collected", "processing"] as const;
const REPORT_STATUS   = "report-ready";

/* ── Mock reminders ── */
const REMINDERS = [
  {
    id: "rem-1",
    testName: "Thyroid Function Test",
    dueDate: "2026-07-15",
    frequency: "annually",
  },
  {
    id: "rem-2",
    testName: "Complete Blood Count",
    dueDate: "2026-06-01",
    frequency: "half-yearly",
  },
];

/* ── Derived data ── */
const activeBookings  = bookings.filter((b) => (ACTIVE_STATUSES as readonly string[]).includes(b.status));
const reportBookings  = bookings.filter((b) => b.status === REPORT_STATUS);

/* ── Sub-components ── */

function ActiveTab() {
  if (activeBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
          <FlaskConical size={28} className="text-stone-400" />
        </div>
        <p className="font-heading font-bold text-stone-700 text-lg mb-1">No active tests</p>
        <p className="text-sm text-stone-400 mb-6">Your ongoing bookings will show here</p>
        <Link
          href="/tests"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 h-11 font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          Browse Tests
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {activeBookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

function ReportsTab() {
  if (reportBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
          <FileText size={28} className="text-stone-400" />
        </div>
        <p className="font-heading font-bold text-stone-700 text-lg mb-1">No reports yet</p>
        <p className="text-sm text-stone-400 mb-6">Completed test reports will appear here</p>
        <Link
          href="/tests"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 h-11 font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          Book a Test
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Health timeline heading */}
      <div className="flex items-center gap-2 mb-1">
        <CalendarClock size={14} className="text-stone-400" />
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
          Health Timeline
        </p>
      </div>

      {reportBookings.map((booking) => {
        const lab       = getLabById(booking.labId);
        const testNames = booking.testIds
          .map((id) => getTestById(id)?.name)
          .filter(Boolean) as string[];
        const displayName = testNames.length === 1
          ? testNames[0]
          : testNames.length > 1
          ? `${testNames[0]} +${testNames.length - 1} more`
          : booking.id;

        return (
          <div
            key={booking.id}
            className="rounded-2xl border border-border bg-white p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50">
                <FileText size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-900 truncate text-sm">{displayName}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {formatDate(booking.slotDate)}
                  {lab ? ` · ${lab.name}` : ""}
                </p>
                <p className="text-xs text-stone-400 font-mono">{booking.id}</p>
              </div>
              <span className="font-heading font-bold text-stone-900 text-sm flex-shrink-0">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>

            <div className="flex gap-2">
              {booking.reportUrl ? (
                <a
                  href={booking.reportUrl}
                  download
                  className="flex flex-1 items-center justify-center gap-1.5 h-9 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
                >
                  <FileDown size={13} />
                  Download PDF
                </a>
              ) : (
                <button
                  disabled
                  className="flex flex-1 items-center justify-center gap-1.5 h-9 rounded-xl bg-stone-100 text-stone-400 text-xs font-semibold cursor-not-allowed"
                >
                  <FileDown size={13} />
                  Download PDF
                </button>
              )}

              <Link
                href={`/my-health/summary/${booking.id}`}
                className="flex flex-1 items-center justify-center gap-1.5 h-9 rounded-xl border border-border bg-white text-stone-600 text-xs font-semibold hover:border-primary/40 hover:text-teal-700 transition-colors"
              >
                <Brain size={13} />
                AI Summary
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RemindersTab() {
  return (
    <div className="flex flex-col gap-3">
      {REMINDERS.map((reminder) => (
        <div
          key={reminder.id}
          className="rounded-2xl border border-border bg-white p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <Bell size={18} className="text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-900 text-sm">{reminder.testName}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <div className="flex items-center gap-1 text-xs text-stone-500">
                  <CalendarClock size={11} className="text-stone-400" />
                  <span>Due {formatDate(reminder.dueDate)}</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                  <Repeat2 size={10} />
                  {reminder.frequency}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-stone-50 h-11 text-sm font-semibold text-stone-500 hover:border-primary/40 hover:text-teal-700 hover:bg-teal-50 transition-colors">
        <BellPlus size={15} />
        Add Reminder
      </button>
    </div>
  );
}

/* ── Page ── */
export default function MyHealthPage() {
  const [tab, setTab] = useState<Tab>("active");

  const tabCounts: Record<Tab, number> = {
    active:    activeBookings.length,
    reports:   reportBookings.length,
    reminders: REMINDERS.length,
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
          My Health
        </h1>
        <p className="text-sm text-stone-500">Your personal health dashboard</p>
      </div>

      {/* Tab pills */}
      <div className="flex rounded-2xl border border-border bg-stone-50 p-1 gap-1 mb-5">
        {TABS.map(({ id, label, icon: Icon }) => (
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
            <Icon size={13} />
            {label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                tab === id
                  ? "bg-primary text-white"
                  : "bg-stone-200 text-stone-500"
              )}
            >
              {tabCounts[id]}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "active"    && <ActiveTab />}
      {tab === "reports"   && <ReportsTab />}
      {tab === "reminders" && <RemindersTab />}
    </PageShell>
  );
}
