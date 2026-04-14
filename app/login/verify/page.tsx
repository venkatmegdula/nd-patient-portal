"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { cn, formatPhone } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Suspense } from "react";

function OTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "9848012345";
  const { login } = useAuthStore();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, "").slice(-1);
      setError("");
      const next = [...otp];
      next[index] = digit;
      setOtp(next);

      // Auto-advance
      if (digit && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }

      // Auto-submit when all 6 filled
      if (digit && index === 5 && next.every((d) => d !== "")) {
        submitOtp(next.join(""));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [otp]
  );

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split("");
      setOtp(digits);
      inputsRef.current[5]?.focus();
      submitOtp(pasted);
    }
  }

  async function submitOtp(code: string) {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 900));

    // Any 6-digit code is valid in prototype
    if (code.length === 6) {
      login(phone);
      toast.success("Welcome back, Ravi Kumar!");
      router.replace("/");
    } else {
      setError("Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setLoading(false);
    }
  }

  function handleResend() {
    setCountdown(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputsRef.current[0]?.focus();
    toast.info("OTP resent to " + formatPhone(phone));
  }

  const filled = otp.filter((d) => d !== "").length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center px-4 py-4">
        <Link
          href={`/login`}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-stone-600 min-h-0"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-4 pb-10 max-w-sm mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-heading font-extrabold text-xl mb-5">
            ND
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-2">
            Verify your number
          </h1>
          <p className="text-stone-500 text-[15px] leading-relaxed">
            Enter the 6-digit code sent to
            <br />
            <span className="font-semibold text-stone-800">
              +91 {phone.slice(0, 5)} {phone.slice(5)}
            </span>
          </p>
        </div>

        {/* OTP boxes */}
        <div className="flex gap-2.5 mb-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              autoFocus={i === 0}
              className={cn(
                "h-14 w-full rounded-2xl border-2 text-center text-2xl font-bold text-stone-900 transition-all focus:outline-none",
                digit
                  ? "border-primary bg-teal-50 scale-105"
                  : "border-border bg-white",
                error && "border-red-400 bg-red-50",
                loading && "opacity-60"
              )}
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center mb-6">
          {otp.map((d, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all",
                d ? "bg-primary w-4" : "bg-stone-200 w-2"
              )}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 text-center">
            {error}
          </p>
        )}

        {/* Verify button */}
        <button
          onClick={() => submitOtp(otp.join(""))}
          disabled={filled < 6 || loading}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-all mb-6",
            filled === 6 && !loading
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
              Verifying…
            </span>
          ) : (
            "Verify & Continue"
          )}
        </button>

        {/* Resend */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mx-auto min-h-0 h-auto"
            >
              <RefreshCw size={14} />
              Resend OTP
            </button>
          ) : (
            <p className="text-sm text-stone-400">
              Resend OTP in{" "}
              <span className="font-semibold text-stone-600 tabular-nums">
                0:{String(countdown).padStart(2, "0")}
              </span>
            </p>
          )}
        </div>

        {/* Prototype note */}
        <div className="mt-8 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-xs text-amber-700 text-center leading-relaxed">
            <span className="font-bold">Prototype mode:</span> Enter any 6 digits to log in.
            No real SMS is sent.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <OTPForm />
    </Suspense>
  );
}
