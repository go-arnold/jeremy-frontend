import type { EventDetail } from "@/types/evenements";

export default function EventInfoGrid({ event }: { event: EventDetail }) {
  const items = [
    { label: "Date",      value: event.date },
    { label: "Heure",     value: event.time },
    { label: "Catégorie", value: event.category },
    { label: "Entrée",    value: event.price },
  ];

  return (
    <section className="px-4 mt-6">
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-[#12223ce6] border border-white/5 p-4">
            <p className="text-xs uppercase tracking-widest text-primary font-bold">
              {label}
            </p>
            <p className="text-sm text-white font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
