"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Star, Home as HomeIcon, Check } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { BookingProgressBar } from "@/components/booking/BookingProgressBar";
import { AccreditationBadge } from "@/components/ui/AccreditationBadge";
import { useBookingStore } from "@/stores/bookingStore";
import { labs } from "@/data/labs";
import { labTests } from "@/data/tests";
import { packages } from "@/data/packages";
import { formatCurrency, cn } from "@/lib/utils";

export default function LabPickPage() {
  const router = useRouter();
  const { cart, selectedLabId, setSelectedLabId } = useBookingStore();

  useEffect(() => {
    if (cart.length === 0) router.replace("/book");
  }, [cart, router]);

  // Build test ID list from cart
  const allTestIds = useMemo(() => {
    const ids: string[] = [];
    for (const item of cart) {
      if (item.type === "test") {
        ids.push(item.id);
      } else {
        const pkg = packages.find((p) => p.id === item.id);
        if (pkg) ids.push(...pkg.testIds);
      }
    }
    return [...new Set(ids)];
  }, [cart]);

  // Labs that offer ALL required tests, with total price
  const eligibleLabs = useMemo(() => {
    return labs
      .map((lab) => {
        const prices = allTestIds.map((testId) => {
          const lt = labTests.find(
            (l) => l.labId === lab.id && l.testId === testId
          );
          return lt ? lt.price : null;
        });
        if (prices.some((p) => p === null)) return null;
        const total = (prices as number[]).reduce((s, p) => s + p, 0);
        return { lab, total };
      })
      .filter((x): x is { lab: (typeof labs)[0]; total: number } => x !== null)
      .sort((a, b) => a.total - b.total);
  }, [allTestIds]);

  function handleSelect(labId: string) {
    setSelectedLabId(labId);
  }

  function handleContinue() {
    if (selectedLabId) router.push("/book/slot");
  }

  return (
    <PageShell noPadBottom>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-4 min-h-0 h-auto"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <BookingProgressBar currentStep={3} />

      <h1 className="font-heading text-xl font-extrabold text-stone-900 mb-1">
        Choose a Lab
      </h1>
      <p className="text-sm text-stone-500 mb-5">
        {eligibleLabs.length} labs offer all your selected tests
      </p>

      {eligibleLabs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-400 text-sm">No labs found that offer all selected tests.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          {eligibleLabs.map(({ lab, total }, i) => {
            const isSelected = selectedLabId === lab.id;
            return (
              <button
                key={lab.id}
                onClick={() => handleSelect(lab.id)}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border-2 p-4 text-left w-full transition-all active:scale-[0.99]",
                  isSelected
                    ? "border-primary bg-teal-50"
                    : "border-border bg-white hover:border-primary/40"
                )}
              >
                {/* Initials */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 font-heading font-bold text-teal-700 text-sm flex-shrink-0">
                  {lab.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-semibold text-stone-900 text-sm">{lab.name}</p>
                    {i === 0 && (
                      <span className="rounded-full bg-green-50 border border-green-200 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                        Lowest Price
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <MapPin size={10} /> {lab.area}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <Star size={10} className="fill-amber-400 text-amber-400" /> {lab.rating}
                    </span>
                    {lab.homeCollection && (
                      <span className="flex items-center gap-1 text-xs text-teal-600">
                        <HomeIcon size={10} /> Home
                      </span>
                    )}
                  </div>
                  <AccreditationBadge accreditations={lab.accreditation} className="mt-1.5" />
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="font-heading font-bold text-stone-900">{formatCurrency(total)}</span>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Sticky CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-0">
        <button
          onClick={handleContinue}
          disabled={!selectedLabId}
          className="flex items-center justify-center w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {selectedLabId ? "Continue" : "Select a Lab to Continue"}
        </button>
      </div>
    </PageShell>
  );
}
