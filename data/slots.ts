import type { TimeSlot } from "@/lib/types";
import { addDays, format, isToday, isTomorrow } from "date-fns";

/* Generate next 7 available dates */
export function getAvailableDates(): { date: Date; label: string; dayLabel: string }[] {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dayName = format(date, "EEE");
    const dayNumber = format(date, "d");
    const month = format(date, "MMM");

    let label = `${dayName}, ${dayNumber} ${month}`;
    let dayLabel = dayName;

    if (i === 0) dayLabel = "Today";
    if (i === 1) dayLabel = "Tomorrow";

    dates.push({ date, label, dayLabel });
  }

  return dates;
}

/* Fixed slot templates — some marked unavailable for realism */
const morningSlots: TimeSlot[] = [
  { time: "06:30", label: "6:30 AM", period: "morning", available: true },
  { time: "07:00", label: "7:00 AM", period: "morning", available: true },
  { time: "07:30", label: "7:30 AM", period: "morning", available: false },
  { time: "08:00", label: "8:00 AM", period: "morning", available: true },
  { time: "08:30", label: "8:30 AM", period: "morning", available: true },
  { time: "09:00", label: "9:00 AM", period: "morning", available: false },
  { time: "09:30", label: "9:30 AM", period: "morning", available: true },
  { time: "10:00", label: "10:00 AM", period: "morning", available: true },
  { time: "10:30", label: "10:30 AM", period: "morning", available: true },
  { time: "11:00", label: "11:00 AM", period: "morning", available: false },
  { time: "11:30", label: "11:30 AM", period: "morning", available: true },
];

const afternoonSlots: TimeSlot[] = [
  { time: "12:00", label: "12:00 PM", period: "afternoon", available: true },
  { time: "12:30", label: "12:30 PM", period: "afternoon", available: false },
  { time: "13:00", label: "1:00 PM", period: "afternoon", available: true },
  { time: "13:30", label: "1:30 PM", period: "afternoon", available: true },
  { time: "14:00", label: "2:00 PM", period: "afternoon", available: true },
  { time: "14:30", label: "2:30 PM", period: "afternoon", available: false },
  { time: "15:00", label: "3:00 PM", period: "afternoon", available: true },
  { time: "15:30", label: "3:30 PM", period: "afternoon", available: true },
  { time: "16:00", label: "4:00 PM", period: "afternoon", available: false },
  { time: "16:30", label: "4:30 PM", period: "afternoon", available: true },
];

const eveningSlots: TimeSlot[] = [
  { time: "17:00", label: "5:00 PM", period: "evening", available: true },
  { time: "17:30", label: "5:30 PM", period: "evening", available: true },
  { time: "18:00", label: "6:00 PM", period: "evening", available: false },
  { time: "18:30", label: "6:30 PM", period: "evening", available: true },
  { time: "19:00", label: "7:00 PM", period: "evening", available: true },
  { time: "19:30", label: "7:30 PM", period: "evening", available: false },
  { time: "20:00", label: "8:00 PM", period: "evening", available: true },
];

export function getSlotsForDate(date: Date): {
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
} {
  // For today, mark past times as unavailable
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();

  if (isToday(date)) {
    const currentMinutes = hour * 60 + min + 60; // +60 min buffer

    return {
      morning: morningSlots.map((s) => ({
        ...s,
        available:
          s.available &&
          parseInt(s.time.split(":")[0]) * 60 + parseInt(s.time.split(":")[1]) >
            currentMinutes,
      })),
      afternoon: afternoonSlots.map((s) => ({
        ...s,
        available:
          s.available &&
          parseInt(s.time.split(":")[0]) * 60 + parseInt(s.time.split(":")[1]) >
            currentMinutes,
      })),
      evening: eveningSlots.map((s) => ({
        ...s,
        available:
          s.available &&
          parseInt(s.time.split(":")[0]) * 60 + parseInt(s.time.split(":")[1]) >
            currentMinutes,
      })),
    };
  }

  return {
    morning: morningSlots,
    afternoon: afternoonSlots,
    evening: eveningSlots,
  };
}
