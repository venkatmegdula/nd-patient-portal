"use client";

import Link from "next/link";
import { Check, Flame, Star, Sparkles, Heart } from "lucide-react";
import { cn, formatCurrency, savingsPercent } from "@/lib/utils";
import type { DiagnosticPackage } from "@/lib/types";
import { tests } from "@/data/tests";

interface PackageCardProps {
  pkg: DiagnosticPackage;
  variant?: "strip" | "full";
}

const badgeIconMap: Record<string, React.ElementType> = {
  "Most Popular": Flame,
  "Best Value":   Star,
  "Bestseller":   Sparkles,
  "Women's Health": Heart,
};

const badgeColourMap: Record<string, string> = {
  "Most Popular":   "bg-amber-500 text-white",
  "Best Value":     "bg-teal-600 text-white",
  "Bestseller":     "bg-purple-600 text-white",
  "Women's Health": "bg-pink-500 text-white",
};

export function PackageCard({ pkg, variant = "strip" }: PackageCardProps) {
  const savings = savingsPercent(pkg.basePrice, pkg.price);
  const BadgeIcon = pkg.badge ? badgeIconMap[pkg.badge] : null;
  const badgeColour = pkg.badge ? badgeColourMap[pkg.badge] : "";

  const includedTests = pkg.testIds
    .map((id) => tests.find((t) => t.id === id))
    .filter(Boolean);

  const isStrip = variant === "strip";

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className={cn(
        "relative flex flex-col rounded-2xl border border-border bg-white overflow-hidden hover:border-primary hover:shadow-md transition-all active:scale-[0.98]",
        isStrip ? "w-[220px] flex-shrink-0 snap-start p-4" : "p-5"
      )}
    >
      {/* Accent stripe */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-2xl", pkg.colour.replace("bg-", "bg-").replace("50", "400").replace("text-", "").split(" ")[0])} />

      {/* Badge */}
      {pkg.badge && BadgeIcon && (
        <div
          className={cn(
            "mb-3 mt-1 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
            badgeColour
          )}
        >
          <BadgeIcon size={10} />
          {pkg.badge}
        </div>
      )}

      {/* Name */}
      <h3 className="font-heading font-bold text-stone-900 text-[15px] leading-tight mb-1">
        {pkg.name}
      </h3>
      <p className="text-xs text-stone-500 leading-snug mb-3">{pkg.tagline}</p>

      {/* Tests list */}
      <ul className="flex flex-col gap-1 mb-4">
        {includedTests.slice(0, isStrip ? 3 : includedTests.length).map((t) => (
          <li key={t!.id} className="flex items-center gap-1.5 text-xs text-stone-600">
            <Check size={12} className="text-primary flex-shrink-0" />
            {t!.shortName ?? t!.name}
          </li>
        ))}
        {isStrip && includedTests.length > 3 && (
          <li className="text-xs text-stone-400 pl-[18px]">
            +{includedTests.length - 3} more
          </li>
        )}
      </ul>

      {/* Price */}
      <div className="mt-auto flex items-center justify-between">
        <div>
          <p className="font-heading font-bold text-stone-900 text-lg leading-none">
            {formatCurrency(pkg.price)}
          </p>
          <p className="text-xs text-stone-400 line-through">
            {formatCurrency(pkg.basePrice)}
          </p>
        </div>
        {savings > 0 && (
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
            {savings}% off
          </span>
        )}
      </div>
    </Link>
  );
}
