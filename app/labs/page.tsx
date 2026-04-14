"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Star, Home as HomeIcon, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { AccreditationBadge } from "@/components/ui/AccreditationBadge";
import { FilterChips } from "@/components/discovery/FilterChips";
import { EmptyState } from "@/components/ui/EmptyState";
import { labs } from "@/data/labs";

const AREA_OPTIONS = [
  { id: "all", label: "All Areas" },
  ...Array.from(new Set(labs.map((l) => l.area))).map((a) => ({ id: a, label: a })),
];

const ACCREDITATION_OPTIONS = [
  { id: "all", label: "Any Accreditation" },
  { id: "NABL", label: "NABL" },
  { id: "CAP", label: "CAP" },
  { id: "ISO", label: "ISO" },
];

const SORT_OPTIONS = [
  { id: "rating", label: "Top Rated" },
  { id: "reviews", label: "Most Reviewed" },
  { id: "name", label: "A–Z" },
];

function LabsContent() {
  const params = useSearchParams();
  const initialArea = params.get("area") ?? "all";

  const [area, setArea] = useState(initialArea);
  const [accreditation, setAccreditation] = useState("all");
  const [homeOnly, setHomeOnly] = useState(false);
  const [sort, setSort] = useState("rating");

  const filtered = useMemo(() => {
    let result = [...labs];

    if (area !== "all") result = result.filter((l) => l.area === area);
    if (accreditation !== "all") result = result.filter((l) => l.accreditation.includes(accreditation as never));
    if (homeOnly) result = result.filter((l) => l.homeCollection);

    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") result.sort((a, b) => b.reviewCount - a.reviewCount);
    else result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [area, accreditation, homeOnly, sort]);

  return (
    <PageShell>
      <div className="mb-4">
        <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
          Diagnostic Labs
        </h1>
        <p className="text-sm text-stone-500">
          {labs.length} NABL-accredited labs across Hyderabad
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: "Labs", value: labs.length.toString() },
          { label: "NABL Certified", value: labs.filter((l) => l.accreditation.includes("NABL")).length.toString() },
          { label: "Home Collection", value: labs.filter((l) => l.homeCollection).length.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-white border border-border px-3 py-3 text-center">
            <p className="font-heading text-xl font-extrabold text-primary">{value}</p>
            <p className="text-[11px] text-stone-500 leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-2.5">
        {/* Area chips */}
        <div className="sticky top-14 z-20 -mx-4 bg-background px-4 py-2 sm:-mx-5 sm:px-5">
          <FilterChips
            options={AREA_OPTIONS}
            selected={[area]}
            onToggle={(id) => setArea(id)}
          />
        </div>

        {/* Secondary filters row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Home collection toggle */}
          <button
            onClick={() => setHomeOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
              homeOnly
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white text-stone-600 border-border hover:border-primary/40"
            }`}
          >
            <HomeIcon size={12} />
            Home Collection
          </button>

          {/* Accreditation filter */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={12} className="text-stone-400" />
            <div className="flex gap-1">
              {ACCREDITATION_OPTIONS.slice(1).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAccreditation(accreditation === opt.id ? "all" : opt.id)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold border transition-colors ${
                    accreditation === opt.id
                      ? "bg-teal-50 text-teal-700 border-teal-300"
                      : "bg-white text-stone-500 border-border hover:border-primary/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort — push to right */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs text-stone-400">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-semibold text-stone-700 bg-transparent border-none outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔬"
          title="No labs match these filters"
          ctaLabel="Clear filters"
          ctaHref="/labs"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((lab) => (
            <Link
              key={lab.id}
              href={`/labs/${lab.id}`}
              className="block rounded-2xl border border-border bg-white p-4 hover:border-primary/40 transition-colors active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                {/* Initials avatar */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 font-heading font-bold text-teal-700 text-sm flex-shrink-0">
                  {lab.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-stone-900 truncate">{lab.name}</p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-stone-800">{lab.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                    <MapPin size={10} />
                    <span>{lab.area}, Hyderabad</span>
                    <span className="text-stone-300">·</span>
                    <span>{lab.reviewCount} reviews</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <AccreditationBadge accreditations={lab.accreditation} />
                    {lab.homeCollection && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                        <HomeIcon size={9} />
                        Home Collection
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-stone-400 border-t border-border pt-2.5">
                <span>Open {lab.openTime} – {lab.closeTime}</span>
                <span className="font-medium text-stone-500">{lab.openDays}</span>
                <span className="text-primary font-semibold">View lab →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default function LabsPage() {
  return (
    <Suspense>
      <LabsContent />
    </Suspense>
  );
}
