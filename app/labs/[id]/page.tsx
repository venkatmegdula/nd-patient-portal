import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Phone, Clock, Star, Home as HomeIcon,
  FlaskConical, ChevronRight, ShieldCheck
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AccreditationBadge } from "@/components/ui/AccreditationBadge";
import { AddToCartButton } from "@/components/discovery/AddToCartButton";
import { getLabById, labs } from "@/data/labs";
import { tests, labTests } from "@/data/tests";
import { formatCurrency } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return labs.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lab = getLabById(id);
  if (!lab) return {};
  return {
    title: lab.name,
    description: `${lab.accreditation.join(" & ")} accredited lab in ${lab.area}, Hyderabad. Book diagnostic tests online.`,
  };
}

export default async function LabDetailPage({ params }: Props) {
  const { id } = await params;
  const lab = getLabById(id);
  if (!lab) notFound();

  // Tests offered by this lab with prices
  const offeredTests = labTests
    .filter((lt) => lt.labId === lab.id)
    .map((lt) => {
      const test = tests.find((t) => t.id === lt.testId);
      return test ? { test, lt } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.test.name.localeCompare(b!.test.name)) as {
      test: (typeof tests)[0];
      lt: (typeof labTests)[0];
    }[];

  // Group by category
  const byCategory = new Map<string, typeof offeredTests>();
  for (const entry of offeredTests) {
    const cat = entry.test.category;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(entry);
  }

  const categoryLabels: Record<string, string> = {
    blood: "Blood Tests",
    diabetes: "Diabetes",
    thyroid: "Thyroid",
    heart: "Heart Health",
    "liver-kidney": "Liver & Kidney",
    vitamins: "Vitamins",
    infections: "Infections",
    "cancer-screening": "Cancer Screening",
    general: "General",
    "full-body": "Full Body",
  };

  return (
    <PageShell noPadBottom>
      <Link
        href="/labs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-primary transition-colors mb-4 min-h-0 h-auto"
      >
        <ArrowLeft size={16} /> All Labs
      </Link>

      {/* Lab header */}
      <div className="rounded-2xl border border-border bg-white p-5 mb-4">
        <div className="flex items-start gap-4 mb-4">
          {/* Big initials */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 font-heading font-extrabold text-teal-700 text-xl flex-shrink-0">
            {lab.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-xl font-extrabold text-stone-900 leading-tight mb-1">
              {lab.name}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-stone-500">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-800">{lab.rating}</span>
              <span className="text-stone-400">({lab.reviewCount} reviews)</span>
            </div>
            <AccreditationBadge accreditations={lab.accreditation} className="mt-2" />
          </div>
        </div>

        {/* Info rows */}
        <div className="flex flex-col gap-2.5 text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-stone-700">{lab.address}</p>
              <p className="text-stone-400 text-xs">{lab.city} – {lab.pincode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone size={15} className="text-primary flex-shrink-0" />
            <a href={`tel:${lab.phone}`} className="text-stone-700 hover:text-primary transition-colors">
              {lab.phone}
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={15} className="text-primary flex-shrink-0" />
            <span className="text-stone-700">
              {lab.openTime} – {lab.closeTime}
              <span className="text-stone-400 ml-1">· {lab.openDays}</span>
            </span>
          </div>
          {lab.homeCollection && (
            <div className="flex items-center gap-2.5">
              <HomeIcon size={15} className="text-primary flex-shrink-0" />
              <span className="text-stone-700">
                Home collection available
                <span className="text-stone-400 ml-1">· ₹{lab.homeCollectionFee} fee</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="rounded-2xl border border-border overflow-hidden mb-4 bg-stone-100 relative h-36 flex items-center justify-center">
        <div className="text-center">
          <MapPin size={24} className="text-primary mx-auto mb-1" />
          <p className="text-xs text-stone-500">{lab.area}, Hyderabad</p>
          <a
            href={`https://maps.google.com/?q=${lab.lat},${lab.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs font-semibold text-primary hover:underline"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>

      {/* Tests offered */}
      <div className="mb-6">
        <h2 className="font-heading font-bold text-stone-900 mb-1">
          Tests offered ({offeredTests.length})
        </h2>
        <p className="text-xs text-stone-400 mb-3">Prices at this lab. Tap a test to learn more.</p>

        {offeredTests.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">No tests listed yet.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {Array.from(byCategory.entries()).map(([catId, entries]) => (
              <section key={catId}>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">
                  {categoryLabels[catId] ?? catId}
                </p>
                <div className="flex flex-col gap-2">
                  {entries.map(({ test, lt }) => (
                    <div
                      key={test.id}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 flex-shrink-0">
                        <FlaskConical size={15} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/tests/${test.slug}`}
                          className="block text-sm font-semibold text-stone-900 hover:text-primary transition-colors truncate"
                        >
                          {test.name}
                          {test.shortName && (
                            <span className="text-stone-400 font-normal ml-1 text-xs">({test.shortName})</span>
                          )}
                        </Link>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Report in {test.turnaroundHours}h
                          {lt.homeCollectionAvailable && (
                            <span className="text-teal-600 ml-2">· Home ✓</span>
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="font-heading font-bold text-stone-900 text-base leading-none">
                          {formatCurrency(lt.price)}
                        </span>
                        <AddToCartButton
                          item={{ id: test.id, type: "test", name: test.name, price: lt.price }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-0">
        <Link
          href={`/book`}
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          Book a Test at {lab.name.split(" ")[0]}
          <ChevronRight size={16} />
        </Link>
      </div>
    </PageShell>
  );
}
