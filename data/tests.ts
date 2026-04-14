import type { DiagnosticTest, LabTest } from "@/lib/types";

/* ── 20 Diagnostic Tests (Indian context) ── */
export const tests: DiagnosticTest[] = [
  {
    id: "test-cbc",
    slug: "complete-blood-count",
    name: "Complete Blood Count",
    shortName: "CBC",
    category: "blood",
    description:
      "Checks your blood cells — red cells, white cells, and platelets. Helps detect anaemia, infections, and blood disorders.",
    preparation: "No special preparation needed. Can be done anytime.",
    turnaroundHours: 6,
    sampleType: "Blood (venous)",
    popular: true,
  },
  {
    id: "test-fbs",
    slug: "fasting-blood-sugar",
    name: "Fasting Blood Sugar",
    shortName: "FBS",
    category: "diabetes",
    description:
      "Measures blood glucose after fasting. The first step in checking for diabetes or pre-diabetes.",
    preparation: "Fast for 8–10 hours before the test. Water is allowed.",
    turnaroundHours: 4,
    sampleType: "Blood (venous)",
    popular: true,
  },
  {
    id: "test-hba1c",
    slug: "hba1c",
    name: "HbA1c (Glycated Haemoglobin)",
    shortName: "HbA1c",
    category: "diabetes",
    description:
      "Shows your average blood sugar over the past 3 months. Used to diagnose and monitor diabetes.",
    preparation: "No fasting required. Can be done anytime.",
    turnaroundHours: 8,
    sampleType: "Blood (venous)",
    popular: true,
  },
  {
    id: "test-lipid",
    slug: "lipid-profile",
    name: "Lipid Profile",
    shortName: "Lipid Panel",
    category: "heart",
    description:
      "Measures cholesterol and triglycerides in your blood. Helps assess your risk of heart disease and stroke.",
    preparation: "Fast for 9–12 hours before the test. Water is allowed.",
    turnaroundHours: 6,
    sampleType: "Blood (venous)",
    popular: true,
  },
  {
    id: "test-tft",
    slug: "thyroid-function-test",
    name: "Thyroid Function Test",
    shortName: "TFT",
    category: "thyroid",
    description:
      "Checks if your thyroid gland is working properly. Measures TSH, T3, and T4 hormone levels.",
    preparation: "No special preparation. Ideally done in the morning.",
    turnaroundHours: 12,
    sampleType: "Blood (venous)",
    popular: true,
  },
  {
    id: "test-lft",
    slug: "liver-function-test",
    name: "Liver Function Test",
    shortName: "LFT",
    category: "liver-kidney",
    description:
      "Checks how well your liver is working. Detects liver damage, jaundice, and other liver conditions.",
    preparation: "Fast for 8 hours before the test. Water is allowed.",
    turnaroundHours: 8,
    sampleType: "Blood (venous)",
    popular: true,
  },
  {
    id: "test-kft",
    slug: "kidney-function-test",
    name: "Kidney Function Test",
    shortName: "KFT",
    category: "liver-kidney",
    description:
      "Checks how well your kidneys are filtering waste. Measures creatinine, urea, and uric acid levels.",
    preparation: "No special preparation. Stay well hydrated.",
    turnaroundHours: 8,
    sampleType: "Blood (venous)",
    popular: false,
  },
  {
    id: "test-urine",
    slug: "urine-routine",
    name: "Urine Routine & Microscopy",
    shortName: "Urine R/M",
    category: "general",
    description:
      "Basic urine test to check for infections, kidney problems, and diabetes markers.",
    preparation: "Collect mid-stream urine in the morning (first void).",
    turnaroundHours: 4,
    sampleType: "Urine",
    popular: false,
  },
  {
    id: "test-hbsag",
    slug: "hepatitis-b-surface-antigen",
    name: "Hepatitis B Surface Antigen",
    shortName: "HBsAg",
    category: "infections",
    description:
      "Detects active Hepatitis B virus infection. Required for health check-ups and before surgery.",
    preparation: "No special preparation needed.",
    turnaroundHours: 6,
    sampleType: "Blood (venous)",
    popular: false,
  },
  {
    id: "test-dengue",
    slug: "dengue-ns1-antigen",
    name: "Dengue NS1 Antigen",
    shortName: "Dengue NS1",
    category: "infections",
    description:
      "Early detection test for dengue fever. Most accurate in the first 5 days of fever.",
    preparation: "No special preparation. Best done during fever.",
    turnaroundHours: 4,
    sampleType: "Blood (venous)",
    popular: false,
  },
  {
    id: "test-vitd",
    slug: "vitamin-d",
    name: "Vitamin D (25-OH)",
    shortName: "Vit D",
    category: "vitamins",
    description:
      "Checks your Vitamin D levels. Deficiency is very common in India and causes bone pain, fatigue, and weakness.",
    preparation: "No special preparation needed.",
    turnaroundHours: 24,
    sampleType: "Blood (venous)",
    popular: true,
  },
  {
    id: "test-vitb12",
    slug: "vitamin-b12",
    name: "Vitamin B12",
    shortName: "Vit B12",
    category: "vitamins",
    description:
      "Measures Vitamin B12 in your blood. Deficiency causes fatigue, numbness, and anaemia — very common in vegetarians.",
    preparation: "No special preparation needed.",
    turnaroundHours: 24,
    sampleType: "Blood (venous)",
    popular: true,
  },
  {
    id: "test-iron",
    slug: "iron-studies",
    name: "Iron Studies (Serum Iron + TIBC + Ferritin)",
    shortName: "Iron Studies",
    category: "blood",
    description:
      "Measures iron levels in your body. Helps diagnose iron deficiency anaemia.",
    preparation: "Fast for 8 hours. Avoid iron supplements for 24 hours before.",
    turnaroundHours: 24,
    sampleType: "Blood (venous)",
    popular: false,
  },
  {
    id: "test-esr",
    slug: "esr",
    name: "Erythrocyte Sedimentation Rate",
    shortName: "ESR",
    category: "blood",
    description:
      "Indicates inflammation in the body. Often done along with CBC to check for infections or autoimmune conditions.",
    preparation: "No special preparation needed.",
    turnaroundHours: 4,
    sampleType: "Blood (venous)",
    popular: false,
  },
  {
    id: "test-crp",
    slug: "c-reactive-protein",
    name: "C-Reactive Protein",
    shortName: "CRP",
    category: "blood",
    description:
      "A marker of inflammation and infection. Elevated CRP can indicate infections, arthritis, or heart disease risk.",
    preparation: "No special preparation needed.",
    turnaroundHours: 6,
    sampleType: "Blood (venous)",
    popular: false,
  },
  {
    id: "test-ecg",
    slug: "ecg",
    name: "Electrocardiogram",
    shortName: "ECG",
    category: "heart",
    description:
      "Records the electrical activity of your heart. Checks for irregular heartbeat, heart attack, and other heart conditions.",
    preparation: "No special preparation. Avoid heavy exercise before the test.",
    turnaroundHours: 1,
    sampleType: "Non-invasive",
    popular: false,
  },
  {
    id: "test-bp",
    slug: "blood-pressure",
    name: "Blood Pressure Check",
    shortName: "BP",
    category: "heart",
    description:
      "Quick check of your blood pressure. Important for detecting hypertension (high BP) which has no visible symptoms.",
    preparation: "Sit quietly for 5 minutes before the test. Avoid caffeine.",
    turnaroundHours: 0,
    sampleType: "Non-invasive",
    popular: false,
  },
  {
    id: "test-psa",
    slug: "psa",
    name: "Prostate Specific Antigen",
    shortName: "PSA",
    category: "cancer-screening",
    description:
      "Screening test for prostate cancer and prostate problems. Recommended for men above 50.",
    preparation: "Avoid ejaculation and strenuous exercise for 48 hours before.",
    turnaroundHours: 24,
    sampleType: "Blood (venous)",
    popular: false,
  },
  {
    id: "test-pap",
    slug: "pap-smear",
    name: "Pap Smear",
    shortName: "Pap Smear",
    category: "cancer-screening",
    description:
      "Screens for cervical cancer and pre-cancerous changes. Recommended for women aged 21–65 every 3 years.",
    preparation: "Avoid intercourse, douching, or vaginal medicines 2 days before.",
    turnaroundHours: 48,
    sampleType: "Cervical swab",
    popular: false,
  },
  {
    id: "test-covid",
    slug: "covid-rtpcr",
    name: "COVID-19 RT-PCR",
    shortName: "COVID RT-PCR",
    category: "infections",
    description:
      "Gold standard test to detect active COVID-19 infection. Required for travel and hospitalisation.",
    preparation: "No eating, drinking, or smoking for 30 minutes before the test.",
    turnaroundHours: 12,
    sampleType: "Nasal swab",
    popular: false,
  },
];

/* ── Lab-specific pricing for all tests ── */
export const labTests: LabTest[] = [
  // Lakshmi Diagnostics (lab-001)
  { labId: "lab-001", testId: "test-cbc",    price: 250, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-fbs",    price: 80,  homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-hba1c",  price: 350, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-lipid",  price: 450, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-tft",    price: 550, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-lft",    price: 420, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-kft",    price: 420, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-urine",  price: 100, homeCollectionAvailable: false },
  { labId: "lab-001", testId: "test-hbsag",  price: 200, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-vitd",   price: 900, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-vitb12", price: 750, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-iron",   price: 550, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-dengue", price: 650, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-crp",    price: 380, homeCollectionAvailable: true },
  { labId: "lab-001", testId: "test-ecg",    price: 200, homeCollectionAvailable: false },
  { labId: "lab-001", testId: "test-bp",     price: 50,  homeCollectionAvailable: false },

  // Sri Sai Diagnostics (lab-002)
  { labId: "lab-002", testId: "test-cbc",    price: 200, homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-fbs",    price: 70,  homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-hba1c",  price: 300, homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-lipid",  price: 380, homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-tft",    price: 480, homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-lft",    price: 360, homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-kft",    price: 360, homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-urine",  price: 80,  homeCollectionAvailable: false },
  { labId: "lab-002", testId: "test-vitd",   price: 800, homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-vitb12", price: 650, homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-dengue", price: 600, homeCollectionAvailable: true },
  { labId: "lab-002", testId: "test-crp",    price: 320, homeCollectionAvailable: true },

  // City Care Labs (lab-003)
  { labId: "lab-003", testId: "test-cbc",    price: 180, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-fbs",    price: 65,  homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-hba1c",  price: 280, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-lipid",  price: 360, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-tft",    price: 460, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-lft",    price: 350, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-kft",    price: 350, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-urine",  price: 75,  homeCollectionAvailable: false },
  { labId: "lab-003", testId: "test-hbsag",  price: 160, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-vitd",   price: 750, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-vitb12", price: 620, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-iron",   price: 480, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-esr",    price: 70,  homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-dengue", price: 550, homeCollectionAvailable: true },
  { labId: "lab-003", testId: "test-covid",  price: 400, homeCollectionAvailable: false },

  // Hitech Diagnostics (lab-004)
  { labId: "lab-004", testId: "test-cbc",    price: 280, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-fbs",    price: 90,  homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-hba1c",  price: 380, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-lipid",  price: 480, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-tft",    price: 580, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-lft",    price: 450, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-kft",    price: 450, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-vitd",   price: 950, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-vitb12", price: 800, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-psa",    price: 800, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-pap",    price: 700, homeCollectionAvailable: false },
  { labId: "lab-004", testId: "test-iron",   price: 580, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-ecg",    price: 250, homeCollectionAvailable: false },
  { labId: "lab-004", testId: "test-crp",    price: 420, homeCollectionAvailable: true },
  { labId: "lab-004", testId: "test-covid",  price: 450, homeCollectionAvailable: false },

  // Sunshine Pathology (lab-005)
  { labId: "lab-005", testId: "test-cbc",    price: 160, homeCollectionAvailable: false },
  { labId: "lab-005", testId: "test-fbs",    price: 60,  homeCollectionAvailable: false },
  { labId: "lab-005", testId: "test-hba1c",  price: 260, homeCollectionAvailable: false },
  { labId: "lab-005", testId: "test-lipid",  price: 350, homeCollectionAvailable: false },
  { labId: "lab-005", testId: "test-tft",    price: 430, homeCollectionAvailable: false },
  { labId: "lab-005", testId: "test-lft",    price: 330, homeCollectionAvailable: false },
  { labId: "lab-005", testId: "test-urine",  price: 65,  homeCollectionAvailable: false },
  { labId: "lab-005", testId: "test-dengue", price: 520, homeCollectionAvailable: false },

  // Galaxy Labs (lab-008) — premium, highest quality
  { labId: "lab-008", testId: "test-cbc",    price: 300, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-fbs",    price: 100, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-hba1c",  price: 420, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-lipid",  price: 520, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-tft",    price: 620, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-lft",    price: 490, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-kft",    price: 490, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-urine",  price: 120, homeCollectionAvailable: false },
  { labId: "lab-008", testId: "test-vitd",   price: 1100, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-vitb12", price: 950, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-psa",    price: 950, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-pap",    price: 750, homeCollectionAvailable: false },
  { labId: "lab-008", testId: "test-iron",   price: 650, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-dengue", price: 750, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-crp",    price: 450, homeCollectionAvailable: true },
  { labId: "lab-008", testId: "test-ecg",    price: 280, homeCollectionAvailable: false },
  { labId: "lab-008", testId: "test-covid",  price: 500, homeCollectionAvailable: false },
  { labId: "lab-008", testId: "test-esr",    price: 90,  homeCollectionAvailable: true },

  // Tirumala Diagnostics (lab-009)
  { labId: "lab-009", testId: "test-cbc",    price: 190, homeCollectionAvailable: true },
  { labId: "lab-009", testId: "test-fbs",    price: 70,  homeCollectionAvailable: true },
  { labId: "lab-009", testId: "test-hba1c",  price: 290, homeCollectionAvailable: true },
  { labId: "lab-009", testId: "test-lipid",  price: 370, homeCollectionAvailable: true },
  { labId: "lab-009", testId: "test-tft",    price: 460, homeCollectionAvailable: true },
  { labId: "lab-009", testId: "test-lft",    price: 360, homeCollectionAvailable: true },
  { labId: "lab-009", testId: "test-vitd",   price: 780, homeCollectionAvailable: true },
  { labId: "lab-009", testId: "test-dengue", price: 580, homeCollectionAvailable: true },

  // Prime Health Labs (lab-010)
  { labId: "lab-010", testId: "test-cbc",    price: 220, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-fbs",    price: 75,  homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-hba1c",  price: 320, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-lipid",  price: 400, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-tft",    price: 510, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-lft",    price: 390, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-kft",    price: 390, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-vitd",   price: 850, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-vitb12", price: 700, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-psa",    price: 700, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-iron",   price: 530, homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-esr",    price: 75,  homeCollectionAvailable: true },
  { labId: "lab-010", testId: "test-ecg",    price: 220, homeCollectionAvailable: false },
  { labId: "lab-010", testId: "test-crp",    price: 350, homeCollectionAvailable: true },
];

/* ── Helpers ── */
export function getTestById(id: string): DiagnosticTest | undefined {
  return tests.find((t) => t.id === id);
}

export function getTestBySlug(slug: string): DiagnosticTest | undefined {
  return tests.find((t) => t.slug === slug);
}

export function getPopularTests(): DiagnosticTest[] {
  return tests.filter((t) => t.popular);
}

export function getTestsByCategory(category: string): DiagnosticTest[] {
  return tests.filter((t) => t.category === category);
}

/** Returns all labs offering a specific test, sorted by price ascending */
export function getLabsForTest(testId: string): LabTest[] {
  return labTests
    .filter((lt) => lt.testId === testId)
    .sort((a, b) => a.price - b.price);
}

/** Returns all tests offered by a specific lab */
export function getTestsForLab(labId: string): LabTest[] {
  return labTests.filter((lt) => lt.labId === labId);
}

/** Returns the price a specific lab charges for a specific test */
export function getLabTestPrice(labId: string, testId: string): number | null {
  const entry = labTests.find((lt) => lt.labId === labId && lt.testId === testId);
  return entry ? entry.price : null;
}

/** Returns min and max price across all labs for a test */
export function getPriceRange(testId: string): { min: number; max: number } | null {
  const prices = labTests.filter((lt) => lt.testId === testId).map((lt) => lt.price);
  if (!prices.length) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
