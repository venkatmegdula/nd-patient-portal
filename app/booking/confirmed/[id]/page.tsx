"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2, Calendar, Building2, Home as HomeIcon,
  Clock, User, ArrowRight, FileText, MessageCircle
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useBookingStore } from "@/stores/bookingStore";
import { getLabById } from "@/data/labs";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ConfirmedPage({ params }: Props) {
  const router = useRouter();
  const { lastBooking } = useBookingStore();
  const hasNavigated = useRef(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  useEffect(() => {
    // If no lastBooking (e.g. page refresh), redirect to home
    if (!lastBooking && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace("/");
    }
  }, [lastBooking, router]);

  if (!lastBooking) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  const lab = lastBooking.labId ? getLabById(lastBooking.labId) : null;

  return (
    <PageShell>
      {/* Success hero */}
      <div className="flex flex-col items-center text-center py-8 mb-6">
        <div className="relative mb-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 border-4 border-green-100">
            <CheckCircle2 size={40} className="text-green-500" strokeWidth={1.5} />
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-20" />
        </div>

        <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
          Booking Confirmed!
        </h1>
        <p className="text-stone-500 text-sm">
          Your appointment has been booked successfully.
        </p>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-1.5">
          <span className="text-xs text-stone-500">Booking ID</span>
          <span className="font-heading font-bold text-stone-900 text-sm">{lastBooking.id}</span>
        </div>
      </div>

      {/* Booking details card */}
      <div className="rounded-2xl border border-border bg-white p-5 mb-4">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-4">
          Booking Details
        </p>

        <div className="flex flex-col gap-3.5 text-sm">
          {/* Tests */}
          <div className="flex items-start gap-3">
            <FileText size={15} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-stone-400 mb-0.5">Tests Booked</p>
              <div className="flex flex-col gap-0.5">
                {lastBooking.items.map((item) => (
                  <p key={item.id} className="font-medium text-stone-800">{item.name}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          {lastBooking.collectionType === "lab-visit" && lab ? (
            <div className="flex items-start gap-3">
              <Building2 size={15} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Lab</p>
                <p className="font-medium text-stone-800">{lab.name}</p>
                <p className="text-xs text-stone-500">{lab.address}</p>
              </div>
            </div>
          ) : lastBooking.address ? (
            <div className="flex items-start gap-3">
              <HomeIcon size={15} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Home Collection Address</p>
                <p className="font-medium text-stone-800">{lastBooking.address}</p>
              </div>
            </div>
          ) : null}

          {/* Date & Time */}
          {lastBooking.slotDate && lastBooking.slotTime && (
            <div className="flex items-center gap-3">
              <Clock size={15} className="text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Date & Time</p>
                <p className="font-medium text-stone-800">
                  {formatDate(lastBooking.slotDate)} at {formatTime(lastBooking.slotTime)}
                </p>
              </div>
            </div>
          )}

          {/* Patient */}
          {lastBooking.patientName && (
            <div className="flex items-center gap-3">
              <User size={15} className="text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-stone-400 mb-0.5">Patient</p>
                <p className="font-medium text-stone-800">{lastBooking.patientName}</p>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span className="text-stone-500 text-sm">Amount Paid</span>
            <span className="font-heading font-extrabold text-lg text-stone-900">
              {formatCurrency(lastBooking.total)}
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp notifications opt-in card */}
      <div className="rounded-2xl border border-border bg-white border-l-4 border-l-green-400 p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 flex-shrink-0">
            <MessageCircle size={20} className="text-green-500" fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-stone-900 text-sm mb-0.5">
              Get your report on WhatsApp
            </p>
            <p className="text-xs text-stone-500 mb-3">
              We'll send your report link and booking updates via WhatsApp
            </p>
            <button
              onClick={() => setWhatsappEnabled((prev) => !prev)}
              className={
                whatsappEnabled
                  ? "inline-flex items-center gap-1.5 rounded-lg bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-semibold text-green-700 transition-all"
                  : "inline-flex items-center gap-1.5 rounded-lg bg-white border border-border px-3 py-1.5 text-xs font-semibold text-stone-600 hover:border-green-300 transition-all"
              }
            >
              {whatsappEnabled ? (
                <>
                  <CheckCircle2 size={13} className="text-green-600" />
                  WhatsApp updates enabled!
                </>
              ) : (
                <>
                  <CheckCircle2 size={13} className="text-stone-400" />
                  Enable WhatsApp updates
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-2xl bg-teal-50 border border-teal-100 p-4 mb-6">
        <p className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-2.5">
          What Happens Next
        </p>
        <div className="flex flex-col gap-2">
          {[
            "You'll receive an SMS confirmation on your registered number",
            lastBooking.collectionType === "home-collection"
              ? "A phlebotomist will arrive at your address at the scheduled time"
              : "Visit the lab at your scheduled time with a valid ID",
            "Your report will be ready within the agreed timeframe",
            "Download your report from My Bookings",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-xs text-teal-700 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 pb-6">
        <Link
          href="/my-bookings"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          View My Bookings
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center w-full h-11 rounded-xl border border-border bg-white text-stone-700 font-semibold text-sm hover:border-primary/40 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </PageShell>
  );
}
