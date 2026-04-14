import type { Booking } from "@/lib/types";

/* Mock user ID for the prototype */
export const MOCK_USER_ID = "user-ravi-123";

export const bookings: Booking[] = [
  {
    id: "BK-240413-001",
    userId: MOCK_USER_ID,
    testIds: ["test-cbc", "test-fbs", "test-hba1c"],
    packageId: "pkg-001",
    labId: "lab-001",
    collectionType: "lab-visit",
    slotDate: "2026-04-14",
    slotTime: "08:00",
    patientName: "Ravi Kumar",
    patientAge: 45,
    patientGender: "male",
    patientNotes: "Diabetic patient, please handle carefully",
    status: "confirmed",
    totalAmount: 499,
    createdAt: "2026-04-12T10:30:00.000Z",
  },
  {
    id: "BK-240407-002",
    userId: MOCK_USER_ID,
    testIds: ["test-cbc"],
    labId: "lab-002",
    collectionType: "lab-visit",
    slotDate: "2026-04-07",
    slotTime: "09:30",
    patientName: "Ravi Kumar",
    patientAge: 45,
    patientGender: "male",
    status: "report-ready",
    totalAmount: 200,
    createdAt: "2026-04-06T14:00:00.000Z",
    reportUrl: "/reports/mock-cbc-report.pdf",
  },
  {
    id: "BK-240329-003",
    userId: MOCK_USER_ID,
    testIds: ["test-lipid"],
    labId: "lab-003",
    collectionType: "home-collection",
    collectionAddress: "Flat 4B, Vasavi Apartments, Road No. 3, Banjara Hills, Hyderabad - 500034",
    slotDate: "2026-03-29",
    slotTime: "07:00",
    patientName: "Ravi Kumar",
    patientAge: 45,
    patientGender: "male",
    status: "report-ready",
    totalAmount: 440,    // 360 test + 80 home collection
    createdAt: "2026-03-28T09:00:00.000Z",
    reportUrl: "/reports/mock-lipid-report.pdf",
  },
];

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

export function getActiveBookings(): Booking[] {
  return bookings.filter((b) =>
    ["confirmed", "pending", "sample-collected", "processing"].includes(b.status)
  );
}

export function getPastBookings(): Booking[] {
  return bookings.filter((b) =>
    ["report-ready", "cancelled"].includes(b.status)
  );
}

export function getBookingsWithReports(): Booking[] {
  return bookings.filter((b) => b.status === "report-ready" && b.reportUrl);
}
