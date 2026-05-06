"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Heart, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",          icon: Home,   label: "Home" },
  { href: "/labs",      icon: MapPin, label: "Find Care" },
  { href: "/my-health", icon: Heart,  label: "My Health" },
  { href: "/rewards",   icon: Star,   label: "Rewards" },
  { href: "/profile",   icon: User,   label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on full-screen flows where a sticky bottom bar is present
  const isHidden =
    pathname.startsWith("/book") ||      // booking flow + confirmation
    pathname.startsWith("/login") ||      // OTP login
    pathname.startsWith("/onboarding") || // onboarding setup
    pathname.startsWith("/discover");     // AI chat has its own sticky input bar

  if (isHidden) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-border pb-safe"
      aria-label="Bottom navigation"
    >
      <div className="flex items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-stone-400 hover:text-stone-600"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={cn(isActive && "scale-110 transition-transform")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
