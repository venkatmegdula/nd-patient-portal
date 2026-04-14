"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Cart" },
  { id: 2, label: "Collection" },
  { id: 3, label: "Location" },
  { id: 4, label: "Schedule" },
  { id: 5, label: "Details" },
  { id: 6, label: "Summary" },
  { id: 7, label: "Payment" },
];

interface BookingProgressBarProps {
  currentStep: number;
}

export function BookingProgressBar({ currentStep }: BookingProgressBarProps) {
  return (
    <div className="w-full mb-6">
      {/* Step dots + connector line */}
      <div className="relative flex items-center justify-between">
        {/* Background connector */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200" />
        {/* Active connector — width grows with steps */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step) => {
          const isDone = step.id < currentStep;
          const isActive = step.id === currentStep;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold border-2 transition-all",
                  isDone
                    ? "bg-primary border-primary text-white"
                    : isActive
                    ? "bg-white border-primary text-primary"
                    : "bg-white border-stone-200 text-stone-300"
                )}
              >
                {isDone ? <Check size={12} strokeWidth={3} /> : step.id}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current step label */}
      <p className="text-center text-xs text-stone-500 mt-2">
        Step {currentStep} of {STEPS.length} —{" "}
        <span className="font-semibold text-stone-700">
          {STEPS[currentStep - 1]?.label}
        </span>
      </p>
    </div>
  );
}
