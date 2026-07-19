import type { EventScheduleItem } from "@/types/evenements";

export default function EventSchedule({ items }: { items: EventScheduleItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-4 mt-6">
      <h2 className="text-base font-bold mb-2.5">Programme</h2>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.date + item.time}
            className="flex items-center justify-between rounded-xl bg-[#12223ce6] border border-white/5 p-3.5"
          >
            <div>
              <p className="text-[10px] text-slate-400">{item.date}</p>
              <p className="text-white text-sm font-bold">{item.label}</p>
            </div>
            <span className="text-xs text-primary font-bold">{item.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
