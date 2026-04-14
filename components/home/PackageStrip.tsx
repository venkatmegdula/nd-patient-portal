import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPopularPackages } from "@/data/packages";
import { PackageCard } from "@/components/discovery/PackageCard";

export function PackageStrip() {
  const popular = getPopularPackages().slice(0, 4);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg font-bold text-stone-900">
          Health Packages
        </h2>
        <Link
          href="/packages"
          className="flex items-center gap-0.5 text-sm font-medium text-primary hover:underline min-h-0 h-auto"
        >
          See all <ChevronRight size={15} />
        </Link>
      </div>

      <div className="scroll-x flex gap-3 pb-2">
        {popular.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} variant="strip" />
        ))}
      </div>
    </section>
  );
}
