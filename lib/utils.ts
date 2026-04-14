import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import type { BookingStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* Format ₹ currency */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/* Format a date string "2026-04-14" → "Mon, 14 Apr" */
export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "EEE, d MMM");
  } catch {
    return dateStr;
  }
}

/* Format time "08:00" → "8:00 AM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/* Format phone for display */
export function formatPhone(phone: string): string {
  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
}

/* Booking status → display label + chip class */
export function getStatusMeta(status: BookingStatus): {
  label: string;
  chipClass: string;
} {
  const map: Record<BookingStatus, { label: string; chipClass: string }> = {
    confirmed:        { label: "Confirmed",       chipClass: "chip-confirmed" },
    pending:          { label: "Pending",          chipClass: "chip-pending" },
    "sample-collected": { label: "Sample Collected", chipClass: "chip-processing" },
    processing:       { label: "Processing",      chipClass: "chip-processing" },
    "report-ready":   { label: "Report Ready",    chipClass: "chip-ready" },
    cancelled:        { label: "Cancelled",        chipClass: "chip-cancelled" },
  };
  return map[status] ?? { label: status, chipClass: "chip-pending" };
}

/* Truncate long text */
export function truncate(str: string, length: number): string {
  return str.length <= length ? str : `${str.slice(0, length)}…`;
}

/* Generate a booking ID */
export function generateBookingId(): string {
  const now = new Date();
  const date = format(now, "yyMMdd");
  const rand = Math.floor(Math.random() * 900) + 100;
  return `BK-${date}-${rand}`;
}

/* Calculate savings percentage */
export function savingsPercent(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100);
}
