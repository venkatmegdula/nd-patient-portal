import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft, Clock, FlaskConical, AlertCircle,
  ShoppingCart, MapPin, Star, Home as HomeIcon, Check
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AccreditationBadge } from "@/components/ui/AccreditationBadge";
import { AddToCartButton } from "@/components/discovery/AddToCartButton";
import { getTestBySlug, getLabsForTest } from "@/data/tests";
import { getLabById } from "@/data/labs";
import { tests } from "@/data/tests";
import { formatCurrency } from "@/lib/utils";
import { categories } from "@/data/categories";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tests.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const test = getTestBySlug(slug);
  if (!test) return {};
  return {
    title: test.name,
    description: test.description,
  };
}

export default async function TestDetailPage({ params }: Props) {
  const { slug } = await params;
  const test = getTestBySlug(slug);
  if (!test) notFound();

  const labPricing = getLabsForTest(test.id)
    .map((lt) => ({ ...lt, lab: getLabById(lt.labId) }))
    .filter((lt) => lt.lab != null)
    .sort((a, b) => a.price - b.price);

  const category = categories.find((c) => c.id === test.category);
  const minPrice = labPricing[0]?.price;
  const maxPrice = labPricing[labPricing.length - 1]?.price;

  return (
    <PageShell noPadBottom>
      {/* Back */}
      <Link
        href="/tests"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-primary transition-colors mb-4 min-h-0 h-auto"
      >
        <ArrowLeft size={16} />
        All Tests
      </Link>

      {/* Header card */}
      <div className="rounded-2xl border border-border bg-white p-5 mb-4">
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${category?.colour ?? "bg-teal-50 text-teal-600"}`}>
            <FlaskConical size={22} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-xl font-extrabold text-stone-900 leading-tight">
              {test.name}
            </h1>
            {test.shortName && (
              <span className="text-sm text-stone-400">{test.shortName}</span>
            )}
          </div>
        </div>

        <p className="text-[15px] text-stone-600 leading-relaxed mb-4">
          {test.description}
        </p>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 border border-border px-3 py-1.5 text-xs font-medium text-stone-600">
            <FlaskConical size={12} className="text-primary" />
            {test.sampleType}
          </span>
          {test.turnaroundHours > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 border border-border px-3 py-1.5 text-xs font-medium text-stone-600">
              <Clock size={12} className="text-primary" />
              Report in {test.turnaroundHours}h
            </span>
          )}
          {minPrice && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1.5 text-xs font-semibold text-teal-700">
              Starts at {formatCurrency(minPrice)}
            </span>
          )}
        </div>

        {/* Preparation */}
        {test.preparation && (
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 mb-0.5">Preparation needed</p>
              <p className="text-xs text-amber-700 leading-relaxed">{test.preparation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Labs pricing */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-bold text-stone-900 mb-3">
          Labs offering this test
        </h2>

        {labPricing.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">No labs listed yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {labPricing.map((lt, i) => {
              const lab = lt.lab!;
              return (
                <div
                  key={lt.labId}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 hover:border-primary/40 transition-colors"
                >
                  {i === 0 && (
                    <span className="absolute ml-0 -mt-10 hidden" />
                  )}
                  {/* Lab info */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 font-heading font-bold text-teal-700 text-xs flex-shrink-0">
                    {lab.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-stone-900 text-sm truncate">{lab.name}</p>
                      {i === 0 && (
                        <span className="rounded-full bg-green-50 border border-green-200 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                          Lowest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <MapPin size={10} /> {lab.area}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <Star size={10} className="fill-amber-400 text-amber-400" /> {lab.rating}
                      </span>
                      {lt.homeCollectionAvailable && (
                        <span className="flex items-center gap-1 text-xs text-teal-600">
                          <HomeIcon size={10} /> Home
                        </span>
                      )}
                    </div>
                    <AccreditationBadge accreditations={lab.accreditation} className="mt-1" />
                  </div>

                  {/* Price + Book */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="font-heading font-bold text-stone-900 text-lg leading-none">
                      {formatCurrency(lt.price)}
                    </span>
                    <AddToCartButton
                      item={{ id: test.id, type: "test", name: test.name, price: lt.price }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Price range summary */}
      {minPrice && maxPrice && minPrice !== maxPrice && (
        <div className="mb-6 rounded-2xl bg-teal-50 border border-teal-100 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-teal-700 font-medium">Price range across labs</span>
          <span className="font-heading font-bold text-teal-800">
            {formatCurrency(minPrice)} – {formatCurrency(maxPrice)}
          </span>
        </div>
      )}
    </PageShell>
  );
}
