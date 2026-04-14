import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PackageCard } from "@/components/discovery/PackageCard";
import { packages } from "@/data/packages";

export const metadata: Metadata = {
  title: "Health Packages",
  description: "Affordable diagnostic packages combining multiple tests. Save up to 40% vs individual tests.",
};

export default function PackagesPage() {
  return (
    <PageShell>
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-1">
          Health Packages
        </h1>
        <p className="text-sm text-stone-500">
          Bundle multiple tests and save up to 40% compared to booking individually
        </p>
      </div>

      {/* Savings banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3.5 flex items-center justify-between mb-5">
        <div>
          <p className="text-white font-heading font-bold text-[15px]">Save more with packages</p>
          <p className="text-white/80 text-xs mt-0.5">All packages include NABL-accredited lab tests</p>
        </div>
        <span className="text-3xl">🎁</span>
      </div>

      <div className="flex flex-col gap-4">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} variant="full" />
        ))}
      </div>
    </PageShell>
  );
}
