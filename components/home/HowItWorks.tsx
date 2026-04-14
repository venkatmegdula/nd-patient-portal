import { Search, CalendarCheck, FileText } from "lucide-react";

const steps = [
  {
    icon: Search,
    colour: "bg-teal-50 text-teal-600",
    title: "Search & Compare",
    desc: "Find the test you need. Compare prices across labs near you.",
  },
  {
    icon: CalendarCheck,
    colour: "bg-amber-50 text-amber-600",
    title: "Book & Pay",
    desc: "Pick a slot, visit the lab or choose home sample collection.",
  },
  {
    icon: FileText,
    colour: "bg-green-50 text-green-700",
    title: "Get Results",
    desc: "Download your report digitally. Usually ready within 24 hours.",
  },
];

export function HowItWorks() {
  return (
    <section className="mb-6">
      <h2 className="font-heading text-lg font-bold text-stone-900 mb-3">
        How It Works
      </h2>
      <div className="rounded-2xl border border-border bg-white divide-y divide-border overflow-hidden">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex items-start gap-4 p-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 ${step.colour}`}>
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-semibold text-stone-900 text-[15px]">
                  <span className="text-stone-300 mr-1.5">{i + 1}.</span>
                  {step.title}
                </p>
                <p className="text-sm text-stone-500 leading-snug mt-0.5">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
