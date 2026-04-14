import { cn, formatCurrency, savingsPercent } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceTag({
  price,
  originalPrice,
  size = "md",
  className,
}: PriceTagProps) {
  const savings = originalPrice ? savingsPercent(originalPrice, price) : 0;

  const sizeClasses = {
    sm: { price: "text-base font-bold", original: "text-xs", badge: "text-[10px]" },
    md: { price: "text-xl font-bold", original: "text-sm", badge: "text-xs" },
    lg: { price: "text-2xl font-bold", original: "text-base", badge: "text-xs" },
  };

  const s = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn(s.price, "text-stone-900 font-heading")}>
        {formatCurrency(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <>
          <span className={cn(s.original, "text-stone-400 line-through")}>
            {formatCurrency(originalPrice)}
          </span>
          {savings > 0 && (
            <span
              className={cn(
                s.badge,
                "inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 font-semibold text-green-700"
              )}
            >
              {savings}% off
            </span>
          )}
        </>
      )}
    </div>
  );
}
