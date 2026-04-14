import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CollectionType } from "@/lib/types";
import { generateBookingId } from "@/lib/utils";

export interface CartItem {
  id: string;         // test or package id
  type: "test" | "package";
  name: string;
  price: number;
}

interface BookingStore {
  /* Cart */
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  /* Booking flow state */
  collectionType: CollectionType | null;
  selectedLabId: string | null;
  collectionAddress: string | null;
  slotDate: string | null;     // "2026-04-14"
  slotTime: string | null;     // "08:00"
  patientName: string;
  patientAge: string;
  patientGender: "male" | "female" | "other" | "";
  patientNotes: string;
  couponCode: string;
  discount: number;

  /* Setters */
  setCollectionType: (type: CollectionType) => void;
  setSelectedLabId: (id: string) => void;
  setCollectionAddress: (address: string) => void;
  setSlot: (date: string, time: string) => void;
  setPatient: (data: { name: string; age: string; gender: "male" | "female" | "other" | ""; notes: string }) => void;
  applyCoupon: (code: string, discount: number) => void;

  /* Computed */
  subtotal: () => number;
  total: () => number;

  /* Confirm booking — saves snapshot, resets flow */
  confirmBooking: () => string;

  /* Last confirmed booking (for confirmation screen) */
  lastBooking: {
    id: string;
    items: CartItem[];
    collectionType: CollectionType | null;
    labId: string | null;
    address: string | null;
    slotDate: string | null;
    slotTime: string | null;
    patientName: string;
    total: number;
  } | null;

  resetFlow: () => void;
}

const COUPONS: Record<string, number> = {
  WELCOME50: 50,
  ND10:      10,
  FIRST100:  100,
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      cart:              [],
      collectionType:    null,
      selectedLabId:     null,
      collectionAddress: null,
      slotDate:          null,
      slotTime:          null,
      patientName:       "",
      patientAge:        "",
      patientGender:     "",
      patientNotes:      "",
      couponCode:        "",
      discount:          0,
      lastBooking:       null,

      addToCart: (item) =>
        set((s) => ({
          cart: s.cart.find((c) => c.id === item.id)
            ? s.cart
            : [...s.cart, item],
        })),

      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),

      clearCart: () =>
        set({
          cart:              [],
          collectionType:    null,
          selectedLabId:     null,
          collectionAddress: null,
          slotDate:          null,
          slotTime:          null,
          patientName:       "",
          patientAge:        "",
          patientGender:     "",
          patientNotes:      "",
          couponCode:        "",
          discount:          0,
        }),

      setCollectionType: (type) => set({ collectionType: type }),
      setSelectedLabId:  (id)   => set({ selectedLabId: id }),
      setCollectionAddress: (address) => set({ collectionAddress: address }),
      setSlot:   (date, time) => set({ slotDate: date, slotTime: time }),
      setPatient: (data) =>
        set({
          patientName:   data.name,
          patientAge:    data.age,
          patientGender: data.gender,
          patientNotes:  data.notes,
        }),
      applyCoupon: (code, discount) => set({ couponCode: code, discount }),

      subtotal: () => get().cart.reduce((sum, c) => sum + c.price, 0),

      total: () => {
        const sub = get().subtotal();
        const homeCollFee = get().collectionType === "home-collection" ? 100 : 0;
        const disc = get().discount;
        return Math.max(0, sub + homeCollFee - disc);
      },

      confirmBooking: () => {
        const s = get();
        const id = generateBookingId();
        set({
          lastBooking: {
            id,
            items:          s.cart,
            collectionType: s.collectionType,
            labId:          s.selectedLabId,
            address:        s.collectionAddress,
            slotDate:       s.slotDate,
            slotTime:       s.slotTime,
            patientName:    s.patientName,
            total:          s.total(),
          },
          cart:              [],
          collectionType:    null,
          selectedLabId:     null,
          collectionAddress: null,
          slotDate:          null,
          slotTime:          null,
          patientName:       "",
          patientAge:        "",
          patientGender:     "",
          patientNotes:      "",
          couponCode:        "",
          discount:          0,
        });
        return id;
      },

      resetFlow: () =>
        set({
          collectionType:    null,
          selectedLabId:     null,
          collectionAddress: null,
          slotDate:          null,
          slotTime:          null,
          patientName:       "",
          patientAge:        "",
          patientGender:     "",
          patientNotes:      "",
          couponCode:        "",
          discount:          0,
        }),
    }),
    {
      name: "nd-booking",
      partialize: (s) => ({ cart: s.cart }),   // only persist cart
    }
  )
);

export { COUPONS };
