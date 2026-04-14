import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="hidden sm:block border-t border-border bg-white mt-auto">
      <div className="max-page px-page mx-auto py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                ND
              </div>
              <span className="font-heading font-bold text-stone-900">
                Neighbourhood Diagnostics
              </span>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Book lab tests near you. Trusted centres, transparent prices.
            </p>
            <div className="mt-3 flex flex-col gap-1.5 text-sm text-stone-500">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                Hyderabad, Telangana
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-primary" />
                1800-123-4567 (Toll Free)
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-primary" />
                help@nddiagnostics.in
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-stone-900 mb-3 text-sm">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-stone-500">
              {[
                { href: "/tests", label: "All Tests" },
                { href: "/packages", label: "Health Packages" },
                { href: "/labs", label: "Find a Lab" },
                { href: "/my-bookings", label: "My Bookings" },
                { href: "/reports", label: "My Reports" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors min-h-0 inline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h3 className="font-heading font-semibold text-stone-900 mb-3 text-sm">
              Why Us
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-stone-500">
              <li>✓ NABL Accredited Labs</li>
              <li>✓ Home Sample Collection</li>
              <li>✓ Reports in 4–24 Hours</li>
              <li>✓ 20–40% Below MRP Prices</li>
              <li>✓ Secure Digital Reports</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-stone-400">
          <span>© 2026 Neighbourhood Diagnostics. All rights reserved.</span>
          <span>Hyderabad, India</span>
        </div>
      </div>
    </footer>
  );
}
