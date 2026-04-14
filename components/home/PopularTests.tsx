import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPopularTests } from "@/data/tests";
import { TestCard } from "@/components/discovery/TestCard";

export function PopularTests() {
  const popular = getPopularTests();

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading text-lg font-bold text-stone-900">
          Popular Tests
        </h2>
        <Link
          href="/tests"
          className="flex items-center gap-0.5 text-sm font-medium text-primary hover:underline min-h-0 h-auto"
        >
          All tests <ChevronRight size={15} />
        </Link>
      </div>

      <div className="scroll-x flex gap-3 pb-2">
        {popular.map((test) => (
          <div key={test.id} className="w-[200px] flex-shrink-0 snap-start">
            <TestCard test={test} variant="grid" />
          </div>
        ))}
      </div>
    </section>
  );
}
