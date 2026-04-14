"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Home as HomeIcon, ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { BookingProgressBar } from "@/components/booking/BookingProgressBar";
import { useBookingStore } from "@/stores/bookingStore";
import { cn } from "@/lib/utils";

export default function CollectionPage() {
  const router = useRouter();
  const { cart, collectionType, setCollectionType } = useBookingStore();

  useEffect(() => {
    if (cart.length === 0) router.replace("/book");
  }, [cart, router]);

  function handleSelect(type: "lab-visit" | "home-collection") {
    setCollectionType(type);
    if (type === "lab-visit") {
      router.push("/book/lab");
    } else {
      router.push("/book/address");
    }
  }

  return (
    <PageShell noPadBottom>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-4 min-h-0 h-auto"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <BookingProgressBar currentStep={2} />

      <h1 className="font-heading text-xl font-extrabold text-stone-900 mb-1">
        How would you like to give your sample?
      </h1>
      <p className="text-sm text-stone-500 mb-6">
        Choose the option that works best for you
      </p>

      <div className="flex flex-col gap-4">
        {/* Lab visit */}
        <button
          onClick={() => handleSelect("lab-visit")}
          className={cn(
            "flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98]",
            collectionType === "lab-visit"
              ? "border-primary bg-teal-50"
              : "border-border bg-white hover:border-primary/40"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 flex-shrink-0">
            <Building2 size={26} className="text-teal-700" />
          </div>
          <div>
            <p className="font-heading font-bold text-stone-900 text-base mb-1">
              Visit the Lab
            </p>
            <p className="text-sm text-stone-500 leading-relaxed">
              Go to the lab at your chosen date and time. Results are often faster.
            </p>
            <span className="mt-2 inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2.5 py-0.5">
              No extra fee
            </span>
          </div>
        </button>

        {/* Home collection */}
        <button
          onClick={() => handleSelect("home-collection")}
          className={cn(
            "flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all active:scale-[0.98]",
            collectionType === "home-collection"
              ? "border-primary bg-teal-50"
              : "border-border bg-white hover:border-primary/40"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 flex-shrink-0">
            <HomeIcon size={26} className="text-sky-700" />
          </div>
          <div>
            <p className="font-heading font-bold text-stone-900 text-base mb-1">
              Home Collection
            </p>
            <p className="text-sm text-stone-500 leading-relaxed">
              A trained phlebotomist comes to your door at your chosen time.
            </p>
            <span className="mt-2 inline-block text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
              + ₹100 collection fee
            </span>
          </div>
        </button>
      </div>
    </PageShell>
  );
}
