"use client";

import { useState, useEffect } from "react";
import { useBookingStore } from "@/stores/bookingStore";

/**
 * Returns true once the booking Zustand persist store has fully rehydrated
 * from localStorage. Guards against redirect loops that fire before cart data
 * is available on the first render.
 */
export function useBookingHydrated(): boolean {
  const [hydrated, setHydrated] = useState<boolean>(
    () => useBookingStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (useBookingStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useBookingStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  return hydrated;
}
