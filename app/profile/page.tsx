"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Phone, Edit3, MapPin, LogOut, HelpCircle,
  ChevronRight, Plus, ShieldCheck
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useAuthStore } from "@/stores/authStore";
import { formatPhone } from "@/lib/utils";

const SAVED_ADDRESSES = [
  { id: "addr-1", label: "Home", address: "Flat 4B, Vasavi Residency, Banjara Hills Road No. 3", area: "Banjara Hills" },
  { id: "addr-2", label: "Office", address: "Tower B, Cyber Gateway, Hitech City", area: "Hitech City" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, name, phone, logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!isLoggedIn) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 mb-4">
            <User size={28} className="text-stone-400" />
          </div>
          <p className="font-heading font-bold text-stone-700 text-lg mb-1">Not logged in</p>
          <p className="text-sm text-stone-400 mb-6">Sign in to view your profile and bookings</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 h-11 font-semibold text-sm hover:bg-teal-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 flex-shrink-0">
          <span className="font-heading font-extrabold text-teal-700 text-xl">
            {name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
        </div>
        <div className="flex-1">
          <p className="font-heading font-extrabold text-stone-900 text-lg">{name}</p>
          <p className="text-sm text-stone-400 flex items-center gap-1.5">
            <Phone size={12} />
            {formatPhone(phone || "9876543210")}
          </p>
        </div>
        <Link
          href="/profile/edit"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white hover:border-primary/40 transition-colors"
        >
          <Edit3 size={15} className="text-stone-600" />
        </Link>
      </div>

      {/* Quick links */}
      <div className="rounded-2xl border border-border bg-white divide-y divide-border mb-4 overflow-hidden">
        {[
          { href: "/my-bookings", icon: ShieldCheck, label: "My Bookings" },
          { href: "/reports", icon: ShieldCheck, label: "My Reports" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors"
          >
            <span className="text-sm font-medium text-stone-800">{label}</span>
            <ChevronRight size={15} className="text-stone-300" />
          </Link>
        ))}
      </div>

      {/* Saved Addresses */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-stone-700">Saved Addresses</p>
          <button className="flex items-center gap-1 text-xs font-semibold text-primary">
            <Plus size={12} /> Add New
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {SAVED_ADDRESSES.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start gap-3 rounded-2xl border border-border bg-white px-4 py-3"
            >
              <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800">{addr.label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{addr.address}</p>
              </div>
              <button className="text-xs text-stone-400 hover:text-primary transition-colors flex-shrink-0">
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Help & Logout */}
      <div className="rounded-2xl border border-border bg-white divide-y divide-border mb-6 overflow-hidden">
        <Link
          href="#"
          className="flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle size={16} className="text-stone-400" />
            <span className="text-sm font-medium text-stone-800">Help &amp; Support</span>
          </div>
          <ChevronRight size={15} className="text-stone-300" />
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut size={16} className="text-red-400" />
            <span className="text-sm font-medium text-red-500">Logout</span>
          </div>
          <ChevronRight size={15} className="text-stone-300" />
        </button>
      </div>

      {/* App info */}
      <p className="text-center text-xs text-stone-300">
        Neighbourhood Diagnostics · Prototype v0.1
      </p>
    </PageShell>
  );
}
