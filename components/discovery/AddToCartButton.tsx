"use client";

import { ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore, type CartItem } from "@/stores/bookingStore";
import { toast } from "sonner";

interface AddToCartButtonProps {
  item: CartItem;
  size?: "sm" | "md";
  fullWidth?: boolean;
  label?: string;
}

export function AddToCartButton({
  item,
  size = "sm",
  fullWidth = false,
  label,
}: AddToCartButtonProps) {
  const { addToCart, removeFromCart, cart } = useBookingStore();
  const isInCart = cart.some((c) => c.id === item.id);

  function handleClick() {
    if (isInCart) {
      removeFromCart(item.id);
      toast.info(`${item.name} removed from cart`);
    } else {
      addToCart(item);
      toast.success(`${item.name} added!`, {
        action: { label: "View Cart", onClick: () => (window.location.href = "/book") },
      });
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-all active:scale-95 min-h-0",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
        fullWidth && "w-full",
        isInCart
          ? "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          : "bg-primary text-white hover:bg-teal-700"
      )}
    >
      {isInCart ? (
        <>
          <Check size={size === "sm" ? 12 : 14} />
          {label ? "Added" : "Added"}
        </>
      ) : (
        <>
          <ShoppingCart size={size === "sm" ? 12 : 14} />
          {label ?? "Book"}
        </>
      )}
    </button>
  );
}
