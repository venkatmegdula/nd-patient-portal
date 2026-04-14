"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { tests } from "@/data/tests";
import { packages } from "@/data/packages";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
}

interface Suggestion {
  type: "test" | "package";
  id: string;
  slug: string;
  name: string;
  sub: string;
}

export function SearchBar({ initialQuery = "", autoFocus = false, className }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const suggestions: Suggestion[] = query.trim().length >= 2
    ? [
        ...tests
          .filter(
            (t) =>
              t.name.toLowerCase().includes(query.toLowerCase()) ||
              (t.shortName ?? "").toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 4)
          .map((t) => ({
            type: "test" as const,
            id: t.id,
            slug: t.slug,
            name: t.name,
            sub: t.shortName ?? "",
          })),
        ...packages
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 2)
          .map((p) => ({
            type: "package" as const,
            id: p.id,
            slug: p.slug,
            name: p.name,
            sub: "Package",
          })),
      ]
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function clearQuery() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-white px-4 py-3 focus-within:border-primary transition-colors shadow-sm">
          <Search size={18} className="flex-shrink-0 text-stone-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => query.length >= 2 && setOpen(true)}
            placeholder="Search tests, e.g. CBC, Thyroid…"
            className="flex-1 bg-transparent text-stone-800 placeholder:text-stone-400 focus:outline-none text-[15px] min-h-0 h-auto"
            autoFocus={autoFocus}
            aria-label="Search diagnostic tests"
            aria-autocomplete="list"
            aria-expanded={open && suggestions.length > 0}
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors min-h-0"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border border-border bg-white shadow-lg overflow-hidden nd-scale-in">
          {suggestions.map((s) => (
            <Link
              key={s.id}
              href={s.type === "test" ? `/tests/${s.slug}` : `/packages/${s.slug}`}
              onClick={() => {
                setQuery(s.name);
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors border-b border-border/50 last:border-0"
            >
              <div className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold flex-shrink-0",
                s.type === "test" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"
              )}>
                {s.type === "test" ? "T" : "P"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">{s.name}</p>
                {s.sub && <p className="text-xs text-stone-400">{s.sub}</p>}
              </div>
              <span className={cn(
                "ml-auto flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                s.type === "test" ? "bg-teal-50 text-teal-600" : "bg-amber-50 text-amber-600"
              )}>
                {s.type === "test" ? "Test" : "Package"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
