"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  cartCount?: number;
  isLoggedIn?: boolean;
}

export function Navbar({ cartCount = 0, isLoggedIn = false }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-sm",
          isHome && "border-transparent bg-white"
        )}
      >
        <div className="max-page px-page mx-auto flex h-14 items-center justify-between gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 min-h-0 flex-shrink-0"
            aria-label="Neighbourhood Diagnostics Home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm font-heading">
              ND
            </div>
            <span className="font-heading font-bold text-stone-900 text-[15px] leading-tight hidden sm:block">
              Neighbourhood<br />
              <span className="text-primary">Diagnostics</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <Link
              href="/tests"
              className={cn(
                "px-3 py-2 rounded-lg font-medium transition-colors min-h-0",
                pathname.startsWith("/tests")
                  ? "text-primary bg-teal-50"
                  : "text-stone-600 hover:text-primary hover:bg-teal-50"
              )}
            >
              Tests
            </Link>
            <Link
              href="/packages"
              className={cn(
                "px-3 py-2 rounded-lg font-medium transition-colors min-h-0",
                pathname.startsWith("/packages")
                  ? "text-primary bg-teal-50"
                  : "text-stone-600 hover:text-primary hover:bg-teal-50"
              )}
            >
              Packages
            </Link>
            <Link
              href="/labs"
              className={cn(
                "px-3 py-2 rounded-lg font-medium transition-colors min-h-0",
                pathname.startsWith("/labs")
                  ? "text-primary bg-teal-50"
                  : "text-stone-600 hover:text-primary hover:bg-teal-50"
              )}
            >
              Labs
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-600 hover:text-primary hover:bg-teal-50 transition-colors min-h-0"
              aria-label="Search tests"
            >
              <Search size={20} />
            </Link>

            {cartCount > 0 && (
              <Link
                href="/book"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-600 hover:text-primary hover:bg-teal-50 transition-colors min-h-0"
                aria-label={`Cart — ${cartCount} item${cartCount > 1 ? "s" : ""}`}
              >
                <ShoppingCart size={20} />
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                  {cartCount}
                </span>
              </Link>
            )}

            <Link
              href={isLoggedIn ? "/profile" : "/login"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-600 hover:text-primary hover:bg-teal-50 transition-colors min-h-0"
              aria-label={isLoggedIn ? "Profile" : "Login"}
            >
              {isLoggedIn ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                  R
                </div>
              ) : (
                <User size={20} />
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100 transition-colors min-h-0"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
            {[
              { href: "/tests", label: "Tests" },
              { href: "/packages", label: "Packages" },
              { href: "/labs", label: "Labs" },
              { href: "/my-bookings", label: "My Bookings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl font-medium text-sm transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-teal-50 text-primary"
                    : "text-stone-700 hover:bg-stone-50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
