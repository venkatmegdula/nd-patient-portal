import type { AgeGenderRecommendation } from "@/lib/types";

export const recommendations: AgeGenderRecommendation[] = [
  // Age 10-20
  { testId: "test-cbc",    ageMin: 10, ageMax: 20, gender: "all",    priority: "high" },
  { testId: "test-vitd",   ageMin: 10, ageMax: 20, gender: "all",    priority: "high" },
  { testId: "test-vitb12", ageMin: 10, ageMax: 20, gender: "all",    priority: "medium" },
  { testId: "test-tft",    ageMin: 10, ageMax: 20, gender: "all",    priority: "medium" },
  { testId: "test-iron",   ageMin: 10, ageMax: 20, gender: "female", priority: "high" },

  // Age 20-35
  { testId: "test-hba1c",  ageMin: 20, ageMax: 35, gender: "male",   priority: "high" },
  { testId: "test-lipid",  ageMin: 20, ageMax: 35, gender: "male",   priority: "high" },
  { testId: "test-lft",    ageMin: 20, ageMax: 35, gender: "male",   priority: "medium" },
  { testId: "test-kft",    ageMin: 20, ageMax: 35, gender: "male",   priority: "medium" },
  { testId: "test-hba1c",  ageMin: 20, ageMax: 35, gender: "female", priority: "medium" },
  { testId: "test-tft",    ageMin: 20, ageMax: 35, gender: "female", priority: "high" },
  { testId: "test-iron",   ageMin: 20, ageMax: 35, gender: "female", priority: "high" },
  { testId: "test-vitd",   ageMin: 20, ageMax: 35, gender: "female", priority: "high" },

  // Age 35-45
  { testId: "test-lipid",  ageMin: 35, ageMax: 45, gender: "male",   priority: "high" },
  { testId: "test-hba1c",  ageMin: 35, ageMax: 45, gender: "male",   priority: "high" },
  { testId: "test-lft",    ageMin: 35, ageMax: 45, gender: "male",   priority: "high" },
  { testId: "test-lipid",  ageMin: 35, ageMax: 45, gender: "female", priority: "high" },
  { testId: "test-tft",    ageMin: 35, ageMax: 45, gender: "female", priority: "high" },
  { testId: "test-iron",   ageMin: 35, ageMax: 45, gender: "female", priority: "medium" },

  // Age 45-60
  { testId: "test-cbc",    ageMin: 45, ageMax: 60, gender: "all",    priority: "high" },
  { testId: "test-lipid",  ageMin: 45, ageMax: 60, gender: "all",    priority: "high" },
  { testId: "test-hba1c",  ageMin: 45, ageMax: 60, gender: "all",    priority: "high" },
  { testId: "test-psa",    ageMin: 45, ageMax: 60, gender: "male",   priority: "high" },
  { testId: "test-lft",    ageMin: 45, ageMax: 60, gender: "male",   priority: "medium" },
  { testId: "test-vitd",   ageMin: 45, ageMax: 60, gender: "female", priority: "high" },

  // Age 60+
  { testId: "test-cbc",    ageMin: 60, ageMax: 120, gender: "all",   priority: "high" },
  { testId: "test-hba1c",  ageMin: 60, ageMax: 120, gender: "all",   priority: "high" },
  { testId: "test-kft",    ageMin: 60, ageMax: 120, gender: "all",   priority: "high" },
  { testId: "test-lipid",  ageMin: 60, ageMax: 120, gender: "all",   priority: "high" },
  { testId: "test-vitd",   ageMin: 60, ageMax: 120, gender: "all",   priority: "medium" },
  { testId: "test-lft",    ageMin: 60, ageMax: 120, gender: "all",   priority: "medium" },
];

export function getRecommendedTestIds(
  age: number,
  gender: "male" | "female" | "other"
): string[] {
  return recommendations
    .filter(
      (r) =>
        age >= r.ageMin &&
        age <= r.ageMax &&
        (r.gender === "all" || r.gender === gender)
    )
    .sort((a, b) => (a.priority === "high" ? -1 : 1))
    .map((r) => r.testId)
    .filter((id, i, arr) => arr.indexOf(id) === i) // dedupe
    .slice(0, 6);
}
