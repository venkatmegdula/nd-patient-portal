"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { SearchBar } from "@/components/discovery/SearchBar";
import { FilterChips } from "@/components/discovery/FilterChips";
import { TestCard } from "@/components/discovery/TestCard";
import { PackageCard } from "@/components/discovery/PackageCard";
import { LabCard } from "@/components/discovery/LabCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { tests } from "@/data/tests";
import { packages } from "@/data/packages";
import { labs } from "@/data/labs";
import { categories } from "@/data/categories";

const CATEGORY_FILTERS = categories.map((c) => ({ id: c.id, label: c.label }));

type Tab = "tests" | "packages" | "labs";

function SearchResults() {
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";

  const [activeTab, setActiveTab] = useState<Tab>("tests");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [homeOnly, setHomeOnly] = useState(false);

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  const filteredTests = useMemo(() => {
    let result = tests;
    if (initialQ) {
      const q = initialQ.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.shortName ?? "").toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length) {
      result = result.filter((t) => selectedCategories.includes(t.category));
    }
    return result;
  }, [initialQ, selectedCategories]);

  const filteredPackages = useMemo(() => {
    if (!initialQ) return packages;
    const q = initialQ.toLowerCase();
    return packages.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    );
  }, [initialQ]);

  const filteredLabs = useMemo(() => {
    let result = labs;
    if (initialQ) {
      const q = initialQ.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q)
      );
    }
    if (homeOnly) result = result.filter((l) => l.homeCollection);
    return result.sort((a, b) => b.rating - a.rating);
  }, [initialQ, homeOnly]);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "tests",    label: "Tests",    count: filteredTests.length },
    { id: "packages", label: "Packages", count: filteredPackages.length },
    { id: "labs",     label: "Labs",     count: filteredLabs.length },
  ];

  return (
    <PageShell>
      {/* Search bar sticky */}
      <div className="sticky top-14 z-30 -mx-4 bg-background px-4 pt-2 pb-3 sm:-mx-5 sm:px-5">
        <SearchBar initialQuery={initialQ} autoFocus={!initialQ} />
      </div>

      {initialQ && (
        <p className="text-sm text-stone-500 mb-3">
          Results for <span className="font-semibold text-stone-800">&ldquo;{initialQ}&rdquo;</span>
        </p>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-stone-100 p-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all min-h-0 ${
              activeTab === tab.id
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab.label}
            <span className={`ml-1 text-xs ${activeTab === tab.id ? "text-primary" : "text-stone-400"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      {activeTab === "tests" && (
        <div className="mb-4">
          <FilterChips
            options={CATEGORY_FILTERS}
            selected={selectedCategories}
            onToggle={toggleCategory}
          />
        </div>
      )}
      {activeTab === "labs" && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setHomeOnly(!homeOnly)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all min-h-0 h-auto ${
              homeOnly
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-stone-600 hover:border-primary/50"
            }`}
          >
            🏠 Home Collection Only
          </button>
        </div>
      )}

      {/* Results */}
      {activeTab === "tests" && (
        filteredTests.length === 0 ? (
          <EmptyState
            icon="🔬"
            title="No tests found"
            description={`We couldn't find tests matching "${initialQ}". Try a different search term.`}
            ctaLabel="Browse all tests"
            ctaHref="/tests"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTests.map((test) => (
              <TestCard key={test.id} test={test} variant="list" />
            ))}
          </div>
        )
      )}

      {activeTab === "packages" && (
        filteredPackages.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No packages found"
            description="Try searching by health concern like Diabetes or Thyroid."
            ctaLabel="View all packages"
            ctaHref="/packages"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} variant="full" />
            ))}
          </div>
        )
      )}

      {activeTab === "labs" && (
        filteredLabs.length === 0 ? (
          <EmptyState
            icon="🏥"
            title="No labs found"
            description="Try searching by area name like Banjara Hills or Kukatpally."
            ctaLabel="View all labs"
            ctaHref="/labs"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filteredLabs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        )
      )}
    </PageShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
