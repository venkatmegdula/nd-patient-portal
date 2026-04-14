import Link from "next/link";
import { Clock, Building2, Home as HomeIcon, ChevronRight, FileDown } from "lucide-react";
import { cn, formatCurrency, formatDate, formatTime, getStatusMeta } from "@/lib/utils";
import { getLabById } from "@/data/labs";
import { getTestById } from "@/data/tests";
import { packages } from "@/data/packages";
import type { Booking } from "@/lib/types";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const { label, chipClass } = getStatusMeta(booking.status);
  const lab = getLabById(booking.labId);

  // Resolve display name: package or tests
  const pkg = booking.packageId ? packages.find((p) => p.id === booking.packageId) : null;
  const testNames = booking.testIds
    .map((id) => getTestById(id)?.name)
    .filter(Boolean) as string[];

  const displayName = pkg
    ? pkg.name
    : testNames.length === 1
    ? testNames[0]
    : `${testNames[0]} +${testNames.length - 1} more`;

  return (
    <Link
      href={`/my-bookings/${booking.id}`}
      className="block rounded-2xl border border-border bg-white p-4 hover:border-primary/40 transition-colors active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 truncate">{displayName}</p>
          <p className="text-xs text-stone-400 mt-0.5 font-mono">{booking.id}</p>
        </div>
        <span className={cn("flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold", chipClass)}>
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <Clock size={11} className="text-stone-400 flex-shrink-0" />
          <span>{formatDate(booking.slotDate)} · {formatTime(booking.slotTime)}</span>
        </div>
        {lab && (
          <div className="flex items-center gap-2">
            {booking.collectionType === "home-collection" ? (
              <HomeIcon size={11} className="text-stone-400 flex-shrink-0" />
            ) : (
              <Building2 size={11} className="text-stone-400 flex-shrink-0" />
            )}
            <span className="truncate">
              {booking.collectionType === "home-collection" ? "Home Collection" : lab.name}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border">
        <span className="font-heading font-bold text-stone-900">{formatCurrency(booking.totalAmount)}</span>
        <div className="flex items-center gap-2">
          {booking.status === "report-ready" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600">
              <FileDown size={11} /> Report ready
            </span>
          )}
          <ChevronRight size={14} className="text-stone-300" />
        </div>
      </div>
    </Link>
  );
}
