"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  Star,
  FlaskConical,
  Home,
  Users,
  UserCheck,
  ShoppingBag,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

/* ── tier config ─────────────────────────────────── */

type Tier = "bronze" | "silver" | "gold";

const TIER_META: Record<
  Tier,
  { label: string; colour: string; badgeClass: string; min: number; max: number | null }
> = {
  bronze: {
    label: "Bronze",
    colour: "text-amber-700",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    min: 0,
    max: 499,
  },
  silver: {
    label: "Silver",
    colour: "text-stone-600",
    badgeClass: "bg-stone-100 text-stone-600 border-stone-300",
    min: 500,
    max: 999,
  },
  gold: {
    label: "Gold",
    colour: "text-yellow-600",
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
    min: 1000,
    max: null,
  },
};

function getTierProgress(totalEarned: number, tier: Tier): {
  pct: number;
  nextTierLabel: string | null;
  ptsToNext: number | null;
} {
  if (tier === "bronze") {
    const ptsToNext = 500 - totalEarned;
    return {
      pct: Math.min((totalEarned / 500) * 100, 100),
      nextTierLabel: "Silver",
      ptsToNext: Math.max(ptsToNext, 0),
    };
  }
  if (tier === "silver") {
    const ptsToNext = 1000 - totalEarned;
    return {
      pct: Math.min(((totalEarned - 500) / 500) * 100, 100),
      nextTierLabel: "Gold",
      ptsToNext: Math.max(ptsToNext, 0),
    };
  }
  return { pct: 100, nextTierLabel: null, ptsToNext: null };
}

/* ── earn rows ────────────────────────────────────── */

const EARN_ROWS = [
  { icon: FlaskConical, label: "Book a test", pts: "+50 pts" },
  { icon: Home, label: "Home collection booking", pts: "+75 pts" },
  { icon: Users, label: "Refer a friend", pts: "+200 pts" },
  { icon: UserCheck, label: "Complete profile", pts: "+25 pts" },
];

/* ── recent activity (hardcoded) ─────────────────── */

const RECENT_ACTIVITY = [
  { label: "Diabetes Care package booked", pts: "+50 pts", date: "13 Apr" },
  { label: "Account created", pts: "+25 pts", date: "13 Apr" },
];

/* ── page ─────────────────────────────────────────── */

export default function RewardsPage() {
  const router = useRouter();
  const loyalty = useAuthStore((s) => s.loyalty);
  const [copied, setCopied] = useState(false);

  const tier = loyalty.tier as Tier;
  const tierMeta = TIER_META[tier];
  const { pct, nextTierLabel, ptsToNext } = getTierProgress(
    loyalty.totalEarned,
    tier
  );

  function handleCopy() {
    navigator.clipboard.writeText(loyalty.referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white hover:border-primary/40 transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={16} className="text-stone-600" />
        </button>
        <h1 className="font-heading font-extrabold text-stone-900 text-xl">
          Rewards &amp; Loyalty
        </h1>
      </div>

      {/* Points card — teal gradient */}
      <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 px-5 py-5 mb-4 text-white shadow-md">
        {/* Points + tier badge */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-xs font-semibold text-teal-200 uppercase tracking-wider mb-1">
              Your Points
            </p>
            <p className="font-heading font-extrabold text-5xl leading-none">
              {loyalty.points.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-teal-200 mt-1.5">
              Total earned: {loyalty.totalEarned} pts
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
              tierMeta.badgeClass
            )}
          >
            <Star size={11} className="fill-current" />
            {tierMeta.label}
          </span>
        </div>

        {/* Referral code */}
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
          <p className="flex-1 text-sm font-semibold text-white/90 truncate">
            Your code:{" "}
            <span className="font-extrabold tracking-widest">
              {loyalty.referralCode}
            </span>
          </p>
          <button
            onClick={handleCopy}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Copy referral code"
          >
            {copied ? (
              <Check size={13} className="text-green-300" />
            ) : (
              <Copy size={13} className="text-white" />
            )}
          </button>
        </div>

        {/* Tier progress bar */}
        <div className="mt-4">
          {nextTierLabel ? (
            <>
              <div className="flex justify-between text-xs text-teal-200 mb-1.5">
                <span>{tierMeta.label}</span>
                <span>
                  {ptsToNext} pts to {nextTierLabel}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white/70 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-teal-200 mt-1 text-right">
                Next: {nextTierLabel}
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full w-full rounded-full bg-yellow-300" />
              </div>
              <span className="text-xs font-bold text-yellow-300 flex-shrink-0">
                Max Tier!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* How to earn */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-bold text-stone-800">How to Earn Points</p>
        </div>
        <div className="divide-y divide-border">
          {EARN_ROWS.map(({ icon: Icon, label, pts }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
                  <Icon size={15} className="text-teal-600" />
                </div>
                <span className="text-sm text-stone-700">{label}</span>
              </div>
              <span className="text-sm font-bold text-teal-700">{pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem section */}
      <div className="rounded-2xl border border-border bg-white px-4 py-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 flex-shrink-0">
            <ShoppingBag size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800">
              Use Points at Checkout
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              ₹1 off per 10 points — redeem during booking
            </p>
          </div>
        </div>
        {loyalty.points >= 10 && (
          <div className="mt-3 rounded-xl bg-teal-50 px-3 py-2 text-xs text-teal-700 font-semibold">
            You can save up to ₹{Math.floor(loyalty.points / 10)} on your next
            booking
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden mb-2">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-bold text-stone-800">Recent Activity</p>
        </div>
        <div className="divide-y divide-border">
          {RECENT_ACTIVITY.map(({ label, pts, date }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm text-stone-700">{label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{date}</p>
              </div>
              <span className="text-sm font-bold text-teal-700">{pts}</span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
