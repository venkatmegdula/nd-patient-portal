"use client";

import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { Clock, Home, ShoppingCart, Check } from "lucide-react";
import type { DiagnosticTest } from "@/lib/types";
import { getPriceRange } from "@/data/tests";
import { useBookingStore } from "@/stores/bookingStore";
import { toast } from "sonner";

interface TestCardProps {
  test: DiagnosticTest;
  variant?: "grid" | "list";
  labPrice?: number;   // when shown in lab context with a specific price
  labId?: string;
  homeCollectionAvailable?: boolean;
}

export function TestCard({
  test,
  variant = "grid",
  labPrice,
  labId,
  homeCollectionAvailable,
}: TestCardProps) {
  const { addToCart, cart } = useBookingStore();
  const priceRange = getPriceRange(test.id);
  const isInCart = cart.some((c) => c.id === test.id);

  function handleBook() {
    if (isInCart) return;
    addToCart({
      id: test.id,
      type: "test",
      name: test.name,
      price: labPrice ?? priceRange?.min ?? 0,
    });
    toast.success(`${test.shortName ?? test.name} added to cart`);
  }

  const displayPrice = labPrice ?? priceRange?.min;

  if (variant === "list") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4 hover:border-primary/40 transition-colors">
        <div className="flex-1 min-w-0">
          <Link href={`/tests/${test.slug}`} className="block">
            <h3 className="font-semibold text-stone-900 text-[15px] leading-tight truncate hover:text-primary transition-colors">
              {test.name}
            </h3>
          </Link>
          <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {test.turnaroundHours > 0 ? `${test.turnaroundHours}h` : "Instant"}
            </span>
            {homeCollectionAvailable && (
              <span className="flex items-center gap-1 text-teal-600">
                <Home size={11} />
                Home collection
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {displayPrice != null && (
            <span className="font-heading font-bold text-stone-900 text-[15px]">
              {formatCurrency(displayPrice)}
            </span>
          )}
          <button
            onClick={handleBook}
            disabled={isInCart}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold transition-colors min-h-0",
              isInCart
                ? "bg-teal-50 text-teal-700 cursor-default"
                : "bg-primary text-white hover:bg-teal-700"
            )}
          >
            {isInCart ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={14} /> Book
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-white p-4 hover:border-primary/40 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-2">
        <Link href={`/tests/${test.slug}`} className="flex-1 mr-2">
          <h3 className="font-semibold text-stone-900 text-[15px] leading-tight hover:text-primary transition-colors">
            {test.name}
          </h3>
        </Link>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 flex-shrink-0">
          {test.sampleType === "Non-invasive" ? "Non-invasive" : "Blood"}
        </span>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-3 flex-1">
        {test.description}
      </p>

      <div className="flex items-center gap-2 text-xs text-stone-400 mb-3">
        <Clock size={11} />
        <span>
          {test.turnaroundHours > 0
            ? `Report in ${test.turnaroundHours}h`
            : "Instant result"}
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div>
          {displayPrice != null ? (
            <span className="font-heading font-bold text-stone-900 text-lg">
              {formatCurrency(displayPrice)}
            </span>
          ) : (
            <span className="text-sm text-stone-400">Price varies</span>
          )}
          {!labPrice && priceRange && priceRange.max > priceRange.min && (
            <p className="text-[10px] text-stone-400">
              up to {formatCurrency(priceRange.max)}
            </p>
          )}
        </div>
        <button
          onClick={handleBook}
          disabled={isInCart}
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition-colors min-h-0",
            isInCart
              ? "bg-teal-50 text-teal-700 cursor-default"
              : "bg-primary text-white hover:bg-teal-700"
          )}
        >
          {isInCart ? (
            <>
              <Check size={14} /> Added
            </>
          ) : (
            "Book"
          )}
        </button>
      </div>
    </div>
  );
}
