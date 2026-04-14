"use client";

import { useAuthStore } from "@/stores/authStore";
import { useBookingStore } from "@/stores/bookingStore";
import { Navbar } from "./Navbar";

export function NavbarClient() {
  const { isLoggedIn } = useAuthStore();
  const { cart } = useBookingStore();
  return <Navbar cartCount={cart.length} isLoggedIn={isLoggedIn} />;
}
