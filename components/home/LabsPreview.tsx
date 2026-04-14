import Link from "next/link";
import { ChevronRight, Star, MapPin } from "lucide-react";
import { labs } from "@/data/labs";
import { AccreditationBadge } from "@/components/ui/AccreditationBadge";

export function LabsPreview() {
  const featured = labs.filter((l) => l.rating >= 4.5).slice(0, 3);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg font-bold text-stone-900">
          Trusted Labs Near You
        </h2>
        <Link
          href="/labs"
          className="flex items-center gap-0.5 text-sm font-medium text-primary hover:underline min-h-0 h-auto"
        >
          View all <ChevronRight size={15} />
        </Link>
      </div>

      <div className="flex flex-col gap-2.5">
        {featured.map((lab) => (
          <Link
            key={lab.id}
            href={`/labs/${lab.id}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3.5 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            {/* Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 font-heading font-bold text-teal-700 text-sm flex-shrink-0">
              {lab.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-900 text-[14px] truncate">
                {lab.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={11} className="text-stone-400 flex-shrink-0" />
                <span className="text-xs text-stone-500 truncate">
                  {lab.area}
                </span>
              </div>
              <AccreditationBadge
                accreditations={lab.accreditation}
                className="mt-1.5"
              />
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1 text-sm font-bold text-stone-900">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {lab.rating}
              </div>
              <span className="text-[10px] text-stone-400">
                {lab.reviewCount} reviews
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
