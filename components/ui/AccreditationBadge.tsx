import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Accreditation } from "@/lib/types";

interface AccreditationBadgeProps {
  accreditations: Accreditation[];
  className?: string;
}

export function AccreditationBadge({
  accreditations,
  className,
}: AccreditationBadgeProps) {
  if (!accreditations.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {accreditations.map((acc) => (
        <span
          key={acc}
          className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-[11px] font-semibold text-teal-700"
        >
          <ShieldCheck size={10} className="flex-shrink-0" />
          {acc}
        </span>
      ))}
    </div>
  );
}
