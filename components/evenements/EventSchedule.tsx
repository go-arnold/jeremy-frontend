import type { EventScheduleItem } from "@/types/evenements";

export default function EventSchedule({ items }: { items: EventScheduleItem[] }) {
  return (
    <section className="px-4 mt-6">
      <h2 className="text-lg font-bold mb-3">Programme</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.date + item.time}
            className="flex items-center justify-between rounded-xl bg-[#12223ce6] border border-white/5 p-4"
          >
            <div>
              <p className="text-xs text-slate-400">{item.date}</p>
              <p className="text-white font-bold">{item.label}</p>
            </div>
            <span className="text-sm text-primary font-bold">{item.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
