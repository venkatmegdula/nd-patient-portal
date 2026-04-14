"use client";

import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selected: string[];
  onToggle: (id: string) => void;
  className?: string;
}

export function FilterChips({ options, selected, onToggle, className }: FilterChipsProps) {
  return (
    <div className={cn("scroll-x flex gap-2 pb-1", className)}>
      {options.map((opt) => {
        const active = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            className={cn(
              "flex-shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all min-h-0 h-auto",
              active
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border bg-white text-stone-600 hover:border-primary/50 hover:text-primary"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
