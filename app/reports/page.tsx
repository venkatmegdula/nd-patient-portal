"use client";

import Link from "next/link";
import { FileDown, Share2, FileText } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { getBookingsWithReports } from "@/data/bookings";
import { getTestById } from "@/data/tests";
import { getLabById } from "@/data/labs";
import { packages } from "@/data/packages";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ReportsPage() {
  const reportBookings = getBookingsWithReports();

  return (
    <PageShell>
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">My Reports</h1>
        <p className="text-sm text-stone-500">Download and share your test results</p>
      </div>

      {reportBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
            <FileText size={28} className="text-stone-400" />
          </div>
          <p className="font-heading font-bold text-stone-700 text-lg mb-1">No reports yet</p>
          <p className="text-sm text-stone-400 mb-6">Complete a booking to see your reports here</p>
          <Link
            href="/tests"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 h-11 font-semibold text-sm hover:bg-teal-700 transition-colors"
          >
            Book a Test
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reportBookings.map((booking) => {
            const lab = getLabById(booking.labId);
            const pkg = booking.packageId ? packages.find((p) => p.id === booking.packageId) : null;
            const testNames = booking.testIds
              .map((id) => getTestById(id)?.name)
              .filter(Boolean) as string[];
            const displayName = pkg ? pkg.name : testNames.join(", ");

            return (
              <div
                key={booking.id}
                className="rounded-2xl border border-border bg-white p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 flex-shrink-0">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 truncate text-sm">{displayName}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {formatDate(booking.slotDate)} · {lab?.name ?? "Lab"}
                    </p>
                    <p className="text-xs text-stone-400 font-mono">{booking.id}</p>
                  </div>
                  <span className="font-heading font-bold text-stone-900 text-sm flex-shrink-0">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <a
                    href={booking.reportUrl}
                    download
                    className="flex flex-1 items-center justify-center gap-1.5 h-9 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
                  >
                    <FileDown size={13} />
                    Download PDF
                  </a>
                  <button className="flex flex-1 items-center justify-center gap-1.5 h-9 rounded-xl border border-border bg-white text-stone-600 text-xs font-semibold hover:border-primary/40 transition-colors">
                    <Share2 size={13} />
                    Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
