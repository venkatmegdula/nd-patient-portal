"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
  ChevronRight,
  Flame,
  Star,
  Sparkles,
  Heart,
  MapPin,
  ShoppingCart,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PriceTag } from "@/components/ui/PriceTag";
import { AccreditationBadge } from "@/components/ui/AccreditationBadge";
import { getPackageBySlug } from "@/data/packages";
import { getTestById, getLabsForTest } from "@/data/tests";
import { labs } from "@/data/labs";
import { useBookingStore } from "@/stores/bookingStore";
import { cn, formatCurrency, savingsPercent } from "@/lib/utils";
import { toast } from "sonner";

const badgeIconMap: Record<string, React.ElementType> = {
  "Most Popular": Flame,
  "Best Value":   Star,
  Bestseller:     Sparkles,
  "Women's Health": Heart,
};

export default function PackageDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { addToCart, removeFromCart, cart } = useBookingStore();

  const slug = params?.slug ?? "";
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    return (
      <PageShell>
        <div className="py-16 text-center">
          <p className="text-stone-500">Package not found.</p>
          <Link
            href="/packages"
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Browse all packages
          </Link>
        </div>
      </PageShell>
    );
  }

  const includedTests = pkg.testIds
    .map((id) => getTestById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getTestById>>[];

  const BadgeIcon = pkg.badge ? badgeIconMap[pkg.badge] : null;
  const savings = pkg.basePrice - pkg.price;
  const savingsPct = savingsPercent(pkg.basePrice, pkg.price);

  // Find labs that offer ALL tests in this package, sorted by total price
  const labCoverage = labs
    .map((lab) => {
      const prices = pkg.testIds.map((testId) => {
        const lt = getLabsForTest(testId).find((l) => l.labId === lab.id);
        return lt ? lt.price : null;
      });
      if (prices.some((p) => p === null)) return null;
      const total = (prices as number[]).reduce((s, p) => s + p, 0);
      return { lab, total };
    })
    .filter(
      (x): x is { lab: (typeof labs)[number]; total: number } => x !== null
    )
    .sort((a, b) => a.total - b.total);

  const isInCart = cart.some((c) => c.id === pkg.id);

  function handleAddToCart() {
    if (isInCart) {
      removeFromCart(pkg!.id);
      toast.info(`${pkg!.name} removed from cart`);
    } else {
      addToCart({
        id: pkg!.id,
        type: "package",
        name: pkg!.name,
        price: pkg!.price,
      });
      toast.success(`${pkg!.name} added to cart!`, {
        action: {
          label: "View Cart",
          onClick: () => router.push("/book"),
        },
      });
    }
  }

  return (
    <PageShell noPadBottom>
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-primary transition-colors mb-4 min-h-0 h-auto"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header card */}
      <div
        className={cn(
          "rounded-2xl border border-border p-5 mb-4 overflow-hidden relative",
          pkg.colour
        )}
      >
        {/* Decorative circle */}
        <div className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/20" />

        {/* Badge */}
        {pkg.badge && BadgeIcon && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-stone-700 backdrop-blur-sm">
            <BadgeIcon size={11} />
            {pkg.badge}
          </div>
        )}

        <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
          {pkg.name}
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed mb-4">
          {pkg.tagline}
        </p>

        <PriceTag price={pkg.price} originalPrice={pkg.basePrice} size="lg" />

        {savings > 0 && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-bold text-green-700">
            <Check size={11} />
            Save {formatCurrency(savings)} ({savingsPct}% off)
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
          <Clock size={12} className="text-primary" />
          Report ready in {pkg.turnaroundHours}h
        </div>
      </div>

      {/* What's included */}
      <div className="rounded-2xl border border-border bg-white p-4 mb-4">
        <h2 className="font-heading font-bold text-stone-900 mb-3">
          What&apos;s included ({includedTests.length} tests)
        </h2>
        <div className="flex flex-col gap-3">
          {includedTests.map((test) => (
            <Link
              key={test.id}
              href={`/tests/${test.slug}`}
              className="flex items-center gap-3 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                <Check size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-900 group-hover:text-primary transition-colors truncate">
                  {test.name}
                  {test.shortName && (
                    <span className="text-stone-400 font-normal ml-1 text-xs">
                      ({test.shortName})
                    </span>
                  )}
                </p>
                <p className="text-xs text-stone-400 truncate">
                  {test.sampleType} ·{" "}
                  {test.turnaroundHours > 0
                    ? `${test.turnaroundHours}h TAT`
                    : "Instant"}
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-stone-300 flex-shrink-0 group-hover:text-primary transition-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Preparation */}
      <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 mb-4">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800 mb-0.5">
            Preparation needed
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            {pkg.preparation}
          </p>
        </div>
      </div>

      {/* Lab options */}
      {labCoverage.length > 0 && (
        <div className="mb-6">
          <h2 className="font-heading font-bold text-stone-900 mb-1">
            Available at these labs
          </h2>
          <p className="text-xs text-stone-400 mb-3">
            Individual test prices shown. Package price is{" "}
            {formatCurrency(pkg.price)}.
          </p>
          <div className="flex flex-col gap-2">
            {labCoverage.slice(0, 4).map(({ lab, total }, i) => {
              const labInitials = lab.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2);
              const labSaving = total - pkg.price;
              return (
                <Link
                  key={lab.id}
                  href={`/labs/${lab.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition-colors hover:border-primary/40",
                    i === 0 ? "border-green-200 bg-green-50/30" : "border-border"
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 font-heading font-bold text-teal-700 text-xs flex-shrink-0 border border-teal-100">
                    {labInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <p className="text-sm font-semibold text-stone-900 truncate">
                        {lab.name}
                      </p>
                      {i === 0 && (
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 rounded-full px-1.5 py-0.5 flex-shrink-0">
                          Lowest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <MapPin size={10} />
                        {lab.area}
                      </span>
                      <AccreditationBadge accreditations={lab.accreditation} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="font-heading font-bold text-stone-900 text-base leading-tight">
                      {formatCurrency(pkg.price)}
                    </span>
                    {labSaving > 0 && (
                      <span className="text-[10px] text-stone-400 line-through">
                        {formatCurrency(total)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky Add to Cart CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-0">
        <button
          onClick={handleAddToCart}
          className={cn(
            "flex w-full items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-all active:scale-[0.99]",
            isInCart
              ? "bg-teal-50 text-teal-700 border border-teal-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              : "bg-primary text-white hover:bg-teal-700"
          )}
        >
          {isInCart ? (
            <>
              <Check size={16} />
              Package Added — tap to remove
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add Package to Cart · {formatCurrency(pkg.price)}
              {savings > 0 && (
                <span className="ml-1 text-xs opacity-75">
                  (save {formatCurrency(savings)})
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </PageShell>
  );
}
