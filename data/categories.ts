import type { TestCategoryMeta } from "@/lib/types";

export const categories: TestCategoryMeta[] = [
  {
    id: "blood",
    label: "Blood Tests",
    icon: "Droplets",
    colour: "bg-red-50 text-red-600",
    description: "CBC, ESR, Iron Studies and more",
  },
  {
    id: "diabetes",
    label: "Diabetes",
    icon: "Activity",
    colour: "bg-amber-50 text-amber-600",
    description: "Blood sugar, HbA1c, insulin levels",
  },
  {
    id: "thyroid",
    label: "Thyroid",
    icon: "Zap",
    colour: "bg-purple-50 text-purple-600",
    description: "TSH, T3, T4 hormone tests",
  },
  {
    id: "heart",
    label: "Heart Health",
    icon: "Heart",
    colour: "bg-pink-50 text-pink-600",
    description: "Lipid profile, ECG, BP check",
  },
  {
    id: "liver-kidney",
    label: "Liver & Kidney",
    icon: "FlaskConical",
    colour: "bg-orange-50 text-orange-600",
    description: "LFT, KFT, urine tests",
  },
  {
    id: "vitamins",
    label: "Vitamins",
    icon: "Sun",
    colour: "bg-yellow-50 text-yellow-600",
    description: "Vitamin D, B12, Iron deficiency",
  },
  {
    id: "infections",
    label: "Infections",
    icon: "Shield",
    colour: "bg-green-50 text-green-600",
    description: "Dengue, Hepatitis, COVID, Typhoid",
  },
  {
    id: "full-body",
    label: "Full Body",
    icon: "Scan",
    colour: "bg-teal-50 text-teal-600",
    description: "Complete health screening packages",
  },
];

export function getCategoryById(id: string): TestCategoryMeta | undefined {
  return categories.find((c) => c.id === id);
}
