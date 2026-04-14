"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import {
  ArrowLeft, Clock, Building2, Home as HomeIcon, User,
  FileDown, Share2, XCircle, FlaskConical, CheckCircle2
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatusTracker } from "@/components/account/StatusTracker";
import { getBookingById } from "@/data/bookings";
import { getLabById } from "@/data/labs";
import { getTestById } from "@/data/tests";
import { packages } from "@/data/packages";
import { formatCurrency, formatDate, formatTime, getStatusMeta, cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const booking = getBookingById(id);
  if (!booking) {
    return (
      <PageShell>
        <div className="text-center py-20">
          <p className="text-stone-400">Booking not found.</p>
          <Link href="/my-bookings" className="text-primary text-sm mt-2 block">
            ← My Bookings
          </Link>
        </div>
      </PageShell>
    );
  }

  const effectiveStatus = cancelled ? "cancelled" : booking.status;
  const { label, chipClass } = getStatusMeta(effectiveStatus);
  const lab = getLabById(booking.labId);
  const pkg = booking.packageId ? packages.find((p) => p.id === booking.packageId) : null;
  const testNames = booking.testIds
    .map((tid) => getTestById(tid)?.name)
    .filter(Boolean) as string[];

  const canCancel =
    !cancelled && ["confirmed", "pending"].includes(effectiveStatus);
  const hasReport = effectiveStatus === "report-ready" && booking.reportUrl;

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white hover:border-primary/40 transition-colors"
        >
          <ArrowLeft size={16} className="text-stone-600" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-stone-400 font-mono">{booking.id}</p>
          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold mt-0.5", chipClass)}>
            {label}
          </span>
        </div>
      </div>

      {/* Status tracker */}
      <div className="rounded-2xl border border-border bg-white p-5 mb-4">
        <h2 className="font-heading font-bold text-stone-900 mb-4">Booking Status</h2>
        <StatusTracker status={effectiveStatus} />
      </div>

      {/* Tests */}
      <div className="rounded-2xl border border-border bg-white p-4 mb-4">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">Tests</p>
        <div className="flex flex-col gap-2">
          {pkg ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 flex-shrink-0">
                <span className="text-base">🎁</span>
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-sm">{pkg.name}</p>
                <p className="text-xs text-stone-400">{testNames.join(" · ")}</p>
              </div>
            </div>
          ) : (
            testNames.map((name) => (
              <div key={name} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 flex-shrink-0">
                  <FlaskConical size={14} className="text-primary" />
                </div>
                <p className="font-semibold text-stone-900 text-sm">{name}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appointment info */}
      <div className="rounded-2xl border border-border bg-white p-4 mb-4">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">
          Appointment Details
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Clock size={15} className="text-primary flex-shrink-0" />
            <span className="text-stone-700">
              {formatDate(booking.slotDate)} · {formatTime(booking.slotTime)}
            </span>
          </div>
          {booking.collectionType === "lab-visit" && lab ? (
            <div className="flex items-start gap-3">
              <Building2 size={15} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-800">{lab.name}</p>
                <p className="text-xs text-stone-400">{lab.address}</p>
              </div>
            </div>
          ) : booking.collectionAddress ? (
            <div className="flex items-start gap-3">
              <HomeIcon size={15} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-800">Home Collection</p>
                <p className="text-xs text-stone-400">{booking.collectionAddress}</p>
              </div>
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            <User size={15} className="text-primary flex-shrink-0" />
            <span className="text-stone-700">
              {booking.patientName} · {booking.patientAge} yrs · {booking.patientGender}
            </span>
          </div>
          {booking.patientNotes && (
            <p className="text-xs text-stone-400 bg-stone-50 rounded-xl px-3 py-2">
              Note: {booking.patientNotes}
            </p>
          )}
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="text-stone-500">Total Paid</span>
            <span className="font-heading font-bold text-stone-900">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Report / Actions */}
      <div className="flex flex-col gap-3 mb-5">
        {hasReport ? (
          <>
            <a
              href={booking.reportUrl}
              download
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
            >
              <FileDown size={16} />
              Download Report
            </a>
            <button className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-border bg-white text-stone-700 font-semibold text-sm hover:border-primary/40 transition-colors">
              <Share2 size={15} />
              Share Report
            </button>
          </>
        ) : effectiveStatus !== "cancelled" && effectiveStatus !== "report-ready" ? (
          <div className="rounded-2xl bg-stone-50 border border-border px-4 py-3 text-center">
            <p className="text-sm text-stone-500">
              Report will be available once your results are ready.
            </p>
          </div>
        ) : null}

        {canCancel && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors"
          >
            <XCircle size={15} />
            Cancel Booking
          </button>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-4 sm:pb-0">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <h3 className="font-heading font-bold text-stone-900 text-lg mb-1">Cancel Booking?</h3>
            <p className="text-sm text-stone-500 mb-5">
              This action cannot be undone. A refund will be processed within 5–7 business days.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 h-11 rounded-xl border border-border text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={() => { setCancelled(true); setShowCancelModal(false); }}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelled && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-stone-900 text-white px-4 py-2 text-sm font-medium shadow-lg">
          <CheckCircle2 size={14} className="text-green-400" />
          Booking cancelled. Refund initiated.
        </div>
      )}
    </PageShell>
  );
}
