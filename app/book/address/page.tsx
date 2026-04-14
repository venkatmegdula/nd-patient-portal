"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Plus, Check } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { BookingProgressBar } from "@/components/booking/BookingProgressBar";
import { useBookingStore } from "@/stores/bookingStore";
import { cn } from "@/lib/utils";

const SAVED_ADDRESSES = [
  { id: "addr-1", label: "Home", address: "Flat 4B, Vasavi Residency, Banjara Hills Road No. 3" },
  { id: "addr-2", label: "Office", address: "Tower B, Cyber Gateway, Hitech City" },
];

export default function AddressPage() {
  const router = useRouter();
  const { cart, collectionAddress, setCollectionAddress } = useBookingStore();

  const [selectedId, setSelectedId] = useState<string | null>(
    SAVED_ADDRESSES.find((a) => a.address === collectionAddress)?.id ?? null
  );
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    if (cart.length === 0) router.replace("/book");
  }, [cart, router]);

  function handleSelectSaved(id: string, address: string) {
    setSelectedId(id);
    setCollectionAddress(address);
    setShowForm(false);
  }

  function handleNewAddress() {
    if (!newAddress.trim()) return;
    setCollectionAddress(newAddress.trim());
    setSelectedId("new");
  }

  function handleContinue() {
    if (collectionAddress) router.push("/book/slot");
  }

  const canContinue = !!collectionAddress;

  return (
    <PageShell noPadBottom>
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-4 min-h-0 h-auto"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <BookingProgressBar currentStep={3} />

      <h1 className="font-heading text-xl font-extrabold text-stone-900 mb-1">
        Where should we collect from?
      </h1>
      <p className="text-sm text-stone-500 mb-6">
        Choose a saved address or add a new one
      </p>

      {/* Saved addresses */}
      <div className="flex flex-col gap-3 mb-4">
        {SAVED_ADDRESSES.map((addr) => {
          const isSelected = selectedId === addr.id;
          return (
            <button
              key={addr.id}
              onClick={() => handleSelectSaved(addr.id, addr.address)}
              className={cn(
                "flex items-start gap-3 rounded-2xl border-2 p-4 text-left w-full transition-all",
                isSelected
                  ? "border-primary bg-teal-50"
                  : "border-border bg-white hover:border-primary/40"
              )}
            >
              <MapPin size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-stone-900 text-sm">{addr.label}</p>
                <p className="text-xs text-stone-500 mt-0.5">{addr.address}</p>
              </div>
              {isSelected && (
                <Check size={16} className="text-primary flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Add new */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 w-full h-11 rounded-2xl border border-dashed border-primary/50 text-primary text-sm font-medium hover:bg-teal-50 transition-colors mb-5 justify-center"
        >
          <Plus size={15} />
          Add new address
        </button>
      ) : (
        <div className="rounded-2xl border border-border bg-white p-4 mb-5">
          <p className="text-sm font-semibold text-stone-800 mb-3">Enter your address</p>
          <textarea
            rows={3}
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Flat/House number, Street, Area, City..."
            className="w-full rounded-xl border border-border bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <button
            onClick={handleNewAddress}
            disabled={!newAddress.trim()}
            className="mt-3 flex items-center justify-center w-full h-10 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40"
          >
            Use this address
          </button>
        </div>
      )}

      {selectedId === "new" && collectionAddress && (
        <div className="flex items-start gap-2 rounded-2xl bg-teal-50 border border-teal-200 px-4 py-3 mb-5">
          <Check size={15} className="text-teal-700 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-teal-700">{collectionAddress}</p>
        </div>
      )}

      {/* Sticky CTA */}
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 bg-white border-t border-border px-4 py-3 pb-safe sm:static sm:mx-0 sm:border-0 sm:pb-6 sm:pt-0">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex items-center justify-center w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {canContinue ? "Continue" : "Select an Address to Continue"}
        </button>
      </div>
    </PageShell>
  );
}
