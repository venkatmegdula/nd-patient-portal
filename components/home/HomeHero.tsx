"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronRight, FlaskConical, Building2, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

function getGreeting(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

const quickActions = [
  { icon: FlaskConical, label: "Book Test",  href: "/tests" },
  { icon: Building2,    label: "Find Lab",   href: "/labs" },
  { icon: FileText,     label: "My Reports", href: "/my-health" },
  { icon: Users,        label: "Family",     href: "/family" },
];

const quickTags = ["CBC", "Thyroid", "Vitamin D", "Diabetes", "Full Body"];

export function HomeHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { isLoggedIn, name, city, loyalty } = useAuthStore();

  const firstName = name.split(" ")[0] || "there";
  const greeting = getGreeting();
  const displayCity = city || "Hyderabad";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <section className="relative rounded-3xl px-5 py-10 text-white mb-6">
      {/* Background gradient + decorations, clipped independently so content isn't clipped */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-6 h-36 w-36 rounded-full bg-white/5" />
        <div className="absolute right-12 bottom-4 h-20 w-20 rounded-full bg-white/8" />
      </div>

      {/* All content sits above the background, free from clipping */}
      <div className="relative z-10">
        {/* Location chip */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
          <MapPin size={13} className="text-amber-300" />
          <span>{displayCity}</span>
          <ChevronRight size={13} className="opacity-60" />
        </div>

        {/* Greeting row */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h1 className="font-heading text-[1.75rem] font-extrabold leading-tight">
            {isLoggedIn ? (
              <>
                Good {greeting},{" "}
                <span className="text-amber-300">{firstName}!</span>
              </>
            ) : (
              <>
                Book lab tests
                <br />
                <span className="text-amber-300">near you</span>
              </>
            )}
          </h1>
          {isLoggedIn && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 text-xs font-semibold text-amber-300 self-start mt-1">
              ⭐ {loyalty.points} pts
            </span>
          )}
        </div>

        <p className="text-white/80 text-[15px] mb-6 leading-snug">
          Trusted labs · Transparent prices
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg">
            <Search size={18} className="ml-2 flex-shrink-0 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tests, e.g. CBC, Thyroid…"
              className="flex-1 min-w-0 bg-transparent py-1.5 text-stone-800 placeholder:text-stone-400 focus:outline-none text-[15px]"
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

        {/* Quick action row */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/15 px-2 py-3 text-center hover:bg-white/25 transition-colors active:scale-95"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <span className="text-[11px] font-semibold leading-tight">{action.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick search tags */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {quickTags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white hover:bg-white/25 transition-colors min-h-0 h-auto inline-flex items-center"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
