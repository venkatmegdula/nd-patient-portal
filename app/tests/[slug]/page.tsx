"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  FlaskConical,
  AlertCircle,
  MapPin,
  Star,
  Home as HomeIcon,
  ShoppingCart,
  Check,
  Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { AccreditationBadge } from "@/components/ui/AccreditationBadge";
import { getTestBySlug, getLabsForTest, tests, getPriceRange } from "@/data/tests";
import { getLabById } from "@/data/labs";
import { thyrocarePrices } from "@/data/labs";
import { categories } from "@/data/categories";
import { useBookingStore } from "@/stores/bookingStore";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

// Related test suggestions keyed by category
const RELATED_BY_CATEGORY: Record<string, string[]> = {
  thyroid:       ["vitamin-d", "complete-blood-count", "vitamin-b12"],
  diabetes:      ["hba1c", "lipid-profile", "complete-blood-count"],
  heart:         ["hba1c", "lipid-profile", "complete-blood-count"],
  vitamins:      ["complete-blood-count", "thyroid-function-test", "iron-studies"],
  blood:         ["thyroid-function-test", "vitamin-b12", "c-reactive-protein"],
  "liver-kidney":["complete-blood-count", "urine-routine", "hepatitis-b-surface-antigen"],
  infections:    ["complete-blood-count", "c-reactive-protein", "esr"],
  general:       ["complete-blood-count", "fasting-blood-sugar", "thyroid-function-test"],
  "cancer-screening": ["complete-blood-count", "lipid-profile"],
};

export default function TestDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { addToCart, removeFromCart, cart } = useBookingStore();

  const slug = params?.slug ?? "";
  const test = getTestBySlug(slug);

  if (!test) {
    return (
      <PageShell>
        <div className="py-16 text-center">
          <p className="text-stone-500">Test not found.</p>
          <Link
            href="/tests"
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Browse all tests
          </Link>
        </div>
      </PageShell>
    );
  }

  const labPricing = getLabsForTest(test.id)
    .map((lt) => ({ ...lt, lab: getLabById(lt.labId) }))
    .filter((lt) => lt.lab != null)
    .sort((a, b) => a.price - b.price);

  const category = categories.find((c) => c.id === test.category);
  const priceRange = getPriceRange(test.id);
  const thyroPrice = thyrocarePrices[test.id];

  // Related tests (exclude self)
  const relatedSlugs = (RELATED_BY_CATEGORY[test.category] ?? []).filter(
    (s) => s !== test.slug
  );
  const relatedTests = relatedSlugs
    .map((s) => tests.find((t) => t.slug === s))
    .filter(Boolean)
    .slice(0, 3) as (typeof tests)[number][];

  const cheapestPrice = labPricing[0]?.price ?? priceRange?.min ?? 0;
  const isInCart = cart.some((c) => c.id === test.id);

  function handleAddToCart() {
    if (isInCart) {
      removeFromCart(test!.id);
      toast.info(`${test!.shortName ?? test!.name} removed from cart`);
    } else {
      addToCart({
        id: test!.id,
        type: "test",
        name: test!.name,
        price: cheapestPrice,
      });
      toast.success(`${test!.shortName ?? test!.name} added to cart!`, {
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
      <div className="rounded-2xl border border-border bg-white p-5 mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${
              category?.colour ?? "bg-teal-50 text-teal-600"
            }`}
          >
            <FlaskConical size={22} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h1 className="font-heading text-xl font-extrabold text-stone-900 leading-tight">
                {test.name}
              </h1>
              {test.shortName && (
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-500">
                  {test.shortName}
                </span>
              )}
            </div>
            {category && (
              <span className="text-xs text-stone-400 font-medium">
                {category.label}
              </span>
            )}
          </div>
        </div>

        <p className="text-[15px] text-stone-600 leading-relaxed mb-4">
          {test.description}
        </p>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-2 mb-4">
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
          {priceRange && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1.5 text-xs font-semibold text-teal-700">
              From {formatCurrency(priceRange.min)}
            </span>
          )}
          {thyroPrice && priceRange && priceRange.min < thyroPrice && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-bold text-green-700">
              Save up to {formatCurrency(thyroPrice - priceRange.min)} vs Thyrocare
            </span>
          )}
        </div>

        {/* Preparation */}
        {test.preparation && (
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <AlertCircle
              size={16}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-xs font-bold text-amber-800 mb-0.5">
                Preparation needed
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                {test.preparation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Labs pricing */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-bold text-stone-900 mb-1">
          Price across labs
        </h2>
        <p className="text-xs text-stone-400 mb-3">
          Sorted cheapest first. All labs are NABL accredited.
        </p>

        {labPricing.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">
            No labs listed yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {labPricing.map((lt, i) => {
              const lab = lt.lab!;
              const saving =
                thyroPrice && thyroPrice > lt.price
                  ? thyroPrice - lt.price
                  : null;
              const labInitials = lab.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2);
              return (
                <div
                  key={lt.labId}
                  className={`flex items-center gap-3 rounded-2xl border bg-white p-4 transition-colors ${
                    i === 0
                      ? "border-green-200 bg-green-50/30"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 font-heading font-bold text-teal-700 text-xs flex-shrink-0 border border-teal-100">
                    {labInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <Link
                        href={`/labs/${lab.id}`}
                        className="font-semibold text-stone-900 text-sm hover:text-primary transition-colors truncate"
                      >
                        {lab.name}
                      </Link>
                      {i === 0 && (
                        <span className="rounded-full bg-green-100 border border-green-200 px-1.5 py-0.5 text-[10px] font-bold text-green-700 flex-shrink-0">
                          Lowest price
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <MapPin size={10} />
                        {lab.area}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <Star
                          size={10}
                          className="fill-amber-400 text-amber-400"
                        />
                        {lab.rating}
                      </span>
                      {lt.homeCollectionAvailable && (
                        <span className="flex items-center gap-1 text-xs text-teal-600">
                          <HomeIcon size={10} />
                          Home
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <AccreditationBadge
                        accreditations={lab.accreditation}
                      />
                      {saving !== null && (
                        <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 rounded-full px-1.5 py-0.5">
                          Save {formatCurrency(saving)} vs Thyrocare
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price + Book */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="font-heading font-bold text-stone-900 text-lg leading-none">
                      {formatCurrency(lt.price)}
                    </span>
                    {thyroPrice && thyroPrice > lt.price && (
                      <span className="text-[10px] text-stone-400 line-through leading-none">
                        {formatCurrency(thyroPrice)}
                      </span>
                    )}
                    <button
                      onClick={handleAddToCart}
                      className={`flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-all active:scale-95 min-h-0 ${
                        isInCart
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "bg-primary text-white hover:bg-teal-700"
                      }`}
                    >
                      {isInCart ? (
                        <>
                          <Check size={12} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={12} /> Book
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Price range summary */}
      {priceRange && priceRange.max > priceRange.min && (
        <div className="mb-6 rounded-2xl bg-teal-50 border border-teal-100 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-teal-700 font-medium">
            Price range across labs
          </span>
          <span className="font-heading font-bold text-teal-800">
            {formatCurrency(priceRange.min)} – {formatCurrency(priceRange.max)}
          </span>
        </div>
      )}

      {/* Often booked with */}
      {relatedTests.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} className="text-primary" />
            <h2 className="font-heading text-base font-bold text-stone-900">
              Often booked with
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {relatedTests.map((related) => {
              const relatedRange = getPriceRange(related.id);
              const relatedInCart = cart.some((c) => c.id === related.id);
              return (
                <div
                  key={related.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-50 flex-shrink-0">
                    <FlaskConical size={14} className="text-stone-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/tests/${related.slug}`}
                      className="block text-sm font-semibold text-stone-900 hover:text-primary transition-colors truncate"
                    >
                      {related.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-stone-400">
                        <Clock size={10} className="inline mr-0.5" />
                        {related.turnaroundHours > 0
                          ? `${related.turnaroundHours}h`
                          : "Instant"}
                      </span>
                      {relatedRange && (
                        <span className="text-xs font-semibold text-stone-700">
                          from {formatCurrency(relatedRange.min)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (relatedInCart) {
                        removeFromCart(related.id);
                        toast.info(`${related.shortName ?? related.name} removed`);
                      } else {
                        addToCart({
                          id: related.id,
                          type: "test",
                          name: related.name,
                          price: relatedRange?.min ?? 0,
                        });
                        toast.success(`${related.shortName ?? related.name} added!`);
                      }
                    }}
                    className={`flex h-8 items-center gap-1 rounded-xl px-3 text-xs font-semibold transition-all active:scale-95 min-h-0 flex-shrink-0 ${
                      relatedInCart
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "bg-stone-100 text-stone-700 hover:bg-primary hover:text-white"
                    }`}
                  >
                    {relatedInCart ? (
                      <>
                        <Check size={11} /> Added
                      </>
                    ) : (
                      "+ Add"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky Add to Cart CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-0">
        <button
          onClick={handleAddToCart}
          className={`flex w-full items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-all active:scale-[0.99] ${
            isInCart
              ? "bg-teal-50 text-teal-700 border border-teal-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              : "bg-primary text-white hover:bg-teal-700"
          }`}
        >
          {isInCart ? (
            <>
              <Check size={16} />
              Added to Cart — tap to remove
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Add to Cart
              {priceRange && (
                <span className="ml-1 opacity-80">
                  · from {formatCurrency(priceRange.min)}
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </PageShell>
  );
}
