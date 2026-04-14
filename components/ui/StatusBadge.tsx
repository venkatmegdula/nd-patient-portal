import { cn, getStatusMeta } from "@/lib/utils";
import type { BookingStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, chipClass } = getStatusMeta(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
        chipClass,
        className
      )}
    >
      {label}
    </span>
  );
}
