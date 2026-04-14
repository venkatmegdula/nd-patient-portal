import { ShieldCheck, Clock, MapPin, TrendingDown } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "NABL Accredited Labs" },
  { icon: TrendingDown, label: "Up to 40% below MRP" },
  { icon: Clock,        label: "Reports in 4–24 hrs" },
  { icon: MapPin,       label: "10+ labs in Hyderabad" },
];

export function TrustBar() {
  return (
    <section className="mb-6">
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 flex-shrink-0">
                <Icon size={16} className="text-teal-600" strokeWidth={1.8} />
              </div>
              <span className="text-[12px] font-semibold text-stone-700 leading-tight">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
