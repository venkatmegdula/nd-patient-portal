"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useBookingStore } from "@/stores/bookingStore";
import { getRecommendedTestIds } from "@/data/recommendations";
import { getTestById, getPriceRange } from "@/data/tests";

const categoryLabels: Record<string, string> = {
  blood:            "Blood",
  diabetes:         "Diabetes",
  heart:            "Heart",
  thyroid:          "Thyroid",
  "liver-kidney":   "Liver & Kidney",
  vitamins:         "Vitamins",
  infections:       "Infections",
  general:          "General",
  "cancer-screening": "Screening",
};

export function SmartRecommendations() {
  const { age, gender } = useAuthStore();
  const addToCart = useBookingStore((s) => s.addToCart);
  const router = useRouter();

  if (age === null) return null;

  const effectiveGender: "male" | "female" | "other" = gender ?? "other";

  const testIds = getRecommendedTestIds(age, effectiveGender);
  const tests = testIds
    .map((id) => getTestById(id))
    .filter(Boolean)
    .slice(0, 4) as NonNullable<ReturnType<typeof getTestById>>[];

  if (!tests.length) return null;

  const genderLabel =
    gender === "male" ? "M" : gender === "female" ? "F" : "";
  const profileNote = `${age}${genderLabel}`;

  function handleBook(test: NonNullable<ReturnType<typeof getTestById>>) {
    const range = getPriceRange(test.id);
    addToCart({
      id:    test.id,
      type:  "test",
      name:  test.shortName ?? test.name,
      price: range ? range.min : 0,
    });
    router.push("/book");
  }

  return (
    <section className="mb-6">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-heading text-lg font-bold text-stone-900">
          Recommended for you
        </h2>
        <Sparkles size={16} className="text-teal-500 flex-shrink-0" strokeWidth={1.8} />
        <span className="ml-auto text-xs text-stone-400 font-medium">
          Based on your profile · {profileNote}
        </span>
      </div>

      {/* Test cards — 2-column grid */}
      <div className="grid grid-cols-2 gap-3">
        {tests.map((test) => {
          const range = getPriceRange(test.id);
          const catLabel = categoryLabels[test.category] ?? test.category;

          return (
            <div
              key={test.id}
              className="relative flex flex-col gap-2 rounded-2xl border border-border bg-white p-3.5 overflow-hidden"
            >
              {/* Teal left border accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-teal-500" />

              <div className="pl-1">
                <p className="font-semibold text-stone-900 text-[14px] leading-snug">
                  {test.shortName ?? test.name}
                </p>

                {/* Category chip */}
                <span className="mt-1 inline-block rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                  {catLabel}
                </span>

                {/* Price range */}
                {range && (
                  <p className="mt-1.5 text-[13px] font-semibold text-stone-700">
                    ₹{range.min}
                    <span className="font-normal text-stone-400">–₹{range.max}</span>
                  </p>
                )}
              </div>

              {/* Book button */}
              <button
                onClick={() => handleBook(test)}
                className="mt-auto w-full rounded-xl bg-teal-600 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors active:scale-95"
              >
                Book
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
