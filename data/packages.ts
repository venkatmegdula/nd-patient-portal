import type { DiagnosticPackage } from "@/lib/types";

export const packages: DiagnosticPackage[] = [
  {
    id: "pkg-001",
    slug: "diabetes-care",
    name: "Diabetes Care",
    tagline: "Check your sugar levels + blood health in one go",
    testIds: ["test-cbc", "test-fbs", "test-hba1c"],
    badge: "Bestseller",
    basePrice: 680,
    price: 499,
    preparation: "Fast for 8–10 hours before the test. Water is allowed.",
    turnaroundHours: 8,
    popular: true,
    forGender: "all",
    colour: "bg-amber-50",
  },
  {
    id: "pkg-002",
    slug: "heart-and-sugar",
    name: "Heart & Sugar",
    tagline: "Heart health + diabetes check — one sample, two answers",
    testIds: ["test-cbc", "test-fbs", "test-lipid"],
    badge: "Most Popular",
    basePrice: 810,
    price: 549,
    preparation: "Fast for 9–12 hours before the test. Water is allowed.",
    turnaroundHours: 8,
    popular: true,
    forGender: "all",
    colour: "bg-red-50",
  },
  {
    id: "pkg-003",
    slug: "thyroid-and-liver",
    name: "Thyroid & Liver",
    tagline: "Tiredness, weight gain, or digestion issues? Check these first.",
    testIds: ["test-tft", "test-lft", "test-lipid"],
    badge: "Best Value",
    basePrice: 1120,
    price: 799,
    preparation: "Fast for 8 hours. Ideally done in the morning.",
    turnaroundHours: 12,
    popular: true,
    forGender: "all",
    colour: "bg-blue-50",
  },
  {
    id: "pkg-004",
    slug: "full-body-basic",
    name: "Full Body Basic",
    tagline: "The essential annual health check — 5 key tests",
    testIds: ["test-cbc", "test-fbs", "test-lft", "test-kft", "test-urine"],
    badge: "Most Popular",
    basePrice: 1400,
    price: 999,
    preparation: "Fast for 10 hours. Collect morning urine sample.",
    turnaroundHours: 12,
    popular: true,
    forGender: "all",
    colour: "bg-teal-50",
  },
  {
    id: "pkg-005",
    slug: "womens-wellness",
    name: "Women's Wellness",
    tagline: "Fatigue, hair loss, or weight changes? Start here.",
    testIds: ["test-cbc", "test-tft", "test-vitd", "test-vitb12"],
    badge: "Women's Health",
    basePrice: 2050,
    price: 1199,
    preparation: "No special preparation needed.",
    turnaroundHours: 24,
    popular: true,
    forGender: "female",
    colour: "bg-pink-50",
  },
];

export function getPackageById(id: string): DiagnosticPackage | undefined {
  return packages.find((p) => p.id === id);
}

export function getPackageBySlug(slug: string): DiagnosticPackage | undefined {
  return packages.find((p) => p.slug === slug);
}

export function getPopularPackages(): DiagnosticPackage[] {
  return packages.filter((p) => p.popular);
}
