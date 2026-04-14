"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Tag, X, MapPin, Clock, User, Building2, Home as HomeIcon } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { BookingProgressBar } from "@/components/booking/BookingProgressBar";
import { useBookingStore, COUPONS } from "@/stores/bookingStore";
import { getLabById } from "@/data/labs";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export default function SummaryPage() {
  const router = useRouter();
  const {
    cart, collectionType, selectedLabId, collectionAddress,
    slotDate, slotTime, patientName, patientAge, patientGender,
    couponCode, discount, applyCoupon, subtotal, total,
  } = useBookingStore();

  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState(!!couponCode);

  useEffect(() => {
    if (cart.length === 0) router.replace("/book");
  }, [cart, router]);

  const lab = selectedLabId ? getLabById(selectedLabId) : null;
  const homeCollFee = collectionType === "home-collection" ? 100 : 0;

  function applyCouponCode() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const value = COUPONS[code];
    if (value !== undefined) {
      applyCoupon(code, value);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try WELCOME50 or FIRST100.");
    }
  }

  function removeCoupon() {
    applyCoupon("", 0);
    setCouponInput("");
    setCouponApplied(false);
    setCouponError("");
  }

  return (
    <PageShell noPadBottom>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-4 min-h-0 h-auto"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <BookingProgressBar currentStep={6} />

      <h1 className="font-heading text-xl font-extrabold text-stone-900 mb-1">
        Order Summary
      </h1>
      <p className="text-sm text-stone-500 mb-5">
        Review everything before you pay
      </p>

      {/* Tests */}
      <div className="rounded-2xl border border-border bg-white p-4 mb-3">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">
          Tests ({cart.length})
        </p>
        <div className="flex flex-col gap-2.5">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>{item.type === "package" ? "🎁" : "🧪"}</span>
                <span className="text-stone-700">{item.name}</span>
              </div>
              <span className="font-semibold text-stone-900">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment details */}
      <div className="rounded-2xl border border-border bg-white p-4 mb-3">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">
          Appointment
        </p>
        <div className="flex flex-col gap-2.5 text-sm">
          {slotDate && slotTime && (
            <div className="flex items-center gap-2.5">
              <Clock size={14} className="text-primary flex-shrink-0" />
              <span className="text-stone-700">
                {formatDate(slotDate)} at {formatTime(slotTime)}
              </span>
            </div>
          )}
          {collectionType === "lab-visit" && lab ? (
            <div className="flex items-center gap-2.5">
              <Building2 size={14} className="text-primary flex-shrink-0" />
              <span className="text-stone-700">{lab.name}, {lab.area}</span>
            </div>
          ) : collectionAddress ? (
            <div className="flex items-start gap-2.5">
              <HomeIcon size={14} className="text-primary flex-shrink-0 mt-0.5" />
              <span className="text-stone-700">{collectionAddress}</span>
            </div>
          ) : null}
          {patientName && (
            <div className="flex items-center gap-2.5">
              <User size={14} className="text-primary flex-shrink-0" />
              <span className="text-stone-700">
                {patientName}, {patientAge} yrs, {patientGender}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Coupon */}
      <div className="rounded-2xl border border-border bg-white p-4 mb-3">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">
          Coupon Code
        </p>
        {couponApplied ? (
          <div className="flex items-center justify-between rounded-xl bg-green-50 border border-green-200 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-green-600" />
              <span className="text-sm font-bold text-green-700">{couponCode}</span>
              <span className="text-xs text-green-600">– {formatCurrency(discount)} off</span>
            </div>
            <button onClick={removeCoupon} className="text-stone-400 hover:text-red-500 transition-colors">
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
              onKeyDown={(e) => e.key === "Enter" && applyCouponCode()}
              placeholder="Enter coupon code"
              className="flex-1 rounded-xl border border-border bg-stone-50 px-4 h-10 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
            />
            <button
              onClick={applyCouponCode}
              className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
        {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
        {!couponApplied && (
          <p className="text-xs text-stone-400 mt-2">Try: WELCOME50 · FIRST100 · ND10</p>
        )}
      </div>

      {/* Price breakdown */}
      <div className="rounded-2xl border border-border bg-white p-4 mb-5">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-3">
          Price Breakdown
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Tests subtotal</span>
            <span className="text-stone-900">{formatCurrency(subtotal())}</span>
          </div>
          {homeCollFee > 0 && (
            <div className="flex justify-between">
              <span className="text-stone-500">Home collection fee</span>
              <span className="text-stone-900">{formatCurrency(homeCollFee)}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon ({couponCode})</span>
              <span>– {formatCurrency(discount)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 mt-1 flex justify-between font-heading font-extrabold text-base">
            <span className="text-stone-900">Total</span>
            <span className="text-stone-900">{formatCurrency(total())}</span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-0">
        <button
          onClick={() => router.push("/book/payment")}
          className="flex items-center justify-center w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          Confirm &amp; Pay — {formatCurrency(total())}
        </button>
      </div>
    </PageShell>
  );
}
