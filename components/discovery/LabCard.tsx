import Link from "next/link";
import { MapPin, Star, Home, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lab } from "@/lib/types";
import { AccreditationBadge } from "@/components/ui/AccreditationBadge";

interface LabCardProps {
  lab: Lab;
  variant?: "default" | "compact";
  /** Show a specific test price in context */
  testPrice?: number;
  testName?: string;
}

export function LabCard({ lab, variant = "default", testPrice, testName }: LabCardProps) {
  const initials = lab.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Link
      href={`/labs/${lab.id}`}
      className={cn(
        "flex gap-3.5 rounded-2xl border border-border bg-white hover:border-primary/50 hover:shadow-sm transition-all active:scale-[0.99]",
        variant === "compact" ? "p-3.5" : "p-4"
      )}
    >
      {/* Avatar */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 font-heading font-bold text-teal-700 text-sm flex-shrink-0 border border-teal-100">
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-stone-900 text-[15px] leading-tight truncate">
            {lab.name}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-stone-800">{lab.rating}</span>
            <span className="text-xs text-stone-400">({lab.reviewCount})</span>
          </div>
        </div>

        {/* Area */}
        <div className="flex items-center gap-1 mt-0.5 mb-2">
          <MapPin size={11} className="text-stone-400 flex-shrink-0" />
          <span className="text-xs text-stone-500 truncate">{lab.area}, Hyderabad</span>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <AccreditationBadge accreditations={lab.accreditation} />
          {lab.homeCollection && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-600">
              <Home size={9} /> Home collection
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-50 border border-border px-2 py-0.5 text-[11px] text-stone-500">
            <Clock size={9} /> {lab.openTime}–{lab.closeTime}
          </span>
        </div>

        {/* Test price if passed */}
        {testPrice != null && testName && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-stone-400 truncate">{testName}</span>
            <span className="font-heading font-bold text-stone-900 text-base flex-shrink-0 ml-2">
              ₹{testPrice.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
