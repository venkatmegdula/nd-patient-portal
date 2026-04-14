"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700 px-5 py-10 text-white mb-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-8 -left-6 h-36 w-36 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute right-12 bottom-4 h-20 w-20 rounded-full bg-white/8" />

      {/* Location pill */}
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
        <MapPin size={13} className="text-amber-300" />
        <span>Hyderabad</span>
        <ChevronRight size={13} className="opacity-60" />
      </div>

      {/* Headline */}
      <h1 className="font-heading text-[1.75rem] font-extrabold leading-tight mb-1">
        Book lab tests
        <br />
        <span className="text-amber-300">near you</span>
      </h1>
      <p className="text-white/80 text-[15px] mb-6 leading-snug">
        Trusted labs · Transparent prices
        <br />
        Home sample collection available
      </p>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg">
          <Search size={18} className="ml-2 flex-shrink-0 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tests, e.g. CBC, Thyroid…"
            className="flex-1 bg-transparent py-1.5 text-stone-800 placeholder:text-stone-400 focus:outline-none text-[15px] min-h-0"
            aria-label="Search diagnostic tests"
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-primary px-4 h-10 text-sm font-semibold text-white hover:bg-teal-700 transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick links */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {["CBC", "Diabetes", "Thyroid", "Vitamin D", "Full Body"].map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white hover:bg-white/25 transition-colors min-h-0 h-auto inline-flex items-center"
          >
            {tag}
          </Link>
        ))}
      </div>
    </section>
  );
}
