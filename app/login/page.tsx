"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValid = /^\d{10}$/.test(phone);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    // Mock: simulate OTP send delay
    await new Promise((r) => setTimeout(r, 800));
    router.push(`/login/verify?phone=${phone}`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center px-4 py-4">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-stone-600 min-h-0"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-4 pb-10 max-w-sm mx-auto w-full">
        {/* Logo + headline */}
        <div className="mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-heading font-extrabold text-xl mb-5">
            ND
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-2">
            Enter your mobile number
          </h1>
          <p className="text-stone-500 text-[15px] leading-relaxed">
            We&apos;ll send a one-time password to verify your number.
          </p>
        </div>

        <form onSubmit={handleContinue} className="flex flex-col gap-5">
          {/* Phone input */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-stone-700 mb-2"
            >
              Mobile Number
            </label>
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 bg-white px-4 py-3.5 transition-colors",
                phone.length > 0 && isValid
                  ? "border-primary"
                  : phone.length > 0
                  ? "border-stone-300"
                  : "border-border"
              )}
            >
              {/* Country code */}
              <div className="flex items-center gap-1.5 border-r border-stone-200 pr-3 flex-shrink-0">
                <span className="text-lg">🇮🇳</span>
                <span className="text-stone-700 font-semibold text-[15px]">+91</span>
              </div>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={handleInput}
                placeholder="98480 12345"
                className="flex-1 bg-transparent text-stone-900 placeholder:text-stone-400 focus:outline-none text-lg font-medium tracking-wider min-h-0 h-auto"
                autoFocus
                aria-label="Mobile number"
              />
              {isValid && (
                <ShieldCheck size={18} className="text-primary flex-shrink-0" />
              )}
            </div>
            <p className="mt-1.5 text-xs text-stone-400">
              Enter your 10-digit Indian mobile number
            </p>
          </div>

          {/* Continue button */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-all",
              isValid && !loading
                ? "bg-primary text-white hover:bg-teal-700 shadow-md shadow-teal-200 active:scale-[0.98]"
                : "bg-stone-100 text-stone-400 cursor-not-allowed"
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Sending OTP…
              </span>
            ) : (
              <>
                Get OTP <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Social proof */}
        <div className="mt-8 flex flex-col gap-2">
          {[
            "✓ Your data is safe and encrypted",
            "✓ No spam, only booking updates via SMS",
            "✓ OTP valid for 10 minutes",
          ].map((item) => (
            <p key={item} className="text-xs text-stone-400">
              {item}
            </p>
          ))}
        </div>

        <p className="mt-auto pt-8 text-xs text-center text-stone-400 leading-relaxed">
          By continuing, you agree to our{" "}
          <span className="text-primary">Terms of Service</span> and{" "}
          <span className="text-primary">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
