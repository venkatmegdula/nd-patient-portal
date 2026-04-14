"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShieldCheck, Smartphone, CreditCard, Building } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { BookingProgressBar } from "@/components/booking/BookingProgressBar";
import { useBookingStore } from "@/stores/bookingStore";
import { formatCurrency, cn } from "@/lib/utils";

type PayMethod = "upi" | "card" | "netbanking";

export default function PaymentPage() {
  const router = useRouter();
  const { cart, total, confirmBooking } = useBookingStore();

  const [method, setMethod] = useState<PayMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (cart.length === 0) router.replace("/book");
  }, [cart, router]);

  async function handlePay() {
    setPaying(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1800));
    const bookingId = confirmBooking();
    router.push(`/booking/confirmed/${bookingId}`);
  }

  const tabs: { id: PayMethod; icon: React.ElementType; label: string }[] = [
    { id: "upi", icon: Smartphone, label: "UPI" },
    { id: "card", icon: CreditCard, label: "Card" },
    { id: "netbanking", icon: Building, label: "Net Banking" },
  ];

  return (
    <PageShell noPadBottom>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-4 min-h-0 h-auto"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <BookingProgressBar currentStep={7} />

      <h1 className="font-heading text-xl font-extrabold text-stone-900 mb-1">
        Complete Payment
      </h1>
      <p className="text-sm text-stone-500 mb-5">
        Secure payment powered by Razorpay
      </p>

      {/* Payment method tabs */}
      <div className="flex rounded-2xl border border-border bg-stone-50 p-1 gap-1 mb-5">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setMethod(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl h-10 text-sm font-semibold transition-all",
              method === id
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* UPI */}
      {method === "upi" && (
        <div className="rounded-2xl border border-border bg-white p-4 mb-4">
          <p className="text-sm font-semibold text-stone-700 mb-3">Enter UPI ID</p>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            className="w-full rounded-xl border border-border bg-stone-50 px-4 h-11 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="mt-4 flex items-center justify-center gap-6">
            {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
              <button
                key={app}
                onClick={() => setUpiId(`user@${app.toLowerCase()}`)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="h-10 w-10 rounded-xl bg-stone-100 border border-border flex items-center justify-center text-xs font-bold text-stone-600 group-hover:border-primary/40 transition-colors">
                  {app[0]}
                </div>
                <span className="text-[10px] text-stone-400">{app}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Card */}
      {method === "card" && (
        <div className="rounded-2xl border border-border bg-white p-4 mb-4 flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full rounded-xl border border-border bg-stone-50 px-4 h-11 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono tracking-wider"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-500 mb-1.5 block">Expiry</label>
              <input
                type="text"
                placeholder="MM / YY"
                maxLength={7}
                className="w-full rounded-xl border border-border bg-stone-50 px-4 h-11 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 mb-1.5 block">CVV</label>
              <input
                type="password"
                placeholder="•••"
                maxLength={4}
                className="w-full rounded-xl border border-border bg-stone-50 px-4 h-11 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-500 mb-1.5 block">Name on Card</label>
            <input
              type="text"
              placeholder="RAVI KUMAR"
              className="w-full rounded-xl border border-border bg-stone-50 px-4 h-11 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
            />
          </div>
        </div>
      )}

      {/* Net Banking */}
      {method === "netbanking" && (
        <div className="rounded-2xl border border-border bg-white p-4 mb-4">
          <p className="text-sm font-semibold text-stone-700 mb-3">Select Your Bank</p>
          <div className="grid grid-cols-2 gap-2">
            {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Yes Bank"].map((bank) => (
              <button
                key={bank}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-stone-50 px-3 h-11 text-sm font-medium text-stone-700 hover:border-primary/40 transition-colors"
              >
                <div className="h-6 w-6 rounded-md bg-teal-50 border border-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">
                  {bank[0]}
                </div>
                {bank}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck size={14} className="text-green-600 flex-shrink-0" />
        <p className="text-xs text-stone-400">
          256-bit SSL encrypted · 100% secure payment
        </p>
      </div>

      {/* Demo notice */}
      <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-5">
        <p className="text-xs text-amber-700 font-medium">
          🧪 Prototype — any input will proceed. No real payment is processed.
        </p>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-0">
        <button
          onClick={handlePay}
          disabled={paying}
          className="relative flex items-center justify-center w-full h-12 rounded-xl bg-primary text-white font-bold text-base hover:bg-teal-700 transition-colors disabled:opacity-80"
        >
          {paying ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
              </svg>
              Processing…
            </span>
          ) : (
            `Pay ${formatCurrency(total())} Securely`
          )}
        </button>
      </div>
    </PageShell>
  );
}
