import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateProps {
  icon?: string;       // emoji
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function EmptyState({
  icon = "🔍",
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      <span className="text-5xl mb-4" role="img" aria-hidden>
        {icon}
      </span>
      <h3 className="font-heading text-lg font-bold text-stone-800 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-stone-500 max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
