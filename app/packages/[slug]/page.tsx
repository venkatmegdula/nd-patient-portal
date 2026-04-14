import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft, Check, Clock, AlertCircle,
  ChevronRight, Flame, Star, Sparkles, Heart
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AddToCartButton } from "@/components/discovery/AddToCartButton";
import { PriceTag } from "@/components/ui/PriceTag";
import { getPackageBySlug, packages } from "@/data/packages";
import { getTestById } from "@/data/tests";
import { labs } from "@/data/labs";
import { getLabsForTest } from "@/data/tests";
import { cn, formatCurrency } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return {};
  return { title: pkg.name, description: pkg.tagline };
}

const badgeIconMap: Record<string, React.ElementType> = {
  "Most Popular": Flame,
  "Best Value": Star,
  Bestseller: Sparkles,
  "Women's Health": Heart,
};

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) notFound();

  const includedTests = pkg.testIds
    .map((id) => getTestById(id))
    .filter(Boolean);

  const BadgeIcon = pkg.badge ? badgeIconMap[pkg.badge] : null;

  // Find labs that offer ALL tests in this package
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
    .filter((x): x is { lab: (typeof labs)[0]; total: number } => x !== null)
    .sort((a, b) => a.total - b.total);

  return (
    <PageShell noPadBottom>
      <Link
        href="/packages"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-primary transition-colors mb-4 min-h-0 h-auto"
      >
        <ArrowLeft size={16} /> All Packages
      </Link>

      {/* Header */}
      <div className={cn("rounded-2xl border border-border p-5 mb-4 overflow-hidden relative", pkg.colour)}>
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/20" />

        {pkg.badge && BadgeIcon && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-stone-700 backdrop-blur-sm">
            <BadgeIcon size={11} />
            {pkg.badge}
          </div>
        )}

        <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
          {pkg.name}
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed mb-4">{pkg.tagline}</p>

        <PriceTag price={pkg.price} originalPrice={pkg.basePrice} size="lg" />

        <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
          <Clock size={12} className="text-primary" />
          Report ready in {pkg.turnaroundHours}h
        </div>
      </div>

      {/* Whats included */}
      <div className="rounded-2xl border border-border bg-white p-4 mb-4">
        <h2 className="font-heading font-bold text-stone-900 mb-3">What&apos;s included</h2>
        <div className="flex flex-col gap-3">
          {includedTests.map((test) => (
            <Link
              key={test!.id}
              href={`/tests/${test!.slug}`}
              className="flex items-center gap-3 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 flex-shrink-0">
                <Check size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-900 group-hover:text-primary transition-colors truncate">
                  {test!.name}
                </p>
                <p className="text-xs text-stone-400 truncate">{test!.description.slice(0, 60)}…</p>
              </div>
              <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Preparation */}
      <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 mb-4">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800 mb-0.5">Preparation needed</p>
          <p className="text-xs text-amber-700 leading-relaxed">{pkg.preparation}</p>
        </div>
      </div>

      {/* Labs comparison */}
      {labCoverage.length > 0 && (
        <div className="mb-6">
          <h2 className="font-heading font-bold text-stone-900 mb-3">
            Available at these labs
          </h2>
          <div className="flex flex-col gap-2">
            {labCoverage.slice(0, 5).map(({ lab, total }, i) => (
              <div
                key={lab.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 font-bold text-teal-700 text-xs flex-shrink-0">
                  {lab.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">{lab.name}</p>
                  <p className="text-xs text-stone-400">{lab.area}</p>
                </div>
                {i === 0 && (
                  <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 rounded-full px-1.5 py-0.5 flex-shrink-0">
                    Lowest
                  </span>
                )}
                <span className="font-heading font-bold text-stone-900 flex-shrink-0">
                  {formatCurrency(total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Book CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-3 sm:pt-0">
        <AddToCartButton
          item={{ id: pkg.id, type: "package", name: pkg.name, price: pkg.price }}
          size="md"
          fullWidth
          label={`Book Package — ${formatCurrency(pkg.price)}`}
        />
      </div>
    </PageShell>
  );
}
