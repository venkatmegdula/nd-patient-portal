"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { BookingProgressBar } from "@/components/booking/BookingProgressBar";
import { useBookingStore } from "@/stores/bookingStore";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, subtotal } = useBookingStore();

  useEffect(() => {
    // no redirect — let user see empty cart state with CTA
  }, []);

  return (
    <PageShell noPadBottom>
      <BookingProgressBar currentStep={1} />

      <h1 className="font-heading text-xl font-extrabold text-stone-900 mb-1">Your Cart</h1>
      <p className="text-sm text-stone-500 mb-5">Review your selected tests before booking</p>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
            <ShoppingCart size={28} className="text-stone-400" />
          </div>
          <p className="font-heading font-bold text-stone-700 text-lg mb-1">Your cart is empty</p>
          <p className="text-sm text-stone-400 mb-6">Add tests or packages to get started</p>
          <Link
            href="/tests"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 h-11 font-semibold text-sm hover:bg-teal-700 transition-colors"
          >
            Browse Tests
          </Link>
        </div>
      ) : (
        <>
          {/* Cart items */}
          <div className="flex flex-col gap-3 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3.5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 flex-shrink-0">
                  <span className="text-lg">{item.type === "package" ? "🎁" : "🧪"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-stone-400 capitalize">{item.type}</p>
                </div>
                <span className="font-heading font-bold text-stone-900 flex-shrink-0">
                  {formatCurrency(item.price)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Add more */}
          <Link
            href="/tests"
            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-dashed border-primary/50 text-primary text-sm font-medium hover:bg-teal-50 transition-colors mb-5"
          >
            <Plus size={15} />
            Add more tests
          </Link>

          {/* Subtotal */}
          <div className="rounded-2xl bg-stone-50 border border-border px-4 py-3 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
              <span className="font-heading font-bold text-stone-900">
                {formatCurrency(subtotal())}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              + collection fee (if applicable) applied at next step
            </p>
          </div>
        </>
      )}

      {/* Sticky CTA */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-0">
          <button
            onClick={() => router.push("/book/collection")}
            className="flex items-center justify-center w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
          >
            Continue — {formatCurrency(subtotal())}
          </button>
        </div>
      )}
    </PageShell>
  );
}
