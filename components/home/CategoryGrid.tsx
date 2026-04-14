import Link from "next/link";
import {
  Droplets,
  Activity,
  Zap,
  Heart,
  FlaskConical,
  Sun,
  Shield,
  Scan,
} from "lucide-react";
import { categories } from "@/data/categories";

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  Activity,
  Zap,
  Heart,
  FlaskConical,
  Sun,
  Shield,
  Scan,
};

export function CategoryGrid() {
  return (
    <section className="mb-6">
      <h2 className="font-heading text-lg font-bold text-stone-900 mb-3">
        Browse by Health Area
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Activity;
          return (
            <Link
              key={cat.id}
              href={`/tests?category=${cat.id}`}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-white p-3 text-center hover:border-primary hover:shadow-sm transition-all active:scale-95"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${cat.colour}`}
              >
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-semibold text-stone-700 leading-tight">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
