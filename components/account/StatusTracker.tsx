import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/types";

const STEPS: { id: BookingStatus | "booked"; label: string; sub: string }[] = [
  { id: "booked",            label: "Booked",           sub: "Appointment confirmed" },
  { id: "sample-collected",  label: "Sample Collected",  sub: "In transit to lab" },
  { id: "processing",        label: "Processing",        sub: "Analysis in progress" },
  { id: "report-ready",      label: "Report Ready",      sub: "Download available" },
];

function statusToStep(status: BookingStatus): number {
  const map: Record<BookingStatus, number> = {
    pending:            1,
    confirmed:          1,
    "sample-collected": 2,
    processing:         3,
    "report-ready":     4,
    cancelled:          0,
  };
  return map[status] ?? 1;
}

interface StatusTrackerProps {
  status: BookingStatus;
}

export function StatusTracker({ status }: StatusTrackerProps) {
  const currentStep = statusToStep(status);

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 flex-shrink-0">
          <X size={16} className="text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-red-700 text-sm">Booking Cancelled</p>
          <p className="text-xs text-red-500">This booking has been cancelled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-stone-100" />
      {/* Active segment */}
      <div
        className="absolute left-4 top-5 w-0.5 bg-primary transition-all duration-700"
        style={{ height: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
      />

      <div className="flex flex-col gap-5 relative">
        {STEPS.map((step, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={step.id} className="flex items-center gap-4">
              {/* Dot */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 flex-shrink-0 transition-all",
                  isDone
                    ? "bg-primary border-primary"
                    : isActive
                    ? "bg-white border-primary"
                    : "bg-white border-stone-200"
                )}
              >
                {isDone ? (
                  <Check size={13} className="text-white" strokeWidth={3} />
                ) : (
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      isActive ? "bg-primary" : "bg-stone-200"
                    )}
                  />
                )}
              </div>

              {/* Label */}
              <div>
                <p className={cn(
                  "text-sm font-semibold",
                  isDone || isActive ? "text-stone-900" : "text-stone-400"
                )}>
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-xs text-primary">{step.sub}</p>
                )}
              </div>

              {/* Active badge */}
              {isActive && (
                <span className="ml-auto text-[10px] font-bold text-primary bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 flex-shrink-0">
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
