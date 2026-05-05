/* ─────────────────────────────────────────────────
   Neighbourhood Diagnostics — Shared TypeScript Types
   ───────────────────────────────────────────────── */

export type TestCategory =
  | "blood"
  | "diabetes"
  | "thyroid"
  | "heart"
  | "liver-kidney"
  | "vitamins"
  | "infections"
  | "cancer-screening"
  | "general"
  | "full-body";

export type CollectionType = "lab-visit" | "home-collection";

export type BookingStatus =
  | "confirmed"
  | "pending"
  | "sample-collected"
  | "processing"
  | "report-ready"
  | "cancelled";

export type Accreditation = "NABL" | "CAP" | "ISO" | "NABL+CAP";

/* ── Lab ── */
export interface Lab {
  id: string;
  name: string;
  area: string;                 // e.g. "Banjara Hills"
  address: string;
  city: string;
  pincode: string;
  phone: string;
  lat: number;
  lng: number;
  openTime: string;             // "07:00"
  closeTime: string;            // "21:00"
  openDays: string;             // "Mon–Sat"
  accreditation: Accreditation[];
  homeCollection: boolean;
  homeCollectionFee: number;    // ₹
  rating: number;               // 4.2
  reviewCount: number;
  distanceKm?: number;          // populated dynamically
  imageUrl?: string;
}

/* ── Diagnostic Test ── */
export interface DiagnosticTest {
  id: string;
  slug: string;
  name: string;
  shortName?: string;           // "CBC" for "Complete Blood Count"
  category: TestCategory;
  description: string;          // plain language, no jargon
  preparation: string;          // "Fasting for 8–10 hours required"
  turnaroundHours: number;      // report ready in N hours
  sampleType: string;           // "Blood (venous)"
  popular: boolean;
}

/* ── Lab-specific test pricing ── */
export interface LabTest {
  labId: string;
  testId: string;
  price: number;
  discountedPrice?: number;
  homeCollectionAvailable: boolean;
}

/* ── Package ── */
export interface DiagnosticPackage {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  testIds: string[];
  badge?: "Most Popular" | "Best Value" | "Women's Health" | "Bestseller";
  basePrice: number;            // original total
  price: number;                // discounted package price
  preparation: string;
  turnaroundHours: number;
  popular: boolean;
  forGender?: "male" | "female" | "all";
  colour: string;               // Tailwind bg class for card accent
}

/* ── Booking ── */
export interface Booking {
  id: string;
  userId: string;
  testIds: string[];
  packageId?: string;
  labId: string;
  collectionType: CollectionType;
  collectionAddress?: string;
  slotDate: string;             // "2026-04-13"
  slotTime: string;             // "08:00"
  patientName: string;
  patientAge: number;
  patientGender: "male" | "female" | "other";
  patientNotes?: string;
  status: BookingStatus;
  totalAmount: number;
  couponCode?: string;
  discount?: number;
  createdAt: string;            // ISO string
  reportUrl?: string;           // populated when status = report-ready
}

/* ── Category meta ── */
export interface TestCategoryMeta {
  id: TestCategory;
  label: string;
  icon: string;                 // Lucide icon name
  colour: string;               // Tailwind bg class
  description: string;
}

/* ── Time slot ── */
export interface TimeSlot {
  time: string;                 // "08:00"
  label: string;                // "8:00 AM"
  period: "morning" | "afternoon" | "evening";
  available: boolean;
}

/* ── User (mock) ── */
export interface User {
  id: string;
  name: string;
  phone: string;
  age?: number;
  gender?: "male" | "female" | "other";
  savedAddresses: SavedAddress[];
}

export interface SavedAddress {
  id: string;
  label: string;                // "Home", "Work"
  address: string;
  pincode: string;
  area: string;
}

/* ── v2 Types ── */

export type UserType = "patient" | "family-manager" | "corporate" | "doctor";

export interface FamilyMember {
  id: string;
  name: string;
  relation: "self" | "spouse" | "child" | "parent" | "other";
  dob: string;                  // "YYYY-MM-DD"
  gender: "male" | "female" | "other";
}

export interface LoyaltyAccount {
  points: number;
  tier: "bronze" | "silver" | "gold";
  totalEarned: number;
  referralCode: string;
}

export interface HealthReminder {
  id: string;
  testName: string;
  dueDate: string;              // "YYYY-MM-DD"
  frequency: "monthly" | "quarterly" | "half-yearly" | "annually";
  active: boolean;
}

export interface ReportAISummary {
  bookingId: string;
  interpretation: string;
  flaggedValues: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface AgeGenderRecommendation {
  testId: string;
  ageMin: number;
  ageMax: number;
  gender: "male" | "female" | "all";
  priority: "high" | "medium";
}
