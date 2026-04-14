"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { TestCard } from "@/components/discovery/TestCard";
import { FilterChips } from "@/components/discovery/FilterChips";
import { SearchBar } from "@/components/discovery/SearchBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { tests, getTestsByCategory } from "@/data/tests";
import { categories } from "@/data/categories";

const ALL_FILTER = { id: "all", label: "All Tests" };

function TestsContent() {
  const params = useSearchParams();
  const initialCategory = params.get("category") ?? "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filterOptions = [ALL_FILTER, ...categories.map((c) => ({ id: c.id, label: c.label }))];

  const displayed =
    activeCategory === "all" ? tests : getTestsByCategory(activeCategory);

  // Group by category when showing "all"
  const grouped =
    activeCategory === "all"
      ? categories
          .map((cat) => ({
            cat,
            items: tests.filter((t) => t.category === cat.id),
          }))
          .filter((g) => g.items.length > 0)
      : null;

  return (
    <PageShell>
      <div className="mb-4">
        <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
          Diagnostic Tests
        </h1>
        <p className="text-sm text-stone-500">
          {tests.length} tests available across 10+ labs in Hyderabad
        </p>
      </div>

      <SearchBar className="mb-4" />

      {/* Category filter chips */}
      <div className="sticky top-14 z-20 -mx-4 bg-background px-4 py-2 sm:-mx-5 sm:px-5 mb-4">
        <FilterChips
          options={filterOptions}
          selected={[activeCategory]}
          onToggle={(id) => setActiveCategory(id)}
        />
      </div>

      {activeCategory === "all" && grouped ? (
        <div className="flex flex-col gap-8">
          {grouped.map(({ cat, items }) => (
            <section key={cat.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cat.colour} flex-shrink-0`}>
                  <span className="text-sm">
                    {{ blood:"🩸", diabetes:"🍬", thyroid:"⚡", heart:"❤️", "liver-kidney":"🫘", vitamins:"☀️", infections:"🛡️", "cancer-screening":"🔬", general:"🧪", "full-body":"🫀" }[cat.id] ?? "🧪"}
                  </span>
                </div>
                <h2 className="font-heading text-base font-bold text-stone-900">{cat.label}</h2>
                <span className="text-xs text-stone-400">({items.length})</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {items.map((test) => (
                  <TestCard key={test.id} test={test} variant="list" />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <EmptyState
          icon="🔬"
          title="No tests in this category"
          ctaLabel="Show all tests"
          ctaHref="/tests"
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {displayed.map((test) => (
            <TestCard key={test.id} test={test} variant="list" />
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default function TestsPage() {
  return (
    <Suspense>
      <TestsContent />
    </Suspense>
  );
}
